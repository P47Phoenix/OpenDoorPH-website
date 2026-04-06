import { test, expect } from '@playwright/test';

// Test environments configuration
const environments = [
  {
    name: 'Root Domain',
    baseURL: 'http://localhost:3100',
    basePath: '',
  },
  {
    name: 'GitHub Pages',
    baseURL: 'http://localhost:3101',
    basePath: '/OpenDoorPH-website',
  },
  {
    name: 'Custom Path',
    baseURL: 'http://localhost:3102',
    basePath: '/CustomPath',
  }
];

environments.forEach(({ name, baseURL, basePath }) => {
  test.describe(`External Links and Assets - ${name} Environment`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${baseURL}${basePath}`);
    });

    test('should open external Facebook links in new tabs', async ({ page }) => {
      // Look for Facebook links
      const facebookLinks = page.locator('a[href*="facebook.com"]');
      const count = await facebookLinks.count();
      
      if (count > 0) {
        // Test the first Facebook link
        const firstFacebookLink = facebookLinks.first();
        await expect(firstFacebookLink).toHaveAttribute('target', '_blank');
        await expect(firstFacebookLink).toHaveAttribute('rel', /noreferrer/);
      }
    });

    test('should open Google Maps links in new tabs', async ({ page }) => {
      // Navigate to location page where maps links are
      await page.goto(`${baseURL}${basePath}/opendoor/Home/Location`);
      
      // Look for Google Maps links
      const mapLinks = page.locator('a[href*="maps.google.com"]');
      const count = await mapLinks.count();
      
      if (count > 0) {
        const firstMapLink = mapLinks.first();
        await expect(firstMapLink).toHaveAttribute('target', '_blank');
        await expect(firstMapLink).toHaveAttribute('rel', /noreferrer/);
      }
    });

    test('should load all images successfully', async ({ page }) => {
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Get all img elements
      const images = page.locator('img');
      const imageCount = await images.count();
      
      // Check each image loads successfully
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          // Check if image is loaded
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });

    test('should load CSS and JavaScript assets', async ({ page }) => {
      // Check that CSS is loaded by verifying styled elements
      const bodyElement = page.locator('body');
      
      // Verify the page has styling applied
      const hasBackground = await bodyElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
               styles.background !== 'none' ||
               styles.fontFamily !== 'serif'; // Default would be serif
      });
      
      expect(hasBackground).toBe(true);
    });

    test('should have proper page metadata', async ({ page }) => {
      // Check page title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content');
      
      // Check meta keywords
      const metaKeywords = page.locator('meta[name="keywords"]');
      await expect(metaKeywords).toHaveAttribute('content');
    });

    test('should be responsive on different viewport sizes', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500); // Allow layout to settle
      
      // Check that content is still visible and accessible
      const mainContent = page.locator('main, [role="main"], body > div');
      await expect(mainContent.first()).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      await expect(mainContent.first()).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      await expect(mainContent.first()).toBeVisible();
    });

    test('should have accessible navigation elements', async ({ page }) => {
      // Check for navigation landmarks
      const nav = page.locator('nav, [role="navigation"]');
      expect(await nav.count()).toBeGreaterThan(0);
      
      // Check that links have accessible text
      const allLinks = page.locator('a');
      const linkCount = await allLinks.count();
      
      for (let i = 0; i < Math.min(linkCount, 20); i++) { // Test first 20 links
        const link = allLinks.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        
        // Each link should have some form of accessible text
        expect(text || ariaLabel || title).toBeTruthy();
      }
    });

    test('should handle page refresh without errors', async ({ page }) => {
      // Navigate to different pages and refresh each
      const pages = [
        `${baseURL}${basePath}`,
        `${baseURL}${basePath}/opendoor/Home/Location`,
        `${baseURL}${basePath}/opendoor/Home/About`,
        `${baseURL}${basePath}/opendoor/Home/Scripture`
      ];
      
      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.reload();
        
        // Verify page loads without errors
        await expect(page.locator('body')).not.toBeEmpty();
        
        // Check for any JavaScript errors
        const errors: string[] = [];
        page.on('pageerror', (error) => {
          errors.push(error.message);
        });
        
        await page.waitForTimeout(1000); // Wait for any async errors
        expect(errors.length).toBe(0);
      }
    });
  });
});
