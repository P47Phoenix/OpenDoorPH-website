# Stage: Development — Lessons

## Lesson 1
- **Insight**: For Terraform changes, CODE_COMPLETE (not DONE) is the correct DoD status since terraform validate/plan/apply cannot run in the development environment. Carry runtime validations to UAT.
- **Validated**: 2
- **Last**: run-2026-04-05-hc1q

## Lesson 2
- **Insight**: Terraform version pinning requires testing against the actual .tf files. Three HCL v0.11 patterns that are hard errors in Terraform 1.5.7: `type = "string"`, `tags {}` blocks, and legacy provider addresses in state. The `${}` interpolation syntax only warns.
- **Validated**: 1
- **Last**: run-2026-04-05-hc1q

## Lesson 3
- **Insight**: Legacy Terraform state files (format v3, Terraform 0.9.x) cannot be read by Terraform 1.x. Must be removed or migrated via the 0.12→0.13 upgrade path before CI can run.
- **Validated**: 1
- **Last**: run-2026-04-05-hc1q

## Lesson 4
- **Insight**: When multiple development phases modify the same source file (e.g., analytics.ts), running phases in parallel risks merge conflicts or duplicated logic. Either run such phases sequentially or add a merge-reconciliation step after parallel completion.
- **Validated**: 1
- **Last**: run-2026-04-10-ga4x

## Lesson 5
- **Insight**: Test-writing without test-running (no Node.js in environment) produces CODE_COMPLETE status. 79 tests that have never been green are aspirational, not assurance. First CI run may surface compilation errors or import mismatches that code review cannot catch. Prioritize CI test execution before UAT.
- **Validated**: 1
- **Last**: run-2026-04-12-ev3k

## Lesson 6
- **Insight**: QA DoD catches real test coverage gaps even when code review passes. Empty-state tests and keyboard navigation tests are commonly missed categories. Always include empty-array/empty-state and full keyboard interaction tests in the initial implementation.
- **Validated**: 1
- **Last**: run-2026-04-12-ev3k

## Lesson 7
- **Insight**: When a fix renames a build artifact directory (BUILD_PATH, output dir, dist/ → out/, etc.), the dev-stage validation MUST grep the entire repo (workflows, README, deploy scripts) for the old name. Plan-stage risk lists tend to name deploy:gh-pages but miss CI/AWS chain references. Caught only at UAT round 1 by tech-writer cross-referencing commit content against on-disk workflow.
- **Validated**: 1
- **Last**: run-2026-04-22-e2e3

## Lesson 8
- **Insight**: When an infra fix has a verifiable URL boundary (serve / proxy / CDN behavior), curl the boundary BEFORE running the test suite. A 30-second curl can distinguish "test setup wrong" from "test failure for unrelated reason." In run-2026-05-05-56bx, Bezalel's round-1 fix landed the right disk layout but tests still returned 8/22 — a curl on `localhost:3101/OpenDoorPH-website` revealed `serve` was returning a directory listing, not React's index.html. The curl pre-check would have caught the partial fix without burning a full Playwright run.
- **Validated**: 2
- **Last**: run-2026-05-09-seo1 (caught 2 implementation deviations: canonical body-fetch posture; schema NAP-skip on absent `<address>`)

## Lesson 9
- **Insight**: When the Plan stage names a runtime assumption that's unverified (Jest+`.mjs` discoverability, lhci+Fedora Chromium availability), that assumption MUST be cleared by a Plan-Dev handoff spike BEFORE first-story implementation begins — not validated as part of the first story. In run-2026-05-09-seo1, both spikes (S-09 AC-6 sentinel + S-04 AC-9 lhci) fell to PASS-B; running them first meant the contingency (test:seo script + CHROME_PATH env var) was already in the design when implementation started. Without the spike-first discipline, S-01 would have shipped with an undiscoverable test layer.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1
