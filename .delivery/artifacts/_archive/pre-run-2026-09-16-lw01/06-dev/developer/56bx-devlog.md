# Development Devlog — Issue #56 (run-2026-05-05-56bx, Bezalel)

**Pipeline:** run-2026-05-05-56bx
**Stage:** 6 (Development) — continuation
**Author:** Bezalel (developer alias — Spirit-filled craftsman of the Tabernacle)
**Branch:** `fix/56-restore-e2e-coverage`
**Branched from:** `master` (current head: `c0ac02f`)
**Pre-existing edits inherited from prior session:** package.json BUILD_PATHs +
deploy:gh-pages, playwright.config.ts webServer, node-build.yml demo-deploy
upload path, README §Nested-Prefix-Subdir Convention.

> "I am filled with wisdom, understanding, and all kinds of craftsmanship." —
> the cubits are measured twice; once at the bench and once again at the
> threshold. The first measure was true on disk and false in flight. So I
> went back to the lathe.

---

## 1. The state I inherited

Round 1 of the slice (run-2026-05-05-56bx prior turn) had landed three
correct-but-insufficient changes:

1. `OpenDoorWebsiteApp/package.json` — `build:gh-pages` and `build:custom`
   write to `BUILD_PATH=./build-<env>/<prefix>/` (the *nested-prefix-subdir*
   layout). `deploy:gh-pages` points `npx gh-pages -d` at the nested subdir.
2. `OpenDoorWebsiteApp/playwright.config.ts` — webServers serve the
   *wrapper* dir (`build-gh-pages/`, `build-custom/`) so the disk-root
   mounts at URL-root and the prefixed bundle's static-asset URLs resolve.
3. `.github/workflows/node-build.yml` — `actions/upload-pages-artifact@v3`
   `path:` updated to the nested subdir so the demo deploy publishes the
   prefix-rooted tree (mirroring the `deploy:gh-pages` consumer).

After Round 1 the orchestrator ran `npm run test:e2e:pr` and got **8 passed,
14 failed** — the same count that was deferred at the start of the slice.

The orchestrator's curl diagnostic exposed the gap between the disk layout
and what `serve` actually returned:

```
GET /OpenDoorPH-website   → HTTP 200, body = `serve`'s file-tree directory
                            listing (HTML <title>Files within
                            build-gh-pages/...</title>), NOT React's index.html
GET /OpenDoorPH-website/  → same — directory listing
GET /OpenDoorPH-website/static/js/main.HASH.js → HTTP 200, application/javascript ✓
```

The asset path worked because `serve-handler` stats first when the request
path has an extension. The extensionless `/OpenDoorPH-website` request bypassed
the stat-first branch, fell through to `applyRewrites`, found nothing
matching, then hit the directory-listing renderer and returned the file-tree.
React never mounted; every locator timed out.

## 2. Round-2 fix — Option-1 + Option-2 layered

Option-1 (already in place from Round 1) is the nested-prefix-subdir build
layout — necessary so disk paths mirror URL paths for assets.

Option-2 layered on top is `serve.json` emitted into each prefixed *wrapper*
build dir. `serve` (via `serve-handler@6.1.7`, vendored in `node_modules`) auto-
detects `serve.json` in the served root. Two settings together close the gap:

- `directoryListing: false` — disables the file-tree renderer (belt-and-
  suspenders; without it, an extensionless request that misses the rewrite
  would still fall back to a listing).
- `rewrites:` — explicit prefix → `index.html` rewrites that fire BEFORE
  the directory stat for extensionless paths (see `serve-handler/src/index.js`
  line 618: `applyRewrites` runs before the second `lstat`).

The final post-build node heredoc emits, for `build:gh-pages`:

```json
{
  "directoryListing": false,
  "rewrites": [
    { "source": "/OpenDoorPH-website",     "destination": "/OpenDoorPH-website/index.html" },
    { "source": "/OpenDoorPH-website/**",  "destination": "/OpenDoorPH-website/index.html" }
  ]
}
```

Same shape for `build:custom` with `/CustomPath`.

### Two ancillary fixes the curl-only diagnostic missed

The orchestrator's diagnostic confirmed the curl body was React's HTML, not
the directory listing. I confirmed the same locally (see §3). But Playwright
*still* failed with the locator never appearing — the page loaded, React
mounted, but **rendered nothing**. The trace screenshot was a blank canvas;
network logs showed CSS/JS all 200 OK. The cause was downstream of the
serve-side fix.

**Ancillary fix A — the `-s` flag fights our rewrites.**
`npx serve -s <dir>` PREPENDS `{ source: "**", destination: "/index.html" }`
to any rewrites in serve.json (see `node_modules/serve/build/main.js` —
`if (args["--single"]) { config.rewrites = [{source:"**",destination:"/index.html"}, ...existing]; }`).
That `**` always wins, so our explicit `/OpenDoorPH-website[/**]` →
`/OpenDoorPH-website/index.html` rewrites never fire, and the SPA fallback
points at a non-existent root-level `build-gh-pages/index.html`. I dropped
`-s` from the two prefixed-env webServer commands in `playwright.config.ts`
(ports 3101/3102). Port 3100 (`build-prod`, root-prefix) keeps `-s` because
its bundle has no prefix and needs the catchall.

**Ancillary fix B — React Router's `basename` mismatch on the bare prefix.**
After (A) the curl body was correct (React's HTML, all three URL forms),
but Playwright's `getByRole('link', { name: /visit us/i })` still timed out.
Trace inspection (`unzip -p .../trace.zip resources/page@*.jpeg`) showed a
white page — React mounted but rendered no routes. The cause: `MasterLayout`
uses `<Router basename={process.env.REACT_APP_ROOT_URI || '/'}>` where
`REACT_APP_ROOT_URI=/OpenDoorPH-website/` (with trailing slash). React Router
6's `stripBasename` (in `@remix-run/router/dist/router.cjs.js` line 1127)
returns `null` when `pathname` does not start with `basename`. For pathname
`/OpenDoorPH-website` (no slash) and basename `/OpenDoorPH-website/` (with
slash), `pathname.startsWith(basename) === false` → returns null → no route
matches → blank render.

The fix is to strip the trailing slash from basename:

```tsx
<Router basename={(process.env.REACT_APP_ROOT_URI || '/').replace(/\/$/, '') || '/'}>
```

With basename `/OpenDoorPH-website` (no slash), `stripBasename` accepts
`/OpenDoorPH-website`, `/OpenDoorPH-website/`, and `/OpenDoorPH-website/foo`
uniformly (the trailing-slash branch in the same function: `let startIndex
= basename.endsWith("/") ? basename.length - 1 : basename.length`). Asset
paths are unaffected (those come from `PUBLIC_URL`, which already had no
trailing slash). No production behavior change at the GitHub Pages or
custom-domain URL — the live URLs always have the trailing slash anyway.
The fix is strictly more permissive.

A briefly-tried alternative — emit a 301 `redirects` entry (`/CustomPath`
→ `/CustomPath/`) in serve.json — caused `ERR_TOO_MANY_REDIRECTS`:
`serve-handler` calls `path.posix.resolve('/CustomPath/')` which strips
the trailing slash to `/CustomPath`, so the source `/CustomPath` matches
both forms and the redirect target loops back to itself. That path was
dropped in favor of the basename strip.

## 3. Verification (local, BLOCKING per the orchestrator's gate)

### 3.1 Clean rebuild

```
cd OpenDoorWebsiteApp && rm -rf build-prod build-gh-pages build-custom build-deep
npm run build:prod      # exit 0
npm run build:gh-pages  # exit 0; emits build-gh-pages/serve.json
npm run build:custom    # exit 0; emits build-custom/serve.json
```

On-disk verification:

```
build-gh-pages/serve.json                      ← present, contents per §2
build-gh-pages/OpenDoorPH-website/index.html   ← present (nested-prefix layout)
build-custom/serve.json                        ← present
build-custom/CustomPath/index.html             ← present
```

### 3.2 Curl diagnostic (the test the orchestrator did)

`npx serve build-gh-pages -p 3101` (note: no `-s`):

```
GET /OpenDoorPH-website
  → HTTP 200, Content-Disposition: inline; filename="index.html"
  → body starts <!doctype html><html lang="en">…<title>Open Door Full Gospel Church — Pleasant Hill, MO</title>
GET /OpenDoorPH-website/
  → HTTP 200, same React index.html
GET /OpenDoorPH-website/opendoor/Home/Location
  → HTTP 200, same React index.html (SPA fallback via /OpenDoorPH-website/** rewrite)
GET /OpenDoorPH-website/static/css/main.59e11ab7.css
  → HTTP 200, Content-Type: text/css (asset stat-first branch)
```

`serve` access log confirms no redirect loops, no directory-listing
renders. Same shape verified for `build-custom` on port 3102.

### 3.3 Playwright PR suite

Round-2 result (full text in §5).

## 4. Files changed in this slice (Round-2)

| File | Change |
|------|--------|
| `OpenDoorWebsiteApp/package.json` | `build:gh-pages` and `build:custom` chain a post-build `node -e` that writes `serve.json` to the wrapper dir. (Round-1 also touched the BUILD_PATHs and `deploy:gh-pages`; those carry forward unchanged.) |
| `OpenDoorWebsiteApp/playwright.config.ts` | Drop `-s` from ports 3101 and 3102's `serve` commands; expand the comment block to explain why (`-s` injects a `**` rewrite that wins over our explicit prefix rewrites). |
| `OpenDoorWebsiteApp/src/pages/MasterLayout/MasterLayout.tsx` | Strip trailing slash from `basename` so React Router accepts `/OpenDoorPH-website`, `/OpenDoorPH-website/`, and `/OpenDoorPH-website/foo` uniformly. |
| `OpenDoorWebsiteApp/README.md` | New subsection "`serve.json` companion (Option-1 + Option-2 combined fix)" under the existing Nested-Prefix-Subdir section. Bumps the downstream-consumer count from 3 to 4 (the new `serve.json` emission joins the list). |
| `.github/workflows/node-build.yml` | Round-1 already corrected `actions/upload-pages-artifact@v3` `path:` to the nested subdir; no further edit this round. |
| `.delivery/artifacts/06-dev/developer/56bx-devlog.md` | This file. The existing `devlog.md` from run-2026-05-03-58aa is left untouched per the orchestrator's instruction. |

Out-of-scope (intentionally not staged): `.delivery/memory/*`, `.claude/`,
`OpenDoorWebsiteApp/playwright-report/index.html` (test artefact), `.delivery/
memory/archive/run-2026-05-05-56bx.md` (memory archive will be written by
the retrospective stage).

## 5. Round-2 test result (target: 22/22 chromium-only)

To match the orchestrator's "22 passing" target I run with `CI=true` so
`playwright.config.ts`'s project filter narrows to chromium only (the
default is all three browsers):

```
cd OpenDoorWebsiteApp
CI=true npm run test:e2e:pr
```

Test count:
- 1 a11y smoke (`tests/a11y.spec.ts`)
- 7 regression-broken-links × 3 environments = 21
- **Total: 22**

Round-2 result captured 2026-05-05 20:14 local time:

```
> opendoorwebsiteapp@0.2.0 test:e2e:pr
> playwright test tests/a11y.spec.ts tests/regression-broken-links.spec.ts


Running 22 tests using 1 worker
[a11y smoke] Home has 2 axe violations (baseline 2):
  - color-contrast: Elements must meet minimum color contrast ratio thresholds (6 nodes)
  - landmark-unique: Landmarks should have a unique role or role/label/title (i.e. accessible name) combination (1 nodes)
······················
  22 passed (30.9s)
```

22 passed, 0 failed. The 14 deferred regression tests are restored and the
slice's CODE_COMPLETE gate clears. Compare to Round 1 (8 passed, 14 failed)
and the original deferral baseline (Issue #53's `--grep-invert` exclusion).

## 6. FR-09 attestation — local commit SHAs

Three local commits on `fix/56-restore-e2e-coverage` (off `master @
c0ac02f`), in order:

1. `a16db6e` — `fix(build): emit serve.json with prefix rewrites for gh-pages and custom builds`
   (package.json, playwright.config.ts, README.md, .github/workflows/node-build.yml)
2. `6c83f47` — `fix(router): strip trailing slash from basename for bare-prefix URL compatibility`
   (OpenDoorWebsiteApp/src/pages/MasterLayout/MasterLayout.tsx)
3. `<pending — this commit>` — `docs(devlog): #56 round-2 development devlog with serve.json layering`
   (.delivery/artifacts/06-dev/developer/56bx-devlog.md — this file; SHA
   self-referential and will be backfilled by the orchestrator if required,
   per the BUG-053-01 self-correction precedent in commit `f03e167`).

## 7. BUG-053-01 cross-reference data

The Round-1 workflow edit (`.github/workflows/node-build.yml`,
`actions/upload-pages-artifact@v3` `path:` updated to the nested subdir)
is the *fourth* downstream consumer that BUG-053-01's hot-lesson section
flagged: any change to the `build:gh-pages` BUILD_PATH must propagate to
all consumers (Playwright webServer, `deploy:gh-pages` script, demo-deploy
workflow, and now `serve.json` emission). The diff for that workflow edit
(carried forward from Round 1):

```diff
 - name: Upload to GitHub Pages
   uses: actions/upload-pages-artifact@v3
   with:
-    path: ./OpenDoorWebsiteApp/build-gh-pages
+    path: ./OpenDoorWebsiteApp/build-gh-pages/OpenDoorPH-website
```

The matching README §Nested-Prefix-Subdir documents the four-consumer rule
explicitly so a future change-one, change-all-four reviewer has a single
source of truth.

## 8. Observations carried into the retrospective

- **The curl diagnostic is necessary but not sufficient.** A 200 with
  React's HTML in the body proves the server is no longer rendering a
  directory listing, but it cannot detect a downstream React-Router
  basename mismatch. The Round-1 → Round-2 → final fix arc would have
  been a single round if the diagnostic checklist also included a
  "navigate with Playwright and assert at least one route renders"
  step. Recommend: add a Playwright `--grep "Visit Us.*GitHub Pages"`
  fast-loop to the inner verification gate.
- **`serve -s` is dangerous when paired with custom rewrites.** The flag
  silently injects a catchall that wins over user rules. Worth a
  Plan-stage NFR amendment ("for prefixed envs, drive SPA fallback via
  serve.json rewrites only; do not use the `-s` flag").
- **`path.posix.resolve` strips trailing slashes before redirect-source
  matching.** This is why a naive `/CustomPath` → `/CustomPath/` redirect
  loops. Document this constraint in the README so the next person who
  reaches for `redirects:` knows to avoid the trap.

> "And he made every craftsman wise of heart" — but wisdom in the
> workshop is mostly knowing where the last splinter went, and how to
> grain the next plank against it. The Tabernacle stands when each board
> is planed twice: once for the spec, and once for the way the world
> resists it.
