import { test, expect } from '@playwright/test';

// Test environments configuration
const environments = [
  {
    name: 'Root Domain',
    baseURL: 'http://localhost:3100',
    basePath: '',
    expectedPrefix: ''
  },
  {
    name: 'GitHub Pages',
    baseURL: 'http://localhost:3101',
    basePath: '/OpenDoorPH-website',
    expectedPrefix: '/OpenDoorPH-website'
  },
  {
    name: 'Custom Path',
    baseURL: 'http://localhost:3102',
    basePath: '/CustomPath',
    expectedPrefix: '/CustomPath'
  }
];

environments.forEach(({ name, baseURL, basePath, expectedPrefix }) => {
  test.describe(`Link Navigation - ${name} Environment`, () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the homepage for this environment
      await page.goto(`${baseURL}${basePath}`);
    });

    test('should navigate to Location page via Visit Us button', async ({ page }) => {
      // Find and click the Visit Us button
      const visitUsButton = page.getByRole('link', { name: /visit us/i });
      await expect(visitUsButton).toBeVisible();
      
      await visitUsButton.click();
      
      // Verify we're on the location page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      await expect(page.getByRole('heading', { name: /visit our church/i })).toBeVisible();
    });

    test('should navigate to About page via Learn More button', async ({ page }) => {
      // Find and click the Learn More button
      const learnMoreButton = page.getByRole('link', { name: /learn more/i });
      await expect(learnMoreButton).toBeVisible();
      
      await learnMoreButton.click();
      
      // Verify we're on the about page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
    });

    test('should navigate to About page from Location page', async ({ page }) => {
      // Navigate to location page first
      await page.goto(`${baseURL}${basePath}/opendoor/Home/Location`);
      
      // Find and click the About Our Church button
      const aboutButton = page.getByRole('link', { name: /about our church/i });
      await expect(aboutButton).toBeVisible();
      
      await aboutButton.click();
      
      // Verify we're on the about page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
    });

    test('should have working navigation header links', async ({ page }) => {
      // Test Home link
      const homeLink = page.getByRole('link', { name: /home/i }).first();
      await expect(homeLink).toBeVisible();
      
      // Test Location link
      const locationLink = page.getByRole('link', { name: /location/i }).first();
      await expect(locationLink).toBeVisible();
      await locationLink.click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      
      // Navigate back to home to test About link
      await page.goto(`${baseURL}${basePath}`);
      
      // Test About link
      const aboutLink = page.getByRole('link', { name: /about/i }).first();
      await expect(aboutLink).toBeVisible();
      await aboutLink.click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
    });

    test('should have working footer links', async ({ page }) => {
      // Test footer Home link
      const footerHomeLink = page.locator('footer').getByRole('link', { name: /home/i });
      await expect(footerHomeLink).toBeVisible();
      
      // Test footer Location link
      const footerLocationLink = page.locator('footer').getByRole('link', { name: /location.*directions/i });
      await expect(footerLocationLink).toBeVisible();
      await footerLocationLink.click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      
      // Navigate back to home to test footer About link
      await page.goto(`${baseURL}${basePath}`);
      
      // Test footer About link
      const footerAboutLink = page.locator('footer').getByRole('link', { name: /about us/i });
      await expect(footerAboutLink).toBeVisible();
      await footerAboutLink.click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
    });

    test('should handle direct URL access', async ({ page }) => {
      // Test direct access to Location page
      await page.goto(`${baseURL}${basePath}/opendoor/Home/Location`);
      await expect(page.getByRole('heading', { name: /visit our church/i })).toBeVisible();
      
      // Test direct access to About page
      await page.goto(`${baseURL}${basePath}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
      
      // Test direct access to Scripture page
      await page.goto(`${baseURL}${basePath}/opendoor/Home/Scripture`);
      await expect(page.getByRole('heading', { name: /galatians 6:1/i })).toBeVisible();
    });

    test('should have no broken internal links', async ({ page }) => {
      // Collect all internal links on the homepage
      const internalLinks = await page.locator('a[href^="/opendoor"]').all();
      
      for (const link of internalLinks) {
        const href = await link.getAttribute('href');
        if (href) {
          // Visit each internal link and verify it doesn't result in a 404
          const response = await page.goto(`${baseURL}${href}`);
          expect(response?.status()).not.toBe(404);
          
          // Verify the page has loaded content (not a blank page)
          await expect(page.locator('body')).not.toBeEmpty();
        }
      }
    });

    test('should maintain browser navigation functionality', async ({ page }) => {
      // Start at home
      await page.goto(`${baseURL}${basePath}`);
      
      // Navigate to location
      await page.getByRole('link', { name: /visit us/i }).click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      
      // Navigate to about
      await page.getByRole('link', { name: /about our church/i }).click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      
      // Test browser back functionality
      await page.goBack();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      
      // Test browser forward functionality
      await page.goForward();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      
      // Test page refresh maintains correct URL
      await page.reload();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
    });
  });
});
