import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility smoke — STORY-INFRA-01
 *
 * Minimal axe-core wiring proof. Scans the Home route only so the Sprint 1
 * CI gate activates before any Pass-1 content story runs. The Scripture
 * study page is explicitly excluded from this smoke — its scan arrives as
 * part of the per-story DoD (see stories.md TC-XXX-06 rows) once the
 * discourse-fidelity corrections land.
 *
 * Baseline history:
 *   2026-04-16 Sprint 1 kickoff — header claimed 0 violations (Home was
 *     not actually scanned locally; CI had the Playwright step commented).
 *   2026-04-20 CI-FIX-2026-04-20 — first live CI run (gh run 24682677988)
 *     set HOME_AXE_VIOLATIONS_BASELINE = 2.
 *   2026-09-16 Living Word restyle kickoff — the true full-rule Home
 *     baseline on master (axe-core 4.11.3, 1280x720, ConsentBanner
 *     mounted) was 2 rule ids: color-contrast (6 nodes at 1280x720,
 *     7 at 375x667) and landmark-unique (nav landmarks without distinct
 *     labels). The two 2026-04-20 ids (missing main landmark, missing h1)
 *     were already repaired by then.
 *   2026-09-17 LW-9 — baseline lowered to 0 after the restyle: sage/brick
 *     surfaces clear color-contrast, distinct nav labels (Primary/Footer)
 *     and the TimeStrip `role="region" aria-label="Service time"` clear
 *     landmark-unique and region. Home is now scanned full-rule at both
 *     1280x720 and 375x667, and all four routes are scanned for
 *     color-contrast only at both viewports.
 *
 * Assertion strategy: baseline-regression, not absolute-zero. The test
 * fails if the violation count INCREASES past the baseline, which catches
 * new regressions introduced by later content work without blocking
 * the CI gate on pre-existing issues. The baseline is 0 as of LW-9 —
 * do NOT silently inflate the baseline to accommodate new violations.
 */

const HOME_URL = 'http://localhost:3100/opendoor';

// Baseline 2 captured 2026-04-20 (gh run 24682677988); lowered to 0 on
// 2026-09-17 (LW-9, Living Word restyle). Never inflate.
const HOME_AXE_VIOLATIONS_BASELINE = 0;

const ROUTES = [
  '/opendoor',
  '/opendoor/Home/Location',
  '/opendoor/Home/About',
  '/opendoor/Home/Scripture',
];
const VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 375, height: 667 },
];

test.describe('accessibility smoke', () => {
  test('Home violation count does not exceed baseline', async ({ page }) => {
    await page.goto(HOME_URL);
    const results = await new AxeBuilder({ page }).analyze();

    // Log for visibility in CI when anything is flagged, even below baseline.
    if (results.violations.length > 0) {
      console.log(
        `[a11y smoke] Home has ${results.violations.length} axe violations ` +
          `(baseline ${HOME_AXE_VIOLATIONS_BASELINE}):`
      );
      results.violations.forEach((v) =>
        console.log(`  - ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
      );
    }

    expect(results.violations.filter((v) => v.id === 'color-contrast')).toHaveLength(0);
    expect(results.violations.filter((v) => v.id === 'landmark-unique')).toHaveLength(0);
    expect(results.violations.length).toBeLessThanOrEqual(
      HOME_AXE_VIOLATIONS_BASELINE
    );
  });

  // LW-9 / AC-41: the md:hidden surfaces (TimeStrip, Quick Contact,
  // "Learn More About Us", the mobile menu) are display:none at 1280x720 and
  // invisible to axe there; this second full-rule scan is the only one that
  // sees them. ConsentBanner is mounted (no grantConsent), same as above.
  test('Home violation count does not exceed baseline at 375x667', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(HOME_URL);
    const results = await new AxeBuilder({ page }).analyze();

    if (results.violations.length > 0) {
      console.log(
        `[a11y smoke] Home@375x667 has ${results.violations.length} axe violations ` +
          `(baseline ${HOME_AXE_VIOLATIONS_BASELINE}):`
      );
      results.violations.forEach((v) =>
        console.log(`  - ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
      );
    }

    expect(results.violations.filter((v) => v.id === 'color-contrast')).toHaveLength(0);
    expect(results.violations.filter((v) => v.id === 'landmark-unique')).toHaveLength(0);
    expect(results.violations.length).toBeLessThanOrEqual(
      HOME_AXE_VIOLATIONS_BASELINE
    );
  });

  // LW-9 / AC-41: color-contrast only, four routes x two viewports (eight scans).
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`no color-contrast violations on ${route} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`http://localhost:3100${route}`);
        const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
        if (results.violations.length > 0) {
          results.violations.forEach((v) =>
            console.log(`[a11y contrast] ${route}@${viewport.width}: ${v.id} (${v.nodes.length} nodes)`)
          );
        }
        expect(results.violations).toHaveLength(0);
      });
    }
  }
});
