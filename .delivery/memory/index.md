# Memory Index

## Stage Health (last 7 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 100% | Clean pass all runs |
| Refine | 83% | ev3k: eval-opt revision for edge cases; fb3n: PH typo |
| Design | 100% | ga4x localStorage fix validated; ev3k consistency clean |
| Plan | 100% | Clean pass all runs |
| Development | 86% | ev3k: missing test coverage caught by QA DoD round 1 |
| UAT | 86% | bf7w: PO rejected missing remediation timeline; ev3k: clean |

## Hot Lessons (top 5)
1. **"PH" in OpenDoorPH = Pleasant Hill, NOT Philippines.** Never reference Philippines in copy, labels, or alt-text. See `topics/project-facts.md`.
2. Cross-artifact consistency checks work when institutionalized — ga4x identified, ev3k validated (2x).
3. Release notes must include remediation timelines for ALL known issues — PO DoD rejects without dates (3x validated).
4. Test-writing without test-running produces CODE_COMPLETE. First CI run may surface issues code review can't catch.
5. Front-load edge case specificity at Idea (empty states, keyboard nav, timezone) to compress Refine eval-opt cycles.

## Topic Pointers
- Project facts (church identity, domains, stack): `topics/project-facts.md` **← read for any copy/labels/alt-text work**
- Stage lessons: `stages/idea.md`, `stages/refine.md`, `stages/design.md`, `stages/plan.md`, `stages/development.md`, `stages/uat.md`
- Archive: `archive/run-2026-04-04-fx8s.md`, `archive/run-2026-04-04-tw3p.md`, `archive/run-2026-04-05-hc1q.md`, `archive/run-2026-04-06-bf2x.md`, `archive/run-2026-04-08-cr1t.md`, `archive/run-2026-04-08-fb3n.md`, `archive/run-2026-04-10-bf7w.md`, `archive/run-2026-04-10-ga4x.md`, `archive/run-2026-04-12-ev3k.md`, `archive/run-2026-04-14-dv2k.md`
