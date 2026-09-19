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

/* ------------------------------------------------------------------------- */
/* LW-9 extensions — AC-6 computed fonts, AC-11 runtime durations,           */
/* AC-41 hover contrast, AC-45 below-the-fold geometry, TC-LW-3.2 wordmark.  */
/* ------------------------------------------------------------------------- */

const ROUTES = [
  '/opendoor',
  '/opendoor/Home/Location',
  '/opendoor/Home/About',
  '/opendoor/Home/Scripture',
];

const CONGREGATION_ALT =
  'The Open Door Full Gospel Church congregation gathered in the sanctuary';

/** Undo the top-level `grantConsent` init script so the ConsentBanner mounts. */
const withoutConsent = (page: Page) =>
  page.addInitScript(() => {
    try {
      localStorage.removeItem('analytics-consent');
    } catch {
      // storage disabled — banner's own error branch hides it
    }
  });

/**
 * WCAG 2.x contrast ratio of the element's computed `color` against its
 * effective background (first ancestor whose backgroundColor has alpha > 0).
 * Runs in the browser; returns the ratio as a number.
 */
const contrastRatio = (el: Element): number => {
  const parse = (c: string) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = '1'] = m[1].split(',').map((s) => s.trim());
    return { r: +r, g: +g, b: +b, a: +a };
  };
  const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const ch = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
  };
  const fg = parse(getComputedStyle(el).color)!;
  let node: Element | null = el;
  let bg = null as ReturnType<typeof parse>;
  while (node && (!bg || bg.a === 0)) {
    bg = parse(getComputedStyle(node).backgroundColor);
    node = node.parentElement;
  }
  if (!bg || bg.a === 0) bg = { r: 255, g: 255, b: 255, a: 1 };
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const hoverRatio = async (el: import('@playwright/test').Locator) => {
  await el.hover();
  return el.evaluate(contrastRatio);
};

const durationOf = (el: import('@playwright/test').Locator) =>
  el.evaluate((e) => getComputedStyle(e).transitionDuration);

test.describe('Wordmark at 1280x720 (TC-LW-3.2, AC-7)', () => {
  test.use({ viewport: DESKTOP });

  test('full wordmark "Gospel" is visible in the header h1', async ({ page }) => {
    await page.goto(HOME);
    const gospel = page.locator('header h1').getByText('Gospel', { exact: true });
    await expect(gospel).toBeVisible();
    expect((await gospel.boundingBox())!.width).toBeGreaterThan(0);
  });
});

test.describe('Computed fonts at 1280x720 (AC-6)', () => {
  test.use({ viewport: DESKTOP });

  for (const route of ROUTES) {
    // TC-LW-9.4
    test(`headings and passages resolve to Lora, body to Inter on ${route}`, async ({ page }) => {
      await page.goto(`${BASE}${route}`);
      await page.evaluate(() => document.fonts.ready);
      for (const el of await page.locator('h1,h2,h3,h4,blockquote').all()) {
        expect(await el.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/^Lora/);
      }
      expect(await page.locator('body').evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/^Inter/);
    });
  }
});

test.describe('Runtime transition duration, no emulateMedia (AC-11 / TC-LW-9.9)', () => {
  test.describe('375x667', () => {
    test.use({ viewport: MOBILE });

    test('hamburger, first mobile-menu link and strip Directions read 0.15s', async ({ page }) => {
      await page.goto(HOME);
      const hamburger = page.getByRole('button', { name: /menu/i });
      expect(await durationOf(hamburger)).toBe('0.15s');
      await hamburger.click();
      const first = page.locator('#mobile-menu a').first();
      await expect(first).toBeVisible();
      expect(await durationOf(first)).toBe('0.15s');
      expect(await durationOf(directions(page))).toBe('0.15s');
    });
  });

  test.describe('1280x720', () => {
    test.use({ viewport: DESKTOP });

    test("That's Fine and Visit Us read 0.15s", async ({ page }) => {
      await withoutConsent(page);
      await page.goto(HOME);
      const fine = page.getByRole('button', { name: "That's Fine", exact: true });
      await expect(fine).toBeVisible();
      expect(await durationOf(fine)).toBe('0.15s');
      expect(await durationOf(page.getByRole('link', { name: 'Visit Us', exact: true }))).toBe('0.15s');
    });
  });
});

test.describe('Reduced motion honoured (AC-11 / NFR-2 / TC-LW-9.10)', () => {
  // The 0.01ms !important rule serialises as "1e-05s" (Chromium) or "0.00001s"
  // (Firefox); compare the value in seconds, not the string.
  const seconds = (d: string) => (d.endsWith('ms') ? parseFloat(d) / 1000 : parseFloat(d));
  const expectReduced = (d: string) => expect(seconds(d)).toBeCloseTo(0.00001, 6);

  test.describe('375x667', () => {
    test.use({ viewport: MOBILE });

    test('hamburger, first mobile-menu link and strip Directions read 0.01ms; body has no animation', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(HOME);
      const hamburger = page.getByRole('button', { name: /menu/i });
      expectReduced(await durationOf(hamburger));
      await hamburger.click();
      const first = page.locator('#mobile-menu a').first();
      await expect(first).toBeVisible();
      expectReduced(await durationOf(first));
      expectReduced(await durationOf(directions(page)));
      expect(await page.locator('body').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
    });
  });

  test.describe('1280x720', () => {
    test.use({ viewport: DESKTOP });

    test("That's Fine and Visit Us read 0.01ms; body has no animation", async ({ page }) => {
      await withoutConsent(page);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(HOME);
      const fine = page.getByRole('button', { name: "That's Fine", exact: true });
      await expect(fine).toBeVisible();
      expectReduced(await durationOf(fine));
      expectReduced(await durationOf(page.getByRole('link', { name: 'Visit Us', exact: true })));
      expect(await page.locator('body').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
    });
  });
});

test.describe('Hover contrast >= 4.5 under reduced motion (AC-41 / TC-LW-9.14)', () => {
  test.describe('1280x720', () => {
    test.use({ viewport: DESKTOP });

    test("Home: That's Fine (banner mounted), then Visit Us and Learn More", async ({ page }) => {
      await withoutConsent(page);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(HOME);
      const fine = page.getByRole('button', { name: "That's Fine", exact: true });
      await expect(fine).toBeVisible();
      expect(await hoverRatio(fine)).toBeGreaterThanOrEqual(4.5);
      await fine.click();
      await expect(fine).toBeHidden();
      expect(await hoverRatio(page.getByRole('link', { name: 'Visit Us', exact: true }))).toBeGreaterThanOrEqual(4.5);
      expect(await hoverRatio(page.getByRole('link', { name: 'Learn More', exact: true }))).toBeGreaterThanOrEqual(4.5);
    });

    test('Location: Get Directions', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${BASE}/opendoor/Home/Location`);
      expect(await hoverRatio(page.getByRole('link', { name: 'Get Directions', exact: true }))).toBeGreaterThanOrEqual(4.5);
    });

    test('Header: Primary nav Home link', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(HOME);
      const home = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true });
      expect(await hoverRatio(home)).toBeGreaterThanOrEqual(4.5);
    });
  });

  test.describe('375x667', () => {
    test.use({ viewport: MOBILE });

    test('strip Directions, Quick Contact View location, first mobile-menu link', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(HOME);
      expect(await hoverRatio(directions(page))).toBeGreaterThanOrEqual(4.5);
      expect(await hoverRatio(page.getByRole('link', { name: 'View location', exact: true }))).toBeGreaterThanOrEqual(4.5);
      await page.getByRole('button', { name: /menu/i }).click();
      const first = page.locator('#mobile-menu a').first();
      await expect(first).toBeVisible();
      expect(await hoverRatio(first)).toBeGreaterThanOrEqual(4.5);
    });
  });
});

for (const [label, viewport] of [
  ['375x667', MOBILE],
  ['1280x720', DESKTOP],
] as const) {
  test.describe(`Congregation photo geometry at ${label} (AC-45)`, () => {
    test.use({ viewport });

    for (const route of ['/opendoor', '/opendoor/Home/About']) {
      // TC-LW-9.15 / TC-LW-9.16. Home moved above the fold 2026-09-18 (elder
      // ruling: photo sits right after the welcome heading, eager-loaded,
      // fetchpriority high) so it is annotated-only there; About is unchanged
      // and stays below the fold as the last item in "Our History".
      test(`loads at 1424px on ${route}${route === '/opendoor/Home/About' ? ' (below the fold)' : ''}`, async ({ page }) => {
        await page.goto(`${BASE}${route}`);
        await page.evaluate(() => document.fonts.ready);
        const img = page.getByRole('img', { name: CONGREGATION_ALT, exact: true });
        const box = await img.boundingBox();
        expect(box).not.toBeNull();
        test.info().annotations.push({ type: 'congregation-y', description: `${route}@${label}: ${box!.y}` });
        // Home is annotated only (floor 0) at every viewport since the elder ruling; the
        // Lighthouse LCP-element check is its gate. About keeps the below-the-fold floor.
        const floor = route === '/opendoor' ? 0 : viewport.height;
        expect(box!.y).toBeGreaterThanOrEqual(floor);
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBe(1424);
      });
    }
  });
}
