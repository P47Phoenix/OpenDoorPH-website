# ⚡ URGENT: Repository Secret Configuration Required

## 🚨 **Action Required Before Next Deployment**

The OpenDoorPH website deployment workflow requires a repository secret to be configured for AWS authentication.

### 🔧 **Step-by-Step Setup (2 minutes)**

1. **Navigate to Repository Settings**
   - Go to: https://github.com/P47Phoenix/OpenDoorPH-website/settings/secrets/actions
   - Or: Repository → Settings → Secrets and variables → Actions

2. **Add New Repository Secret**
   - Click **"New repository secret"**
   - Configure as follows:
   
   ```
   Name: AWS_ROLE_ARN
   Value: arn:aws:iam::785341741686:role/GitHubActionsRole-CDKDeploy
   ```

3. **Click "Add secret"**

### ✅ **Verification**

After adding the secret:
1. Push any change to the `main` branch
2. Watch the GitHub Actions workflow run
3. Verify successful deployment at https://opendoorph.info

### 🔒 **What This Secret Does**

- **Secure Authentication**: Enables GitHub Actions to authenticate with AWS using OIDC
- **No Stored Credentials**: Uses temporary tokens instead of long-lived AWS keys
- **Repository Scoped**: Only works for P47Phoenix organization repositories
- **Comprehensive Logging**: All activities are logged and monitored

### 🚀 **After Configuration**

Once configured, the workflow will automatically:
1. ✅ **Test** the React application
2. ✅ **Build** the production bundle
3. ✅ **Deploy** to S3 with optimized caching
4. ✅ **Invalidate** CloudFront cache
5. ✅ **Report** deployment status

### 📊 **Monitoring**

- **GitHub Actions**: Check the Actions tab for deployment status
- **Live Dashboard**: [AWS CloudWatch Monitoring](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=GitHubOIDC-Dashboard)
- **Website**: https://opendoorph.info

---

**Status**: ⚠️ **Configuration Required**  
**Priority**: 🔴 **Critical**  
**Time Required**: ⏱️ **2 minutes**
