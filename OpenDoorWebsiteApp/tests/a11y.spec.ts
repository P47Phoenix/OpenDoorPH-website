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
 * Baseline: no pre-existing violations have been recorded; if this spec
 * begins to fail on unmodified Home-page HTML, update this header with the
 * observed baseline count and either scope a narrow `.exclude()` or switch
 * the assertion to `toBeLessThanOrEqual(<baseline>)` per axe-core docs —
 * do NOT silently weaken the assertion.
 *
 * Baseline recorded on first green run (2026-04-16 Sprint 1 kickoff):
 *   Home (/opendoor) — 0 violations.
 */

const HOME_URL = 'http://localhost:3100/opendoor';

test.describe('accessibility smoke', () => {
  test('Home has no detectable axe-core violations', async ({ page }) => {
    await page.goto(HOME_URL);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
