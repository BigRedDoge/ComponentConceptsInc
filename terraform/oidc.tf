# GitHub Actions authenticates via OIDC — no long-lived access keys anywhere.
#
# SECURITY: sub conditions use StringEquals (not StringLike) and are scoped
# to the exact repo. A wildcard here would allow any workflow on any repo to
# assume these roles. Verify both conditions before apply.

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS validates the GitHub OIDC certificate directly via JWKS for this
  # provider; the thumbprint is required by the API but is not used for
  # validation. The value below is the current well-known GitHub thumbprint.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# ── Deploy role ────────────────────────────────────────────────────────────────
# Used by deploy.yml. Scoped to pushes to main only.
# Permissions: sync assets to S3 + create a CloudFront invalidation. Nothing more.

data "aws_iam_policy_document" "deploy_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name               = "cci-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_assume.json
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid       = "S3Objects"
    effect    = "Allow"
    actions   = ["s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  statement {
    sid       = "S3List"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid       = "CloudFrontInvalidate"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "cci-deploy-policy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}

# ── Terraform CI role ─────────────────────────────────────────────────────────
# Used by terraform.yml for plan (pull requests) and apply (main).
# StringEquals with multiple sub values acts as OR — this allows both event
# types from this exact repo and nothing else.

data "aws_iam_policy_document" "terraform_ci_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_repo}:ref:refs/heads/main",
        "repo:${var.github_repo}:pull_request",
      ]
    }
  }
}

resource "aws_iam_role" "terraform_ci" {
  name               = "cci-github-terraform"
  assume_role_policy = data.aws_iam_policy_document.terraform_ci_assume.json
}

data "aws_iam_policy_document" "terraform_ci" {
  # Terraform state bucket
  statement {
    sid    = "TerraformState"
    effect = "Allow"
    actions = [
      "s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::cci-tfstate-*",
      "arn:aws:s3:::cci-tfstate-*/*",
    ]
  }

  # Site bucket full management
  statement {
    sid       = "SiteBucket"
    effect    = "Allow"
    actions   = ["s3:*"]
    resources = ["arn:aws:s3:::cci-site-*", "arn:aws:s3:::cci-site-*/*"]
  }

  # CloudFront full management
  statement {
    sid       = "CloudFront"
    effect    = "Allow"
    actions   = ["cloudfront:*"]
    resources = ["*"]
  }

  # ACM full management (certs cannot be scoped narrower than region in ARNs)
  statement {
    sid       = "ACM"
    effect    = "Allow"
    actions   = ["acm:*"]
    resources = ["*"]
  }

  # Route 53 full management
  statement {
    sid       = "Route53"
    effect    = "Allow"
    actions   = ["route53:*"]
    resources = ["*"]
  }

  # IAM: only cci-* roles and the GitHub OIDC provider — not iam:*
  statement {
    sid    = "IAMRoles"
    effect = "Allow"
    actions = [
      "iam:CreateRole", "iam:UpdateRole", "iam:DeleteRole", "iam:GetRole",
      "iam:ListRolePolicies", "iam:GetRolePolicy", "iam:PutRolePolicy",
      "iam:DeleteRolePolicy", "iam:TagRole", "iam:UntagRole",
      "iam:ListAttachedRolePolicies",
    ]
    resources = ["arn:aws:iam::*:role/cci-*"]
  }

  statement {
    sid    = "IAMOIDCProvider"
    effect = "Allow"
    actions = [
      "iam:CreateOpenIDConnectProvider", "iam:DeleteOpenIDConnectProvider",
      "iam:GetOpenIDConnectProvider", "iam:UpdateOpenIDConnectProviderThumbprint",
      "iam:AddClientIDToOpenIDConnectProvider",
      "iam:RemoveClientIDFromOpenIDConnectProvider",
      "iam:TagOpenIDConnectProvider", "iam:ListOpenIDConnectProviders",
    ]
    resources = ["arn:aws:iam::*:oidc-provider/token.actions.githubusercontent.com"]
  }

  # STS: for data.aws_caller_identity used in resource naming
  statement {
    sid       = "GetCallerIdentity"
    effect    = "Allow"
    actions   = ["sts:GetCallerIdentity"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "terraform_ci" {
  name   = "cci-terraform-policy"
  role   = aws_iam_role.terraform_ci.id
  policy = data.aws_iam_policy_document.terraform_ci.json
}
