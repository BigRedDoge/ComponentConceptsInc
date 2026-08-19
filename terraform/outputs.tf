output "site_bucket_name" {
  description = "S3 bucket name — used in deploy.yml as BUCKET"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used in deploy.yml for cache invalidation"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  description = "CloudFront *.cloudfront.net domain — use this to verify the site before the DNS cutover"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "name_servers" {
  description = "Route 53 name servers — update these four values at GoDaddy"
  value       = aws_route53_zone.main.name_servers
}

output "deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC — set as AWS_ROLE_ARN in deploy.yml"
  value       = aws_iam_role.deploy.arn
}

output "terraform_role_arn" {
  description = "IAM role ARN for Terraform CI — set as AWS_TERRAFORM_ROLE_ARN in terraform.yml"
  value       = aws_iam_role.terraform_ci.arn
}
