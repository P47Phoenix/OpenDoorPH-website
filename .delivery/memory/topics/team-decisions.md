# Topic: Team Decisions

## DEC-2026-04-23-001: Issue #53 PR gate scope
- **Decision**: Narrow `test:e2e:pr` to a11y + Root Domain via `--grep-invert "GitHub Pages|Custom Path"`. Defer gh-pages + Custom Path coverage via follow-up issue.
- **Why**: `npx serve -s` does not mount the bundle at the embedded PUBLIC_URL prefix. Three remediation candidates (serve.json rewrites / pre-staged subdirs / inline express) each carry meaningful additional surface area; defer-with-follow-up preserves Hot Lesson 4 (no aspirational green ships).
- **Made by**: elder, at Stage 6 escalation
- **Reversibility**: Trivial (drop the `--grep-invert` once the prefix-mismatch is solved)
- **Target sprint to restore**: 2026-05-15
- **Pipeline run**: run-2026-04-22-e2e3

## DEC-2026-05-03-001: OpenDoorPH canonical domain
- **Decision**: `https://opendoorph.org/` is the canonical site. The other three domains (`opendoorph.info`, `opendoorph.net`, `opendoorph.com`) redirect to `.org`. Affects: schema `url`, `<link rel=canonical>`, sitemap.xml, robots.txt, GBP "website" field, citation listings.
- **Why**: Existing `OpenDoorWebsiteApp/public/index.html` already shipped JSON-LD with `.org` canonical and `<link rel=canonical>` to `.org`. PRD round 1 of run-2026-05-03-58aa declared `.info`; adversarial caught the contradiction at confidence 1/5; elder ratified `.org` as the deployed canonical. Print materials and the live site agree.
- **Made by**: elder, at Stage 2 escalation
- **Reversibility**: Trivial (CDN/redirect change; would also require schema and rel=canonical updates)
- **Pipeline run**: run-2026-05-03-58aa

## DEC-2026-05-03-002: Forbidden-string regression guard scope
- **Decision**: The `philippines` / `pleasant hill interdenom` / `herbert lowrey` regression guard runs **source-side** (`OpenDoorWebsiteApp/src/` + `OpenDoorWebsiteApp/public/`), NOT against build outputs. Implementation: `OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh` invoked by CI in `node-build.yml`.
- **Why**: Build outputs are deterministic transforms of source; source coverage covers all 4 build envs uniformly. CI doesn't run all 4 builds (only `build:prod`), so a build-side check would either skip envs (silent gap) or fail-pre-condition (false-fail).
- **Made by**: PO ruling, at Plan DoD round 2 (driven by DevOps B7 finding)
- **Reversibility**: Trivial (move the grep target back to build dirs if CI ever runs all 4 builds)
- **Pipeline run**: run-2026-05-03-58aa

## DEC-2026-05-05-001: serve + CRA prefix-env coupling pattern
- **Decision**: For CRA builds with non-empty `PUBLIC_URL` served via `serve` (or `serve-handler`), the canonical fix is **Option-1 + Option-2 layered**: nest the build output under the prefix path (`BUILD_PATH=./<dir>/<prefix>/`) AND emit a `serve.json` at the served root with rewrites mapping `/<prefix>{,/**}` → `/<prefix>/index.html` and `directoryListing: false`.
- **Why**: Option-2 alone (nested subdirs) is necessary but not sufficient — `serve -s <root>` returns directory listings for paths that match prefix subdirs instead of auto-serving the nested `index.html`. The asset paths (`/<prefix>/static/...`) work after Option-2 alone, but the initial route lands on a listing and React never mounts.
- **Made by**: PO ruling, run-2026-05-05-56bx Stage 6 round 2 (Bezalel-cont's curl diagnostic + layered fix)
- **Reversibility**: Trivial (revert the serve.json emission step in package.json)
- **Pipeline run**: run-2026-05-05-56bx

## DEC-2026-05-05-002: React Router basename trailing-slash invariant
- **Decision**: `react-router-dom@6.x`'s `<Router basename={...}>` MUST be passed a value that does NOT end with a trailing slash. Apply `.replace(/\/$/, '') || '/'` to any basename derived from `process.env.REACT_APP_*_URI` (which is conventionally trailing-slashed in CRA project configs).
- **Why**: React Router's `stripBasename` returns `null` for URLs that don't match the basename including its trailing slash. With basename `/OpenDoorPH-website/`, the bare-prefix URL `/OpenDoorPH-website` (no trailing slash, the form Playwright and many users actually visit) doesn't match — no routes resolve, blank page, link locators fail. The strip-trailing-slash makes basename `/OpenDoorPH-website` which matches both forms.
- **Made by**: Bezalel-cont diagnosis at Stage 6 round 2; PO ruling at UAT acceptance
- **Reversibility**: Trivial 1-line revert in `MasterLayout.tsx`
- **Pipeline run**: run-2026-05-05-56bx

## DEC-2026-05-03-003: NAP byte-match contract scope
- **Decision**: NAP byte-equality test scope is `streetAddress + postalCode + telephone (if present)`. `addressLocality`, `addressRegion`, and `name` are advisory checks that emit `console.warn` but do NOT fail the test (FR-05.5/FR-05.6 in the PRD).
- **Why**: Brand-suffix variation ("Open Door Full Gospel Church Of Pleasant Hill" on Footer/LocationPage vs "Open Door Full Gospel Church" in schema) and state-name variation ("Pleasant Hill, Missouri" on LocationPage vs "MO" in schema) are real but reflect display preferences, not data drift. The Address+Phone scope captures the citation-relevant signal without forcing brand-text reconciliation.
- **Made by**: PO ruling, at Refine DoD round 1 (driven by Thomas-Fresh's LocationPage Missouri/MO finding)
- **Reversibility**: Moderate (would require expanding test scope and reconciling brand text — likely a separate Issue if the elder decides the brand should match the schema name exactly)
- **Pipeline run**: run-2026-05-03-58aa

## DEC-2026-05-09-001: SEO monitor test runner = Jest via react-scripts; fallback `npm run test:seo`
- **Decision**: The seo-monitor utility's tests run under Jest (the existing CRA convention). Because CRA's `react-scripts test` does not pick up `*.test.mjs` outside `src/`, the canonical invocation is `npm run test:seo` → `jest --config OpenDoorWebsiteApp/scripts/seo-monitor/jest.config.cjs`. The 8 added package.json script keys = 7 `seo:*` (umbrella + 6 per-subcommand) + 1 `test:seo` (non-`seo:*` namespace, preserves the seven-`seo:*` invariant).
- **Why**: Plan-Dev sentinel spike (S-09 AC-6) confirmed PASS-B branch fired (CRA refuses .mjs outside src/). Adding the dedicated Jest config under the script directory keeps test discovery deterministic without ejecting CRA.
- **Made by**: Orchestrator decision D-1 at Plan self-correction round 1; ratified by Plan-Dev spike outcome
- **Reversibility**: Moderate (would require migrating to node:test or a different runner)
- **Pipeline run**: run-2026-05-09-seo1

## DEC-2026-05-09-002: lhci on Fedora 43 requires CHROME_PATH env var
- **Decision**: On Fedora 43 dev box (the elder's environment), `npx lhci collect` fails Chromium discovery by default. Workaround: `CHROME_PATH=/var/home/meconnelly/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome npx lhci ...`. Documented in the utility README + cli-ux-spec FR-LH-05 diagnostic message. CI runner (ubuntu-latest) does NOT need the env var.
- **Why**: Plan-Dev spike (S-04 AC-9) PASS-B branch fired. The elder's Fedora doesn't ship a system Chromium; Playwright's bundled Chromium binary is the cleanest available executable.
- **Made by**: Bezalel diagnosis at Stage 6 spike 1.2; documented across release-notes + utility README + cli-ux-spec
- **Reversibility**: Trivial (`sudo dnf install chromium` would unblock without env var; documented as alternative)
- **Pipeline run**: run-2026-05-09-seo1

## DEC-2026-05-09-003: SM-7 closure = first manual workflow_dispatch on merge day (Jericho first-march)
- **Decision**: For the SEO monitor slice, SM-7 (first scheduled run target ≤ 2026-05-18) closes when the elder runs `gh workflow run seo-monitor.yml` post-merge AND the Issue #58 closure-confirmation comment is posted. The first natural Monday cron tick may follow on 2026-05-11 / 2026-05-18 / 2026-05-25 — corroborating evidence, NOT the gating event.
- **Why**: Sprint envelope (19.5 Bezalel-hours / 10 working days) cannot fit between 2026-05-09 and the 2026-05-18 cron tick deadline at 2-hour daily blocks. Three calendar exits considered (longer blocks / slip cron / dispatch-day march); dispatch-day march was the cleanest because it makes baseline capture deterministic AND provides the Issue #58 closure attestation in the same action.
- **Made by**: Orchestrator decision D-6 at Plan self-correction round 1
- **Reversibility**: Trivial (re-frame SM-7 to first cron tick if the elder prefers the calendar gate)
- **Pipeline run**: run-2026-05-09-seo1
