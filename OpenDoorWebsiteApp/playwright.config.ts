import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: (() => {
    const base = [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ];
    return isCI ? base.filter(p => p.name === 'chromium') : base;
  })(),

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run build:prod && npx serve -s build -p 3100',
      port: 3100,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      command: 'npm run build:gh-pages && npx serve -s build -p 3101',
      port: 3101,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      command: 'npm run build:custom && npx serve -s build -p 3102',
      port: 3102,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    }
  ],
});
