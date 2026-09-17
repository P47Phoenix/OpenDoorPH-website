# Sprint lw01 Defects — run-2026-09-16-lw01 (Living Word restyle)

**Stories**: 9 (LW-1..LW-9) · **UAT defects**: 0 · **Rate**: 0.00 defects/story (target < 0.3)
**Detection surface**: 36 Dev DoD reviews (0 FAIL), UAT exploratory session (0 defects), 35 + 10 cross-story UAT cases, review board x3, PR #118 review (0 blockers / 3 nits), production first-march 2026-09-17 (all automated steps PASS).

## Defects

None logged. No defect escaped Stage 6 to UAT, and none was found post-release at first-march.

## Self-corrections recorded at Stage 6 (NOT defects — caught before escape, per defect-tracking.md "Stage 6: logged as self-correction")

### SC-LW-01: LW-9 blocker — bibliography fence blocked a class-only edit
- **Story**: LW-9 (ScriptureStudy.tsx h3s :1000/:1017 needed `font-serif`)
- **Root cause**: TC-LW-7.3 [2] read the :992-1019 fence as byte-identical, so a className change with zero text change failed the fence even though `discourse-fidelity-check.sh` passed.
- **Resolution**: Orchestrator ruling 9 — fence read class-stripped; fidelity script is the guard; stories Rev 1.4 erratum.
- **Prevention**: `stages/plan.md` L8 / Hot #7 — encode the policy (text fidelity) as the script, not as a byte-range grep.

### SC-LW-02: LW-9 blocker — LCP 2258 ms > 2163 ms gate
- **Story**: LW-9 (full battery + Lighthouse)
- **Root cause**: Google Fonts stylesheet `<link>` render-blocking in `public/index.html:14`.
- **Resolution**: Orchestrator ruling 10(a) — preload/onload + `<noscript>`; LCP 2112 local, 1911 prod; CLS 0.005 (self-host ADR-lw-001 not triggered).
- **Prevention**: Plan-stage Lighthouse baseline was 1960 ms on the untouched tree; a fonts-cost estimate at Architect would have flagged the 200 ms headroom as thin. Note for next perf-gated restyle.

### SC-LW-03: LW-6 process slip — edit committed after the battery
- **Story**: LW-6 (value-card class order, class-only)
- **Root cause**: Battery ran, then a class-reorder edit landed, then commit — committed tree ≠ battery tree. Re-verified with lint/type-check/unit subset only.
- **Resolution**: QA M-1 minor; rule added to dev brief at LW-7: committed tree == battery tree, hash in Battery table. Held LW-7..LW-9.
- **Prevention**: Hot Lesson #4 sub-rule in `memory/index.md`.

## Post-release known issues (pre-existing, dated — not sprint defects)
- KI-1 Root Domain internal-links test red on origin/master (fix 2026-10-01).
- KI-2 WebKit not verifiable on host (manual Apple check 2026-09-24; host re-check 2026-12-01).
- KI-3 JSON-LD `closes` "12:00" vs 120-min service (fix 2026-10-01, pending elder ratification).

## Plugin PR assessment
No defect category → no plugin PR. Self-corrections SC-LW-01/02 are project-specific rulings; SC-LW-03 is a single occurrence, LOW severity → log only, revisit if it recurs.
