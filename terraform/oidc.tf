# GitHub Actions authenticates via OIDC — no long-lived access keys anywhere.
#
# SECURITY: the sub condition uses StringEquals (not StringLike) and is scoped
# to the exact repo and ref. A wildcard here would allow any GitHub Actions
# workflow on any repo to assume this role. Verify this condition before apply.

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS validates the GitHub OIDC certificate directly via JWKS for this
  # provider; the thumbprint is required by the API but is not used for
  # validation. The value below is the current well-known GitHub thumbprint.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "github_oidc_assume" {
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

    # Scoped to pushes to main on this exact repository only.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name               = "cci-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_oidc_assume.json
}

# Minimum permissions required by deploy.yml:
# - s3: sync assets and upload index.html
# - cloudfront: create cache invalidation after deploy
data "aws_iam_policy_document" "deploy" {
  statement {
    sid    = "S3Objects"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
    ]
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
