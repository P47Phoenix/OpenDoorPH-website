# Defect Patterns

**Entries**: 3 | **Last updated**: 2026-09-17 | Registry: `.delivery/defects/index.md`

## Rate Trend
- Sprint lw01 (run-2026-09-16-lw01, 9 stories, FEATURE restyle): 0.00 defects/story (baseline for the registry; below 0.3 target)

## Persistent Categories
- None yet. No UAT or post-release defect has been logged since the registry opened.

## Plugin PRs
- None opened. No systemic category, no CRITICAL/HIGH pattern.

## Lessons
- Zero-defect delivery on a 60-file restyle correlated with: per-story byte-exact battery under `CI=true`, 154 runnable sentinel fences executed before Dev, 4-validator DoD per story (36 reviews), and a green-tree tag per story. (validated: 1, lw01)
- Stage-6 blockers that are POLICY collisions (fence vs fidelity, gate vs standing decision) resolve by orchestrator ruling in hours; they are self-corrections, not defects — keep them out of the rate. (validated: 1, lw01)
- Process slips (edit-after-battery) are caught by QA DoD when the devlog states the tree hash; without the hash they would be invisible. (validated: 1, lw01)
