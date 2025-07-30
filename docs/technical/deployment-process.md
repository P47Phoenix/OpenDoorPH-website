# OpenDoorPH Website Deployment Process

## 🎯 Overview

This document outlines the complete deployment process for the OpenDoorPH website, including infrastructure setup, build process, and deployment procedures.

## 🏗️ Infrastructure Architecture

### Current Setup
- **Cloud Provider**: Amazon Web Services (AWS)
- **Region**: us-east-2 (Ohio) for S3 and application resources
- **Authentication**: GitHub OIDC federation via Amazon Global Constructs
- **Frontend Hosting**: AWS S3 + CloudFront CDN
- **Infrastructure as Code**: Terraform + AWS CDK (via Amazon Global Constructs)
- **CI/CD**: GitHub Actions with OIDC authentication
- **Domain Aliases**: 
  - opendoorph.info
  - opendoorph.net  
  - opendoorph.org
  - opendoorph.com

### AWS Resources
- **S3 Bucket**: `opendoorsitebucket` (private bucket with CloudFront access)
- **CloudFront Distribution**: Global CDN with custom domain aliases
- **OIDC Provider**: `arn:aws:iam::785341741686:oidc-provider/token.actions.githubusercontent.com`
- **GitHub Actions Role**: `arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy`

### Security & Authentication
- **Zero Long-term Credentials**: GitHub Actions uses temporary OIDC tokens
- **Repository Scoping**: Access limited to P47Phoenix organization
- **Comprehensive Monitoring**: Real-time security alerts and audit logging
- **Live Dashboard**: [CloudWatch Monitoring](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=GitHubOIDC-Dashboard)

## 🔧 Prerequisites

### Required Tools
- **Node.js**: v20.11.1 or higher
- **npm**: v10.2.4 or higher
- **Terraform**: Latest version
- **AWS CLI**: Configured with appropriate permissions
- **Git**: For version control

### Required Permissions
- Repository admin access to configure GitHub secrets
- GitHub Actions access to P47Phoenix organization (provided by Amazon Global Constructs)

### Repository Secrets
Configure the following secret in your GitHub repository:

```bash
# GitHub Repository Secret
AWS_ROLE_ARN=arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy
```

### AWS Permissions (Automatically Configured)
The Amazon Global Constructs framework provides:
- **PowerUserAccess**: Broad AWS service access
- **CDK Deployment**: CloudFormation and infrastructure management
- **S3 & CloudFront**: Website hosting and CDN management
- **Monitoring**: CloudWatch and CloudTrail access

## 🚀 Deployment Procedures

### 1. Infrastructure Deployment

#### Initial Infrastructure Setup
```bash
# Navigate to Terraform directory
cd Terraform

# Initialize Terraform
terraform init

# Plan infrastructure changes
terraform plan

# Apply infrastructure changes
terraform apply
```

#### Infrastructure Updates
```bash
# Review planned changes
terraform plan

# Apply changes with approval
terraform apply

# Verify deployment
terraform show
```

### 2. Application Build Process

#### Development Build
```bash
# Navigate to application directory
cd OpenDoorWebsiteApp

# Install dependencies
npm install

# Run development server
npm start
# Application available at http://localhost:3000
```

#### Production Build
```bash
# Navigate to application directory
cd OpenDoorWebsiteApp

# Install dependencies
npm ci

# Run tests
npm test -- --coverage --ci --watchAll=false

# Create production build
npm run build

# Verify build output
ls -la build/
```

### 3. Deployment to AWS

#### Manual Deployment
```bash
# Build the application
cd OpenDoorWebsiteApp
npm run build

# Deploy to S3 (requires AWS CLI configuration)
aws s3 sync build/ s3://opendoorsitebucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### Automated Deployment via GitHub Actions (Recommended)
The repository includes an enhanced GitHub Actions workflow that provides:

**Workflow Triggers:**
- **Push to main**: Automatic deployment to production
- **Pull requests**: Build and test only (no deployment)
- **Feature branches**: Build and test only

**Security Features:**
- **OIDC Authentication**: No stored AWS credentials
- **Repository Scoping**: Limited to P47Phoenix organization
- **Branch Protection**: Production deploys only from main branch
- **Audit Logging**: All activities tracked via CloudTrail

**Deployment Process:**
```yaml
name: Build, Test & Deploy OpenDoorPH Website
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  id-token: write  # Required for OIDC authentication
  contents: read

jobs:
  test:
    # Builds and tests the application
    
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-2
      - name: Deploy to S3 and invalidate CloudFront
```

**Deployment Features:**
- **Smart Caching**: Different cache strategies for static assets vs. HTML
- **Efficient Syncs**: Only uploads changed files
- **Automatic Cache Invalidation**: CloudFront cache clearing
- **Multi-domain Support**: Deploys to all configured domain aliases

## 🔄 CI/CD Pipeline

### Current GitHub Actions Workflow
```yaml
name: Build and test
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./OpenDoorWebsiteApp
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Configure node
        uses: actions/setup-node@v3
        with:
          node-version: '14'
      - run: npm install
      - run: npm test
```

### Recommended Enhanced CI/CD Pipeline

#### Enhanced GitHub Actions Workflow
```yaml
name: Build, Test & Deploy
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./OpenDoorWebsiteApp
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage --ci --watchAll=false
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    defaults:
      run:
        working-directory: ./OpenDoorWebsiteApp
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-2
      - run: aws s3 sync build/ s3://opendoorsitebucket --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 🎯 Deployment Environments

### Production Environment
- **Branch**: `main`
- **S3 Bucket**: `opendoorsitebucket`
- **Domain**: opendoorph.info (primary)
- **Auto-deployment**: On merge to main branch

### Staging Environment (Recommended)
- **Branch**: `develop`
- **S3 Bucket**: `opendoor-staging-sitebucket`
- **Domain**: staging.opendoorph.info
- **Auto-deployment**: On push to develop branch

### Feature Environment
- **Branch**: `feature/*`
- **Deployment**: Manual review deployments
- **Testing**: Automated testing on PR creation

## 🔍 Verification & Testing

### Pre-deployment Checks
```bash
# Run full test suite
npm test -- --coverage

# Check for linting issues
npm run lint

# Verify build succeeds
npm run build

# Check bundle size
npm run build && du -sh build/
```

### Post-deployment Verification
```bash
# Check website accessibility
curl -I https://opendoorph.info

# Verify CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Check S3 bucket contents
aws s3 ls s3://opendoorsitebucket --recursive
```

### Performance Testing
- **Core Web Vitals**: Monitor via Google PageSpeed Insights
- **Load Testing**: Use tools like Lighthouse CI
- **CDN Performance**: Verify CloudFront cache hit rates

## 🔒 Security Considerations

### Access Control
- S3 bucket configured as private
- CloudFront Origin Access Identity (OAI) restricts direct S3 access
- HTTPS enforcement via CloudFront

### Secrets Management
- Store AWS credentials in GitHub Secrets
- Use IAM roles with least privilege principle
- Rotate access keys regularly

### Content Security
- Enable S3 bucket versioning for rollback capability
- Configure CloudFront security headers
- Regular security audits of dependencies

## 🚨 Rollback Procedures

### Emergency Rollback
```bash
# Option 1: Revert to previous S3 version
aws s3api list-object-versions --bucket opendoorsitebucket

# Option 2: Deploy previous git commit
git checkout <previous-commit-hash>
npm run build
aws s3 sync build/ s3://opendoorsitebucket --delete

# Option 3: Use Terraform state rollback
terraform plan -target=aws_s3_bucket.sitebucket
terraform apply -target=aws_s3_bucket.sitebucket
```

### Planned Rollback
1. Identify stable previous version
2. Create rollback branch from stable commit
3. Deploy through normal CI/CD process
4. Verify functionality
5. Update documentation

## 📊 Monitoring & Maintenance

### Health Checks
- **Uptime Monitoring**: Implement external monitoring service
- **Error Tracking**: Monitor CloudFront error rates
- **Performance Monitoring**: Track Core Web Vitals

### Regular Maintenance
- **Monthly**: Review and update dependencies
- **Quarterly**: Security audit and vulnerability scan
- **Annually**: Infrastructure cost optimization review

### Troubleshooting Common Issues

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version
npm --version
```

#### Deployment Issues
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check S3 bucket permissions
aws s3api get-bucket-policy --bucket opendoorsitebucket

# Verify CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 📚 References & Documentation

### Internal Documentation
- [Project Overview](../overview/project-overview.md)
- [Architecture Documentation](./architecture.md)
- [Development Guide](../development/development-guide.md)
- [Library Update Plan](../updates/library-update-plan.md)

### External Resources
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

## 📝 Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-28 | 1.0.0 | Initial deployment process documentation | AI Assistant |

---

*This document should be reviewed and updated quarterly or after major infrastructure changes.*
