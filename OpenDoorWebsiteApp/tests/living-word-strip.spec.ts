import { test, expect, Page } from '@playwright/test';
import { grantConsent } from './helpers/consent';

/**
 * Living Word restyle — TimeStrip, layout and SideBar-into-Home checks.
 *
 * Full-suite only (`npm run test:e2e:full`); NOT part of `test:e2e:pr`.
 * Story LW-4 authored the cases below (AC-7 geometry, AC-9, AC-10, AC-12,
 * AC-17). LW-9 extends this file.
 *
 * Every strip locator uses `exact: true` on `Directions` because
 * `Location & Directions` (Footer, every route) and `Get Directions`
 * (Location page) are substring matches.
 */

const BASE = 'http://localhost:3100';
const HOME = `${BASE}/opendoor`;
const MOBILE = { width: 375, height: 667 };
const DESKTOP = { width: 1280, height: 720 };

const PATHS = [
  '/',
  '/opendoor',
  '/opendoor/Home/Location',
  '/opendoor/Home/About',
  '/opendoor/Home/Scripture',
];

const strip = (page: Page) => page.getByTestId('time-strip');
const directions = (page: Page) =>
  strip(page).getByRole('link', { name: 'Directions', exact: true });

test.beforeEach(async ({ page }) => {
  await grantConsent(page);
});

test.describe('TimeStrip at 375x667 (AC-9)', () => {
  test.use({ viewport: MOBILE });

  for (const path of PATHS) {
    // TC-LW-4.1
    test(`renders time and visible Directions link on ${path}`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await expect(strip(page)).toContainText('Sun 10:30 AM');
      const dir = directions(page);
      await expect(dir).toBeVisible();
      const b = await dir.boundingBox();
      expect(b).not.toBeNull();
      expect(b!.y + b!.height).toBeLessThanOrEqual(MOBILE.height);
    });
  }

  // TC-LW-4.2
  test('stays pinned near the top after scrolling (sticky)', async ({ page }) => {
    await page.goto(HOME);
    const dir = directions(page);
    await expect(dir).toBeVisible();
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(100);
    const b = await dir.boundingBox();
    expect(b).not.toBeNull();
    expect(b!.y).toBeGreaterThanOrEqual(0);
    expect(b!.y).toBeLessThan(100);
  });

  // TC-LW-4.6
  test('has exactly one link named Directions pointing at Location (AC-10a)', async ({ page }) => {
    await page.goto(HOME);
    const links = strip(page).getByRole('link');
    await expect(links).toHaveCount(1);
    expect(
      await links.first().evaluate((e) => (e as HTMLAnchorElement).textContent?.trim())
    ).toBe('Directions');
    await expect(links.first()).toHaveAttribute('href', /\/opendoor\/Home\/Location$/);
  });

  // TC-LW-4.9 (b): strip follows the entire header in DOM order
  test('follows the header in DOM order (AC-10b)', async ({ page }) => {
    await page.goto(HOME);
    const follows = await page.evaluate(
      () =>
        document
          .querySelector('header')!
          .compareDocumentPosition(document.querySelector('[data-testid="time-strip"]')!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(follows).toBeTruthy();
  });
});

test.describe('TimeStrip at 1280x720 (AC-9)', () => {
  test.use({ viewport: DESKTOP });

  // TC-LW-4.3
  test('is hidden at the md breakpoint', async ({ page }) => {
    await page.goto(HOME);
    await expect(strip(page)).toBeHidden();
  });
});

test.describe('Mobile menu and tab order at 375x667 (AC-7, AC-10)', () => {
  test.use({ viewport: MOBILE });

  // TC-LW-4.7
  test('menu closed: Tab from the hamburger lands on Directions', async ({ page }) => {
    await page.goto(HOME);
    await page.getByRole('button', { name: /menu/i }).focus();
    await page.keyboard.press('Tab');
    await expect(directions(page)).toBeFocused();
  });

  // TC-LW-4.8
  test('menu open: Tab walks Home, Location, About, Galatians 6:1, then Directions', async ({ page }) => {
    await page.goto(HOME);
    const hamburger = page.getByRole('button', { name: /menu/i });
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    const menu = page.locator('#mobile-menu');
    // The open transition is 150ms; links are not focusable until visibility flips.
    await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await hamburger.focus();

    const sequence = ['Home', 'Location', 'About', 'Galatians 6:1'];
    for (const name of sequence) {
      await page.keyboard.press('Tab');
      await expect(menu.getByRole('link', { name, exact: true })).toBeFocused();
    }
    await page.keyboard.press('Tab');
    await expect(directions(page)).toBeFocused();
  });

  // TC-LW-4.9 (c)
  test('collapsed menu links are visibility:hidden; open menu links are visible', async ({ page }) => {
    await page.goto(HOME);
    const links = page.locator('#mobile-menu a');
    expect(await links.count()).toBeGreaterThan(0);
    for (const l of await links.all()) {
      expect(await l.evaluate((e) => getComputedStyle(e).visibility)).toBe('hidden');
    }
    await page.getByRole('button', { name: /menu/i }).click();
    // Wait for the 150ms open transition to land before sampling computed style.
    await expect(links.first()).toBeVisible();
    for (const l of await links.all()) {
      expect(await l.evaluate((e) => getComputedStyle(e).visibility)).toBe('visible');
    }
  });

  // TC-LW-4.25
  test('open menu spans the full viewport width (AC-7 iii)', async ({ page }) => {
    await page.goto(HOME);
    await page.getByRole('button', { name: /menu/i }).click();
    const box = await page.locator('#mobile-menu').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeLessThanOrEqual(1);
    expect(box!.width).toBeGreaterThanOrEqual(MOBILE.width - 2);
  });
});

test.describe('SideBar inside Home at 1280x720 (AC-12)', () => {
  test.use({ viewport: DESKTOP });

  // TC-LW-4.15
  test('aside is the only aside and matches main width', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('aside')).toHaveCount(1);
    const a = await page.locator('aside').boundingBox();
    const m = await page.locator('main').boundingBox();
    expect(a).not.toBeNull();
    expect(m).not.toBeNull();
    expect(Math.abs(a!.width - m!.width)).toBeLessThanOrEqual(64);
  });
});

for (const [label, viewport] of [
  ['375x667', MOBILE],
  ['1280x720', DESKTOP],
] as const) {
  test.describe(`Add to Calendar at ${label} (AC-17)`, () => {
    test.use({ viewport });

    // TC-LW-4.23
    test('both calendar buttons are visible on Home', async ({ page }) => {
      await page.goto(HOME);
      const btns = page.getByRole('button', { name: /to your calendar/ });
      await expect(btns).toHaveCount(2);
      for (const b of await btns.all()) {
        await expect(b).toBeVisible();
      }
    });
  });
}

test.describe('Calendar menu stacking over the strip at 375x667 (AC-9 z-order)', () => {
  test.use({ viewport: MOBILE });

  // TC-LW-4.26
  test('opened calendar menu paints above the strip (z-40 > z-30)', async ({ page }) => {
    await page.goto(HOME);
    const trigger = page.getByRole('button', { name: 'Add Sunday Service to your calendar' });
    // Scroll so the first calendar card sits just under the sticky strip.
    await trigger.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.max(0, top - 60));
    });
    await page.waitForTimeout(100);
    await trigger.click();

    const menu = page.getByRole('menu').first();
    await expect(menu).toBeVisible();
    expect(await menu.evaluate((e) => getComputedStyle(e).zIndex)).toBe('40');
    expect(await strip(page).evaluate((e) => getComputedStyle(e).zIndex)).toBe('30');

    // Hit-target check only: a trial click fails if the strip intercepts.
    await page.getByRole('menuitem').first().click({ trial: true });
  });
});
