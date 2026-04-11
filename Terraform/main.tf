terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

variable "sitename" {
    type = string
    default = "opendoor"
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Some comment"
}

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${var.sitename}sitebucket/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"]
    }
  }
}


resource "aws_s3_bucket" "sitebucket" {
  bucket = "${var.sitename}sitebucket"
  acl    = "private"
  policy = "${data.aws_iam_policy_document.website_policy.json}"
  website {
    index_document = "index.html"
  }
  tags = {
    Name = "${var.sitename}sitebucket"
    SiteName = "${var.sitename}"
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.sitebucket.bucket_domain_name}"
    origin_id   = "${var.sitename}site"

    s3_origin_config {
    origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "cloud front for ${var.sitename}."
  default_root_object = "index.html"

 /*  logging_config {
    include_cookies = false
    bucket          = "${var.sitename}logs.s3.amazonaws.com"
    prefix          = "${var.sitename}"
  }
 */
  aliases = [
    "opendoorph.org", "www.opendoorph.org",
    "opendoorph.info", "www.opendoorph.info",
    "opendoorph.net", "www.opendoorph.net",
    "opendoorph.com", "www.opendoorph.com",
  ]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.sitename}site"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_200"

   restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# =============================================================================
# Route 53 Hosted Zones (migrated from GoDaddy to Route 53, April 2026)
# =============================================================================

resource "aws_route53_zone" "org" {
  name = "opendoorph.org"
}

resource "aws_route53_zone" "info" {
  name = "opendoorph.info"
}

resource "aws_route53_zone" "net" {
  name = "opendoorph.net"
}

resource "aws_route53_zone" "com" {
  name = "opendoorph.com"
}

# =============================================================================
# DNS Records — apex + www ALIAS records for each zone
# =============================================================================

locals {
  zones = {
    org  = aws_route53_zone.org.zone_id
    info = aws_route53_zone.info.zone_id
    net  = aws_route53_zone.net.zone_id
    com  = aws_route53_zone.com.zone_id
  }
  domain_names = {
    org  = "opendoorph.org"
    info = "opendoorph.info"
    net  = "opendoorph.net"
    com  = "opendoorph.com"
  }
}

resource "aws_route53_record" "apex" {
  for_each = local.zones
  zone_id  = each.value
  name     = local.domain_names[each.key]
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  for_each = local.zones
  zone_id  = each.value
  name     = "www.${local.domain_names[each.key]}"
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# =============================================================================
# ACM Certificate (us-east-1 for CloudFront)
# =============================================================================

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_acm_certificate" "cert" {
  provider          = aws.us_east_1
  domain_name       = "opendoorph.org"
  validation_method = "DNS"

  subject_alternative_names = [
    "www.opendoorph.org",
    "opendoorph.info",
    "www.opendoorph.info",
    "opendoorph.net",
    "www.opendoorph.net",
    "opendoorph.com",
    "www.opendoorph.com",
  ]

  lifecycle {
    create_before_destroy = true
  }
}

# =============================================================================
# ACM DNS Validation Records
# =============================================================================

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      record  = dvo.resource_record_value
      zone_id = (
        can(regex("opendoorph\\.org$", dvo.domain_name)) ? aws_route53_zone.org.zone_id :
        can(regex("opendoorph\\.info$", dvo.domain_name)) ? aws_route53_zone.info.zone_id :
        can(regex("opendoorph\\.net$", dvo.domain_name)) ? aws_route53_zone.net.zone_id :
        aws_route53_zone.com.zone_id
      )
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

# =============================================================================
# ACM Validation
# =============================================================================

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# =============================================================================
# Outputs
# =============================================================================

output "route53_nameservers" {
  description = "Route 53 nameservers — enter these at GoDaddy for each domain"
  value = {
    org  = aws_route53_zone.org.name_servers
    info = aws_route53_zone.info.name_servers
    net  = aws_route53_zone.net.name_servers
    com  = aws_route53_zone.com.name_servers
  }
}
