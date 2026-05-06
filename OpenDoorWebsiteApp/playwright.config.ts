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
  /*
   * Issue #53 — webServer race fix: each environment's `react-scripts build`
   * now writes to its own BUILD_PATH (build-prod, build-gh-pages, build-custom)
   * via the cross-env-prefixed `build:*` scripts in package.json. Each `serve`
   * command below points at its dedicated dir so the three concurrent
   * webServers no longer fight over the shared `./build/` output, and each
   * port serves the bundle whose PUBLIC_URL matches its describe block in
   * tests/regression-broken-links.spec.ts.
   */
  webServer: [
    {
      command: 'npm run build:prod && npx serve -s build-prod -p 3100',
      port: 3100,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      // Issue #56: serves the nested-prefix subdir written by build:gh-pages's
      // BUILD_PATH=./build-gh-pages/OpenDoorPH-website. `npx serve build-gh-pages`
      // (no `-s`) mounts disk-root at URL-root and honours the serve.json that
      // build:gh-pages emits at build-gh-pages/serve.json. The serve.json
      // rewrites map /OpenDoorPH-website[/**] → /OpenDoorPH-website/index.html
      // (SPA fallback for client routes) AND disable directoryListing so a
      // bare /OpenDoorPH-website request lands on React's index.html instead
      // of `serve`'s file-tree listing. `-s` is intentionally omitted: it
      // would prepend a `**` → `/index.html` rewrite that always wins over our
      // explicit prefix rewrite, breaking SPA fallback for the prefixed env.
      command: 'npm run build:gh-pages && npx serve build-gh-pages -p 3101',
      port: 3101,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      // Issue #56: serves the nested-prefix subdir written by build:custom's
      // BUILD_PATH=./build-custom/CustomPath. Same serve.json + no-`-s`
      // pattern as port 3101 — see that block's comment for the rationale.
      // serve.json at build-custom/serve.json maps /CustomPath[/**] →
      // /CustomPath/index.html and disables directoryListing.
      command: 'npm run build:custom && npx serve build-custom -p 3102',
      port: 3102,
      reuseExistingServer: !process.env.CI,
      env: {
        'NODE_ENV': 'production'
      }
    }
  ],
});
