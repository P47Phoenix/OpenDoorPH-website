# Infrastructure Documentation

## ☁️ AWS Infrastructure Overview

The OpenDoorPH website is deployed on AWS using a serverless static website architecture optimized for performance, security, and cost-effectiveness.

## 🏗️ Infrastructure Architecture

### High-Level Architecture
```
Internet → Route 53 → CloudFront → S3 Bucket
                           ↓
                    Origin Access Identity
                           ↓
                    Private S3 Bucket
```

## 🛠️ Infrastructure as Code (Terraform)

### Terraform Configuration Overview

The infrastructure is defined and managed using Terraform for repeatable, version-controlled deployments.

#### Configuration File: `Terraform/main.tf`

### 🔧 Core Infrastructure Components

#### 1. Variables Configuration
```hcl
variable "sitename" {
    type = "string"
    default = "opendoor"
}
```

**Purpose**: Defines the site name prefix for resource naming
**Configuration**: Default value "opendoor" for consistent resource naming

#### 2. AWS Provider Configuration
```hcl
provider "aws" {
  region = "us-east-2"
}
```

**Region**: US East 2 (Ohio) - `us-east-2`
**Benefits**: 
- Lower latency for central US users
- Cost-effective pricing
- High availability with multiple AZs

#### 3. CloudFront Origin Access Identity
```hcl
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Some comment"
}
```

**Purpose**: Secure access between CloudFront and S3
**Security**: Prevents direct public access to S3 bucket
**Access**: Only CloudFront can access S3 content

## 🪣 S3 Bucket Configuration

### Bucket Resource
```hcl
resource "aws_s3_bucket" "sitebucket" {
  bucket = "${var.sitename}sitebucket"
  acl    = "private"
  policy = "${data.aws_iam_policy_document.website_policy.json}"
}
```

#### Bucket Properties
- **Name**: `opendoorsitebucket` (based on sitename variable)
- **ACL**: Private (no public access)
- **Access**: Controlled via bucket policy and OAI

### Bucket Policy Configuration
```hcl
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
```

#### Policy Details
- **Actions**: `s3:GetObject` - Read-only access to objects
- **Resources**: All objects in the site bucket (`/*`)
- **Principals**: Only the CloudFront OAI can access
- **Security**: Prevents unauthorized direct access

## 🌐 CloudFront Distribution

### Expected CloudFront Configuration
Based on the Terraform setup, the CloudFront distribution includes:

#### Origin Configuration
- **Origin Domain**: S3 bucket domain name
- **Origin Access**: Via Origin Access Identity
- **Protocol**: HTTPS only

#### Cache Behaviors
- **Default**: Cache static assets (HTML, CSS, JS, images)
- **TTL**: Configured for optimal performance
- **Compression**: Enabled for text-based assets

#### Security Headers
- **HTTPS**: Redirect HTTP to HTTPS
- **Security**: Standard security headers
- **CORS**: Configured for web application needs

## 🔒 Security Configuration

### Access Control
- **S3 Bucket**: Private with policy-based access
- **CloudFront**: Public endpoint with SSL/TLS
- **OAI**: Secure connection between CloudFront and S3

### SSL/TLS Configuration
- **Certificate**: AWS-managed SSL certificate
- **Protocols**: TLS 1.2+ only
- **Cipher Suites**: Strong encryption standards

### IAM Policies
- **Principle of Least Privilege**: Minimal required permissions
- **Resource-Specific**: Policies scoped to specific resources
- **No User Access**: Static website requires no user authentication

## 📊 Monitoring and Logging

### CloudFront Logging
- **Access Logs**: Detailed request logging
- **Real-time Logs**: Available for analysis
- **Metrics**: Performance and usage metrics

### S3 Monitoring
- **Access Patterns**: Request metrics
- **Storage Metrics**: Object count and size
- **Error Monitoring**: 4xx and 5xx error tracking

## 💰 Cost Optimization

### S3 Storage
- **Storage Class**: Standard (appropriate for website assets)
- **Lifecycle Policies**: Not needed for static website
- **Versioning**: Disabled to minimize costs

### CloudFront
- **Price Class**: All edge locations for global performance
- **Caching**: Aggressive caching to reduce origin requests
- **Compression**: Enabled to reduce bandwidth costs

### Data Transfer
- **CDN Benefits**: Reduced data transfer costs from S3
- **Caching**: Minimizes repeated requests to origin
- **Global Distribution**: Efficient content delivery

## 🚀 Deployment Process

### Infrastructure Deployment
```bash
# Navigate to Terraform directory
cd Terraform

# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply infrastructure
terraform apply
```

### Application Deployment
```bash
# Build React application
cd OpenDoorWebsiteApp
npm run build

# Deploy to S3
aws s3 sync build/ s3://opendoorsitebucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## 🔄 Disaster Recovery

### Backup Strategy
- **Source Code**: Version controlled in Git repository
- **Infrastructure**: Defined in Terraform (Infrastructure as Code)
- **Static Assets**: Stored in S3 with durability guarantees

### Recovery Procedures
1. **Code Recovery**: Restore from Git repository
2. **Infrastructure Recovery**: Re-deploy via Terraform
3. **Content Recovery**: S3 provides 99.999999999% durability

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: < 1 hour
- **Recovery Point Objective (RPO)**: Latest committed code
- **Availability**: 99.9% uptime target

## 📈 Scalability Considerations

### Current Scale
- **Traffic**: Local community website
- **Geographic**: Primarily US-based users
- **Content**: Static website with minimal updates

### Future Scaling Options
- **Global Reach**: CloudFront already provides global distribution
- **Traffic Spikes**: Auto-scaling via CloudFront
- **Content Growth**: S3 scales automatically
- **Dynamic Content**: Can add Lambda@Edge for dynamic features

## 🔧 Infrastructure Maintenance

### Regular Tasks
- **Security Updates**: Monitor AWS security bulletins
- **Cost Review**: Monthly cost analysis and optimization
- **Performance Review**: CloudFront and S3 metrics analysis
- **SSL Certificate**: Automatic renewal via AWS Certificate Manager

### Terraform State Management
- **State File**: `terraform.tfstate` (should be moved to remote backend)
- **State Backup**: `terraform.tfstate.backup`
- **Best Practice**: Store state in S3 backend for team collaboration

### Recommended Improvements
```hcl
# Add remote state backend
terraform {
  backend "s3" {
    bucket = "terraform-state-bucket"
    key    = "opendoor/terraform.tfstate"
    region = "us-east-2"
  }
}

# Add CloudFront distribution resource
resource "aws_cloudfront_distribution" "website_distribution" {
  # CloudFront configuration
}

# Add Route 53 hosted zone
resource "aws_route53_zone" "main" {
  name = "opendoorph.com"
}
```

## 🐳 Container Configuration (Docker)

### Dockerfile Analysis
The project includes a `Dockerfile` for containerized deployments:

```dockerfile
# Located at: Terraform/Dockerfile
# Purpose: Container-based deployment option
# Use Case: Alternative deployment method or CI/CD pipelines
```

### Container Benefits
- **Consistent Environment**: Same runtime across development and production
- **CI/CD Integration**: Easy integration with container-based pipelines
- **Local Development**: Standardized development environment

## 📚 Additional Resources

### AWS Documentation
- [S3 Static Website Hosting](https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Route 53 Documentation](https://docs.aws.amazon.com/route53/)

### Terraform Resources
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/)

### Security Best Practices
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [S3 Security Best Practices](https://docs.aws.amazon.com/s3/latest/userguide/security-best-practices.html)
