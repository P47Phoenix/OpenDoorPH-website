/**
 * Jest config for the seo-monitor utility tests.
 *
 * Spike outcome (S-09 AC-6): Pre-flight Spike 1.1 ran `CI=true npm test --
 * --testPathPattern=seo-monitor` against a sentinel `_sentinel.test.mjs` and
 * react-scripts (CRA's Jest wrapper) reported "No tests found" because CRA's
 * built-in testMatch hard-codes `src/**` with `.{js,jsx,ts,tsx}` only — `.mjs`
 * outside `src/` is invisible to it. **PASS-B fired.**
 *
 * Per orchestrator decision D-1 + stories.md S-09 AC-6, we add this dedicated
 * Jest config and the `npm run test:seo` package.json entry (the EIGHTH script
 * in the non-`seo:*` namespace, preserving S-01 AC-6's seven-`seo:*` invariant).
 *
 * Jest 27 (transitively via react-scripts 5) supports ESM .mjs natively as
 * long as we tell it where to look and let the .mjs files be loaded as ES
 * modules (Node's loader handles that — no Babel transform needed for our
 * pure-Node code that has no JSX / TS).
 */

'use strict';

const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '..', '..'),
    displayName: 'seo-monitor',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/scripts/seo-monitor/__tests__/**/*.test.mjs',
    ],
    moduleFileExtensions: ['mjs', 'cjs', 'js', 'json'],
    transform: {},
    // Quiet mode for CI: only show test failures by default.
    verbose: false,
};
