# Stage: UAT — Lessons

## Lesson 1
- **Insight**: AWS infrastructure UAT reports should include both CLI commands (curl, dig, terraform plan) AND AWS Console verification steps. The user needs both for confidence.
- **Validated**: 2
- **Last**: run-2026-04-10-bf7w

## Lesson 2
- **Insight**: Release notes must include remediation timelines for all known issues (not just "deferred"). PO DoD will reject without a target date or sprint.
- **Validated**: 3
- **Last**: run-2026-04-12-ev3k

## Lesson 3
- **Insight**: Stakeholder-removed checkpoints should be logged, not debated. Record the decision in the retrospective with the tradeoff noted. The team continues with maximum diligence and self-policing quality. For low-risk projects (church website), this is acceptable. For compliance/sensitive projects, flag the risk explicitly.
- **Validated**: 1
- **Last**: run-2026-04-12-ev3k

## Lesson 4
- **Insight**: UAT tech-writer DoD round 1 should explicitly cross-reference the runbook's "files in commit" claim against `git show <sha> --stat`. This catch can prevent production-deploy regressions invisible to dev/qa/architect DoD because they validate the new code path, not the unchanged-but-now-stale CI deploy path. Cost: 30 seconds of `git show`. Save: a wiped S3 bucket. **Sub-rule (run-2026-05-09-seo1)**: when the slice adds a NEW workflow file, run `git diff master -- .github/workflows/<each-existing-workflow>.yml` for EVERY existing workflow (not just node-build.yml). In this run, both node-build.yml AND terraform.yml were verified empty.
- **Validated**: 4
- **Last**: run-2026-05-09-seo1
