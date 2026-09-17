# Stage: UAT — Lessons

## Lesson 1
- **Insight**: AWS infrastructure UAT reports should include both CLI commands (curl, dig, terraform plan) AND AWS Console verification steps. The user needs both for confidence.
- **Validated**: 2
- **Last**: run-2026-04-10-bf7w

## Lesson 2
- **Insight**: Release notes must include remediation timelines for all known issues (not just "deferred"). PO DoD will reject without a target date or sprint.
- **Validated**: 4
- **Last**: run-2026-09-16-lw01
- **lw01 note**: KI-1/2/3 all dated (2026-10-01 / 2026-09-24 + 2026-12-01 / 2026-10-01); PO DONE_WITH_MINORS accepts. See Lesson 5 for the drift that dates-in-three-places caused.

## Lesson 3
- **Insight**: Stakeholder-removed checkpoints should be logged, not debated. Record the decision in the retrospective with the tradeoff noted. The team continues with maximum diligence and self-policing quality. For low-risk projects (church website), this is acceptable. For compliance/sensitive projects, flag the risk explicitly.
- **Validated**: 1
- **Last**: run-2026-04-12-ev3k

## Lesson 4
- **Insight**: UAT tech-writer DoD round 1 should explicitly cross-reference the runbook's "files in commit" claim against `git show <sha> --stat`. This catch can prevent production-deploy regressions invisible to dev/qa/architect DoD because they validate the new code path, not the unchanged-but-now-stale CI deploy path. Cost: 30 seconds of `git show`. Save: a wiped S3 bucket. **Sub-rule (run-2026-05-09-seo1)**: when the slice adds a NEW workflow file, run `git diff master -- .github/workflows/<each-existing-workflow>.yml` for EVERY existing workflow (not just node-build.yml). In this run, both node-build.yml AND terraform.yml were verified empty.
- **Validated**: 5
- **Last**: run-2026-09-16-lw01
- **lw01 note**: No workflow/TF edits this run (deploy-plan rule); DevOps DoD verified; CI PR gate unchanged (lint/type-check remain local DoD steps → FI-12).

## Lesson 5 (CANDIDATE — NEW lw01)
- **Insight**: Date-bearing facts (known-issue remediation dates, review horizons) must live in ONE source artifact; every other artifact cites it ("see release plan KI-n"), never restates the date. In run-2026-09-16-lw01 release-plan said 2026-10-01 / 2026-12-01 while release-notes and pr-body said 2026-09-30 / 2026-09-24; all four UAT validators spent a minor on it (DONE_WITH_MINORS x4). Substance identical, copies drifted. Release plan §6 = schedule of record.
- **Validated**: 0 (CANDIDATE — promote on 2nd instance)
- **Last**: run-2026-09-16-lw01

## Lesson 6 (CANDIDATE — NEW lw01)
- **Insight**: The merge step must reserve nothing about the remote. Before push/merge run `git fetch origin && git rev-parse origin/<branch>` and compare to local HEAD; log the result. In run-2026-09-16-lw01 `origin/feature/living-word-restyle` was already at 70c78e3 (push 2026-09-17 17:54 CDT, not from any pipeline agent) before the merge step, which had assumed local-only. Same SHA this time — a different SHA would have been a silent divergence.
- **Validated**: 0 (CANDIDATE — promote on 2nd instance)
- **Last**: run-2026-09-16-lw01
