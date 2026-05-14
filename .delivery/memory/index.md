# Memory Index

## Stage Health (last 10 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 90% | seo1: clean (1 round, Solomon WARN deferred to Plan); 56bx: 1 self-correction (3rd consumer caught); 58aa: clean |
| Refine | 70% | seo1: 1 self-correction round (adversarial 2/5 → 4/5; cron-vs-rank-due + three-overdue provenance); 58aa: 3 PRD rounds + DoD self-correction |
| Design | 100% | seo1: slim no-UI (1 self-correction for D-R-001 reconciliation; both rounds clean); 58aa: clean |
| Plan | 67% | seo1: 3 self-correction rounds (Lesson-4 reprise — test-runner wired 3 ways, slice letter B/C, MILESTONE_DAY 3 forms, file names, extractNAP path); 58aa: 2 self-correction rounds; 56bx: light Plan clean; w0a1: 1 self-correction (AC-4 / wiring drift on light Plan — L4 reprise + new L7 added); w1a1: light Plan clean r1 (L7 carried Idea→Plan→Dev verbatim, L4 did NOT trigger — positive counter-example) |
| Development | 80% | seo1: clean DoD r1 (62/62 tests green; both Plan-Dev spikes PASS-B); 58aa: 124/124 + Story 5 CODE_COMPLETE-deferred; 56bx: 1 self-correction; e2e3: 1 self-correction |
| UAT | 90% | seo1: clean DoD r1 (BUG-053-01 cross-reference clean for both node-build.yml AND terraform.yml); 58aa: clean DoD r1; bf7w: PO rejected missing dates |

## Hot Lessons (top 7)
1. **"PH" in OpenDoorPH = Pleasant Hill, NOT Philippines.** Never reference Philippines in copy, labels, or alt-text. See `topics/project-facts.md`. Validated 5x (most recent: w1a1 — release notes line 26 invokes the rule explicitly while AC-35 enforcement tests strengthen it).
2. **When authoring an "add X" PRD on an existing codebase, grep the working tree for X FIRST.** 60 seconds at PRD-time saves 2 rounds of Refine rework. Validated 1x (58aa).
3. **Cross-artifact consistency checks work when institutionalized.** Validated 4x (ga4x identified, ev3k 2x, 58aa Plan-stage 3x, seo1 Plan-stage 5 Lesson-4 species drifts caught).
4. **Release notes must include remediation timelines for ALL known issues.** PO DoD rejects without dates. Validated 7x (most recent: w1a1 — deferred #78/#79 again acknowledged; PO DoD r1 clean).
5. **Tests run locally before push; verify runtime exists before writing tests.** Validated 5x (most recent: w1a1 — Bezalel ran all 5 + TC-6 sentinel; Thomas-UAT re-ran with distinct scratch filename).
6. **After a build-artifact dir rename OR workflow file edit, UAT tech-writer must cross-reference `git show <sha> --stat` (or `git diff master -- <each-existing-workflow>`) before signing DoD.** Sub-rule: when adding a NEW workflow, verify EVERY existing workflow's diff is empty, not just node-build.yml. Validated 6x (e2e3, 58aa, 56bx, seo1, w0a1, w1a1 — Ezra-UAT independently verified empty in w1a1).
7. **For infra fixes / new utilities with verifiable URL boundaries (serve/proxy/CDN/curl), curl the boundary BEFORE running the test suite.** A 30-second curl can distinguish "test setup wrong" from "test failure for unrelated reason." Validated 2x (56bx, seo1 — caught 2 implementation deviations in seo1 Step 7 before test pass declaration).

## Topic Pointers
- Project facts (church identity, domains, stack, **canonical = opendoorph.org**): `topics/project-facts.md` **← read for any copy/labels/alt-text/schema work**
- Team decisions: `topics/team-decisions.md` (DEC-2026-05-09-001/002/003 added seo1)
- Stage lessons: `stages/idea.md`, `stages/refine.md` (Lesson 4+5 added seo1), `stages/design.md`, `stages/plan.md` (Lessons 5+6 added seo1, Lesson 7 added w0a1 + validated 2x in w1a1, Lesson 8 CANDIDATE added w1a1 = "lesson-as-code"; L1 validated 3x, L4 validated 3x + 1 positive counter-example w1a1), `stages/development.md` (Lesson 9 added seo1; L8 validated 2x), `stages/uat.md` (L4 sub-rule added seo1; validated 6x cumulative)
- Archive: `archive/run-2026-04-04-fx8s.md`, `archive/run-2026-04-04-tw3p.md`, `archive/run-2026-04-05-hc1q.md`, `archive/run-2026-04-08-fb3n.md`, `archive/run-2026-04-10-bf7w.md`, `archive/run-2026-04-10-ga4x.md`, `archive/run-2026-04-12-ev3k.md`, `archive/run-2026-04-14-dv2k.md`, `archive/run-2026-04-22-e2e3.md`, `archive/run-2026-05-03-58aa.md`, `archive/run-2026-05-05-56bx.md`, `archive/run-2026-05-09-seo1.md`, `archive/run-2026-05-13-w0a1.md`, `archive/run-2026-05-13-w1a1.md`
