/**
 * Google Analytics 4 Configuration
 *
 * This file contains the GA4 configuration for the Open Door Full Gospel Church website.
 */

// GA4 Measurement ID
export const GA_MEASUREMENT_ID = 'G-9VW8X3YKJ6';

// GA4 Configuration
export const GA_CONFIG = {
  send_page_view: false // We handle page views manually for SPA
};

// Custom Event Types for Church Website
export const GA_EVENTS = {
  // Page tracking
  PAGE_VIEW: 'page_view',

  // Navigation events
  NAVIGATION: 'navigation',
  EXTERNAL_LINK: 'external_link_click',
  NAV_CLICK: 'nav_click',

  // Conversion events
  CTA_CLICK: 'cta_click',
  DIRECTIONS_CLICK: 'directions_click',

  // Engagement events
  MOBILE_MENU_TOGGLE: 'mobile_menu_toggle',
  SCROLL_DEPTH: 'scroll_depth',

  // Social events
  SOCIAL_CLICK: 'social_click',

  // Content events
  REFERENCE_CLICK: 'reference_click',

  // Church-specific events
  LOCATION_VIEW: 'location_view',
  ABOUT_VIEW: 'about_view'
};

// Page titles mapping for better analytics
export const PAGE_TITLES: Record<string, string> = {
  '/opendoor': 'Home — Open Door Full Gospel Church',
  '/opendoor/Home/About': 'About Us — Open Door Full Gospel Church',
  '/opendoor/Home/Location': 'Location & Directions — Open Door Full Gospel Church',
  '/opendoor/Home/Scripture': 'Scripture Study — Open Door Full Gospel Church'
};

// Helper function to get page title
export const getPageTitle = (pathname: string): string => {
  return PAGE_TITLES[pathname] || 'Open Door Full Gospel Church';
};
