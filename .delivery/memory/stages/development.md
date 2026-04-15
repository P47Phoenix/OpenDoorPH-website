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
