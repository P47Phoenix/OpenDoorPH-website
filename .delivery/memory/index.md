# Memory Index

## Stage Health (last 4 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 100% | Clean pass all runs |
| Refine | 75% | Typo in FR-5 on fb3n — "Philippines" instead of "Pleasant Hill" |
| Design | 100% | Clean pass |
| Plan | 100% | Clean pass all runs |
| Development | 100% | CODE_COMPLETE all runs (runtime pending) |
| UAT | 100% | Approved first presentation all runs |

## Hot Lessons (top 5)
1. **"PH" in OpenDoorPH = Pleasant Hill, NOT Philippines.** Never reference Philippines in copy, labels, or alt-text. See `topics/project-facts.md`.
2. Terraform version pinning requires testing against actual .tf files — HCL v0.11 `type = "string"`, `tags {}`, and legacy state are hard errors in 1.5.7
3. Terraform changes always CODE_COMPLETE, carry runtime validations to UAT
4. For CI/CD features, draft a flow diagram at Idea to surface approval-flow decisions before Refine
5. Legacy Terraform state (format v3, 0.9.x) must be removed or migrated before Terraform 1.x can run

## Topic Pointers
- Project facts (church identity, domains, stack): `topics/project-facts.md` **← read for any copy/labels/alt-text work**
- Stage lessons: `stages/idea.md`, `stages/refine.md`, `stages/plan.md`, `stages/development.md`, `stages/uat.md`
- Archive: `archive/run-2026-04-04-fx8s.md`, `archive/run-2026-04-04-tw3p.md`, `archive/run-2026-04-05-hc1q.md`, `archive/run-2026-04-06-bf2x.md`, `archive/run-2026-04-08-cr1t.md`, `archive/run-2026-04-08-fb3n.md`
