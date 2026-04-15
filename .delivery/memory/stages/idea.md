# Stage: Idea — Lessons

## Lesson 1
- **Insight**: For infrastructure BUG_FIX, scanning the actual config files (Terraform, CloudFront, etc.) before writing the idea brief catches the real root cause. The user said "expired SSL cert" but the actual issue was "no custom cert configured at all."
- **Validated**: 1
- **Last**: run-2026-04-04-fx8s

## Lesson 2
- **Insight**: For CI/CD FEATURE work, draft a lightweight flow diagram at Idea stage to surface approval-flow decisions (e.g., manual vs automated apply) before Refine. This prevents scope pivots during Refine.
- **Validated**: 1
- **Last**: run-2026-04-04-tw3p

## Lesson 3
- **Insight**: Pre-pipeline brainstorms with domain experts compress Idea cycle time and produce higher-quality briefs. For FEATURE pipelines, gathering team input before the pipeline starts lets the Idea stage synthesize rather than discover.
- **Validated**: 1
- **Last**: run-2026-04-10-ga4x

## Lesson 4
- **Insight**: Front-loading edge case specificity at Idea (empty states, keyboard nav, timezone handling) compresses the Refine eval-opt cycle. When the Idea brief is vague on edge cases, the PRD inherits those gaps and QA catches them, costing a revision round.
- **Validated**: 1
- **Last**: run-2026-04-12-ev3k
