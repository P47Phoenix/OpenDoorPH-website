# Memory Index

## Stage Health (last 2 runs)
| Stage | First-Try Pass Rate | Notes |
|-------|-------------------|-------|
| Idea | 100% | Clean pass both runs |
| Refine | 100% | User scope change absorbed cleanly (tw3p) |
| Design | 100% | Clean pass (tw3p) |
| Plan | 100% | Clean pass both runs |
| Development | 100% | CODE_COMPLETE both runs (runtime pending) |
| UAT | 100% | Approved first presentation both runs |

## Hot Lessons (top 5)
1. For infrastructure BUG_FIX, scan actual config files to find root cause before writing idea brief
2. Terraform changes always CODE_COMPLETE, carry runtime validations to UAT
3. For CI/CD features, draft a flow diagram at Idea to surface approval-flow decisions before Refine
4. Include pre-flight env checklist (CLIs, tokens, secrets) in Refine template
5. AWS UAT reports need both CLI commands and Console verification steps

## Topic Pointers
- Stage lessons: `stages/idea.md`, `stages/refine.md`, `stages/plan.md`, `stages/development.md`, `stages/uat.md`
- Archive: `archive/run-2026-04-04-fx8s.md`, `archive/run-2026-04-04-tw3p.md`
