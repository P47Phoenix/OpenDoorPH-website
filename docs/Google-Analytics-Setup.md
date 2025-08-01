# Google Analytics 4 Setup Guide

This guide will help you complete the Google Analytics 4 implementation for the OpenDoor PH website.

## 📋 Current Status

✅ **COMPLETED:**
- ❌ Removed legacy Universal Analytics (UA-11114024-1) 
- ✅ Created GA4 configuration system
- ✅ Implemented comprehensive tracking utilities
- ✅ Added route tracking for Single Page Application
- ✅ Enhanced pages with specific event tracking
- ✅ Added TypeScript types and error handling
- ✅ Implemented GDPR compliance features
- ✅ Created debugging and testing utilities

## 🚀 Required Steps to Complete Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" in the bottom left
3. Click "Create Property"
4. Choose "GA4" (not Universal Analytics)
5. Set up your property:
   - **Property Name:** "OpenDoor PH Website"
   - **Reporting Time Zone:** Your local timezone
   - **Currency:** USD
6. Set up Data Stream:
   - Choose "Web"
   - **Website URL:** https://opendoorph.info (primary domain)
   - **Stream Name:** "OpenDoor PH Main Site"
7. **Copy your Measurement ID** (starts with `G-` like `G-ABC123XYZ`)

### Step 2: Configure Measurement ID
1. Open `src/config/analytics.ts`
2. Replace `'G-XXXXXXXXXX'` with your actual GA4 Measurement ID:
   ```typescript
   export const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID';
   ```

### Step 3: Update HTML Script Tag
1. Open `public/index.html`
2. Find line with `G-XXXXXXXXXX`
3. Replace with your actual Measurement ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
   ```

### Step 4: Test the Implementation
1. Start the development server:
   ```bash
   npm start
   ```
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. You should see: "Google Analytics 4 initialized with ID: G-YOUR-ID"
5. Navigate between pages and check for "GA4 Page View" and "GA4 Event" logs

### Step 5: Verify in Google Analytics
1. Go to your GA4 property
2. Click "Reports" → "Realtime"
3. Navigate your website and confirm events are appearing
4. Check these specific events:
   - Page views
   - Video page engagement
   - About page views
   - Location page views
   - External link clicks

## 🔧 Advanced Configuration Options

### Enhanced Ecommerce (Future)
Currently disabled but ready for implementation:
```typescript
// In src/config/analytics.ts
enhanced_measurement: {
  scroll: true,          // Track scroll depth
  outbound_clicks: true, // Track external links
  site_search: false,    // Enable if you add search
  video_engagement: false, // Enable for advanced video tracking
  file_downloads: true   // Track PDF/document downloads
}
```

### Custom Dimensions (Optional)
Set up custom dimensions in GA4 for church-specific tracking:
1. In GA4, go to Admin → Custom Definitions → Custom Dimensions
2. Add these dimensions:
   - **Dimension Name:** "Content Type" | **Parameter:** content_type
   - **Dimension Name:** "Church Section" | **Parameter:** section
   - **Dimension Name:** "Engagement Type" | **Parameter:** engagement_type

### GDPR Compliance
The implementation includes privacy controls:
```typescript
import { disableGA, enableGA } from './utils/analytics';

// To disable analytics (for privacy compliance)
disableGA();

// To re-enable analytics (with user consent)
enableGA();
```

## 🧪 Debug Mode
For development, enable debug mode:
```typescript
import { enableDebugMode } from './utils/analytics';
enableDebugMode();
```

## 📊 Available Tracking Features

### Automatic Tracking
- ✅ Page views on route changes
- ✅ Navigation between pages
- ✅ External link clicks
- ✅ Video engagement (YouTube embed)
- ✅ Page-specific events (About, Location, Contact views)

### Manual Event Tracking
Use these functions anywhere in your code:
```typescript
import { trackEvent, trackExternalLink, trackVideoPlay } from './utils/analytics';

// Custom events
trackEvent('contact_form_submit', { form_type: 'newsletter' });

// External links
trackExternalLink('https://www.facebook.com/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471', 'Facebook Page');

// Video interactions
trackVideoPlay('Sunday Sermon', 'https://youtube.com/watch?v=...');
```

## 🚨 Important Notes

1. **Privacy Compliance:** The implementation respects user privacy and includes GDPR compliance features
2. **Performance:** GA4 loads asynchronously and won't block page rendering
3. **Cross-Domain:** Currently tracks opendoorph.info, .net, .org, .com domains
4. **SPA Support:** Properly tracks Single Page Application navigation
5. **Error Handling:** Gracefully handles cases where GA4 isn't loaded or configured

## ✅ Verification Checklist

After completing setup, verify:
- [ ] GA4 Measurement ID is correctly set in both files
- [ ] Console shows "Google Analytics 4 initialized" message
- [ ] GA4 Realtime reports show your activity
- [ ] Page views are tracked on navigation
- [ ] Video page shows engagement events
- [ ] External link clicks are tracked
- [ ] No JavaScript errors in console

## 🆘 Troubleshooting

### Issue: "Please set your GA4 Measurement ID" warning
**Solution:** Replace `G-XXXXXXXXXX` with your actual Measurement ID in `src/config/analytics.ts`

### Issue: No events showing in GA4
**Solution:** 
1. Check measurement ID is correct
2. Verify HTML script tag has correct ID
3. Check browser console for errors
4. Wait 24-48 hours for data to appear in standard reports (Realtime should show immediately)

### Issue: TypeScript errors
**Solution:** Run `npm run build` to check for compilation errors and fix any type issues

## 📈 Next Steps

1. **Set up Goals/Conversions** in GA4 for important actions
2. **Create Audiences** for church member engagement
3. **Set up Alerts** for significant traffic changes
4. **Configure Data Retention** settings
5. **Add team members** to GA4 property access

## 📞 Support

For additional help:
- [Google Analytics 4 Help Center](https://support.google.com/analytics/answer/10089681)
- [GA4 Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- Check the task list in VS Code for tracking implementation progress
