# Stage: Plan — Lessons

## Lesson 1
- **Insight**: Light Plan (single story, SM+QA DoD only) is sufficient for single-resource infrastructure fixes. All passed first attempt with no rework needed.
- **Validated**: 2
- **Last**: run-2026-04-22-e2e3

## Lesson 2
- **Insight**: Plan-stage risk-list discipline must include a "where does the renamed thing flow downstream?" sweep. For BUG-053-01, the risk list named deploy:gh-pages but missed CI workflow upload-artifact / aws s3 sync chains and README references. Adding a "rename grep" step would catch these in Plan, not UAT.
- **Validated**: 1
- **Last**: run-2026-04-22-e2e3

## Lesson 3
- **Insight**: Cross-artifact build-path consistency is a high-frequency Plan-stage drift. PO + SM + QA + DevOps each reference build dirs; if any has typos or stale names (e.g., `build-root`/`build-gh` vs the actual `build-prod`/`build-gh-pages`/`build-custom`/`build-deep` from `package.json`), the gap won't be caught until DevOps DoD validates against `package.json`. Mitigation: when authoring a Plan primary, include a "verify all paths against package.json" line in the prompt. Caught in run-2026-05-03-58aa Plan DoD round 2 (DevOps B7).
- **Validated**: 1
- **Last**: run-2026-05-03-58aa

## Lesson 4
- **Insight**: "FR/Test wired to CI vs UAT vs attestation" must agree across stories.md, test-strategy.md, and deploy-plan.md. A single source of truth (the PRD's FR text) is not sufficient if downstream artifacts paraphrase the wiring differently — adversarial caught run-2026-05-03-58aa with FR-06 wired three different ways across the four Plan artifacts. Cross-reference at Plan DoD: every CI/UAT/attestation claim should match exactly across primaries.
- **Validated**: 2
- **Last**: run-2026-05-09-seo1

## Lesson 5
- **Insight**: After the first round of 4 parallel Plan primaries, ALWAYS dispatch a CONSENSUS facilitator + ADVERSARIAL reviewer BEFORE DoD — the two together caught 5 Lesson-4 species drifts in run-2026-05-09-seo1 (test-runner wired 3 ways, slice letter B/C, MILESTONE_DAY regex 3 forms, test file names long vs short, extractNAP path 3 stances) that DoD alone would have missed. Adversarial confidence trajectory: 2/5 → 4/5 → 3/5 (last round caught 3 NEW surgical drifts). Consensus + adversarial in parallel after Plan primaries is now a standing pattern.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1

## Lesson 6
- **Insight**: When a PRD §13 "file path lock" exists, every Plan artifact (and every test file Bezalel later authors) must use the locked path BYTE-EXACT. Renames silently break the lock. In run-2026-05-09-seo1, test-strategy r1 used `tz-runner-utc.test.mjs` and `dst-boundary.test.mjs` while PRD §13 locked `rank-due-tz.test.mjs` and `rank-due-dst.test.mjs`. Both were caught at adversarial r2 + DoD r1 QA. Fix: Plan DoD validators must explicitly include a "PRD §13 path-lock byte-equality check" gate.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1
