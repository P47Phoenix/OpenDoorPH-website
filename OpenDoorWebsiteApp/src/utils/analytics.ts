/**
 * Google Analytics 4 Utilities
 *
 * This module provides utilities for tracking events and page views
 * in Google Analytics 4 for the Open Door Full Gospel Church website.
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
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.includes('XXXXXXXXXX')) {
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
};

/**
 * Track page views for Single Page Application
 * Call this on route changes
 */
export const trackPageView = (pathname: string, title?: string): void => {
  if (!isGAInitialized()) return;

  const pageTitle = title || getPageTitle(pathname);

  window.gtag('event', GA_EVENTS.PAGE_VIEW, {
    page_path: pathname,
    page_title: pageTitle
  });
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
    ...parameters
  });
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

/**
 * Centralized click tracking utility (FR-17)
 * All click tracking calls are wrapped in try/catch to prevent
 * analytics errors from breaking navigation.
 */
export const trackClick = (
  eventName: string,
  parameters: Record<string, any> = {}
): void => {
  try {
    trackEvent(eventName, parameters);
  } catch {
    // Never let analytics break navigation
  }
};

/**
 * Track navigation clicks (Story 2.1)
 */
export const trackNavClick = (
  linkText: string,
  linkUrl: string,
  navSource: 'header_desktop' | 'header_mobile' | 'footer' | 'sidebar'
): void => {
  trackClick(GA_EVENTS.NAV_CLICK, {
    link_text: linkText,
    link_url: linkUrl,
    nav_source: navSource
  });
};

/**
 * Track mobile menu toggle (Story 2.1)
 */
export const trackMobileMenuToggle = (action: 'open' | 'close'): void => {
  trackClick(GA_EVENTS.MOBILE_MENU_TOGGLE, { action });
};

/**
 * Track CTA button clicks (Story 2.2)
 */
export const trackCtaClick = (
  buttonText: string,
  buttonLocation: string,
  destinationUrl: string
): void => {
  trackClick(GA_EVENTS.CTA_CLICK, {
    button_text: buttonText,
    button_location: buttonLocation,
    destination_url: destinationUrl
  });
};

/**
 * Track "Get Directions" / "View Larger Map" clicks (Story 2.2)
 * This is the single most important conversion signal on the site.
 */
export const trackDirectionsClick = (
  linkText: string,
  linkUrl: string
): void => {
  trackClick(GA_EVENTS.DIRECTIONS_CLICK, {
    link_text: linkText,
    link_url: linkUrl
  });
};

/**
 * Track social (Facebook) link clicks (Story 2.3)
 */
export const trackSocialClick = (
  platform: string,
  linkLocation: string
): void => {
  trackClick(GA_EVENTS.SOCIAL_CLICK, {
    platform,
    link_location: linkLocation
  });
};

/**
 * Track Scripture reference link clicks (Story 2.3)
 */
export const trackReferenceClick = (
  linkText: string,
  linkUrl: string
): void => {
  trackClick(GA_EVENTS.REFERENCE_CLICK, {
    link_text: linkText,
    link_url: linkUrl
  });
};

/**
 * Check if Google Analytics is properly initialized
 */
export const isGAInitialized = (): boolean => {
  return typeof window !== 'undefined' &&
         typeof window.gtag === 'function' &&
         !GA_MEASUREMENT_ID.includes('XXXXXXXXXX') &&
         GA_MEASUREMENT_ID.length > 0;
};

// ---------------------------------------------------------------------------
// Consent Mode v2 Utilities (Story 3.1 / 3.2)
// ---------------------------------------------------------------------------

const CONSENT_STORAGE_KEY = 'analytics-consent';

/**
 * Read the stored consent preference from localStorage.
 * Returns 'granted', 'denied', or null when no preference exists
 * or localStorage is unavailable (Safari Private Browsing, etc.).
 */
export const getStoredConsent = (): string | null => {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // localStorage unavailable -- treat as no stored preference
    return null;
  }
};

/**
 * Update Google Consent Mode v2 analytics_storage state.
 * Call with `true` to grant analytics consent.
 * When `false`, the defaults set in index.html (analytics_storage: 'denied')
 * remain in effect -- no explicit update call is needed.
 */
export const updateConsent = (granted: boolean): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  if (granted) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
};
