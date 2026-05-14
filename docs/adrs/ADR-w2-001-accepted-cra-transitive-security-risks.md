# ADR-w2-001 — Accepted CRA-Transitive Security Risks

> *"To every thing there is a season, and a time to every purpose under the heaven."* — Ecclesiastes 3:1. The wise know when to leave a stone unturned.

- **Status:** Accepted
- **Date:** 2026-05-13
- **Author:** Solomon (Solution Architect)
- **Wave:** w2 (Dependabot Drain)
- **Supersedes:** none
- **Superseded by:** none

## Context

Eleven Dependabot alerts open against `OpenDoorWebsiteApp` — all eleven sit inside the transitive tree of `react-scripts@^5.0.1` (Create React App), which is pinned by prior project decision and out of scope to upgrade this wave (C3). PR #100 (Wave 0) unblocked the lint gate; PR #74 (Wave 1.5) proved the `overrides` pattern works for transitive security fixes. Wave 2's job is to drain the five alerts where an override is technically safe (see `../solution/architecture.md`) and document the remaining six with explicit remediation horizons so the dashboard's "open" count stops being noise and starts being a register. Production deployment ships a static bundle compiled by `react-scripts build` to `opendoorph.org`; webpack-dev-server, jest, and CRA-internal Babel chains never leave `node_modules` at production runtime.

## Decision

The following six Dependabot alerts are formally accepted as CRA-transitive risks. Each carries an empirically-verified dependency chain (run `cd OpenDoorWebsiteApp && npm ls <pkg>` to reproduce), a blast-radius classification, the specific constraint that makes an override infeasible, a remediation horizon, and any compensating control.

### #81 — `@babel/plugin-transform-modules-systemjs` (HIGH)

- **Severity:** HIGH
- **Vulnerability summary:** Inefficient regular expression in Babel SystemJS transform; ReDoS via crafted source input during build.
- **CRA-transitive chain (verified):** `react-scripts@5.0.1 → @svgr/webpack@5.5.0 → @babel/preset-env@7.28.0 → @babel/plugin-transform-modules-systemjs@7.27.1`
- **Blast radius:** Build-time only — Babel plugin runs during `react-scripts build`; not reachable at production runtime; not reachable at test time.
- **Why no override is reachable:** Overriding the plugin forks the `@babel/preset-env` plugin graph; preset-env composes ~50 transform plugins with version-coupled assumptions. An override to a single transform splits the preset's internal version invariants and risks "near-certain build break" (Idea-stage architect review, trade-off table Option A).
- **Remediation horizon:** Remediated when CRA upgrade or Vite migration lands; re-evaluate 2026-Q4.
- **Compensating controls:** Build runs only inside CI and on maintainer machines; input source is project-controlled (`OpenDoorWebsiteApp/src/`), not user-controlled; ReDoS exploit window requires an attacker who can already commit source. No production reach.

### #82 — `fast-uri` host confusion (HIGH)

- **Severity:** HIGH
- **Vulnerability summary:** URI parser host-name confusion in fast-uri 3.x; potential SSRF/origin-spoofing when used as URL validator.
- **CRA-transitive chain (verified):** `react-scripts → @pmmmwh/react-refresh-webpack-plugin → schema-utils → ajv@8.18.0 → fast-uri@3.0.6`; ALSO `react-scripts → workbox-webpack-plugin → workbox-build → ajv@8.18.0 → fast-uri@3.0.6`; ALSO `serve → ajv@8.18.0 → fast-uri@3.0.6`.
- **Blast radius:** Mixed — react-refresh path is dev-only (HMR); workbox path runs at PWA build time; `serve` is a CLI dev tool. The URI-parsing surface is JSON Schema `format: uri` validation inside ajv — a narrow exploit window requiring attacker-controlled JSON schema input.
- **Why no override is reachable:** `ajv@8.x` binds `fast-uri@^3` via peer/runtime contract; CRA pins the ajv minor floor through schema-utils. Forcing a fast-uri major bump risks ajv schema validation regressions across the three independent chains above.
- **Remediation horizon:** CRA upgrade or Vite migration; re-evaluate 2026-Q4.
- **Compensating controls:** Build-time schema validation consumes only project-internal schemas (no user-supplied JSON Schema). Production bundle does not include ajv.

### #83 — `fast-uri` path traversal (HIGH)

- **Severity:** HIGH
- **Vulnerability summary:** Path normalization flaw in fast-uri 3.x; relative-segment handling permits traversal in URI consumers that trust the parsed `path` field.
- **CRA-transitive chain:** Same chains as #82 (same package, same coexistence pattern).
- **Blast radius:** Same as #82 — mixed dev + build-time; no production-runtime reach.
- **Why no override is reachable:** Same ajv@8 binding as #82.
- **Remediation horizon:** CRA upgrade or Vite migration; re-evaluate 2026-Q4.
- **Compensating controls:** Same as #82.

### #87 — `glob` CLI command injection (HIGH)

- **Severity:** HIGH
- **Vulnerability summary:** Argument injection through `glob`'s `-c/--cmd` CLI execution flag in glob ≤8; affects the CLI binary, not the programmatic API.
- **CRA-transitive chain (verified):** `react-scripts → jest@27.5.1 → @jest/core` AND `react-scripts → babel-jest → babel-plugin-istanbul → test-exclude` AND `react-scripts → react-dev-utils → fork-ts-checker-webpack-plugin` AND `react-scripts → workbox-webpack-plugin → workbox-build` AND `@lhci/cli → chrome-launcher → rimraf@3` — all resolve to `glob@7.2.3`. A safe `glob@10.4.5` coexists via `tailwindcss → sucrase`.
- **Blast radius:** Dev + CI (test time + build time). `npm run test:ci`, `npm run test:seo`, `npm run build:*` all touch glob; production bundle does not. The CLI surface that carries the vulnerability is not invoked anywhere in the project's npm scripts — programmatic API only.
- **Why no override is reachable:** `jest@27.5.1` binds the `glob@7` callback API (`new Glob(pattern, options, callback)`); `glob@10` removed callbacks entirely. A blanket `"glob": "^10"` override would force jest@27 onto glob@10 and break `test:ci` + `test:seo` at startup. Scoped override considered (`"react-scripts": { "glob": "^7.2.3" }`) and rejected as audit-trail-completeness alternative — it would be a no-op (the lockfile already resolves to 7.2.3 via jest's pin) and adds reader load without security benefit.
- **Remediation horizon:** Remediated when jest upgrade lands, which requires CRA upgrade or eject; re-evaluate 2026-Q4.
- **Compensating controls:** Project's npm scripts never invoke the glob CLI binary directly; only programmatic API used by jest/workbox/rimraf is reached. CI runs in ephemeral containers.

### #88 — `webpack-dev-server` source theft v1 (MEDIUM)

- **Severity:** MEDIUM
- **Vulnerability summary:** Non-Chromium-based browser cross-origin leak permits source-code theft when a malicious site is opened while the dev server runs.
- **CRA-transitive chain (verified):** `react-scripts@5.0.1 → webpack-dev-server@4.15.2` (direct); ALSO `react-scripts → @pmmmwh/react-refresh-webpack-plugin → webpack-dev-server@4.15.2` (deduped).
- **Blast radius:** Dev-only. Production builds invoke `react-scripts build` (lines 17–20 of package.json: `build:prod`, `build:gh-pages`, `build:custom`, `build:deep`) which excludes webpack-dev-server entirely; the dev server is reachable only via `react-scripts start`. Risk is bounded to developer machines on non-Chromium browsers.
- **Why no override is reachable:** CRA 5 pins `webpack-dev-server@^4`; v5 has breaking changes in middleware API, static-serving options, and HTTPS configuration. Override to v5 is high-break-risk and would require CRA-internal patches beyond this wave's scope.
- **Remediation horizon:** CRA upgrade or Vite migration; re-evaluate 2026-Q4.
- **Compensating controls:** Production builds invoke `react-scripts build` which excludes the dev server entirely; risk is bounded to developer machines on non-Chromium browsers. No shared dev server, no preview deploys exposing webpack-dev-server publicly.

### #89 — `webpack-dev-server` source theft v2 (MEDIUM)

- **Severity:** MEDIUM
- **Vulnerability summary:** Companion advisory to #88 covering a second source-leak vector through dev-server middleware on non-Chromium browsers.
- **CRA-transitive chain:** Same as #88 (same package, same pin).
- **Blast radius:** Dev-only (same as #88).
- **Why no override is reachable:** Same v4 → v5 break risk as #88.
- **Remediation horizon:** CRA upgrade or Vite migration; re-evaluate 2026-Q4.
- **Compensating controls:** Same as #88.

## Consequences

**Positive.** Wave 2 closes 5 of 11 alerts (#84, #85, #86, #90, #91). Remaining six are documented and traceable to a specific dep-tree constraint with a re-evaluation date. Dependabot dashboard pressure reduced ~45%. Future maintainers reading the security tab have a single ADR to consult instead of repeating Solomon's Idea-stage dep-tree investigation.

**Negative.** Six advisories remain "open" on the Dependabot tab until CRA upgrade or Vite migration lands. Future maintainers must read this ADR before responding to alerts on these packages — silent "just override it" instincts would break the build.

**Mitigation.** Each accepted alert receives a closure-style comment (NOT a GitHub issue close) citing this ADR path and the remediation horizon. Per-issue copy is enumerated in the PRD under FR-ISS-01.

## Revisit Trigger

Binary. **When a CRA upgrade is planned, this ADR MUST be re-reviewed** — each accepted alert's "Why no override is reachable" clause is invalidated by a jest/webpack/Babel major bump. **If Vite migration is planned, this ADR is superseded** — the entire CRA-transitive surface dissolves.

## References

- Wave 2 idea brief — `/var/home/meconnelly/Documents/GitHub/OpenDoorPH-website/.delivery/artifacts/01-idea/po/idea-brief.md`
- Wave 2 PRD — `/var/home/meconnelly/Documents/GitHub/OpenDoorPH-website/.delivery/artifacts/02-refine/po/prd.md`
- Idea-stage Architect review (dep-tree witness table) — `/var/home/meconnelly/Documents/GitHub/OpenDoorPH-website/.delivery/artifacts/01-idea/dod/architect-review.md`
- Companion architecture (the 5 reachable overrides) — `../solution/architecture.md`
- Dependabot advisories — GitHub Security tab, alerts #81, #82, #83, #87, #88, #89
- Precedent override pattern — PR #74 (`tmp@^0.2.4`), merged 2026-05-13

---
> *"There is a time for monoliths and a time for microservices — and a time to leave the CRA-transitive stone unturned until the season turns."* Six stones marked. The wise foot steps over.
