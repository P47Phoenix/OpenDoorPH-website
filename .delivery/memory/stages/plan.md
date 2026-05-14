# Stage: Plan — Lessons

## Lesson 1
- **Insight**: Light Plan (single story, SM+QA DoD only) is sufficient for single-resource infrastructure fixes. All passed first attempt with no rework needed.
- **Validated**: 3
- **Last**: run-2026-05-13-w0a1

## Lesson 2
- **Insight**: Plan-stage risk-list discipline must include a "where does the renamed thing flow downstream?" sweep. For BUG-053-01, the risk list named deploy:gh-pages but missed CI workflow upload-artifact / aws s3 sync chains and README references. Adding a "rename grep" step would catch these in Plan, not UAT.
- **Validated**: 1
- **Last**: run-2026-04-22-e2e3

## Lesson 3
- **Insight**: Cross-artifact build-path consistency is a high-frequency Plan-stage drift. PO + SM + QA + DevOps each reference build dirs; if any has typos or stale names (e.g., `build-root`/`build-gh` vs the actual `build-prod`/`build-gh-pages`/`build-custom`/`build-deep` from `package.json`), the gap won't be caught until DevOps DoD validates against `package.json`. Mitigation: when authoring a Plan primary, include a "verify all paths against package.json" line in the prompt. Caught in run-2026-05-03-58aa Plan DoD round 2 (DevOps B7).
- **Validated**: 1
- **Last**: run-2026-05-03-58aa

## Lesson 4
- **Insight**: "FR/Test wired to CI vs UAT vs attestation" must agree across stories.md, test-strategy.md, and deploy-plan.md. A single source of truth (the PRD's FR text) is not sufficient if downstream artifacts paraphrase the wiring differently — adversarial caught run-2026-05-03-58aa with FR-06 wired three different ways across the four Plan artifacts. Cross-reference at Plan DoD: every CI/UAT/attestation claim should match exactly across primaries. Reprised on a light-mode Plan in w0a1 (4-vs-5 command battery drift); confirms drift is structural, not depth-correlated. Positive counter-example in w1a1: when Lesson 7's anti-narrowing assertion was carried verbatim PO→SM→QA, drift surface shrank to zero. Reprised again in w2a1: SM held the Wave 0/1 canonical battery while PO/QA evolved independently to a richer 5-cmd shape (`lint / type-check / test:ci / test:seo / build:prod`) — both internally consistent, but cross-artifact drift. Resolution: SM canonical-realignment at r2.
- **Validated**: 4
- **Last**: run-2026-05-13-w2a1
- **Positive counter-example**: run-2026-05-13-w1a1 (no drift when L7 applied)

## Lesson 5
- **Insight**: After the first round of 4 parallel Plan primaries, ALWAYS dispatch a CONSENSUS facilitator + ADVERSARIAL reviewer BEFORE DoD — the two together caught 5 Lesson-4 species drifts in run-2026-05-09-seo1 (test-runner wired 3 ways, slice letter B/C, MILESTONE_DAY regex 3 forms, test file names long vs short, extractNAP path 3 stances) that DoD alone would have missed. Adversarial confidence trajectory: 2/5 → 4/5 → 3/5 (last round caught 3 NEW surgical drifts). Consensus + adversarial in parallel after Plan primaries is now a standing pattern.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1

## Lesson 6
- **Insight**: When a PRD §13 "file path lock" exists, every Plan artifact (and every test file Bezalel later authors) must use the locked path BYTE-EXACT. Renames silently break the lock. In run-2026-05-09-seo1, test-strategy r1 used `tz-runner-utc.test.mjs` and `dst-boundary.test.mjs` while PRD §13 locked `rank-due-tz.test.mjs` and `rank-due-dst.test.mjs`. Both were caught at adversarial r2 + DoD r1 QA. Fix: Plan DoD validators must explicitly include a "PRD §13 path-lock byte-equality check" gate.
- **Validated**: 1
- **Last**: run-2026-05-09-seo1

## Lesson 7
- **Insight**: BUG_FIX / FEATURE-Light / FEATURE idea-briefs must lock an explicit "extension/scope lock" / anti-narrowing assertion line that downstream primaries copy verbatim. Without it, test design can pass a fix that silently narrows scope (TC-4 in w0a1 would have passed a fix that dropped `.jsx`). Mitigation: add "Scope lock / anti-narrowing assertion" field to brief templates; Plan QA DoD must verify a negative-narrowing test case exists. Validated across 3 waves: w0a1 caught the gap (introduced); w1a1 carried Idea § 8 → Plan AC-5 → Dev runtime sentinel without drift; w2a1 NFR-08 SVG count parity served the same role for nth-check override (#91). Promote to hot lesson at Wave 3 if pattern continues.
- **Validated**: 3
- **Last**: run-2026-05-13-w2a1

## Lesson 8
- **Insight**: Encoding a policy as a RUNTIME assertion or a STRUCTURED ADR-with-horizon is more durable than encoding it as plain documentation. w1a1 demonstrated runtime-form: AC-33 / AC-35 went from doc-only to fail-loud jest assertions and the anti-narrowing sentinel fires when injected. w2a1 demonstrated ADR-form: 6 CRA-transitive accepted risks each carry severity / chain / blast-radius / blocker / remediation-horizon / compensating-controls — when CRA upgrade lands, the ADR is the executable triage list, not a wishlist. Generalizable shape: when a wave closes "policy carries" (FEATURE-Light enforcement) or accepts "structured-deferral" risks (security batch), prefer code-or-ADR-with-trigger over plain prose acceptance.
- **Validated**: 1 (was CANDIDATE in w1a1; ADR-with-horizon in w2a1 = second generalizable instance)
- **Last**: run-2026-05-13-w2a1

## Lesson 9 (CANDIDATE)
- **Insight**: Architect-specified package version floors for security overrides must be validated against the LIVE security advisory range, not the dependabot-suggested floor or the alert's "secure version" hint. Wave 2 architecture.md spec'd `qs ^6.13.0` (dependabot's lowest-non-vulnerable suggestion at the time); empirical install showed body-parser still resolves to 6.13.0 in-range vulnerable per GHSA-6rw7-vpxm-498p (actual fix at 6.14.1). Bezalel had to deviate at Dev stage. Mitigation: Architect-light protocol must include a per-override `npm audit --json` re-fetch + GHSA range read AFTER `npm install --package-lock-only` simulation — not before. Add to Architect-light DoD criteria for security waves.
- **Validated**: 0 (CANDIDATE — awaits one more security wave instance to confirm; flag at Wave 3+ or any future security batch)
- **Last**: run-2026-05-13-w2a1
