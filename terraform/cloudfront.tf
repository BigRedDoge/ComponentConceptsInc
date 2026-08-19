resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "cci-site-oac"
  description                       = "OAC for ${var.domain}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Redirects www to the apex domain (301). Runs on every viewer request before
# CloudFront touches the cache or origin.
resource "aws_cloudfront_function" "www_redirect" {
  name    = "cci-www-redirect"
  runtime = "cloudfront-js-2.0"
  publish = true

  code = <<-EOT
    function handler(event) {
      var host = event.request.headers.host.value;
      if (host === 'www.${var.domain}') {
        return {
          statusCode: 301,
          statusDescription: 'Moved Permanently',
          headers: {
            location: {
              value: 'https://${var.domain}' + event.request.uri
            }
          }
        };
      }
      return event.request;
    }
  EOT
}

# Response headers added to every CloudFront response. All fonts and images
# are self-hosted; no third-party scripts load; CSP can be genuinely strict.
resource "aws_cloudfront_response_headers_policy" "site" {
  name = "cci-site-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    # style-src includes 'unsafe-inline' because Radix UI (used by shadcn/ui
    # Sheet) applies inline style attributes for positioning and transforms.
    content_security_policy {
      content_security_policy = join("; ", [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ])
      override = true
    }
  }
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  http_version        = "http2and3"
  aliases             = [var.domain, "www.${var.domain}"]

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-site"

    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.www_redirect.arn
    }
  }

  # SPA routing: S3 returns 403 (not 404) for missing keys when Block Public
  # Access is on and OAC is used. Both must rewrite to index.html so React
  # Router can handle the path. error_caching_min_ttl = 0 prevents CloudFront
  # from caching the rewrite across deploys.
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

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
