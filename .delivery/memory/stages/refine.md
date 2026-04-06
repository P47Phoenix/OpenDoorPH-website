# Stage: Refine — Lessons

## Lesson 1
- **Insight**: Include a pre-flight environment checklist in the Refine template: required CLIs (gh, terraform, aws), tokens/secrets, environment variables. User-initiated corrections at Refine (like adding gh CLI env setup) should be anticipated by the pipeline.
- **Validated**: 1
- **Last**: run-2026-04-04-tw3p

## Lesson 2
- **Insight**: When user provides feedback that changes scope at Refine checkpoint (e.g., plan-only → plan+approve+apply), update the PRD immediately and re-validate before proceeding. Don't carry the change as informal context.
- **Validated**: 1
- **Last**: run-2026-04-04-tw3p
