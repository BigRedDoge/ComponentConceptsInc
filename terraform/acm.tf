# CloudFront requires ACM certificates to be in us-east-1 regardless of
# where the distribution or bucket lives. The us_east_1 provider alias
# (defined in providers.tf) enforces this.

resource "aws_acm_certificate" "site" {
  provider = aws.us_east_1

  domain_name               = var.domain
  subject_alternative_names = ["www.${var.domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# DNS validation records in the Route 53 zone. for_each handles both the
# apex and www SANs; allow_overwrite prevents conflicts if applied twice.
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = aws_route53_zone.main.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

# Waits for ACM to confirm the certificate is issued. The CloudFront
# distribution depends on this resource so Terraform will not attempt
# to attach an unvalidated certificate.
#
# Validation only succeeds once Route 53 is authoritative for the domain
# (i.e., GoDaddy nameservers updated). If this times out, update the NS
# records at GoDaddy and re-apply.
resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
