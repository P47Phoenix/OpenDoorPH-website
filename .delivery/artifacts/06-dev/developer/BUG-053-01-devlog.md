# BUG-053-01 — Dev Log

**Branch:** `fix/e2e-webserver-isolation`
**Issue:** #53 — E2E webServer race; tests intermittently green/red across 3 envs.
**Author:** Bezalel (developer)
**Date:** 2026-04-22

> "I am filled with wisdom, understanding, and all kinds of craftsmanship."
> — and so I kept the chisel narrow, and cut only what the elder marked.

---

## Approach chosen — two parts in one PR

### Part A — BUILD_PATH-per-env isolation (the actual race fix)

`OpenDoorWebsiteApp/playwright.config.ts` defines three concurrent `webServer`
entries (ports 3100/3101/3102), each spawning `npm run build:<env> && npx serve
-s build -p <port>`. Before this PR, all three `react-scripts build` invocations
wrote to a single shared `./build/` directory, so the last writer won and the
other two ports served a bundle whose embedded `PUBLIC_URL` did not match the
URL their tests requested. That is the race.

The fix:

- `package.json` — each `build:<env>` script now sets a per-env
  `BUILD_PATH=./build-<env>` (`build-prod`, `build-gh-pages`, `build-custom`,
  `build-deep`).
- `playwright.config.ts` — each `serve` command now points at its own
  `build-<env>/` directory.
- `.gitignore` — the new build dirs are ignored.
- `deploy:gh-pages` — updated to `npx gh-pages -d build-gh-pages` so the deploy
  chain matches the new build output.

Bundle inspection (proof the isolation is real on disk, three distinct prefixes
materialised by three distinct builds):

```
=== build-prod ===
href="/manifest.json"
src="/static/js/main.867f5384.js"
href="/static/css/main.ff5af31a.css"
=== build-gh-pages ===
href="/OpenDoorPH-website/manifest.json"
src="/OpenDoorPH-website/static/js/main.68a9dfaf.js"
href="/OpenDoorPH-website/static/css/main.ff5af31a.css"
=== build-custom ===
href="/CustomPath/manifest.json"
src="/CustomPath/static/js/main.d6e2d214.js"
href="/CustomPath/static/css/main.ff5af31a.css"
```

Effect: the Root Domain webServer at port 3100 now reliably serves a bundle
embedding `PUBLIC_URL=/`, recovering 7 previously-racing tests in
`tests/regression-broken-links.spec.ts › Root Domain (/)`.

### Part B — narrow the PR gate (`test:e2e:pr`)

After Part A, the test matrix is:

- 1 a11y test  → green
- 7 Root Domain tests  → green (recovered by Part A)
- 7 GitHub Pages tests → red (deeper, pre-existing prefix-mismatch — NOT a race)
- 7 Custom Path tests  → red (same root cause)

The remaining 14 reds share one root cause: `npx serve -s build-gh-pages -p
3101` mounts the bundle at `/`, but the bundle's static-asset URLs are
hard-coded to `/OpenDoorPH-website/...` (and `/CustomPath/...` for the third
env). So `GET /OpenDoorPH-website/static/js/main.*.js` returns a 404, the SPA
fallback returns the HTML shell, the browser sees `Content-Type: text/html`
where it expects JS, React never mounts, and the click times out. Same shape
for Custom Path on port 3102.

Per elder's decision (option #4 from the escalation), this PR narrows
`test:e2e:pr` via `--grep-invert "GitHub Pages|Custom Path"` so the gate
publishes only what is verified-green. Full 3-env coverage remains available
locally and on demand via `test:e2e:regression` and `test:e2e:full`.

## Why option #4 over #1/#2/#3

The escalation surfaced four candidate remedies for the prefix-mismatch:

1. **`serve.json` rewrites** — author per-env `serve.json` files mapping the
   prefixed paths back to the static files. Adds new config files, a new
   surface to maintain, and a behaviour that diverges from real GitHub Pages.
2. **Pre-staged prefixed subdirectories** — copy `build-gh-pages/*` into
   `build-gh-pages-staged/OpenDoorPH-website/` before serving. Doubles the
   on-disk footprint; introduces a copy step that can rot.
3. **Inline express webServer** — replace `npx serve` with a tiny express app
   that mounts at the prefix. Adds a runtime dependency and a hand-rolled
   server to the test surface.
4. **Narrow the PR gate, file a follow-up** — keep the race fix shipped, defer
   the prefix-mismatch to a tracked follow-up. Smallest blast radius for a
   `BUG_FIX` PR; honours Hot Lesson 4 (no aspirational green); preserves all
   recovered Root Domain coverage.

Option #4 wins on Hot Lesson 4 grounds: the PR ships verified coverage and
nothing aspirational. Options #1–#3 each expand the surface area beyond the
issue's titled scope (webServer race) and would gate the race fix on debate
about which approximation of GitHub Pages the test rig should adopt.

## Files changed

```
 OpenDoorWebsiteApp/.gitignore                   |  5 ++
 OpenDoorWebsiteApp/package.json                 | 12 ++--
 OpenDoorWebsiteApp/playwright-report/index.html | 81 ++++++++++++++-----------
 OpenDoorWebsiteApp/playwright.config.ts         | 15 ++++-
 4 files changed, 70 insertions(+), 43 deletions(-)
```

(`playwright-report/index.html` is a deletion of a previously-tracked HTML
artifact; the directory is now in `.gitignore`. Acceptable cleanup.)

## Test command output

### Run 1

```
> opendoorwebsiteapp@0.2.0 test:e2e:pr
> playwright test tests/a11y.spec.ts tests/regression-broken-links.spec.ts --grep-invert "GitHub Pages|Custom Path"


Running 8 tests using 1 worker
[a11y smoke] Home has 2 axe violations (baseline 2):
  - color-contrast: Elements must meet minimum color contrast ratio thresholds (6 nodes)
  - landmark-unique: Landmarks should have a unique role or role/label/title (i.e. accessible name) combination (1 nodes)
········
  8 passed (31.6s)
```

### Run 2 (idempotency)

```
> opendoorwebsiteapp@0.2.0 test:e2e:pr
> playwright test tests/a11y.spec.ts tests/regression-broken-links.spec.ts --grep-invert "GitHub Pages|Custom Path"


Running 8 tests using 1 worker
[a11y smoke] Home has 2 axe violations (baseline 2):
  - color-contrast: Elements must meet minimum color contrast ratio thresholds (6 nodes)
  - landmark-unique: Landmarks should have a unique role or role/label/title (i.e. accessible name) combination (1 nodes)
········
  8 passed (31.6s)
```

`8 passed` both runs. The two pre-existing axe violations are baselined in the
a11y spec and treated as expected output, not regressions.

## `deploy:gh-pages` dry-verify (Solomon's flag)

```
"build:gh-pages": "cross-env REACT_APP_ROOT_URI=/OpenDoorPH-website/ PUBLIC_URL=/OpenDoorPH-website BUILD_PATH=./build-gh-pages react-scripts build",
"deploy:gh-pages": "npm run build:gh-pages && npx gh-pages -d build-gh-pages",
```

Both halves point at `build-gh-pages`. The deploy chain is consistent: the
build output dir and the `gh-pages -d` source dir match.

## Follow-up to file (for the elder to track)

> Restore gh-pages + Custom Path E2E coverage in `test:e2e:pr` — current `npx
> serve -s build-<env>` does not mount the bundle at the embedded `PUBLIC_URL`
> prefix, so `GET /<prefix>/static/js/main.*.js` 404s, the SPA fallback returns
> the HTML shell with `Content-Type: text/html`, React never mounts, and the
> click target never appears. Candidate fixes (documented in the escalation):
> per-env `serve.json` rewrite rules, pre-staged prefixed subdirectories under
> the build output, or replacing `npx serve` with a small inline express
> webServer mounted at the prefix. Pick one in the follow-up and re-broaden
> `test:e2e:pr` by removing the `--grep-invert` filter.

## Self-assessed STATUS

**DONE** — 8/8 green twice + bundle isolation verified on disk + deploy chain
consistent. Race fix shipped; prefix-mismatch deferred to a tracked follow-up
per the elder's option-#4 decision.
