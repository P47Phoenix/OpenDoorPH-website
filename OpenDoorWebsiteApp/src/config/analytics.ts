/**
 * Google Analytics 4 Configuration
 * 
 * This file contains the GA4 configuration for OpenDoor PH Website.
 * Replace 'YOUR_GA4_MEASUREMENT_ID' with your actual GA4 Measurement ID (starts with G-)
 */

// GA4 Measurement ID - Replace with your actual ID from Google Analytics
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual GA4 ID

// Enhanced Ecommerce and Custom Events Configuration
export const GA_CONFIG = {
  // Basic configuration
  send_page_view: false, // We'll handle page views manually for SPA
  
  // Enhanced measurement features
  enhanced_measurement: {
    scroll: true,
    outbound_clicks: true,
    site_search: false,
    video_engagement: false,
    file_downloads: true
  },
  
  // Custom parameters for church website
  custom_parameters: {
    content_group1: 'Church Website',
    content_group2: 'OpenDoor PH'
  }
};

// Custom Event Types for Church Website
export const GA_EVENTS = {
  // Page tracking
  PAGE_VIEW: 'page_view',
  
  // Navigation events
  NAVIGATION: 'navigation',
  EXTERNAL_LINK: 'external_link_click',
  
  // Church-specific events
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  CONTACT_VIEW: 'contact_view',
  LOCATION_VIEW: 'location_view',
  ABOUT_VIEW: 'about_view',
  
  // User engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page'
};

// Page titles mapping for better analytics
export const PAGE_TITLES: Record<string, string> = {
  '/': 'Home - OpenDoor PH',
  '/about': 'About Us - OpenDoor PH', 
  '/location': 'Location & Contact - OpenDoor PH',
  '/video': 'Videos & Sermons - OpenDoor PH'
};

// Helper function to get page title
export const getPageTitle = (pathname: string): string => {
  return PAGE_TITLES[pathname] || `OpenDoor PH - ${pathname}`;
};
