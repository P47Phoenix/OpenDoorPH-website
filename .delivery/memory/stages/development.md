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
