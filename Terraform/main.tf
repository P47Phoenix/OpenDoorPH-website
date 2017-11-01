variable "sitename" {
    type = "string"
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
  policy = "${data.aws_iam_policy_document.website.json}"
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
    domain_name = "${aws_s3_bucket.b.bucket_domain_name}"
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

    viewer_protocol_policy = "allow-all"
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
    cloudfront_default_certificate = true
  }
}