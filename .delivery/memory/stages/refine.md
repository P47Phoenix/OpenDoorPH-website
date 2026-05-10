# Stage: Refine — Lessons

## Lesson 1
- **Insight**: Include a pre-flight environment checklist in the Refine template: required CLIs (gh, terraform, aws), tokens/secrets, environment variables. User-initiated corrections at Refine (like adding gh CLI env setup) should be anticipated by the pipeline.
- **Validated**: 1
- **Last**: run-2026-04-04-tw3p

## Lesson 2
- **Insight**: When user provides feedback that changes scope at Refine checkpoint (e.g., plan-only → plan+approve+apply), update the PRD immediately and re-validate before proceeding. Don't carry the change as informal context.
- **Validated**: 1
- **Last**: run-2026-04-04-tw3p

## Lesson 3
- **Insight**: When authoring an "add X" or "ship X" PRD on an existing codebase, run a literal grep / file-read for X in the working tree BEFORE writing the problem statement. The adversarial reviewer will catch this in 60 seconds — better to catch it during PRD authoring than burn 2 PRD rounds reframing as "audit + reconcile". Run-2026-05-03-58aa adversarial round 1 caught this with confidence 1/5: the PRD declared "site lacks JSON-LD entirely" but `OpenDoorWebsiteApp/public/index.html` already shipped a Church/LocalBusiness block with a different canonical. Without the catch, the slice would have produced duplicate `<script type="application/ld+json">` blocks AND silently flipped canonical from .org to .info.
- **Validated**: 1
- **Last**: run-2026-05-03-58aa

## Lesson 4
- **Insight**: When the PRD claims to "close N overdue items", verify N against the SOURCE release notes by date arithmetic, not by assumption. In run-2026-05-09-seo1, the PRD round 1 declared "three overdue items" but slice-A release notes showed only TWO were overdue at 2026-05-09 (Demo URL 2026-05-06, Production curl 2026-05-05); Lighthouse baseline 2026-05-11 was upcoming-due. Adversarial r1 caught the +1 miscount. Correct framing: "two overdue + one upcoming-due."
- **Validated**: 1
- **Last**: run-2026-05-09-seo1

## Lesson 5
- **Insight**: For monitoring/scheduled-job features, validate that the schedule and the per-run logic don't mutually disarm. In run-2026-05-09-seo1, PRD round 1 had `rank-due` exit 0 on non-milestone days AND the cron run `all`, which would silently emit NO signal except on day 30/60/90 — the elder would think the workflow was broken. Fix: structured `MILESTONE_DAY=` marker emitted always (with `=none` on non-milestone days); workflow grep matches only `30|60|90`. Adversarial r1 caught this at confidence 2/5.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1
