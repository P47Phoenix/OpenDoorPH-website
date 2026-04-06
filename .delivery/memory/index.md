# Memory Index

## Stage Health (last 3 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 100% | Clean pass all runs |
| Refine | 100% | User scope change absorbed cleanly (tw3p) |
| Design | 100% | Clean pass (tw3p) |
| Plan | 100% | Clean pass all runs |
| Development | 100% | CODE_COMPLETE all runs (runtime pending) |
| UAT | 100% | Approved first presentation all runs |

## Hot Lessons (top 5)
1. Terraform version pinning requires testing against actual .tf files — HCL v0.11 `type = "string"`, `tags {}`, and legacy state are hard errors in 1.5.7
2. Terraform changes always CODE_COMPLETE, carry runtime validations to UAT
3. For CI/CD features, draft a flow diagram at Idea to surface approval-flow decisions before Refine
4. Include pre-flight env checklist (CLIs, tokens, secrets) in Refine template
5. Legacy Terraform state (format v3, 0.9.x) must be removed or migrated before Terraform 1.x can run

## Topic Pointers
- Stage lessons: `stages/idea.md`, `stages/refine.md`, `stages/plan.md`, `stages/development.md`, `stages/uat.md`
- Archive: `archive/run-2026-04-04-fx8s.md`, `archive/run-2026-04-04-tw3p.md`, `archive/run-2026-04-05-hc1q.md`
