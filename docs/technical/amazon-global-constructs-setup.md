# OpenDoorPH Website Setup with Amazon Global Constructs

## 🚀 Quick Setup Guide

This document guides you through integrating the OpenDoorPH website with the Amazon Global Constructs framework for secure AWS deployment and enterprise AI collaboration.

## 📋 Prerequisites

- Repository admin access to configure secrets
- Basic understanding of GitHub Actions
- AWS account access (handled by Amazon Global Constructs)

## ⚡ 5-Minute Setup

### Step 1: Add Repository Secret

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

```
Name: AWS_ROLE_ARN
Value: arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy
```

### Step 2: Verify Workflow Configuration

The repository now includes an enhanced GitHub Actions workflow (`.github/workflows/node-build.yml`) that:

- ✅ **Tests** your React application on every push/PR
- ✅ **Builds** the production bundle
- ✅ **Deploys** to AWS S3 + CloudFront (main branch only)
- ✅ **Uses OIDC** for secure, credential-free authentication

### Step 3: Test Deployment

1. Push changes to the `main` branch
2. Watch the GitHub Actions workflow execute
3. Verify deployment at:
   - https://opendoorph.info
   - https://opendoorph.net
   - https://opendoorph.org
   - https://opendoorph.com

## 🔧 Technical Details

### AWS Infrastructure

**Current Setup** (managed by Terraform):
- **S3 Bucket**: `opendoorsitebucket` (private, CloudFront-only access)
- **CloudFront CDN**: Global distribution with custom domains
- **Region**: us-east-2 (Ohio)

**Authentication** (provided by Amazon Global Constructs):
- **OIDC Provider**: `arn:aws:iam::785341741686:oidc-provider/token.actions.githubusercontent.com`
- **IAM Role**: `arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy`
- **Permissions**: PowerUserAccess + CDK deployment capabilities

### Workflow Features

#### Security
- **Zero Long-term Credentials**: Uses temporary OIDC tokens
- **Repository Scoping**: Limited to P47Phoenix organization
- **Branch Protection**: Deployment only from main branch
- **Audit Logging**: All activities logged via CloudTrail

#### Performance Optimizations
- **Smart Caching**: Different cache strategies for static assets vs. HTML
- **Efficient Syncs**: Only uploads changed files
- **Cache Invalidation**: Automatic CloudFront cache clearing

#### Monitoring
- **Real-time Dashboard**: [CloudWatch Metrics](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=GitHubOIDC-Dashboard)
- **Security Alerts**: Automatic notifications for anomalies
- **Deployment Status**: Clear success/failure reporting in GitHub

## 🎯 Available Capabilities

With this setup, your GitHub Actions can:

### ✅ **Core Deployment**
- Deploy React applications to S3
- Manage CloudFront distributions
- Update DNS and SSL configurations
- Handle multi-environment deployments

### ✅ **AWS Services Access**
- **S3**: Object storage and static website hosting
- **CloudFront**: Global CDN and SSL termination
- **Route 53**: DNS management (if configured)
- **CloudWatch**: Monitoring and logging
- **Lambda**: Serverless functions (for future enhancements)
- **API Gateway**: REST/GraphQL APIs (for future features)

### ✅ **Infrastructure Management**
- **CDK Deployments**: Full CloudFormation stack management
- **Terraform Integration**: Works with existing Terraform setup
- **Resource Tagging**: Automatic resource organization
- **Cost Optimization**: Built-in AWS cost management practices

## 🔒 Security Features

### Authentication & Authorization
- **OIDC Federation**: Industry-standard secure authentication
- **Least Privilege**: Minimal required permissions
- **Repository Scoping**: Access limited to specific repositories
- **Branch Restrictions**: Production deploys only from main

### Monitoring & Auditing
- **Failed Authentication Alarms**: Triggers on 5+ failures in 10 minutes
- **High Volume Alerts**: Monitors for 50+ authentications in 15 minutes
- **CloudTrail Integration**: Complete audit trail of all AWS activities
- **Weekly Security Reports**: Automated validation and reporting

### Compliance
- **No Stored Credentials**: Zero long-lived AWS keys in GitHub
- **Automatic Token Rotation**: Tokens expire after workflow completion
- **Comprehensive Logging**: All deployment activities tracked
- **Access Reviews**: Regular permission audits via monitoring

## 🚀 Next Steps

### Immediate Enhancements
1. **Multi-Environment Setup**: Create staging and development environments
2. **Custom Domain SSL**: Configure SSL certificates for custom domains
3. **Performance Monitoring**: Add Core Web Vitals tracking
4. **Error Tracking**: Implement application error monitoring

### Advanced Integrations
1. **CDK Migration**: Convert Terraform to AWS CDK for enhanced features
2. **Lambda Functions**: Add serverless backend capabilities
3. **Database Integration**: Connect to AWS RDS or DynamoDB
4. **API Development**: Build REST APIs with API Gateway

### Enterprise AI Framework
1. **Prompt Integration**: Use the 14 specialized AI collaboration prompts
2. **Workflow Automation**: Implement AI-assisted development workflows
3. **Code Quality**: Automated code review and optimization
4. **Documentation**: AI-powered documentation generation

## 🔍 Troubleshooting

### Common Issues

#### Deployment Fails with "Access Denied"
```bash
# Check if the secret is correctly configured
# Verify AWS_ROLE_ARN = arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy
```

#### CloudFront Distribution Not Found
- The workflow automatically discovers the distribution ID
- Ensure Terraform infrastructure is deployed
- Check that the distribution comment matches "cloud front for opendoor."

#### Build Fails in GitHub Actions
- Verify Node.js version compatibility (currently using Node 20)
- Check package.json for dependency issues
- Review test failures in the Actions log

### Getting Help

1. **GitHub Actions Logs**: Check the detailed logs in the Actions tab
2. **AWS Console**: Monitor CloudWatch for deployment activities
3. **Security Dashboard**: [Real-time monitoring](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=GitHubOIDC-Dashboard)
4. **Documentation**: Reference the [complete deployment process](../docs/technical/deployment-process.md)

## 📚 Related Documentation

- **[Deployment Process](../docs/technical/deployment-process.md)**: Complete deployment procedures
- **[Amazon Global Constructs](https://github.com/P47Phoenix/Amazon-Global-Constructs)**: Source framework repository
- **[Security Model](https://github.com/P47Phoenix/Amazon-Global-Constructs/blob/main/docs/security-model.md)**: Comprehensive security documentation
- **[Enterprise AI Framework](../.github/copilot-instructions.md)**: AI collaboration guidelines

---

**Status**: ✅ Ready for Production  
**Last Updated**: July 29, 2025  
**Framework Version**: Amazon Global Constructs v1.0  
**Monitoring**: [Live Dashboard](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=GitHubOIDC-Dashboard)
