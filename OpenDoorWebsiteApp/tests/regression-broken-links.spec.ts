import { test, expect } from '@playwright/test';

/**
 * Regression tests for the specific link fixes implemented in tasks 10-12
 * These tests verify that the previously broken content area links now work correctly
 */

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
  test.describe(`Regression Tests - Previously Broken Links - ${name}`, () => {
    
    test('Homepage "Visit Us" button should work correctly', async ({ page }) => {
      // Navigate to homepage
      await page.goto(`${baseURL}${basePath}`);
      
      // Find the specific "Visit Us" button in the "Join Our Church Family" section
      const visitUsButton = page.getByRole('link', { name: /visit us/i });
      
      // Verify the button exists and is visible
      await expect(visitUsButton).toBeVisible();
      
      // Verify it has the correct href attribute (React Router Link should generate correct href)
      const href = await visitUsButton.getAttribute('href');
      expect(href).toBe(`${expectedPrefix}/opendoor/Home/Location`);
      
      // Click the button and verify navigation
      await visitUsButton.click();
      
      // Verify we arrive at the correct URL and page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      await expect(page.getByRole('heading', { name: /visit our church/i })).toBeVisible();
      
      // Verify this is not a 404 page
      const pageContent = page.locator('body');
      const bodyText = await pageContent.textContent();
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('Not Found');
    });

    test('Homepage "Learn More" button should work correctly', async ({ page }) => {
      // Navigate to homepage
      await page.goto(`${baseURL}${basePath}`);
      
      // Find the specific "Learn More" button in the "Join Our Church Family" section
      const learnMoreButton = page.getByRole('link', { name: /learn more/i });
      
      // Verify the button exists and is visible
      await expect(learnMoreButton).toBeVisible();
      
      // Verify it has the correct href attribute
      const href = await learnMoreButton.getAttribute('href');
      expect(href).toBe(`${expectedPrefix}/opendoor/Home/About`);
      
      // Click the button and verify navigation
      await learnMoreButton.click();
      
      // Verify we arrive at the correct URL and page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
      
      // Verify this is not a 404 page
      const pageContent = page.locator('body');
      const bodyText = await pageContent.textContent();
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('Not Found');
    });

    test('Location page "About Our Church" link should work correctly', async ({ page }) => {
      // Navigate to location page
      await page.goto(`${baseURL}${basePath}/opendoor/Home/Location`);
      
      // Find the specific "About Our Church" link in the "Plan Your Visit" section
      const aboutChurchLink = page.getByRole('link', { name: /about our church/i });
      
      // Verify the link exists and is visible
      await expect(aboutChurchLink).toBeVisible();
      
      // Verify it has the correct href attribute
      const href = await aboutChurchLink.getAttribute('href');
      expect(href).toBe(`${expectedPrefix}/opendoor/Home/About`);
      
      // Click the link and verify navigation
      await aboutChurchLink.click();
      
      // Verify we arrive at the correct URL and page
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
      
      // Verify this is not a 404 page
      const pageContent = page.locator('body');
      const bodyText = await pageContent.textContent();
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('Not Found');
    });

    test('All previously broken links return 200 status', async ({ page }) => {
      const brokenLinkPaths = [
        '/opendoor/Home/Location',  // Homepage "Visit Us" 
        '/opendoor/Home/About',     // Homepage "Learn More" and Location "About Our Church"
      ];
      
      for (const path of brokenLinkPaths) {
        const fullUrl = `${baseURL}${expectedPrefix}${path}`;
        const response = await page.goto(fullUrl);
        
        // Verify the response is successful
        expect(response?.status()).toBe(200);
        
        // Verify the page has actual content
        await expect(page.locator('body')).not.toBeEmpty();
        
        // Verify we're not on an error page
        const pageText = await page.locator('body').textContent();
        expect(pageText).not.toContain('404');
        expect(pageText).not.toContain('Page Not Found');
        expect(pageText).not.toContain('Cannot GET');
      }
    });

    test('User journey: Home → Visit Us → About Our Church should work seamlessly', async ({ page }) => {
      // Start at homepage
      await page.goto(`${baseURL}${basePath}`);
      
      // Click "Visit Us" button
      await page.getByRole('link', { name: /visit us/i }).click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/Location`);
      
      // Click "About Our Church" link
      await page.getByRole('link', { name: /about our church/i }).click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      
      // Verify we ended up on the about page with content
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
    });

    test('User journey: Home → Learn More should work correctly', async ({ page }) => {
      // Start at homepage
      await page.goto(`${baseURL}${basePath}`);
      
      // Click "Learn More" button
      await page.getByRole('link', { name: /learn more/i }).click();
      await expect(page).toHaveURL(`${baseURL}${expectedPrefix}/opendoor/Home/About`);
      
      // Verify we're on the about page with proper content
      await expect(page.getByRole('heading', { name: /our history/i })).toBeVisible();
      
      // Verify the page has the expected content sections
      await expect(page.locator('text=Our History')).toBeVisible();
    });

    test('Broken links should not exist in production build', async ({ page, context }) => {
      // Navigate to homepage
      await page.goto(`${baseURL}${basePath}`);
      
      // Check console for any 404 errors
      const consoleLogs: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleLogs.push(message.text());
        }
      });
      
      // Check network requests for any 404s
      const failedRequests: string[] = [];
      page.on('response', (response) => {
        if (response.status() === 404) {
          failedRequests.push(response.url());
        }
      });
      
      // Navigate through all the previously broken links
      await page.getByRole('link', { name: /visit us/i }).click();
      await page.waitForLoadState('networkidle');
      
      await page.getByRole('link', { name: /about our church/i }).click();
      await page.waitForLoadState('networkidle');
      
      await page.goto(`${baseURL}${basePath}`);
      await page.getByRole('link', { name: /learn more/i }).click();
      await page.waitForLoadState('networkidle');
      
      // Verify no console errors related to navigation
      const navigationErrors = consoleLogs.filter(log => 
        log.includes('404') || 
        log.includes('Failed to fetch') || 
        log.includes('Cannot GET')
      );
      expect(navigationErrors).toHaveLength(0);
      
      // Verify no 404 network requests
      expect(failedRequests).toHaveLength(0);
    });
  });
});
