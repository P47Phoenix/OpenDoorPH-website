import { Page } from '@playwright/test';

/**
 * Pre-seed the analytics consent state so ConsentBanner does not mount
 * during E2E runs.
 *
 * Context: ConsentBanner (src/components/ConsentBanner/ConsentBanner.tsx)
 * renders a `fixed bottom-0 inset-x-0 z-50` overlay on first visit. On
 * the Home page that overlay intercepts pointer events targeting the
 * "Visit Us" and "Learn More" CTAs, producing 30s locator.click timeouts
 * in Playwright. See issue #37.
 *
 * The banner reads `localStorage.getItem('analytics-consent')` in a
 * useEffect on mount. If the stored value is 'granted' or 'denied', the
 * banner renders null. By injecting the value BEFORE navigation via
 * page.addInitScript, we guarantee the banner never enters the
 * 'unknown' state and therefore never paints over the Home CTAs.
 *
 * Call this in a beforeEach hook BEFORE page.goto. addInitScript runs
 * on every document creation (including iframe / popup), so one call per
 * test suffices.
 */
export async function grantConsent(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('analytics-consent', 'granted');
    } catch {
      // Safari Private Browsing / storage disabled — banner's own error
      // branch also hides it, so the test still has a clean viewport.
    }
  });
}
