# Architecture

## Context and goals

A five-page-section static site for a small manufacturer. Traffic is expected to be
near-zero: the owner works directly with his clients, and the site exists for
credibility when someone looks the company up.

Goals, in order:

1. Looks like a real manufacturer's site.
2. Costs almost nothing to run.
3. Cannot break in a way that requires a 2am fix.
4. Business expenses stay cleanly separated from personal ones.

Explicit non-goals: search ranking, lead capture, e-commerce, CMS editing, scale.

---

## AWS account

**Component Concepts, Inc. gets its own AWS account.** This is not an IAM user inside an
existing personal account — billing in AWS is per-account, so an IAM user would not
separate anything.

Setup:

| Item | Value |
|---|---|
| Root email | `aws@` the business domain, not a personal address |
| Payment method | Business credit card |
| Root MFA | Enabled at creation, then root is never used again |
| Human access | One IAM user with an admin policy + MFA, for you |
| Automation access | IAM role assumed via GitHub OIDC — no access keys anywhere |
| Region | `us-east-1` (required for the CloudFront certificate; keep everything there) |
| Billing alert | Budget at $5/month with an email alert |

**Do not** put this account under an AWS Organization with a personal account as the
management account. In Organizations the management account is billed for all member
accounts, which reverses the separation this is meant to achieve. Standalone account.

A new account also gets a fresh 12-month free tier, and isolates blast radius from any
personal projects.

> Expense treatment is a question for the company's accountant, not this document. The
> account separation is a prerequisite either way.

## Runtime architecture

```
                        GoDaddy (registrar)
                               │ NS delegation
                               ▼
                    Route 53 (hosted zone)
                       │              │
              A/AAAA alias        MX records
                       │              │
                       ▼              ▼
                  CloudFront      email provider
                       │
                  OAC (SigV4)
                       │
                       ▼
              S3 bucket (private)
              - Block Public Access: ON
              - No website hosting endpoint
              - Bucket policy allows only this distribution
```

That is the entire system. There is no compute, no database, no VPC, and no state to
back up beyond the Git repository.

### Why not Lambda

An earlier plan included a Lambda Function URL and SES for a request-for-quote form.
That was dropped: the contact method is a `mailto:` link. Removing it eliminated SES
domain verification, the sandbox production-access request, function concurrency
quotas, and a CloudFront behavior. Nothing was lost, because the owner's clients call
and email him directly.

### Why no prerendering

With SEO out of scope, a client-rendered SPA is fine. `vite-react-ssg` was considered
and rejected as complexity with no beneficiary.

### Routing, and what it costs

Two routes: `/` and `/products`. React Router, client-side.

This has one infrastructure consequence that is easy to miss. A direct visit to
`componentconcepts.com/products` asks S3 for an object at that key, which does not
exist — S3 returns 403 (not 404, because Block Public Access is on and the OAC-signed
request gets AccessDenied for a missing key). Without handling, the visitor sees an XML
error page.

The fix is CloudFront custom error responses that rewrite both 403 and 404 to
`/index.html` and return **200**:

```hcl
custom_error_response {
  error_code            = 403
  response_code         = 200
  response_page_path    = "/index.html"
  error_caching_min_ttl = 0
}

custom_error_response {
  error_code            = 404
  response_code         = 200
  response_page_path    = "/index.html"
  error_caching_min_ttl = 0
}
```

`error_caching_min_ttl = 0` matters — the default caches the error at the edge, so a
missing asset during a deploy would be served as `index.html` long after the deploy
finished.

There are no per-product detail pages. Each product block on `/products` carries an
anchor ID, which covers deep-linking a client to a specific part without a third route.

## Terraform

Flat files in `terraform/`. One environment. No modules, no workspaces, no environment
directories. At this size, indirection costs more than it saves.

### State

S3 backend with native S3 locking:

```hcl
terraform {
  backend "s3" {
    bucket       = "cci-tfstate-<suffix>"
    key          = "site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

`use_lockfile = true` uses S3 conditional writes for locking. The old DynamoDB lock
table is no longer needed — do not create one.

The state bucket itself is created by `terraform/bootstrap/`, which runs once with local
state. Commit that local state file's absence, not its contents: `bootstrap/` is
apply-once and then effectively frozen.

### Apply order

1. `terraform/bootstrap` — state bucket, versioned, encrypted, public access blocked.
2. `terraform init -migrate-state` in `terraform/`.
3. `terraform apply` — creates the hosted zone first. Read the `name_servers` output.
4. **Update nameservers at GoDaddy** to the four Route 53 servers.
5. Wait for delegation to propagate, then apply again — ACM DNS validation only
   completes once Route 53 is authoritative for the domain. This can take up to 48
   hours; usually under one.

Do the nameserver switch **last**, after the site is confirmed working on the
`*.cloudfront.net` domain. Until then the live domain is untouched.

### Resource notes

**S3** — Block Public Access on all four settings. No `aws_s3_bucket_website_configuration`;
CloudFront reads the bucket via the REST endpoint with OAC, not the website endpoint.
Versioning on, so a bad deploy is recoverable.

**CloudFront** — `PriceClass_100` (North America and Europe; the customer base is
domestic). Compression enabled. HTTP/2 and HTTP/3. `default_root_object = "index.html"`.
Managed cache policy `CachingOptimized`. Custom error responses for 403 and 404 as above
— required for the `/products` route. Response headers policy with HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, and a Content-Security-Policy — fonts and
images are all self-hosted and no third-party scripts load, so the CSP can be genuinely
strict.

**ACM** — certificate in `us-east-1` regardless of where anything else lives; CloudFront
accepts certificates from no other region. DNS validation, with the validation records
managed by the same Terraform run.

**Route 53** — A and AAAA alias records for both apex and `www`. Pick one as canonical
and redirect the other with a CloudFront Function; do not serve identical content at
both. MX, SPF, and DKIM records go here too once business email is set up.

## CI/CD

Two workflows, both authenticating through GitHub OIDC. No AWS access keys are stored
in GitHub secrets.

### OIDC trust policy

The single highest-risk line in the whole setup. Scope the subject claim to the exact
repository and ref:

```hcl
condition {
  test     = "StringEquals"
  variable = "token.actions.githubusercontent.com:sub"
  values   = ["repo:<org>/<repo>:ref:refs/heads/main"]
}

condition {
  test     = "StringEquals"
  variable = "token.actions.githubusercontent.com:aud"
  values   = ["sts.amazonaws.com"]
}
```

A wildcard in `sub` means any GitHub Actions workflow anywhere can assume the role.
Verify this condition exists before the role is ever created.

The deploy role gets exactly two permissions: `s3:PutObject`/`DeleteObject`/`ListBucket`
on the site bucket, and `cloudfront:CreateInvalidation` on the one distribution.

### `deploy.yml`

Triggered by pushes to `main` under `src/`, `public/`, or build config.

```yaml
permissions:
  id-token: write
  contents: read
```

The build-and-sync step, in this order:

```bash
# 1. Hashed assets first, cached forever.
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

# 2. index.html last, never cached.
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

# 3. Invalidate.
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
```

Assets before HTML matters: if `index.html` lands first, it references hashed bundles
that are not uploaded yet, and visitors in that window get a blank page. If
`index.html` is cached at the edge, visitors get a stale page indefinitely.

Invalidations are free up to 1,000 paths per month, so `/*` is fine here.

### `terraform.yml`

`fmt -check`, `validate`, and `plan` on pull requests, with the plan posted as a PR
comment. `apply` on `main`, gated behind a GitHub Environment that requires manual
approval. Terraform never runs from a laptop after bootstrap.

## Operations

There is no runbook, because there is nothing to operate. The failure modes are:

| Symptom | Cause | Fix |
|---|---|---|
| Stale content after deploy | Invalidation missed, or `index.html` cached | Re-run deploy; check cache-control headers |
| Certificate stuck in `PENDING_VALIDATION` | Nameservers not yet delegated to Route 53 | Verify NS at GoDaddy, wait, re-apply |
| 403 from CloudFront | OAC bucket policy wrong, or object missing | Check bucket policy references the current distribution ARN |
| `/products` 403s on direct visit, works via nav | Custom error responses missing | Add the 403/404 → `/index.html` 200 rewrites |
| Domain not resolving | NS propagation still in flight | Wait; up to 48h from the GoDaddy change |

Rollback is `git revert` and a re-deploy. S3 versioning is the backstop if that fails.
