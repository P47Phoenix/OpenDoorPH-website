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
 *     surfaced 2 pre-existing Home-page violations:
 *       - landmark-one-main       (no <main> landmark on the page)
 *       - page-has-heading-one    (no <h1> heading on the page)
 *     Both pre-date STORY-INFRA-01 and are orthogonal to the CI-activation
 *     track. Fixing them is a separate follow-up issue (elder's ruling).
 *
 * Assertion strategy: baseline-regression, not absolute-zero. The test
 * fails if the violation count INCREASES past the baseline, which catches
 * new regressions introduced by Pass-1..4 content work without blocking
 * the CI gate on pre-existing issues. Once the baseline violations are
 * repaired in the follow-up PR, lower HOME_AXE_VIOLATIONS_BASELINE toward
 * 0 — do NOT silently inflate the baseline to accommodate new violations.
 */

const HOME_URL = 'http://localhost:3100/opendoor';

// Baseline captured 2026-04-20 from gh run 24682677988 on master-equivalent
// build. Tighten toward 0 as pre-existing violations are repaired.
const HOME_AXE_VIOLATIONS_BASELINE = 2;

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

    expect(results.violations.length).toBeLessThanOrEqual(
      HOME_AXE_VIOLATIONS_BASELINE
    );
  });
});
