import React, { useState, useEffect } from 'react';
import { getStoredConsent, updateConsent } from '../../utils/analytics';

const CONSENT_KEY = 'analytics-consent';

/**
 * ConsentBanner -- Google Consent Mode v2 banner for Open Door PH.
 *
 * Non-blocking, bottom-anchored banner that appears on first visit.
 * Integrates with gtag consent API. Saves preference to localStorage.
 * Privacy-safe: defaults to denied when localStorage is unavailable.
 */
const ConsentBanner: React.FC = () => {
  // 'unknown' = show banner, 'granted'/'denied' = hide, 'error' = localStorage unavailable (hide)
  const [consentState, setConsentState] = useState<'unknown' | 'granted' | 'denied' | 'error'>('unknown');

  useEffect(() => {
    // Read stored consent on mount
    const stored = getStoredConsent();

    if (stored === null) {
      // No stored value -- but we need to check if localStorage is even available
      // getStoredConsent returns null for both "no key" and "error"
      // Try a write test to distinguish
      try {
        localStorage.setItem('__consent_test__', '1');
        localStorage.removeItem('__consent_test__');
        // localStorage works, no stored preference -- show banner
        setConsentState('unknown');
      } catch {
        // localStorage unavailable -- privacy-safe default, no banner
        setConsentState('error');
      }
      return;
    }

    if (stored === 'granted') {
      // Return visit with granted consent -- fire update immediately
      updateConsent(true);
      setConsentState('granted');
    } else {
      // Return visit with denied consent -- leave defaults
      setConsentState('denied');
    }
  }, []);

  const handleAccept = (): void => {
    // Fire consent update to GA4
    updateConsent(true);

    // Persist to localStorage
    try {
      localStorage.setItem(CONSENT_KEY, 'granted');
    } catch {
      // Safari Private Browsing or storage full -- consent update still fires for this session
    }

    setConsentState('granted');
  };

  const handleDecline = (): void => {
    // No consent update needed -- defaults remain denied

    // Persist to localStorage
    try {
      localStorage.setItem(CONSENT_KEY, 'denied');
    } catch {
      // Safari Private Browsing or storage full
    }

    setConsentState('denied');
  };

  // Only render when consent state is unknown (first visit, localStorage available)
  if (consentState !== 'unknown') {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      aria-live="polite"
      className="fixed bottom-0 inset-x-0 z-50"
    >
      <div className="bg-white border-t border-stone-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto px-4 py-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <p
            id="consent-message"
            className="text-sm text-stone-600 leading-relaxed flex-1"
          >
            We use simple analytics to understand how visitors use our website so
            we can make it better. No personal information is collected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              aria-describedby="consent-message"
              onClick={handleDecline}
              className="bg-stone-100 text-stone-600 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-200 transition-colors duration-200 touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              No Thanks
            </button>
            <button
              type="button"
              aria-describedby="consent-message"
              onClick={handleAccept}
              className="bg-church-green text-church-dark px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-church-green/90 transition-colors duration-200 touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-church-green focus:ring-offset-2"
            >
              That's Fine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
