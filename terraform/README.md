# Terraform

## Apply order

### 1. Bootstrap — state bucket (run once, local state)

```bash
cd terraform/bootstrap
terraform init
terraform apply
```

Copy the `state_bucket_name` output. Paste it into `backend.tf`, replacing
`REPLACE_WITH_ACCOUNT_ID`.

### 2. Initialize main config

```bash
cd terraform
terraform init
```

If you previously ran `terraform apply` with a local state file, migrate it:

```bash
terraform init -migrate-state
```

### 3. Create the hosted zone and get name servers

Apply only the hosted zone first so you can hand the NS records to GoDaddy
before ACM tries to validate:

```bash
terraform apply -target=aws_route53_zone.main
```

Read the `name_servers` output:

```bash
terraform output name_servers
```

### 4. Update nameservers at GoDaddy

Log into GoDaddy and replace the four default NS records with the Route 53
values from step 3. This step is manual.

### 5. Wait for DNS delegation

Propagation usually takes under an hour. Use a tool like
`dig NS componentconceptsinc.com @8.8.8.8` to confirm the Route 53 servers
are authoritative before continuing.

### 6. Apply everything

```bash
terraform apply
```

This completes ACM DNS validation and creates the CloudFront distribution.
The `aws_acm_certificate_validation` resource has a 75-minute timeout; if
delegation has not propagated, it will time out and you can re-apply after
propagation finishes.

### 7. Verify

1. Visit the `cloudfront_domain` output URL — the site should load.
2. Navigate directly to `<cloudfront_domain>/products` in a new browser tab.
   It must load the app, not an XML error. This confirms the custom error
   responses are working.
3. Visit `https://www.componentconceptsinc.com` — confirm it redirects 301
   to `https://componentconceptsinc.com` (only after DNS cutover in Phase 10).

The real domain (`componentconceptsinc.com`) is untouched until Phase 10.

---

## GitHub Actions secrets / variables

After apply, add these to the repository (Settings → Secrets and variables →
Actions):

| Name | Value | Type |
|---|---|---|
| `AWS_ROLE_ARN` | `deploy_role_arn` output | Variable (not secret) |
| `AWS_BUCKET` | `site_bucket_name` output | Variable |
| `AWS_DISTRIBUTION_ID` | `cloudfront_distribution_id` output | Variable |

No AWS access keys. All authentication is via OIDC.
