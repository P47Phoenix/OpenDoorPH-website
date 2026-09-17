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

## DEC-2026-09-16-001: Living Word palette + type = flat 7-token config, Lora/Inter
- **Decision**: Tailwind colours are a flat 7-entry config (parchment/ink/sage/sage-dark/brick/brick-dark/rule, + stone); hover tokens sage-dark #4B6350 / brick-dark #7A3A24; alpha-opacity utilities banned; body `text-ink`; fonts Lora + Inter; `transitionDuration.DEFAULT` 150 ms. PRD Section 5.1 contrast table is the palette contract.
- **Why**: Elder chose the scripture-forward direction 2026-09-16; flat tokens keep the restyle greppable (AC sentinels) and contrast provable per pair.
- **Made by**: elder (direction) + PO ruling at Refine Rev 3 (token set)
- **Reversibility**: Moderate (every className in ~60 files)
- **Pipeline run**: run-2026-09-16-lw01

## DEC-2026-09-17-001: Google Fonts stays via `<link>`, delivered non-blocking (ruling 10)
- **Decision**: Keep Google Fonts (PRD 5.3 / Paul C-6); load as `preload as=style onload` + `<noscript>` fallback. Self-host per ADR-lw-001 only if CLS > 0.05.
- **Why**: LCP 2258 > 2163 gate with render-blocking stylesheet; step (a) alone brought LCP to 2112 (prod 1911), CLS 0.005. Any future CSP must allow the inline `onload` (unsafe-hashes/sha256).
- **Made by**: Orchestrator ruling 10 at LW-9
- **Reversibility**: Trivial (revert `public/index.html` link form)
- **Pipeline run**: run-2026-09-16-lw01

## DEC-2026-09-17-002: One congregation photo; share card text-only; `-v2` rename for immutable assets
- **Decision**: Exactly one elder-supplied congregation photo on the site (Home after Our Mission, About foot of Our History); no other people photos; share card is text-only. Replacing `congregation.jpg` or `share-card.png` requires a `-v2` filename + meta update (CloudFront `query_string=false`, immutable Cache-Control).
- **Why**: Elder Amendment A1 supplied the photo; LCP kept the photo below the fold. `?v=` cache-bust impossible under current CloudFront config (ADR-lw-002/003, deploy-plan 4.3).
- **Made by**: elder (A1) + Architect ADR-lw-002/003; elder placement confirmation pending (questions A/B)
- **Reversibility**: Trivial (one-file revert per placement; `-v2` re-render for card)
- **Pipeline run**: run-2026-09-16-lw01

## DEC-2026-09-17-003: Bibliography fence read class-stripped; discourse-fidelity script is the guard (ruling 9)
- **Decision**: The ScriptureStudy.tsx :992-1019 byte-identical fence protects the elder's discourse TEXT, not class attributes; it is read in class-stripped form. `scripts/discourse-fidelity-check.sh` (BASE_REF=origin/master) is the real fidelity gate and must PASS post-commit. Service duration = 120 min (`events.ts`), calendar 10:30–12:30.
- **Why**: LW-9 needed `font-serif` on two bibliography h3s; fence-as-bytes blocked a class-only edit with zero text change.
- **Made by**: Orchestrator ruling 9; QA codified in stories Rev 1.4 erratum
- **Reversibility**: Trivial (restore byte-form reading in stories.md)
- **Pipeline run**: run-2026-09-16-lw01
