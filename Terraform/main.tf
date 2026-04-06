variable "sitename" {
    type = string
    default = "opendoor"
}

provider "aws" {
  region = "us-east-2"
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
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
  tags {
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
  aliases = ["opendoorph.info", "opendoorph.net", "opendoorph.org", "opendoorph.com"]

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

  tags {
    Environment = "production"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# -------------------------------------------------------------------
# ACM Certificate (must be in us-east-1 for CloudFront)
# -------------------------------------------------------------------

resource "aws_acm_certificate" "cert" {
  provider          = aws.us_east_1
  domain_name       = "opendoorph.info"
  validation_method = "DNS"

  subject_alternative_names = [
    "opendoorph.net",
    "opendoorph.org",
    "opendoorph.com",
  ]

  lifecycle {
    create_before_destroy = true
  }
}

# -------------------------------------------------------------------
# ACM Certificate Validation
# Apply this AFTER adding the DNS CNAME records shown in the outputs.
# -------------------------------------------------------------------

resource "aws_acm_certificate_validation" "cert" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.cert.arn
}

# -------------------------------------------------------------------
# Outputs – DNS validation CNAME records to add manually
# -------------------------------------------------------------------

output "acm_validation_records" {
  description = "DNS CNAME records required to validate the ACM certificate. Add these to your DNS provider."
  value = {
    for dvo in aws_acm_certificate.cert.domain_validation_options :
    dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
}