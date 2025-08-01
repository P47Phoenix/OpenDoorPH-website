/**
 * Google Analytics 4 Utilities
 * 
 * This module provides utilities for tracking events and page views
 * in Google Analytics 4 for the OpenDoor PH website.
 */

import { GA_MEASUREMENT_ID, GA_CONFIG, GA_EVENTS, getPageTitle } from '../config/analytics';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    [key: string]: any; // Allow dynamic properties for GA disable flags
  }
}

/**
 * Initialize Google Analytics 4
 * Call this once when the app starts
 */
export const initGA = (): void => {
  // Only initialize if we have a valid measurement ID
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics not initialized: Please set your GA4 Measurement ID in src/config/analytics.ts');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Configure gtag
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, GA_CONFIG);

  console.log('Google Analytics 4 initialized with ID:', GA_MEASUREMENT_ID);
};

/**
 * Track page views for Single Page Application
 * Call this on route changes
 */
export const trackPageView = (pathname: string, title?: string): void => {
  if (!isGAInitialized()) return;

  const pageTitle = title || getPageTitle(pathname);
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pathname,
    page_title: pageTitle
  });

  // Send custom page view event with additional context
  window.gtag('event', GA_EVENTS.PAGE_VIEW, {
    page_path: pathname,
    page_title: pageTitle,
    content_group1: 'Church Website',
    content_group2: 'OpenDoor PH'
  });

  console.log('GA4 Page View:', { pathname, pageTitle });
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string, 
  parameters: Record<string, any> = {}
): void => {
  if (!isGAInitialized()) return;

  window.gtag('event', eventName, {
    ...parameters,
    timestamp: new Date().toISOString()
  });

  console.log('GA4 Event:', { eventName, parameters });
};

/**
 * Track navigation events
 */
export const trackNavigation = (from: string, to: string): void => {
  trackEvent(GA_EVENTS.NAVIGATION, {
    from_page: from,
    to_page: to,
    navigation_type: 'internal'
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent(GA_EVENTS.EXTERNAL_LINK, {
    link_url: url,
    link_text: linkText || url,
    outbound: true
  });
};

/**
 * Track video interactions
 */
export const trackVideoPlay = (videoTitle: string, videoUrl?: string): void => {
  trackEvent(GA_EVENTS.VIDEO_PLAY, {
    video_title: videoTitle,
    video_url: videoUrl,
    engagement_type: 'play'
  });
};

export const trackVideoComplete = (videoTitle: string, duration?: number): void => {
  trackEvent(GA_EVENTS.VIDEO_COMPLETE, {
    video_title: videoTitle,
    video_duration: duration,
    engagement_type: 'complete'
  });
};

/**
 * Track church-specific page views
 */
export const trackAboutView = (): void => {
  trackEvent(GA_EVENTS.ABOUT_VIEW, {
    section: 'about',
    content_type: 'church_info'
  });
};

export const trackLocationView = (): void => {
  trackEvent(GA_EVENTS.LOCATION_VIEW, {
    section: 'location',
    content_type: 'contact_info'
  });
};

export const trackContactView = (): void => {
  trackEvent(GA_EVENTS.CONTACT_VIEW, {
    section: 'contact',
    content_type: 'contact_info'
  });
};

/**
 * Track scroll depth (useful for engagement metrics)
 */
export const trackScrollDepth = (percentage: number): void => {
  trackEvent(GA_EVENTS.SCROLL_DEPTH, {
    scroll_depth: percentage,
    engagement_metric: true
  });
};

/**
 * Check if Google Analytics is properly initialized
 */
export const isGAInitialized = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';
};

/**
 * Enable debug mode for development
 */
export const enableDebugMode = (): void => {
  if (!isGAInitialized()) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    debug_mode: true
  });
  
  console.log('GA4 Debug mode enabled');
};

/**
 * Set user properties (useful for audience segmentation)
 */
export const setUserProperties = (properties: Record<string, any>): void => {
  if (!isGAInitialized()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_properties: properties
  });
};

/**
 * GDPR Compliance: Disable analytics
 */
export const disableGA = (): void => {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  console.log('Google Analytics disabled for privacy compliance');
};

/**
 * GDPR Compliance: Enable analytics
 */
export const enableGA = (): void => {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  console.log('Google Analytics enabled');
};
