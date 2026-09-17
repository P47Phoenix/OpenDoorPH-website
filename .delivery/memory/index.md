# Memory Index

**Last updated**: 2026-09-17 (after run-2026-09-16-lw01) · **Total runs**: 17 · **Latest**: Living Word restyle, PR #118 → 76f3a16, 0 UAT defects

## Stage Health (last 11 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 91% | lw01: clean r1 (anti-narrowing assertion locked; Solomon deletion-consumer sweep W-A/W-B); seo1: clean; 56bx: 1 self-correction |
| Refine | 64% | lw01: 1 DoD self-correction (PRD Rev 1→3; Paul 2/5→3/5, 3 blockers/round: analytics creep, alpha utilities, contrast table); seo1: 1 round; 58aa: 3 PRD rounds |
| Design | 82% | lw01: 2 self-correction rounds (Rev 2.1→2.4; QA BLOCK x2 on SVG recolour map) + elder Amendment A1 mid-stage → PRD Rev 5.1; seo1/58aa: clean |
| Architect | 100% | lw01: light, clean r1 (change map 60+ files, z-index table, ADR-lw-001/002/003) |
| Plan | 67% | lw01: DONE/DONE_WITH_MINORS r1, minors text-only; consensus r1/r2 + challenger 3/5→4/5; 154 sentinel fences run against HEAD; w3a1: clean; w2a1/w0a1/58aa/seo1: 1–3 rounds |
| Development | 82% | lw01: 9 stories, 36 DoD reviews, 0 FAIL, 0 round-2; LW-6 edit-after-battery slip (Hot #5 sub-rule); LW-9 blockers settled by rulings 9/10 (LCP 2258→2112); seo1/w3a1: clean |
| UAT | 91% | lw01: 4x DONE_WITH_MINORS r1 (KI-date drift across 3 artifacts; first dispatch lost to rate limit, re-dispatched); board GO-WITH-CONDITIONS x3; 0 defects; bf7w: PO rejected missing dates |

## Hot Lessons (top 7, validated 3+)
1. **"PH" in OpenDoorPH = Pleasant Hill, NOT Philippines.** Never in copy, labels, alt-text. `topics/project-facts.md`. Validated 6x (lw01: prod smoke "Pleasant Hill" x7, Philippines 0; forbidden-strings own release-plan line).
2. **Cross-artifact consistency checks work when institutionalized — but copies of the same fact still drift.** Validated 5x (lw01: Plan consensus caught wiring; UAT 4 validators each caught the same KI-date drift → see `stages/uat.md` L5 candidate: ONE source, others cite).
3. **Release notes must carry remediation dates for ALL known issues.** PO DoD rejects without dates. Validated 10x (lw01: KI-1/2/3 dated; PO accepted).
4. **Tests run locally before push; verify runtime exists before writing tests.** **Sub-rule (lw01): committed tree == battery tree; commit hash in the devlog Battery table.** Validated 8x (lw01: byte-exact 5-cmd battery per story under `CI=true`; LW-6 slip → rule held LW-7..9).
5. **After a build-artifact rename OR workflow edit, UAT must cross-reference `git show <sha> --stat` / `git diff master -- <each workflow>` before DoD.** Validated 9x (lw01: no workflow/TF edits; DevOps verified).
6. **Idea-brief locks an explicit anti-narrowing / scope-lock assertion carried verbatim PO→SM→QA→Dev sentinel; Plan QA DoD verifies a negative sentinel exists.** Validated 5x (w0a1, w1a1, w2a1, w3a1, lw01: restyle-only held; WelcomeBanner the one permitted removal). Detail: `stages/plan.md` L7.
7. **Encode policy as runtime assertion / grep sentinel / ADR-with-horizon, not prose.** *(Promoted from `stages/plan.md` L8 after lw01.)* Validated 3x (w2a1 ADR-with-horizon; w3a1 anti-`any` grep; lw01: 154 runnable sentinel fences extracted with awk, class-stripped fence + discourse-fidelity script as the guard).

Demoted to stage files after lw01 (still valid, <3x): "grep the working tree for X before an add-X PRD" → `stages/refine.md` L3 (2x); "curl the URL boundary before the test suite" → `stages/development.md` L8 (2x).

## Candidates to watch (0–1x; promote on 2nd instance)
- `stages/uat.md` L5: date-bearing facts in ONE artifact; others cite. L6: merge step `git fetch` + compare origin SHA (branch was pushed by a human mid-run).
- `stages/development.md` L10: dev briefs point at the spec line, never paraphrase ACs (LW-5 h1 brief error).
- `stages/plan.md` L10 (now 1x): latent failures surfaced under a scope bound are FILED with a date, not fixed in-wave (KI-1 Root Domain). L9 (0x): Architect version floors vs live GHSA range.

## Topic Pointers
- Project facts (church identity, canonical = opendoorph.org, **Living Word tokens/fonts/photo/`-v2`/120-min facts**): `topics/project-facts.md` **← read for any copy, class, asset, or schedule work**
- Team decisions: `topics/team-decisions.md` (DEC-2026-09-16-001, DEC-2026-09-17-001/002/003 added lw01)
- Defect patterns: `topics/defect-patterns.md` (lw01: 0.00/story; registry `.delivery/defects/`)
- Stage lessons: `stages/idea.md` (L3, L6 → 2x), `stages/refine.md` (L2, L3 → 2x), `stages/design.md` (L1 → 3x), `stages/plan.md` (L5, L6 → 2x; L8 promoted; L10 → 1x), `stages/development.md` (L9 → 2x; L10 + Hot #4 sub-rule added), `stages/uat.md` (L2 → 4x, L4 → 5x; L5, L6 added)
- Archive (17): `archive/run-2026-04-04-fx8s.md` … `archive/run-2026-05-13-w3a1.md`, **`archive/run-2026-09-16-lw01.md`** (Living Word; elder questions A–E pending)
