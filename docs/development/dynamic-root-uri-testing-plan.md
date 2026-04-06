# Dynamic Root URI Testing Plan

## Overview
This document outlines comprehensive testing procedures for the dynamic root URI implementation to ensure the React application works correctly across different deployment environments with varying root paths.

## Test Environments

### Environment 1: Root Domain (/)
- **REACT_APP_ROOT_URI**: `/` or unset
- **Use Case**: Custom domain deployment (e.g., https://www.opendoorph.org/)
- **Expected Behavior**: All links work without any path prefix

### Environment 2: GitHub Pages Subdirectory (/OpenDoorPH-website/)
- **REACT_APP_ROOT_URI**: `/OpenDoorPH-website/`
- **Use Case**: GitHub Pages deployment (e.g., https://p47phoenix.github.io/OpenDoorPH-website/)
- **Expected Behavior**: All links work with `/OpenDoorPH-website/` prefix

### Environment 3: Custom Subdirectory (/CustomPath/)
- **REACT_APP_ROOT_URI**: `/CustomPath/`
- **Use Case**: Deployment to a custom subdirectory
- **Expected Behavior**: All links work with `/CustomPath/` prefix

### Environment 4: Deep Nested Path (/level1/level2/app/)
- **REACT_APP_ROOT_URI**: `/level1/level2/app/`
- **Use Case**: Complex subdirectory deployment
- **Expected Behavior**: All links work with `/level1/level2/app/` prefix

## Test Categories

### 1. Navigation Component Links
**Components to Test:**
- Header navigation (Home, Location, About, Galatians 6:1)
- Footer Quick Links (Home, Location & Directions, About Us)

**Expected Behavior:**
- All navigation links should respect the REACT_APP_ROOT_URI setting
- Links should navigate correctly within the React Router
- Active states should work properly
- No 404 errors on navigation

### 2. Content Area Links
**Components to Test:**
- Homepage "Visit Us" button
- Homepage "Learn More" button
- Location page "About Our Church" link
- Any other internal content links

**Expected Behavior:**
- All content links should respect the REACT_APP_ROOT_URI setting
- Links should navigate correctly to intended pages
- No broken links or 404 errors

### 3. External Links
**Components to Test:**
- Facebook link in footer
- Bible Gateway and other external reference links
- Google Maps links on Location page

**Expected Behavior:**
- External links should open in new tabs/windows
- External links should not be affected by REACT_APP_ROOT_URI
- All external links should resolve correctly

### 4. Static Asset Loading
**Assets to Test:**
- Images (logos, photos, icons)
- CSS files
- JavaScript bundles
- Favicon and manifest files

**Expected Behavior:**
- All assets should load correctly regardless of root URI
- No broken images or missing resources
- Proper cache headers and asset optimization

### 5. React Router Functionality
**Features to Test:**
- Direct URL access to all pages
- Browser back/forward navigation
- Programmatic navigation
- Route parameters and query strings

**Expected Behavior:**
- All routes should be accessible via direct URL
- Browser navigation should work correctly
- Route matching should respect the basename

## Test Procedures

### Local Testing Setup

#### Test Environment 1: Root Domain (/)
```bash
# In OpenDoorWebsiteApp directory
npm run build:prod
npx serve -s build -p 3000
```
**Test URL**: http://localhost:3000/

#### Test Environment 2: GitHub Pages (/OpenDoorPH-website/)
```bash
# In OpenDoorWebsiteApp directory
npm run build:gh-pages
# Create test structure
cd ..
mkdir -p temp_test/OpenDoorPH-website
cp -r OpenDoorWebsiteApp/build/* temp_test/OpenDoorPH-website/
npx serve temp_test -p 3001
```
**Test URL**: http://localhost:3001/OpenDoorPH-website/

#### Test Environment 3: Custom Path (/CustomPath/)
```bash
# In OpenDoorWebsiteApp directory
cross-env REACT_APP_ROOT_URI=/CustomPath/ PUBLIC_URL=/CustomPath/ npm run build
# Create test structure
cd ..
mkdir -p temp_test_custom/CustomPath
cp -r OpenDoorWebsiteApp/build/* temp_test_custom/CustomPath/
npx serve temp_test_custom -p 3002
```
**Test URL**: http://localhost:3002/CustomPath/

#### Test Environment 4: Deep Nested (/level1/level2/app/)
```bash
# In OpenDoorWebsiteApp directory
cross-env REACT_APP_ROOT_URI=/level1/level2/app/ PUBLIC_URL=/level1/level2/app/ npm run build
# Create test structure
cd ..
mkdir -p temp_test_deep/level1/level2/app
cp -r OpenDoorWebsiteApp/build/* temp_test_deep/level1/level2/app/
npx serve temp_test_deep -p 3003
```
**Test URL**: http://localhost:3003/level1/level2/app/

### Manual Testing Checklist

For each test environment, verify:

#### Page Loading
- [ ] Homepage loads correctly
- [ ] All navigation menu items are visible
- [ ] Footer content displays properly
- [ ] No console errors in browser developer tools

#### Navigation Links
- [ ] Click "Home" in header navigation
- [ ] Click "Location" in header navigation
- [ ] Click "About" in header navigation
- [ ] Click "Galatians 6:1" in header navigation
- [ ] Click "Home" in footer Quick Links
- [ ] Click "Location & Directions" in footer Quick Links
- [ ] Click "About Us" in footer Quick Links

#### Content Area Links
- [ ] Click "Visit Us" button on homepage
- [ ] Click "Learn More" button on homepage
- [ ] Navigate to Location page and click "About Our Church" link
- [ ] Check for any other internal content links

#### External Links
- [ ] Click "Follow us on Facebook" link (should open in new tab)
- [ ] On Scripture study page, click external reference links
- [ ] On Location page, click Google Maps links

#### Direct URL Access
- [ ] Access homepage directly via URL
- [ ] Access /opendoor directly via URL
- [ ] Access /opendoor/Home/Location directly via URL
- [ ] Access /opendoor/Home/About directly via URL
- [ ] Access /opendoor/Home/Scripture directly via URL

#### Browser Navigation
- [ ] Use browser back button after navigation
- [ ] Use browser forward button
- [ ] Refresh page on different routes
- [ ] Open links in new tabs

### Automated Testing Considerations

#### Playwright Test Suite
Create automated tests for:
- Link navigation verification
- Page loading verification
- External link functionality
- Asset loading verification
- Route accessibility

#### Test Data Matrix
| Environment | Root URI | Expected Base URL | Test Port |
|-------------|----------|-------------------|-----------|
| Root Domain | `/` | http://localhost:3000/ | 3000 |
| GitHub Pages | `/OpenDoorPH-website/` | http://localhost:3001/OpenDoorPH-website/ | 3001 |
| Custom Path | `/CustomPath/` | http://localhost:3002/CustomPath/ | 3002 |
| Deep Nested | `/level1/level2/app/` | http://localhost:3003/level1/level2/app/ | 3003 |

## Success Criteria

### Link Functionality
- ✅ All internal navigation links work correctly in all test environments
- ✅ All content area links navigate to correct destinations
- ✅ External links open in new tabs and resolve correctly
- ✅ No 404 errors on any internal navigation

### Technical Requirements
- ✅ Router basename correctly set based on REACT_APP_ROOT_URI
- ✅ Asset paths resolve correctly in all environments
- ✅ Browser navigation (back/forward) works properly
- ✅ Direct URL access works for all routes

### User Experience
- ✅ Consistent navigation behavior across all environments
- ✅ Fast page transitions and loading
- ✅ No broken images or missing resources
- ✅ Proper active states for navigation items

## Regression Testing

After any changes to routing or link components:
1. Run full test suite across all four environments
2. Verify no new broken links introduced
3. Check that existing functionality remains intact
4. Test both local builds and production deployments

## Documentation Updates

After successful testing:
- Update README.md with verified deployment instructions
- Document any environment-specific considerations
- Update build scripts documentation
- Create troubleshooting guide for common issues

---

*Created: August 8, 2025*  
*Last Updated: August 8, 2025*
