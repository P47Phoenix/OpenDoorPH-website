# Dev log — run-2026-09-16-lw01

Branch `feature/living-word-restyle` · base `origin/master` 4cfbe3b · developer Bezalel

## Pre-flight

Run 2026-09-17, repo root unless stated. All GNU-tool sentinels under `bash --noprofile --norc`, `LC_ALL=C.UTF-8`.

| Step | Command | Exit | Key output |
|---|---|---|---|
| P-1 | `git fetch origin` | 0 | — |
| P-1 | `git rev-parse --short origin/master` | 0 | `4cfbe3b` |
| P-1 | `git rev-parse --abbrev-ref HEAD` | 0 | `feature/living-word-restyle` |
| P-1 | `git log --oneline origin/master..HEAD \| wc -l` | 0 | `1` — **deviation from the expected 0**: `f92203b chore(delivery): archive pre-lw01 devlogs…` is the P-2 bookkeeping commit, already made before this run. Accepted; no app files in it. |
| P-1 | `git diff origin/master --stat -- .github/ Terraform/` | 0 | empty |
| P-2 | `git checkout -- OpenDoorWebsiteApp/playwright-report/index.html` | 0 | — |
| P-2 | `git status --porcelain OpenDoorWebsiteApp` | 0 | empty |
| P-2 | devlog created + `git add -f`; `git ls-files … \| grep -q . && echo tracked` | 0 | `tracked` (first commit carrying it is LW-1's, since the chore(delivery) commit pre-existed — deviation, recorded) |
| P-3 | `type grep; type find; grep --version; find --version` | 0 | `/usr/bin/grep`, `/usr/bin/find`, GNU grep 3.12, GNU findutils 4.10.0 |
| P-3 | three self-tests | 0/0/1 | `2`, `1`, `0` (expected) |
| P-4 | `locale -a \| grep -i C.utf`; `grep -cP '\p{L}' <<< 'é'` | 0 | `C.utf8`; `1` |
| P-5 | `npx playwright --version` | 0 | `Version 1.59.1` |
| P-5 | install locations | 0 | chromium-1217, chromium_headless_shell-1217, firefox-1511, webkit-2272, ffmpeg-1011 |
| P-5 | launch probe | 0 | `chromium 147.0.7727.15`, `firefox 148.0.2`, **webkit `browserType.launch` fails** (missing host libs, immutable OS — ruling item 3; out of scope locally) |
| P-6 | `magick -version` | 0 | ImageMagick 7.1.2-27 |
| P-6 | `npx lighthouse --version` | 0 | `12.6.1` |
| P-6 | `ls $HOME/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome` | 0 | exists (CHROME_PATH pin) |
| P-6 | `which jq gzip file`; `ls node_modules/.bin/serve` | 0 | all present |
| P-7 | `npm ci --dry-run` | 0 | lockfile in sync |
| P-7 | `npm ls --depth=0 \| grep -ciE 'invalid\|missing\|extraneous'` | — | `0` |
| P-7 | `git diff --quiet origin/master -- package-lock.json` | 0 | no dependency delta |
| P-8 | nine `git ls-files` pathspecs | 0 | nine `ok`; negative control from app dir printed nothing |
| P-9 | `export CI=true; npm run lint -- --max-warnings=0` | 0 | zero warnings |
| P-9 | `npm run lint && npm run type-check && npm run test:unit && npm run build:prod && npm run test:e2e:pr` | 0/0/0/0/0 | unit: 9 suites, 114 tests; build `Compiled successfully.`; e2e:pr 22 passed (chromium) |
| P-9 | `npx playwright test tests/multi-environment-navigation.spec.ts --project=chromium -g "direct URL"` | 1 | **known pre-existing red**: 3 failed, `strict mode violation: getByRole('heading', { name: /galatians 6:1/i }) resolved to 2 elements` (sequencing Section 5.4). Attributed before any story edit. |
| P-10 | `gzip -c build-prod/static/css/main.*.css \| wc -c` | 0 | `5962` (ceiling 16202) |
| P-10 | `gzip -c build-prod/static/js/main.*.js \| wc -c` | 0 | `75228` (ceiling 80348) |
| P-10 | `npx playwright test tests/a11y.spec.ts --project=chromium` | 0 | `Home has 2 axe violations (baseline 2)` |
| P-10 | Lighthouse x3, `:3200`, `SERVE_PID` killed, port released | 0/0/0 | perf 0.99 / a11y 0.96 / LCP 1961 · 1957 · 1956 ms (median **1957**) / CLS 0 / FCP ~754 ms / TBT 0 / SI ~754 ms |

Verdict: P-1..P-10 green (one recorded deviation on P-1/P-2 commit count). LW-1 starts.

## LW-1 — Additive tokens, fonts, head links

**Files touched (all in `OpenDoorWebsiteApp/`, exactly the story `Files:` list):**
- `tailwind.config.js` — added 7 flat colour keys (`parchment/ink/sage/sage-dark/brick/brick-dark/rule`) beside the untouched `church.*` block; `fontFamily.serif` → `['Lora', 'Georgia', 'Times New Roman', 'serif']` (sans unchanged, already Inter); added `transitionDuration.DEFAULT: '150ms'`. No `darkMode` key. `spacing['820']` left in place (goes with WelcomeBanner, later story).
- `src/index.css` — body now `@layer base { body { @apply m-0 p-0 bg-parchment text-ink font-sans antialiased; } }` (bare `font-family: sans-serif` gone); added the `@media (prefers-reduced-motion: reduce)` block (component-specs 1.3, verbatim).
- `src/App.css` — token classes only on the three layout rules: `.church-header` → `bg-parchment border-b border-rule`; `.church-main` → `flex-1 bg-parchment`; `.church-footer` → `bg-stone-800 text-stone-300`. Nothing removed (dead CSS is LW-2).
- `public/index.html` — three `<link>`s (2 preconnect + Google Fonts css2 with `display=swap`) inserted after `<meta name="author">`, before the `og:` block. Diff is 3 added lines, 0 removed; JSON-LD byte-identical. `<meta name="theme-color">` not added (optional under AC-38; not in the story file list).
- `public/manifest.json` — `theme_color` `#000000` → `#F5F0E6`.

No component, test, workflow, or Terraform file touched.

**Battery** (`OpenDoorWebsiteApp/`, `export CI=true`):

| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` (pre-check) | 0 | zero warnings |
| `npm run lint` | 0 | — |
| `npm run type-check` | 0 | — |
| `npm run test:unit` | 0 | 9 suites, 114 tests passed, 0 skipped |
| `npm run build:prod` | 0 | `Compiled successfully.` |
| `npm run test:e2e:pr` | 0 | 22 passed (chromium); `Home has 2 axe violations (baseline 2)` |

Post-build gzip sizes: css `6087` (was 5962; ceiling 16202), js `75228` (unchanged; ceiling 80348).

**Story sentinels / TCs** (cwd `OpenDoorWebsiteApp/` unless `root`; fences copied verbatim from stories.md):

| TC | Command | Exit | Output | Result |
|---|---|---|---|---|
| 1.1 | `grep -n "Lora" tailwind.config.js` | 0 | `26: 'serif': ['Lora', 'Georgia', 'Times New Roman', 'serif'],` | pass |
| 1.1 | `grep -c "'Inter'" tailwind.config.js` | 0 | `1` | pass |
| 1.2 | `! grep -n "font-family: sans-serif" src/index.css` | 0 | — | pass |
| 1.2 [1] | `cat src/index.css src/App.css \| grep -c 'text-ink'` | 0 | `1` | pass (>= 1) |
| 1.3 | `grep -cE 'bg-parchment' src/index.css`; `grep -cE 'font-sans' src/index.css`; `! grep -nE 'text-sage' src/index.css` | 0/0/0 | `1`, `1`, — | pass |
| 1.4 | css2 / display=swap / preconnect googleapis / preconnect gstatic crossorigin / full byte-exact URL counts | 0 | `1`,`1`,`1`,`1`,`1` | pass |
| 1.5 [1] | JSON-LD `diff <(git show origin/master:…) <(sed …)` | 0 | empty | pass |
| 1.6 | `npm run test:unit -- jsonLd`; root `git diff --quiet origin/master -- OpenDoorWebsiteApp/src/__tests__/jsonLd.test.ts` | 0/0 | 1 suite, 10 tests | pass |
| 1.7 [1] | `! LC_ALL=C.UTF-8 grep -rnP '\bdark:[a-z]\|prefers-color-scheme\|color-scheme' src public tailwind.config.js` (pipe unescaped when run) | 0 | — | pass |
| 1.7 | `! grep -n 'darkMode' tailwind.config.js` | 0 | — | pass |
| 1.8 | `grep -c '"theme_color": "#F5F0E6"' public/manifest.json`; `grep -c 'name="theme-color"' public/index.html` | 0/1 | `1`, `0` | pass (0 allowed) |
| 1.9 | `prefers-reduced-motion` / `transition-duration: 0.01ms !important` / `animation: none !important` counts in `src/index.css` | 0 | `1`,`1`,`1` | pass |
| 1.10 [1] | seven-hex `grep -oiE … \| sort -u \| wc -l` | 0 | `7` | pass |
| 1.10 | `grep -c "'sage-dark'"`; `grep -c "'brick-dark'"` | 0 | `1`, `1` | pass |
| 1.11 | `grep -cE '^\s*church\s*:' tailwind.config.js` | 0 | `1` | pass (church.* kept) |
| 1.12 [1] | `grep -cE 'church-(header\|main\|footer)' src/App.css` | 0 | `4` | pass (>= 3) |
| 1.12 [2] | `awk '/\.church-(header\|main\|footer)/,/}/' src/App.css \| grep -nE '#[0-9A-Fa-f]{3,6}\|green-\|orange-\|church-(green\|dark\|light\|stone\|brick)'` | 1 | empty | pass |
| 1.13 | battery (above); `grep -c 'HOME_AXE_VIOLATIONS_BASELINE = 2' tests/a11y.spec.ts` | 0 | `1` | pass |
| 1.14 | root: `git ls-files OpenDoorWebsiteApp/src/__tests__/SideBar.test.tsx \| grep -q .`; `git diff --quiet origin/master -- …SideBar.test.tsx` | 0/0 | — | pass (DoD 3) |
| 1.15 [1] | root: porcelain + `git diff --name-only origin/master` over `src/__tests__`, `src/App.test.tsx`, `tests` | 0 | empty | pass (DoD 4, no test file touched) |
| extra | `git diff origin/master -- OpenDoorWebsiteApp/public/index.html \| grep -c '^-'` (excluding header) | — | `0` removed lines | index.html purely additive |

TCs: 15/15 pass. DoD sentinels: 12/12 (all listed under DoD 2 covered by rows above).

**Deviations:** none in scope. Pre-flight P-1 commit count was 1 not 0 (pre-existing chore(delivery) commit); devlog first tracked in this story's commit rather than that chore commit.

**Timing:** pre-flight ~12 min (battery + 3 Lighthouse runs dominate); LW-1 edits + battery + sentinels ~6 min.

## LW-2 — Delete legacy assets and dead CSS

Date: 2026-09-17 · Developer: Bezalel · Base: `lw-1-green` (030e558) · ACs: AC-34, AC-35, AC-36

### Consumer check (before any deletion)
- `git grep -nE 'churchImages|uiImages|assets/images/(church|ui)' -- src` — hits only inside `src/assets/images/{church,ui}/index.ts` and `src/assets/images/index.ts` (the re-exports). Zero consumers.
- `git grep -nE '\.(gif|JPG|PNG)\b' -- src ':!src/assets'` — hits only inside `src/App.css.legacy` (itself deleted).
- `git grep -nE 'App-logo|church-sidebar'` — `App.css`, `App.css.new` (deleted), and `SideBar.tsx:16` (LW-4 edit, untouched here).

### Files touched
- D (25, `git rm`): `src/{bg,clock,comment,headerbg,page,tableft,tabright}.gif`, `src/{BoardMembers,Deacons,Linda,Nursery,PastorAndWife,SundaySchoolTeachers,WendsdayNightTeachers,WorshipTeam}.{JPG,PNG|png}`, `src/App.css.legacy`, `src/App.css.new`
- D (18, `git rm -r`): `src/assets/images/church/**` (index.ts, building/header-photo.jpg, 8 member JPGs), `src/assets/images/ui/**` (index.ts, 7 GIFs)
- M: `src/assets/images/index.ts` — now `export * from './logos';` only
- M: `src/App.css` — header comment "Open Door Full Gospel Church"; removed `.App-logo`, its `prefers-reduced-motion: no-preference` block, `@keyframes App-logo-spin`, `.church-sidebar` (both base and `max-width: 768px` rule). `.church-header`/`.church-main`/`.church-footer` untouched (token classes from LW-1).
- `src/assets/index.ts` unchanged. No test file touched.

### Sentinels (cwd `OpenDoorWebsiteApp/` unless noted; `bash --noprofile --norc`, `LC_ALL=C.UTF-8`)
| TC | Command | Result | Exit |
|---|---|---|---|
| 2.1 | `ls src/*.gif src/*.JPG src/*.PNG src/*.png src/App.css.legacy src/App.css.new 2>/dev/null \| wc -l` | `0` | 0 |
| 2.2 (repo root) | `git ls-files OpenDoorWebsiteApp/src \| grep -cE '\.(gif\|JPG\|PNG\|png)$\|App\.css\.(legacy\|new)$'` | `0` | 1 (grep -c zero-count; expected `0`) |
| 2.3 | `test ! -d src/assets/images/church && test ! -d src/assets/images/ui` | — | 0 |
| 2.4 | `grep -c "export \* from './logos';" src/assets/images/index.ts` · `grep -cE "from '\./(church\|ui)'" src/assets/images/index.ts` · (repo root) `git diff --quiet origin/master -- OpenDoorWebsiteApp/src/assets/index.ts` | `1` · `0` · — | 0 · 1 (zero-count) · 0 |
| 2.5 | `find src -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' \) \| wc -l` · `grep -rnEi "\.(jpg\|jpeg\|png\|gif)['\"\`]" src --include=*.ts --include=*.tsx --exclude-dir=__tests__ \| wc -l` | `0` · `0` | 0 · 0 |
| 2.6 | `! grep -nE 'App-logo\|church-sidebar\|Baptist' src/App.css` · `grep -c 'Open Door Full Gospel Church' src/App.css` | — · `1` | 0 · 0 |
| 2.7 | `! grep -rnE '\b[0-9]+(\.[0-9]+)?s\b' src --include=*.css` · `! grep -rnE '@keyframes' src --include=*.css` | — · — | 0 · 0 |
| 2.8 | `grep -rnE 'churchImages\|uiImages' src --include=*.ts --include=*.tsx \| wc -l` · `grep -rnE 'App-logo\|church-sidebar' src --include=*.tsx --include=*.ts \| grep -v 'SideBar.tsx' \| wc -l` | `0` · `0` | 0 · 0 |
| 2.9 | `npx playwright test tests/external-links-assets.spec.ts` | 24 passed (40.3s) | 0 |
| 2.11 (repo root) | `git diff --quiet origin/master -- OpenDoorWebsiteApp/src/__tests__/SideBar.test.tsx` · `git diff --name-only origin/master -- OpenDoorWebsiteApp/src/__tests__ OpenDoorWebsiteApp/src/App.test.tsx OpenDoorWebsiteApp/tests` | — · (empty) | 0 · 0 |
| DoD guard | `grep -c 'HOME_AXE_VIOLATIONS_BASELINE = 2' tests/a11y.spec.ts` | `1` | 0 |

Sentinels: 11/11 TCs pass (TC-LW-2.10 = battery below).

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` (pre-check) | 0 | clean |
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 9 suites, 114 tests passed |
| `npm run build:prod` | 0 | build ok |
| `npm run test:e2e:pr` | 0 | 22 passed (26.8s) |

### Deviations
None. No test file modified. `.church-sidebar` remains on `SideBar.tsx:16` by design (LW-4).

### Timing
~8 min including battery.

## LW-3 — Global chrome (Header, Footer, ConsentBanner, calendar trigger)

Run 2026-09-17, base `lw-2-green` (a64b50f). `export CI=true`; cwd `OpenDoorWebsiteApp/` unless noted; sentinels under `bash --noprofile --norc`, `LC_ALL=C.UTF-8`.

### Files touched
- M `src/components/layout/Header/Header.tsx` — one-row masthead per component-specs 2.1: `header relative`, `church-container flex ... min-h-16 md:min-h-[72px]`; `h1` Option A wordmark (short `Open Door` single text node `md:hidden aria-hidden`, full wordmark `sr-only md:not-sr-only` with one `>Door<` (`text-brick`) and one `>Gospel<` (`text-sage`)); `<nav aria-label="Primary">`; hamburger `aria-controls="mobile-menu"`, `Menu` span removed; `#mobile-menu absolute inset-x-0 top-full z-40 bg-parchment border-b border-rule ... duration-150 motion-reduce:transition-none` toggling `'visible'`/`'invisible'`; ASCII labels; gradient, `shadow-lg`, verse block removed. Link class strings hoisted to `DESKTOP_LINK`/`MOBILE_LINK` constants (identical per link). `trackNavClick` call-set byte-identical.
- M `src/components/layout/Footer/Footer.tsx` — `text-stone-300`; `h3`s `font-serif ... text-white`; verse block `<blockquote className="font-serif text-stone-300 text-sm bg-stone-700 ... border-l-4 border-stone-300">` with `text-white` cite; `<nav aria-label="Footer">`; links `duration-150 motion-reduce:transition-none focus:ring-white focus:ring-offset-stone-800 hover:text-white`; bullets `bg-stone-300 group-hover:bg-white`; `opacity-90` dropped on two `p`s; `🕐` -> inline clock SVG `aria-hidden="true"` + `{' '}` text node; `🚀` span deleted; credits `text-stone-400`.
- M `src/components/ConsentBanner/ConsentBanner.tsx` — class values only (container `bg-parchment border-t border-rule text-ink`; decline `bg-white text-ink border border-sage ... hover:bg-parchment hover:border-sage-dark active:bg-rule`; accept `bg-sage text-white ... hover:bg-sage-dark active:bg-sage-dark`; `duration-150 motion-reduce:transition-none`).
- M `src/components/AddToCalendarButton/AddToCalendarButton.tsx` — trigger `bg-white/bg-parchment text-brick border border-brick duration-150 ... focus:ring-sage focus:ring-offset-white`; chevron `duration-150`; menu `z-10` -> `z-40`, `border-rule`; menuitem `text-ink hover:bg-parchment focus:bg-rule focus:ring-2 focus:ring-inset focus:ring-sage` (spec 2.11).
- C `src/__tests__/ConsentBanner.test.tsx` — 6 tests (TC-LW-3.15..3.19; 3.19 as `test.each(['granted','denied'])` with `waitFor`). Mock: `jest.requireActual('../utils/analytics')` + `jest.fn()` for `updateConsent`/`track*` — CRA `resetMocks: true` wipes factory implementations per test, so a mocked `getStoredConsent` returned `undefined` and the banner hid; the real reader is kept.
- No existing test file modified.

### Story sentinels (all as fenced in stories.md Rev 1.3)
| TC | Command | Result | Exit |
|---|---|---|---|
| 3.2 | `grep -oE '>Door<' …Header.tsx \| wc -l` · `>Gospel<` · `grep -c 'sr-only'` | `1` · `1` · `2` | 0 |
| 3.3 | `! grep -n 'bg-gradient'` · `grep -c 'aria-controls="mobile-menu"'` · `grep -c 'id="mobile-menu"'` · `! grep -nE '>\s*Menu\s*<'` · `grep -c 'aria-label="Primary"'` · `grep -c 'aria-label="Toggle mobile menu"'` · `! grep -n 'sticky'` · `grep -c 'font-serif'` | — · `1` · `1` · — · `1` · `1` · — · `1` | all 0 |
| 3.4 | `! grep -n 'Brethren'` · `! grep -n 'blockquote'` (Header) | — | 0 · 0 |
| 3.7 | `! LC_ALL=C.UTF-8 grep -nP '[^\x00-\x7F]' …Header.tsx` · `grep -c 'title="Scripture study - Galatians 6:1"'` · fence [1] labels | — · `2` · `2 >About<` `2 >Galatians6:1<` `2 >Home<` `2 >Location<` | 0 |
| 3.8 | fence [1] Header `track*` call-set diff vs origin/master (repo root) | empty | 0 |
| 3.9 | fence [1] duration scan (4 files) · `grep -c 'motion-reduce:transition-none'` · `grep -c 'invisible'` · fence [2] `'visible'` | — · `4` · `1` · `1` | 0 |
| 3.10 | `grep -c 'z-40'` · `! grep -n 'z-10'` · `grep -c 'border-brick'` · `! grep -n 'border-brick/'` (ATC) | `1` · — · `1` · — | 0 |
| 3.12 | fence [1] footer forbidden classes · `grep -c 'aria-label="Footer"'` · `grep -c 'bg-stone-700'` · `grep -c 'ring-offset-stone-800'` · non-ASCII · fence [2] h3 serif · fence [3] blockquote serif | — · `1` · `1` · `4` · — · `3` · `1` | 0 |
| 3.13 | Footer `track*` call-set diff · fence [1] attr diff | empty · `0a1 > aria-label="Footer"` (sole delta) | 0 · 1 (diff, expected) |
| 3.20 | `aria-describedby="consent-message"` · `id="consent-message"` · `'analytics-consent'` · call-set diff · fence [1] non-className line count | `2` · `1` · `1` · empty · `0` | 0 |
| 3.21 | fence [1] alpha scan (ConsentBanner/Header/Footer dirs) | — (src-wide form still fires on `SideBar.tsx:28,37`, LW-4) | 0 |
| 3.1/3.11/3.24 (repo root) | `git diff --quiet origin/master -- …App.test.tsx …AddToCalendarButton.test.tsx …SideBar.test.tsx` · `git diff --name-only origin/master -- src/__tests__ src/App.test.tsx tests` · fence [1] untracked | — · empty · `?? OpenDoorWebsiteApp/src/__tests__/ConsentBanner.test.tsx` | 0 |
| 3.1/3.6/3.11/3.15-19 | `npm run test:unit -- App.test ConsentBanner AddToCalendarButton` | 3 suites, 41 passed | 0 |
| 3.6/3.14 | `npm run test:e2e:full -- multi-environment` | 20 passed, 4 failed: `should handle direct URL access` x3 (pre-existing `:128` strict-mode collision, sequencing 5.4) + `Root Domain › should have no broken internal links` (timeout at `nth(14)`). Both reproduced identically on the pre-story tree via `git stash push -u -- OpenDoorWebsiteApp/src` -> same 1 failed / 2 passed for the internal-links test -> `git stash pop`. Pre-existing; file untouched. | 1 (expected) |
| 3.22 | `npm run test:e2e:pr` console block | `[a11y smoke] Home has 1 axe violations (baseline 2): color-contrast (5 nodes)` — `landmark-unique` gone; `HOME_AXE_VIOLATIONS_BASELINE = 2` unchanged | 0 |
| 3.5 (manual) | `npx serve -s build-prod -p 3100` + Playwright script, 375x667 `/opendoor`, click `/menu/i`, `#mobile-menu` boundingBox | `x=0, y=64, width=375, height=253`; header `position: relative`; menu `z-index: 40`; short wordmark visible | 0 |
| 3.2 visibility (manual) | 1280x720 `header h1` `getByText('Gospel', { exact: true })` | visible, width `70.69`; h1 font `Lora, Georgia, "Times New Roman", serif`; header height 73 | 0 |
| AC-11 runtime (manual) | `transitionDuration` hamburger / mobile link / `That's Fine` | `0.15s` x3; under `reducedMotion: 'reduce'` `1e-05s` x3 (Chromium serialises 0.01ms as `1e-05s` — note for the LW-4 spec author) | 0 |

Sentinels: 24/24 TCs pass (3.23 = battery below; 3.5 manual as the story permits).

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, run on the finished tree)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` (pre-check) | 0 | clean |
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 10 suites, 120 tests passed |
| `npm run build:prod` | 0 | build ok |
| `npm run test:e2e:pr` | 0 | 22 passed (27.6s) |

### Deviations
- `napByteMatch.test.ts` "Footer renders street + postalCode" went red on the first full unit run: the deleted `🕐` span was the text node separating `64080` and `Sunday` in `textContent`; the SVG has none, so `\b\d{5}\b` found no boundary. Fixed in Footer with a `{' '}` text node after the SVG (component only; test untouched).
- Two `h1`s on Home today (masthead + welcome), so `page.locator('h1')` in the planned `living-word-strip.spec.ts` TC-LW-3.2 assertion is strict-mode ambiguous until LW-5; the probe used `header h1`. Flagged for LW-4.
- ATC menuitem classes applied per component-specs 2.11 (same file, class values only; `AddToCalendarButton.test.tsx` unmodified and green).

### Timing
~40 min including three e2e runs (multi-environment x2 + stash attribution) and battery.

## LW-4 — Layout: TimeStrip, single column, SideBar into Home

Base: `lw-3-green` (e5f41d2). ACs AC-9, AC-10, AC-12, AC-12a, AC-13, AC-14, AC-17. Edits landed in sequencing 3.4 order 1-6 inside one commit.

### Files touched
- `OpenDoorWebsiteApp/src/components/layout/TimeStrip/TimeStrip.tsx` (new, component-specs 2.2 verbatim; `Sun {EVENTS[0].time}`, `Directions` Link, no `track*`)
- `OpenDoorWebsiteApp/src/components/layout/TimeStrip/index.ts` (new re-export)
- `OpenDoorWebsiteApp/src/pages/MasterLayout/MasterLayout.tsx` (SideBar import/element gone; `lg:flex-row`, `order-*`, `flex-1` on main gone; `<TimeStrip />` at :22 between `<Header />` :21 and content wrapper :23)
- `OpenDoorWebsiteApp/src/pages/HomePage/HomePage.tsx` (`import SideBar`; `<SideBar />` as last child of the root div, after "Join Our Church Family")
- `OpenDoorWebsiteApp/src/components/layout/SideBar/SideBar.tsx` (class values only per component-specs 2.6; `block md:hidden` kept on Quick Contact and Learn More About Us; arrows deleted; no attribute/track line changed)
- `OpenDoorWebsiteApp/src/__tests__/LinkNavigation.test.tsx` (`/^learn more$/i` x4 at :48,58,87,115; asset mock + `ScheduleIcon`, `FacebookIcon`, `QuickMap`; analytics mock + `trackNavClick`, `trackCtaClick`, `trackSocialClick`, `trackCalendarClick`)
- `OpenDoorWebsiteApp/tests/living-word-strip.spec.ts` (new, 17 cases: TC-LW-4.1 x5, 4.2, 4.3, 4.6, 4.7, 4.8, 4.9, 4.15, 4.23 x2, 4.25, 4.26; no skip/fixme)
- `OpenDoorWebsiteApp/src/__tests__/SideBar.test.tsx` UNTOUCHED (diff --quiet exit 0)

### Pre-checks (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit -- SideBar LinkNavigation AddToCalendarButton App.test` | 0 | 4 suites, 55 passed |

### Sentinels (`bash --noprofile --norc`, `LC_ALL=C.UTF-8`; cwd `OpenDoorWebsiteApp/` unless repo root)
| TC | Command | Result | Exit |
|---|---|---|---|
| 4.4 | `grep -c 'aria-label="Service time"'` · `role="region"` · `data-testid="time-strip"` · `grep -cE 'EVENTS\[0\]\.time'` · `! grep -n '10:30'` · `grep -cE 'fixed'` (TimeStrip) · `<Header`/`<TimeStrip`/wrapper lines in MasterLayout | `1` · `1` · `1` · `1` · — · `0` · `:21` < `:22` < `:23` | 0 (grep -c 0 = exit 1, expected) |
| 4.5 | `min-h-\[44px\]` · `hover:bg-sage-dark` · `hover:underline` · `focus:ring-offset-sage` · `z-30` | `2` · `1` · `1` · `1` · `1` | 0 |
| 4.12 | `grep -c '<SideBar' HomePage` · `! grep -n 'SideBar' MasterLayout` · `grep -c 'import SideBar' HomePage` | `1` · — · `1` | 0 |
| 4.13 | `! LC_ALL=C.UTF-8 grep -nP "$R" SideBar.tsx MasterLayout.tsx` · fences [2][3][4][5] · [6] mockups (repo root) | — · `0`,`0`,`0`,`1` · `0` | 0 |
| 4.14 | `grep -n '<aside'` | `16:    <aside className={\`w-full ${className}\`}>` | 0 |
| 4.16 | `grep -c "/^learn more\$/i"` · `grep -c "/learn more/i"` | `4` · `0` | 0 / 1 (expected) |
| 4.17 (repo root) | `git diff --numstat origin/master -- …LinkNavigation.test.tsx` · fences [1][2][3] · removed-line list | `11 4` · `4`,`3`,`4` · exactly the four `/learn more/i` lines | 0 |
| 4.18 | `grep -c 'md:hidden' SideBar.tsx` | `2` | 0 |
| 4.19 (repo root) | fence [1] · fence [2] (`-w` attr/track diff) · call-set unchanged by inspection of [2] | — · `0` lines | 0 |
| 4.21 | non-ASCII (SideBar) · fence [1] src-wide alpha · `! grep backdrop-blur` · `! grep bg-gradient` | all clean | 0 |
| 4.22 | `bg-sage rounded-lg p-4` · `bg-white text-sage` · `hover:bg-parchment hover:text-sage-dark` · `focus:ring-offset-sage` · `font-serif` | `1` · `2` · `2` · `2` · `5` | 0 |
| 4.28 | `grep -c 'HOME_AXE_VIOLATIONS_BASELINE = 2' tests/a11y.spec.ts` · `npx playwright test tests/a11y.spec.ts` | `1` · `[a11y smoke] Home has 1 axe violations (baseline 2): color-contrast (4 nodes)` | 0 |
| entry | `grep -c 'z-40' AddToCalendarButton.tsx` | `1` | 0 |
| 4.11 (repo root) | fence [1] `git ls-files … SideBar.test.tsx \| grep -q . && git diff --quiet origin/master -- …SideBar.test.tsx` | — | 0 |
| 4.30 (repo root) | `git diff --name-only origin/master -- src/__tests__ src/App.test.tsx tests` · fence [1] untracked | `ConsentBanner.test.tsx` (LW-3, now tracked) + `LinkNavigation.test.tsx` · `?? OpenDoorWebsiteApp/tests/living-word-strip.spec.ts`; `SideBar.test.tsx` in neither | 0 |
| 4.1-4.3, 4.6-4.9, 4.15, 4.23, 4.25, 4.26 | `npx playwright test tests/living-word-strip.spec.ts` | 17 passed (19.2s) | 0 |
| 4.10 | `npm run test:e2e:full -- multi-environment` | 20 passed, 4 failed — identical set to LW-3: `should handle direct URL access` x3 (pre-existing `:128` strict-mode collision, sequencing 5.4) + `Root Domain › should have no broken internal links` (`nth(14)` timeout, followups.md). No new red. | 1 (expected) |
| 4.20 | `npx playwright test tests/external-links-assets.spec.ts tests/a11y.spec.ts` | 25 passed (40.9s) | 0 |
| 4.24 / 4.27 | covered by `npm run test:unit` below (AddToCalendarButton, SideBar, App.test green) | — | 0 |

Sentinels: 30/30 TCs pass (4.29 = battery below).

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, finished tree)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 10 suites, 120 tests passed |
| `npm run build:prod` | 0 | build ok |
| `npm run test:e2e:pr` | 0 | 22 passed (27.2s); `[a11y smoke] Home has 1 axe violations (baseline 2)` |

### Deviations
- First strip-spec run: TC-LW-4.9 red x3 and TC-LW-4.8 flaky. Cause: `#mobile-menu` `transition-all duration-150` — `visibility` flips at transition end, and the spec sampled `getComputedStyle` synchronously after the click. Component matches spec; the test now awaits `toBeVisible()` on the first menu link before sampling / tabbing (retrying assertion, no timeout literal). 17/17 on rerun.
- TC-LW-4.30 expects `ConsentBanner.test.tsx` untracked; it was committed in LW-3, so it appears in the modified list instead. Not touched by this story.
- Hint honoured: no `h1` locator in this spec; TC-LW-3.2's visibility case waits for LW-5/LW-9.
- Home axe count recorded: 1 (color-contrast, 4 nodes) — `<aside>` inside `<main>` did not trip `landmark-complementary-is-top-level`, as sequencing 5.1 probed.

### Timing
~35 min including three e2e runs (strip x2, multi-environment, ext+a11y) and battery.

## LW-5 — Home page: verse card, CTA band, congregation photo

Base: `lw-4-green` (5545fa8). ACs AC-15, AC-18, AC-19, AC-42, AC-43. One commit; sequencing 3.5 order (asset -> HomePage -> test -> spec edit -> ext-links run before commit).

### Files touched
- `OpenDoorWebsiteApp/public/images/congregation.jpg` (new; `magick .delivery/artifacts/01-idea/inputs/congregation.png -resize 1424x -strip -interlace JPEG -sampling-factor 4:2:0 -quality 82 …` from repo root; 132,288 B, progressive, sRGB 1424x640, no exif/xmp/icc). PNG original stays outside `OpenDoorWebsiteApp/`.
- `OpenDoorWebsiteApp/src/pages/HomePage/HomePage.tsx` — `WelcomeBanner` import + `<img>` removed (the one permitted removal); verse card per component-specs 2.7 as the first `<section>` (`aria-labelledby="verse-label"` on the section, `id="verse-label"` on the label `<p>`, TC-LW-5.10 form; `first-letter:` drop cap, blockquote one text node; single `Read the study` Link, `aria-label="Read the study of Galatians 6:1"`, no `onClick`/`track*`); `page h1`/`page intro`/`section card`/`section h2`/`section h3` class values per 2.8; `<figure className="max-w-3xl mx-auto">` + `<img … loading="lazy" decoding="async" width={1424} height={640} className="w-full h-auto rounded-lg border border-rule">` inserted after the Mission `</section>` per 2.12; CTA band `cta band` + `cta band h2` + `cta band p`, buttons `btn on-sage` / `btn outline-on-sage` per 2.9; `usePageMeta` and both `trackCtaClick` lines byte-identical; `<SideBar />` last.
- `OpenDoorWebsiteApp/src/__tests__/HomePage.test.tsx` (new; 9 tests: TC-LW-5.1–5.5, 5.9, AC-18 CTA parity, 5.15, 5.16; asset/analytics mocks identical to `LinkNavigation.test.tsx`, `jest.mock('../hooks/usePageMeta')`; master text literals copied from `git show origin/master:…HomePage.tsx`).
- `OpenDoorWebsiteApp/tests/external-links-assets.spec.ts` — exactly the two PRD Rev 5.2 Section 17 lines inserted after `:73`, byte-exact (diffed against the fence); numstat `2\t0`.
- `OpenDoorWebsiteApp/src/__tests__/SideBar.test.tsx` UNTOUCHED (`git diff --quiet` exit 0). `tailwind.config.js` and `src/assets/svg/index.ts` untouched (not in the story Files list; `WelcomeBanner` export stays, unrendered).

### Pre-checks (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` | 0 | clean (after two `eslint-disable-next-line testing-library/no-node-access` lines in the new test for the PRD-mandated `img.closest('a')` and `childElementCount` — precedent `AddToCalendarButton.test.tsx:247`) |
| `npm run type-check` | 0 | clean |
| `npm run test:unit -- HomePage LinkNavigation App.test` | 0 | 3 suites, 24 passed |
| `npx playwright test tests/external-links-assets.spec.ts` (BEFORE commit, sequencing 3.5 / P-B1) | 0 | 24 passed (42.9s) — lazy photo scrolled + awaited, `naturalWidth > 0` |

### Sentinels (`bash --noprofile --norc /tmp/lw5/sentinels-lw-5.sh`, `LC_ALL=C.UTF-8`; cwd `OpenDoorWebsiteApp/` unless repo root; patterns copied from the stories.md Rev 1.3 fence)
| TC | Command | Result | Exit |
|---|---|---|---|
| 5.6 (repo root) | `grep -c "Read the study"` · fence [1] · fence [2] `-w` diff `usePageMeta`/`track[A-Z]…\(` · `! grep homepage_verse` | `2` (aria-label + text) · — · `0` lines · — | 0 |
| 5.8 | `grep -c 'Join Our Church Family'` · fence [1] · `! text-green-100` · `! bg-church-green` · `! bg-gradient` | `1` · `1` · clean x3 | 0 |
| 5.10 | `! WelcomeBanner` · `grep -c 'Scripture Study'` · `grep -c aria-labelledby` · `<section` count vs master fence [1] | clean · `0` · `1` · `5` = master `4` + 1 | 0 (grep -c 0 = exit 1, expected) |
| 5.11 | `! <span…>B</span>` · `grep -c 'first-letter:'` | clean · `1` | 0 |
| 5.12 | `test -f` · fence [1] `file` · `stat -le 204800` · `magick identify` · fence [2] metadata | ok · `JPEG image data … progressive … 1424x640` · 132288 · `sRGB 1424 640` · stripped | 0 |
| 5.13 (repo root) | fence [1] `congregation.png` in index · fence [2] raster list | `0` · `OpenDoorWebsiteApp/public/headerphoto.jpg` (+ `public/images/` untracked pre-commit; becomes exactly the two listed files at commit) | 0 |
| 5.14 | `build:prod` + `cmp` · `build:gh-pages` · `build:custom` | all three `images/congregation.jpg` present, prod `cmp` identical | 0 |
| 5.16 | `grep -c 'Our Mission'` · `grep -c 'Community Outreach'` | `1` · `1` | 0 |
| 5.17 | `images/congregation.jpg` · `loading="lazy"` · `decoding="async"` · alt string · `! <figcaption` · fence [1] picture/srcset/webp · `process.env.PUBLIC_URL` · fence [2] figure-scoped shadow/alpha | `1` · `1` · `1` · `1` · clean · clean · `1` · prints nothing | 0 |
| 5.18 (repo root) | fence [1] · `--numstat` · `grep -c '^+.*scrollIntoViewIfNeeded'` · guarded form · `el.complete` · byte-diff vs PRD s17 fence | — · `2	0	OpenDoorWebsiteApp/tests/external-links-assets.spec.ts` · `1` · `1` · `1` · `BYTE-EXACT` | 0 |
| DoD 3 (repo root) | `git diff --quiet origin/master -- …SideBar.test.tsx` | — | 0 |
| 5.22 (repo root) | modified test files · untracked | `ConsentBanner.test.tsx`, `LinkNavigation.test.tsx`, `tests/external-links-assets.spec.ts` (+ `living-word-strip.spec.ts` tracked since LW-4) · `?? HomePage.test.tsx`; `SideBar.test.tsx` in neither | 0 |
| AC-2 (Home part) | `grep -nE 'church-green|green-NNN|orange-NNN|stone-800|stone-200' HomePage.tsx` | no hits | 1 (expected) |
| 5.1–5.5, 5.9, 5.15, 5.16 | `npm run test:unit -- HomePage` | 9 passed | 0 |
| 5.7, 5.20, 5.21 | `npm run test:unit -- LinkNavigation App.test` · battery below | green | 0 |

Sentinels: 22/22 TCs pass.

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, finished tree; log `/tmp/lw5/battery.log`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean, 0 warnings |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 11 suites, 129 tests passed |
| `npm run build:prod` | 0 | build ok; `build-prod/images/congregation.jpg` byte-identical to `public/` |
| `npm run test:e2e:pr` | 0 | 22 passed (27.1s); no `[a11y smoke]` line — Home axe violations now **0** (logger fires only when > 0; sequencing 3.5 expected 0 here). `HOME_AXE_VIOLATIONS_BASELINE` stays 2 until LW-9. |

### Deviations
- Task brief said "Galatians 6:1 as the single h1 on the page"; PRD AC-15/AC-19, wireframes A5, spec 2.7/2.8 and Q4 all keep `h1` "Welcome to Open Door Full Gospel Church" with the verse in a `<section>` card (label is a `<p>`, not a heading). Built per the spec; Home keeps the masthead `h1` + page `h1` exactly as on master (TC-LW-5.5 asserts the page `h1`; `App.test.tsx:9` the masthead one).
- `aria-labelledby` (TC-LW-5.10 expects >= 1) is not in the 2.7 markup; added as attribute-only `aria-labelledby="verse-label"` / `id="verse-label"` — no text, class, or heading change.
- Two `eslint-disable-next-line testing-library/no-node-access` comments in the new test (PRD-mandated `img.closest('a')`, TC-LW-5.15 child count); all other figure checks use `getByRole('figure')` / `within`.
- `WelcomeBanner` key in the `LinkNavigation.test.tsx` mock left in place (sequencing 3.5: harmless, leave it).

### Timing
~25 min including the ext-links e2e run, the battery, and the two extra builds.

## LW-6 — Location and About restyle, emoji retired

Base: `lw-5-green` (2b48321). ACs AC-20, AC-22, AC-23, AC-24, AC-25, AC-44. One commit; sequencing 3.6 (icon swap + `AboutPage.test.tsx` mock keys in the same commit).

### Files touched
- `OpenDoorWebsiteApp/src/pages/LocationPage/LocationPage.tsx` — class values per component-specs 2.8/2.9/2.10 (`page h1`, `page intro`, `section card`, `section h2/h3`, `btn primary` on Get Directions, `link` on View Larger Map and About Our Church, `map footer strip` `bg-parchment`, Plan Your Visit `bg-white border border-rule … text-ink`); `import { EVENTS } from '../../config/events'`; new `<p className="text-sm text-stone-600 mt-2">Sundays {EVENTS[0].time}, about two hours</p>` after `</address>`, before the Get Directions div; map hover overlay `div` deleted and its `relative` wrapper dropped, `iframe` gains `block` (2.10). `usePageMeta`, all three `track*` calls, hrefs, `target`/`rel`, iframe `title` and `src`, all heading and link text byte-identical to `origin/master`.
- `OpenDoorWebsiteApp/src/pages/AboutPage/AboutPage.tsx` — `hero parchment` (`bg-parchment text-ink border border-rule rounded-xl p-5 md:p-8`), `page h1`, `section card` x4, `section h2/h3/h4` (`font-serif … text-ink`), `history icon` `text-sage`, `timeline sage` / `timeline brick`, `external link` string on both external anchors, `tile parchment` past-leader rows, Current Leadership `bg-white border border-rule text-ink p-6 rounded-lg`, `value card` + `value disc` (`bg-sage`) + `<img src={CrossIcon|BibleIcon|CommunityServiceIcon|LeadershipIcon} alt="" className="w-8 h-8 filter brightness-0 invert" />` replacing the four emoji spans, `cta band` + `cta band h2/p/p small`; `<figure className="mt-4 md:mt-6 max-w-3xl mx-auto">` + the 2.12 `<img>` (same `src` template literal, A1 alt, `width={1424} height={640} loading="lazy" decoding="async"`, `w-full h-auto rounded-lg border border-rule`) inserted after the timeline entries `</div>`, before the History `</section>`. Imports `CrossIcon`, `BibleIcon`, `CommunityServiceIcon` added. `TimelineIcon` line, `:120` JSX comment, both external links (href/target/rel/aria-label), `usePageMeta`, `trackAboutView()` untouched.
- `OpenDoorWebsiteApp/src/__tests__/AboutPage.test.tsx` — additive only (numstat `54 0`): mock gains `CrossIcon`, `BibleIcon`, `CommunityServiceIcon`; new `describe('AboutPage — congregation photo (AC-44)')` with the eight AC-43-form assertions + figure class/child checks (TC-LW-6.11) and the three `compareDocumentPosition` checks (TC-LW-6.12). Three `eslint-disable-next-line testing-library/no-node-access` for the PRD-mandated `closest('a')`, `closest('figure')`, `children.length` (LW-5 precedent).
- `OpenDoorWebsiteApp/src/__tests__/LinkNavigation.test.tsx` — one added test in the LocationPage block with exactly `getByText('Sundays 10:30 AM, about two hours')`; no removals beyond the four LW-4 lines (`grep -c '^-[^-]'` = 4).
- `SideBar.test.tsx`, `tailwind.config.js`, `src/assets/svg/index.ts` untouched.

### Pre-checks (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit -- AboutPage LinkNavigation` | 0 | 2 suites, 16 passed (only the pre-existing React Router v7 future-flag warnings) |

### Sentinels (`bash --noprofile --norc /tmp/lw6/sentinels-lw-6.sh`, `LC_ALL=C.UTF-8`; fence lines extracted verbatim from stories.md Rev 1.3 with awk, never retyped; log `/tmp/lw6/sentinels.log`; non-fenced row commands run directly)
| TC | cwd | Command | Result | Exit |
|---|---|---|---|---|
| 6.1 | root | fence [1] · [2] Location diff filter · [3] About diff filter (+ `grep -v 'images/congregation.jpg'`) | `2` · 0 lines · 0 lines | 0 · 1 (no match = expected) · 1 (expected) |
| 6.2 | root | fence [1] heading-text parity Location · same for About · [2] `P` attr-set Location · [3] `P` attr-set About · call-set diff (`usePageMeta|track[A-Za-z]+\(`) both files | all empty; About added attributes are exactly `alt=""` x4 (spec icons), the A1 `alt`, `loading="lazy"`, `decoding="async"`; no href/to/target/rel/aria-label/title delta | 0 |
| 6.3 | app | `test:unit -- AboutPage LinkNavigation` · `test:e2e:full -- multi-environment` · `test:e2e:pr` | 16 passed · :120/:124 Location+About green in all 3 envs (see Battery for the 4 pre-existing reds) · 22 passed | 0 · 1 (pre-existing) · 0 |
| 6.4 | app | two-part emoji grep · fence [1] `:301-302` diff | both clean (first part passes for the first time) · empty | 0 |
| 6.5 | app | fence [1] icon names · `alt=""` · fence [2] mock keys · `brightness-0 invert` | `9` · `12` · `3` · `4` (advisory met) | 0 |
| 6.6 | app | `grep -c "getByText('Sundays 10:30 AM, about two hours')"` | `1`; test green | 0 |
| 6.7 | app | `about two hours` · `! 'Sundays 10:30 AM, about two hours'` literal · `EVENTS\[0\]\.time` · fence [1] | `1` · absent · `1` · **fence [1] exit 1 — erratum, see Deviations** | 0/0/0/1 |
| 6.8 | app/root | fence [1] · `bg-sage text-white hover:bg-sage-dark` · `text-brick hover:text-brick-dark` · `P … 'title="[^"]*"'` · `! group-hover` | clean · `1` · `2` · empty · clean | 0 |
| 6.9 | app | `npx playwright test tests/external-links-assets.spec.ts` | 24 passed (43.3s), incl. lazy About photo `naturalWidth` | 0 |
| 6.10 | app | fence [1] · fence [2] · `bg-white border border-rule` · `bg-parchment text-ink` | clean · `2` · `5` (Current Leadership card + four value cards) · `1` | 0 |
| 6.11 / 6.12 | app | `npm run test:unit -- AboutPage` | 5 passed | 0 |
| 6.13 | app | `images/congregation.jpg` in About · fence [1] · A1 alt · `! <figcaption` · `<figure` · fence [2] | `1` · `2` · `1` · clean · `1` · exit 0 | 0 |
| 6.14 | app | `test:e2e:pr` (`regression-broken-links.spec.ts:175`) | green | 0 |
| 6.15 | root | fence [1] · fence [2] | `0` · `4` | 1 (grep -c 0 = expected) · 0 |
| 6.17 | root | modified / untracked test files | modified: `AboutPage.test.tsx`, `LinkNavigation.test.tsx` (+ `ConsentBanner.test.tsx`, `HomePage.test.tsx`, `tests/external-links-assets.spec.ts`, `tests/living-word-strip.spec.ts` tracked since LW-3..LW-5); `SideBar.test.tsx` absent; DoD 3 `git diff --quiet` exit 0 | 0 |
| AC-40 | app | alpha-variant grep | clean | 0 |
| 6.18 | UAT | manual — elder review of both placements at 375/1280 | pending UAT | — |

Sentinels: 17/17 automated TCs pass (6.18 is UAT-manual). TC-6.7 fence [1] is an erratum (below); its intent is proven.

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, finished tree; log `/tmp/lw6/battery.log`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 11 suites, 132 tests passed |
| `npm run build:prod` | 0 | ok |
| `npm run test:e2e:pr` | 0 | 22 passed (27.0s) |
| DoD 2: `npm run test:e2e:full -- multi-environment` | 1 | 20 passed, 4 failed — all pre-existing and documented: `should handle direct URL access` x3 envs (`:128` Galatians strict-mode, sequencing 3.3/3.7, green in LW-7; `:120` Location and `:124` About assertions pass first) and Root Domain `should have no broken internal links` 30s timeout at `nth(13)` (followups.md, LW-9 triage). No LW-6 row red. |
| DoD 2: `npx playwright test tests/external-links-assets.spec.ts` | 0 | 24 passed (43.3s) |

### Deviations
- **TC-LW-6.7 fence [1] erratum**: `grep -n 'Get Directions' … | head -1` resolves to the `trackDirectionsClick("Get Directions", GOOGLE_MAPS_URL)` handler (`:22`; `:21` on origin/master), which precedes the address block on every tree, so `A < B` can never hold. Not fixable without moving an analytics line (forbidden by AC-20). Intent verified with the second occurrence (the link text): `<p>` at `:68` < `Get Directions` text at `:83`. QA to amend the fence (`sed -n 2p` or `tail -1`) — same class of issue as LW-4 D-2.
- **Value-card class order**: spec 2.8 `value card` is `text-center p-6 bg-white rounded-lg border border-rule`; TC-LW-6.10 greps the contiguous `bg-white border border-rule` (AC-25 wording) and expects >= 2. Same class set, emitted as `text-center p-6 bg-white border border-rule rounded-lg`. Applied after the battery run; class-order-only, re-verified with `lint --max-warnings=0` (0), `type-check` (0), `test:unit -- AboutPage` (5 passed) and the AC-2 grep.
- **Hero class order**: spec 2.8 `hero parchment` is `bg-parchment border border-rule rounded-xl p-5 md:p-8 text-ink`; TC-LW-6.10 greps the contiguous `bg-parchment text-ink` (AC-25 wording). Same class set, emitted as `bg-parchment text-ink border border-rule rounded-xl p-5 md:p-8`.
- Wireframe B11/B12 give the external links `text-brick hover:text-brick-dark underline`; spec 2.8 `external link` vocabulary used (superset, includes both). Location `About Our Church` uses the 2.9 `link` variant (AC-24 wording), not the large-text outline option.
- `TimelineIcon` keeps its pre-existing `opacity-60` (AC-44: the TimelineIcon wrapper is unchanged; AC-40 bans `/NN` alpha variants, not `opacity-*`).
- Three `eslint-disable-next-line testing-library/no-node-access` comments in the new About test block (PRD-mandated `closest`/`children` forms, LW-5 precedent).

### Timing
~20 min including the battery and the two DoD e2e runs (~4 min of Playwright).

## LW-7 — Scripture Study: className-only, fidelity gate green
Base: `lw-6-green` (d7dc3e1). ACs AC-21, AC-26. One commit; sequencing 3.7 (commit -> fidelity gate -> tag). Prose-fidelity memory rule observed: not one text node, footnote, `id=`, `href`, `track*` call or `usePageMeta` touched.

### Files touched
- `OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx` — `className` VALUES only, 81 lines, `--numstat` `81 81`, applied by a line/pattern-scoped `sed -f` script (`/tmp/lw7/restyle.sed`): hero `:38` `bg-gradient-to-r from-stone-50 to-white rounded-lg shadow-md` -> `bg-white border border-rule rounded-xl` (spec 2.8 value); `h1 :43` `font-serif … text-ink`; verse blockquote `:46` `font-serif italic … text-ink … border-sage`; cites `:49,:652` `text-brick`; all 20 footnote refs/back-links `text-green-600 hover:text-green-800 … focus-visible:outline-green-600` -> `text-brick hover:text-brick-dark underline … focus-visible:outline-sage` (spec `scripture footnote link`; `focus-visible:` kept per spec 2.6 note); bullets `:197,203,207,211` `text-brick`; term blocks `:230,237,268,275,400,419` `border-sage`; blockquotes `:345,:649` `font-serif italic text-ink … border-sage`; RTL Hebrew blockquotes `:578,:665` `border-r-4 border-sage … text-ink`; tiles `:369,375,381,895,930` `bg-parchment`, their `h4` `font-serif font-semibold text-ink`; `:921` `What NOT to Do:` `+ font-serif`, `text-red-700` stays; Sources section `:985` `bg-stone-50` -> `bg-parchment` (wireframe G10); every other `h2`/`h3`/`h4` `+ font-serif`, `text-stone-800` -> `text-ink`, including the standalone className lines `:306,:396,:539,:562,:639` under the multi-line headings whose `id=` lines (`:305,:395,:538,:561,:638`) are untouched. JSX comment `:301-302` and bibliography `:992-1019` byte-identical.
- `OpenDoorWebsiteApp/tests/multi-environment-navigation.spec.ts:128` — the one PRD Section 6 permitted edit: `getByRole('heading', { name: /galatians 6:1/i })` -> `getByRole('heading', { name: 'Galatians 6:1', exact: true, level: 1 })`; `--numstat` `1 1`.
- `SideBar.test.tsx` untouched (DoD 3 `git diff --quiet` exit 0).

### TC-LW-7.10 step 1 — reproduce-first on the untouched tree (`export CI=true`, cwd `OpenDoorWebsiteApp/`; log `/tmp/lw7/repro-master.log`)
`npx playwright test tests/multi-environment-navigation.spec.ts -g "direct URL"` exit 1 before any edit (file and test byte-equal to `origin/master` at that point): x3 environments, each `strict mode violation: getByRole('heading', { name: /galatians 6:1/i }) resolved to 2 elements: 1) <h1 …>Galatians 6:1</h1> … 2) <h2 …>Detailed Analysis of Galatians 6:1</h2>`. Attribution confirmed (sequencing 3.3).

### Pre-checks (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint -- --max-warnings=0` | 0 | clean |
| AC-2 `! grep -rnE 'green-[0-9]{2,3}|orange-[0-9]{2,3}' src --include=*.tsx --include=*.css --exclude-dir=__tests__` | 0 | clean src-wide |

### Sentinels (`bash --noprofile --norc /tmp/lw7/sentinels-lw-7.sh`, `LC_ALL=C.UTF-8`, GNU grep; fence lines extracted verbatim from stories.md Rev 1.3 with awk, never retyped; log `/tmp/lw7/sentinels.log`)
| TC | cwd | Command | Result | Exit |
|---|---|---|---|---|
| 7.1 | root | fence [1] · [2] `-w` line filter `grep -v className` · [3] class-stripped whole-file diff | tracked · 0 lines · empty | 0 · 1 (no match = expected) · 0 |
| 7.2 | root | `git diff --numstat origin/master -- $S` | exactly `81\t81\t…ScriptureStudy.tsx` | 0 |
| 7.3 | root | fence [1] `:301-302` · [2] `:992-1019` · [3] `:43-51` class-stripped | all empty | 0 · 0 · 0 |
| 7.4 | root | fence [1] `href`/`id` set diff · `trackReferenceClick(...)` call-set diff | both empty | 0 · 0 |
| 7.5 | root | `BASE_REF=origin/master sh scripts/discourse-fidelity-check.sh` AFTER commit | see "Fidelity gate" below | — |
| 7.6 | root | fence [1] AC-20 filter (`track|aria-label|href=|rel=|target=|usePageMeta`) | 0 lines | 1 (expected) |
| 7.7 | root/app | fence [1] `<nav` on master = `0`; `<nav` now = `0` (equal) · `! grep 'In this study'` | no TOC built | 0 |
| 7.8 | app | fence [1] `! border-green-500|green-300|bg-gradient` · `border-sage` count · `font-serif italic` count | clean · `11` (>= 4) · `3` (>= 1) | 0 |
| 7.9 | app | fence [1] src-wide gradient grep | clean — passes src-wide for the first time | 0 |
| 7.10 | app | step 1 above (red on untouched tree); step 2 `test:e2e:full -- multi-environment` | `direct URL` green x3 envs on chromium under `CI=true` | 1 -> green |
| 7.11 | root | fence [1] · numstat · fence [2] · fence [3] | tracked · `1\t1\tOpenDoorWebsiteApp/tests/multi-environment-navigation.spec.ts` · `1` · `1` | 0 |
| 7.12 | app | `npm run test:e2e:full -- multi-environment` (log `/tmp/lw7/multienv.log`) | 23 passed, 1 failed; the level-1 `Galatians 6:1` visible on all three environments; the single red is the pre-existing Root Domain `should have no broken internal links` 30s timeout at `nth(13)` (followups.md, LW-9 triage) | 1 (pre-existing only) |
| 7.13 | app | canonical battery | below | 0 |
| 7.14 | root | modified / untracked test files | modified: `tests/multi-environment-navigation.spec.ts` added to the LW-6 list (`AboutPage.test.tsx`, `ConsentBanner.test.tsx`, `HomePage.test.tsx`, `LinkNavigation.test.tsx`, `tests/external-links-assets.spec.ts`; `living-word-strip.spec.ts` tracked since LW-4); untracked none; `SideBar.test.tsx` absent | 0 |

Sentinels: 13/14 automated TCs pass pre-commit; 7.5 runs post-commit (below).

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, finished tree, byte-exact string; log `/tmp/lw7/battery-exact.log`)
`npm run lint && npm run type-check && npm run test:unit && npm run build:prod && npm run test:e2e:pr` -> exit 0.
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 11 suites, 132 tests passed |
| `npm run build:prod` | 0 | ok |
| `npm run test:e2e:pr` | 0 | 22 passed (27.0s) |
(An earlier per-script loop with the same five scripts also printed exit 0 for each — `/tmp/lw7/battery.log`; the byte-exact chain was then run last, on the same tree, and is the run of record. No edit after it.)

### Fidelity gate (TC-LW-7.5; repo root, AFTER the story commit 38ed8b1; log `/tmp/lw7/fidelity.log`)
`BASE_REF=origin/master sh scripts/discourse-fidelity-check.sh` -> exit 0: `discourse-fidelity-check: PASS — source-PRD fidelity enforced on OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx.` Devlog then updated with this line and the commit amended (`git commit --amend --no-edit`; branch unpushed; no file under `OpenDoorWebsiteApp/` changed after the battery), gate re-run on the amended HEAD -> exit 0.

### Deviations
- **`h3` at `:1000` and `:1017` left as-is** (`font-semibold text-stone-800 mb-3`, no `font-serif`): they sit inside the bibliography range `:992-1019` that the story, the wireframe (Gbib) and sentinel TC-LW-7.3 [2] require byte-identical. Spec 2.8 "every h1-h4 + font-serif" conflicts with that fence for these two lines; the fence wins. `:986`, `:990`, `:1027` (outside the range) are restyled. LW-9 may revisit if QA amends the fence.
- **RTL Hebrew blockquotes `:578,:665`** get `passage rule rtl` + `text-ink` but NOT `font-serif italic` (wireframe G7a-q lists only `border-r-4 border-sage text-right`; italic on Hebrew script is typographically wrong and Lora carries no Hebrew glyphs).
- Hero `:38` drops `shadow-md` (spec 2.8 value string has no shadow; `rounded-lg` -> `rounded-xl` per spec).
- `<p>` term labels (`font-semibold text-stone-800`, e.g. `:231,:732`) untouched: not headings, not banned by AC-2; spec lists no change.
- Footnote refs/back-links gain `underline` per the spec `scripture footnote link` string.

### Timing
~25 min including the reproduce-first run, two full Playwright multi-environment runs and two batteries (~8 min Playwright).

## LW-8 — Assets and data: SVG recolour, share card, meta, 120-minute service

Parent `d45cfe7` (lw-7-green). Committed app tree object `0b3ab156b988e30958650f05e7a4d79699b18f91` (= `git rev-parse lw-8-green:OpenDoorWebsiteApp`); the battery below ran on exactly this tree, no edit after it. Commit SHA is in the final report and the `lw-8-green` tag.

### Files touched
- `src/assets/svg/` — the 25 Appendix B files, spec Section 5 sed map verbatim (`#9EC630->#5F7A61`, `#C8B59B->#E5DECF`, `#D4C4A0->#F5F0E6`, `#2D3748->#1C1917`, `#4A5568->#44403C`); `quick-map.svg` `<animate attributeName="opacity" …/>` line deleted. Other 18 SVGs untouched.
- `src/config/events.ts:70` `duration: 90` -> `120` (numstat 1/1).
- `src/__tests__/events.test.ts:40` `toBe(90)` -> `toBe(120)` (numstat 1/1; `:77` WotW stays 90).
- `src/__tests__/calendarLinks.test.ts` — additions only: `import { EVENTS } from '../config/events';` (new line) + `describe('120-minute Sunday Service')` block (svc120 Google URL, svc120 ICS DTEND, `EVENTS[0]` real-data DTEND).
- `public/index.html` — `og:image`/`twitter:image` -> `https://opendoorph.org/share-card.png`; `og:image:width` 1200 / `og:image:height` 630 / `og:image:type` image/png added adjacent; nothing else changed (TC-LW-8.17 = 0 lines); JSON-LD untouched; `public/headerphoto.jpg` kept.
- `public/share-card.png` (new) — 1200x630 PNG-24, 48,856 bytes, rendered by the generator (Google Fonts fetched at render time). Copy attached: `.delivery/artifacts/06-dev/developer/lw-8-share-card.png`.
- `scripts/share-card/template.html`, `scripts/share-card/render.mjs` (new) — spec Section 4; not wired into CI or npm scripts.

### Pre-checks (`export CI=true`, cwd `OpenDoorWebsiteApp/`)
| Command | Exit | Output |
|---|---|---|
| `node scripts/share-card/render.mjs` | 0 | `wrote …/public/share-card.png (48856 bytes)` (fonts gate + text gate passed) |
| `bash scripts/check-forbidden-strings.sh` | 0 | `OK: no forbidden strings found in source.`; `grep -ciE philippines scripts/share-card/template.html` = 0 |
| `npm run lint -- --max-warnings=0` | 0 | clean |
| `npm run test:unit -- events calendarLinks jsonLd` | 0 | 3 suites, 56 tests passed |

### Sentinels (`bash --noprofile --norc`, `LC_ALL=C.UTF-8`, fence text copied verbatim from stories.md Rev 1.3)
cwd `OpenDoorWebsiteApp/`:
| TC | Command | Exit | Result |
|---|---|---|---|
| 8.1 neg | `for f in $F25; do grep -liE '9ec630' "$f"; done` | — | prints nothing |
| 8.1 pos | fence [1] | 0 | address 4, bible 6, car 1, church 1, close 1, community-service 5, copyright 4, cross 2, directions 2, external-link 2, facebook 0, footer-border 2, hamburger 1, heart 1, history 3, leadership 5, map-marker 1, pastor 3, quick-links 1, quick-map 2, schedule 7, timeline 3, values 1, visit 5, website 1 — all equal Appendix B |
| 8.2 | `grep -liE '5f7a61' $F25 \| wc -l`; `grep -LiE '5f7a61' $F25` | 0 | `24`; `src/assets/svg/facebook-icon.svg` only |
| 8.3 | fence [1]; `grep -c '#1877F2' facebook-icon.svg` | 0 | `0`; `1` |
| 8.5 | `! grep -l '<animate' $F25`; `grep -c '<circle cx="34" cy="14" r="3"' quick-map.svg` | 0 | exit 0; `1` |
| 8.7 | `grep -c 'toBe(120)'` / `'toBe(90)'` events.test.ts | 0 | `1` / `1` |
| 8.12 | `grep -c 'T120000' calendarLinks.test.ts` | 0 | `2` |
| 8.13 | fence [1]; size test; fence [2] | 0 | `1200 x 630`; 48856 <= 307200; `1` |
| 8.14 | fonts.check / exit(1) / '700 72px Lora' counts; five text lines | 0 | `1`; `3`; `1`; each text `1` |
| 8.16 | seven greps/tests | 0 | `2`; `3`; `1`; `1`; `1`; raw.githubusercontent absent (exit 0); headerphoto.jpg present |
| 8.18 | `test -f build-prod/share-card.png && file … \| grep '1200 x 630'`; `cmp public/share-card.png build-prod/share-card.png` | 0 | match; identical |
| 8.6 | `npx playwright test tests/external-links-assets.spec.ts` (CI=true) | 0 | 24 passed (42.7s) |
| LinkNavigation literal | `grep 'about two hours' src/__tests__/LinkNavigation.test.tsx` | 0 | `:84` literal intact; `time` field untouched; passes in battery |

cwd repo root:
| TC | Command | Exit | Result |
|---|---|---|---|
| 8.4 [1] | diff filter `grep -vE 'fill\|stroke\|stop-color\|<animate'` | 1 (no lines) | 0 lines |
| 8.4 [2]/[3] | `grep -c '^-.*<animate'` / `'^+.*<animate'` | 0 | `1` / `0` |
| 8.4 [4]/[5]/[6] | changed SVG count / welcome-banner / history-(scroll\|calendar) | 0 | `25` / `0` / `0` |
| 8.5 numstat | `git diff --numstat origin/master -- …/quick-map.svg` | 0 | `4\t5` (deletions = additions + 1) |
| 8.7 numstat | events.test.ts | 0 | `1\t1\tOpenDoorWebsiteApp/src/__tests__/events.test.ts` |
| 8.8 [1]-[5] + numstat | events.ts | 0 | tracked; `2`; `1`; `1`; `1\t1\tOpenDoorWebsiteApp/src/config/events.ts`; self-test `2` |
| 8.12 [1] | `grep -c '^-[^-]'` calendarLinks.test.ts diff | 0 | `0` (additions only) |
| 8.14 CI | `grep -rn 'share-card' .github/workflows/node-build.yml OpenDoorWebsiteApp/package.json` | 1 | no match lines, `exit=1` |
| 8.17 [1] | non-og/twitter `<meta` diff lines in index.html | 1 (no lines) | 0 lines |
| DoD 3 | `git diff --quiet origin/master -- …/SideBar.test.tsx` | 0 | unmodified |
| 8.22 | test-file diff list | 0 | LW-7 list + `calendarLinks.test.ts`, `events.test.ts`; `SideBar.test.tsx` absent |
| 8.20 | `git log --format=%h origin/master.. -- …/share-card.png \| wc -l` (after commit) | 0 | see final report line (expected `1`; congregation.jpg `1`) |

Sentinels: 22/22 exit as expected. TCs: 8.1-8.14, 8.16-8.18, 8.20-8.22 pass; 8.15 manual visual — checked at 100%: parchment field, 12px brick bottom rule, Lora bold / Inter uppercase sage / Lora italic / Inter, no photo, no people (copy attached above). 8.19 is post-deploy (release plan), not run here.

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, byte-exact chain on tree `0b3ab156b988e30958650f05e7a4d79699b18f91`; log `/tmp/lw8-battery.log` for e2e, tool output for the rest)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 11 suites, 135 tests passed |
| `npm run build:prod` | 0 | build-prod/share-card.png present |
| `npm run test:e2e:pr` | 0 | 22 passed (27.4s) |
Chain exit: `battery=0`. No edits after the run; the committed tree is the tree the battery ran on.

### Deviations
- `render.mjs`: spec Section 4 lists `'700 72px Lora'` twice (a `fonts.load` call and the `FACES` array); TC-LW-8.14 expects the literal exactly once. The four `fonts.load` calls now iterate `FACES` (`faces.map((f) => document.fonts.load(f))`) — same four faces loaded, same gates, literal appears once. Behaviour identical; verified by a clean render.
- `calendarLinks.test.ts` `EVENTS` import added as a separate line rather than widening the existing import, so TC-LW-8.12 (0 removed lines) holds; `import/no-duplicates` is not enabled in this ESLint config (lint 0).
- Battery first ran as four separate commands (all 0) while confirming the tree, then the byte-exact chain once more on the identical tree; the chain run is the one recorded.

### Timing
~20 min including two renders, sentinel pass, targeted units, one byte-exact battery (~3 min) and the assets spec.

## LW-9 — Token retirement, full sentinel battery, a11y baseline to zero

Parent `0623314` (lw-8-green). **STATUS: DONE — one commit, tag `lw-9-green`, not pushed.** First pass stopped NOT_DONE on two blockers (AC-6 vs the bibliography fence; LCP 2258 ms); orchestrator ruling items 9–11 (sequencing.md) resolved both and the story was finished on the same working tree. Everything below reflects the final tree (`OpenDoorWebsiteApp/` subtree hash **`157240567c6da36c5f3316095e139a152935fb36`** — battery tree == committed tree).

### Files touched (working tree, uncommitted)
- `tailwind.config.js` — `church.{stone,brick,green,dark,light}` block removed (7 lines); the seven flat keys are now the only custom colours; `dark:` key gone.
- `tests/a11y.spec.ts` — `HOME_AXE_VIOLATIONS_BASELINE` 2 -> 0; header comment rewritten (true 2026-09-16 baseline = `color-contrast` + `landmark-unique`; 2026-09-17 = 0); existing 1280x720 test keeps every line and gains the two filter `expect`s; NEW `'Home violation count does not exceed baseline at 375x667'` (full-rule, banner mounted); NEW `withRules(['color-contrast'])` loop 4 routes x 2 viewports. No helper refactor; removed `expect(` lines = 0; removed `toBeLessThanOrEqual` = 0.
- `tests/living-word-strip.spec.ts` — extended (additions only, LW-4 cases untouched): TC-LW-3.2 Gospel-wordmark visibility (`header h1` scoped, followups D-3); AC-6 computed fonts x4 routes; AC-11 runtime `0.15s` x5 elements (no emulateMedia); reduced-motion x5 + body `animationName === 'none'`; AC-41 hover contrast (in-test WCAG helper, `reducedMotion: 'reduce'` before `goto`, 8 elements, Home test hovers `That's Fine` first with the banner mounted then clicks it); AC-45 geometry x4 + `naturalWidth` 1424 poll.
- `src/pages/LocationPage/LocationPage.tsx:117` — "View Larger Map" `font-medium` -> `font-semibold` (spec 2.9 `link`; LW-6 DoD polish). Class-only.
- `src/pages/ScriptureStudy/ScriptureStudy.tsx` (class-only, three places, discourse untouched): (1) `:111,451,694,858` — the four `sr-only` "Footnotes" `h3` gain `font-serif` (AC-6 surfaced them: computed font was Inter); (2) **ruling 9** — `:1000,:1017` bibliography `h3` (`font-semibold text-stone-800 mb-3` -> `font-serif font-semibold text-stone-800 mb-3`); (3) **declared deviation, accepted under ruling 9** — the two RTL Hebrew `<blockquote>` (`border-r-4 border-sage pr-6 text-right … leading-relaxed`, `:578`, `:665`) gain `font-serif` (AC-6 surfaced them after (2): computed `Inter, system-ui, sans-serif`; Lora has no Hebrew glyphs, the stack falls back to the system serif). TC-LW-7.1 [3] whole-file class-stripped diff still empty; TC-LW-7.2 numstat `87\t87`; TC-LW-7.3 [2] bibliography `:992-1019` now read **class-stripped** per ruling 9 (exit 0; literal diff differs only on the two `className` attributes).
- `public/index.html:14` — **ruling 10 step (a)**: the Google Fonts `<link rel="stylesheet">` becomes `<link rel="preload" as="style" href=… onload="this.onload=null;this.rel='stylesheet'">` + `<noscript><link rel="stylesheet" href=…></noscript>`; href byte-identical, both `preconnect`s kept; numstat `9\t2`; TC-LW-8.17 non-og/twitter `<meta` delta = 0; TC-LW-1.5 [1] ld+json block unchanged. Step (b) self-host NOT needed (LCP 2112 ≤ 2163, CLS 0.005 ≤ 0.05).

### Pre-checks
| Check | Exit | Result |
|---|---|---|
| Ordering rule 1 — AC-2 grep BEFORE key removal (`bash --noprofile --norc`) | 0 | no hits; safe to retire `church.*` |
| Ordering rule 2 — full-rule Home axe at 1280x720 and 375x667 BEFORE lowering the constant (`CI=true npx playwright test tests/a11y.spec.ts tests/living-word-strip.spec.ts`, first run) | 1 | a11y: 10/10 pass at 0 violations both viewports, 8/8 contrast scans 0; strip: 33/34 — the one failure is the AC-6 Scripture case (Blocker 1) |
| `npm run lint -- --max-warnings=0` | 0 | clean |
| `npx tsc --noEmit` | 0 | clean (tsconfig `include: ["src"]` — tests/ not type-checked by `type-check`) |
| `npx eslint tests/*.spec.ts` (not a gate) | — | only `testing-library/prefer-screen-queries` false positives on Playwright locators (25, pre-existing rule mismatch; 12 before this story) |

### Sentinels (`bash --noprofile --norc`, `set -u`, `LC_ALL=C.UTF-8`; every fence of LW-1..LW-9 extracted verbatim from stories.md Rev 1.3 into `lw-9-sentinels.sh` (attached; guard lines at top passed); full log `lw-9-sentinels.log` attached — 143 fence entries + 45 inline table commands, each with cwd, exit, line count, first output)
Summary against the TC "Expected" columns (cwd app unless `root`):
| TC | Result | Exit |
|---|---|---|
| 1.2 / 1.5 / 1.7 / 1.10 / 1.12 / 1.14 | `1`; JSON-LD diff empty; no `darkMode`; `7`,`1`,`1`; `4` selectors + fence [2] prints nothing; SideBar.test untouched | 0 |
| 2.1 / 2.2 / 2.4 / 2.6 / 2.8 | `0`; `0`; `1`,`0`, `src/assets/index.ts` unchanged; `1`; `0`,`0` | 0 |
| 2.5 [1]/[2] | `0` / `2` — [2] is the pre-A1 form of AC-37(b) (no `congregation.jpg` exclusion); the two hits are the permitted Home/About refs; the Rev 5.2 form TC-LW-9.7 [2] = `0` | 0 |
| 3.2 / 3.7 / 3.8 / 3.9 / 3.12 / 3.13 / 3.20 / 3.21 | `1`,`1`, sr-only `2`; four `2 >Label<` lines, no non-ASCII, title `2`; call-set diff empty; `4`,`1`,ternary `1`; Footer `1`,≥1,≥1, no non-ASCII, `3`,`1`; exactly `> aria-label="Footer"`; `2`,`1`,`1`, `0` | 0 |
| 3.8 [2] | TypeScript union literal, not a shell command (stories Rev 1.1 note) — not run | — |
| 4.11 / 4.13 / 4.17 / 4.19 / 4.21 | root diff exit 0; `$R` negative exit 0, self-tests `0`,`0`,`0`,`1`, mockups `0`; numstat `17\t4`, `4`,`3`,`4`; `0` lines, call-set empty; all negatives exit 0 | 0 |
| 5.6 / 5.8 / 5.10 / 5.12 / 5.13 / 5.17 / 5.18 | `2` (fence [2] 0 lines, call-set empty, no `homepage_verse`); `1` + three negatives; no WelcomeBanner, `0`, `1`, sections 5 = master 4 + 1; jpg 132,288 B `sRGB 1424 640`, metadata clean; `0`, raster list = headerphoto + congregation + share-card; `1`,`1`,`1`,`1`, no figcaption, fence [2] empty; `2\t0`, `1`,`1`,`1` | 0 |
| 6.1 / 6.2 / 6.4 / 6.5 / 6.7 / 6.8 / 6.10 / 6.13 / 6.15 | `2`, `0`, `0` lines; heading-text + `P()` attr diffs empty (Location, About); emoji greps clean, `:301-302` identical; `9`,`12`,`3`,`4`; order OK (fence [1] run with the LW-6 DoD `tail -1` erratum); `1`,`2`, `title` set identical, no `group-hover`; `2`,`5`,`1`; `1`,`2`,`1`, no figcaption, `1`, figure before Leadership; `0`, `4` | 0 |
| 7.1 / 7.2 / 7.3 / 7.4 / 7.6 / 7.7 / 7.8 / 7.9 / 7.11 (root, `S=`) | class-stripped diff empty, line filter 0; `85\t85`; three ranges empty; href/id set identical; `0`; no ToC/nav (master `<nav` = 0); `11`, `3`; src-wide gradient grep clean; `1\t1`, `1`, `1` | 0 |
| 8.1–8.4 / 8.8 / 8.12 / 8.13 / 8.17 / 8.18 / 8.20 | per-file counts = Appendix B, `24`, facebook only, `0`/`1`; diff filter 0 lines, `1`,`0`,`25`,`0`,`0`; `2`,`1`,`1`,`1\t1`, self-test `2`; `0` removed, `T120000` `2`; `1200 x 630`, ≤307200, `1`; `0` lines; `build-prod/share-card.png` identical; `1`,`1` | 0 |
| 8.9 / 5.4 | Jest/regex literals, not shell — covered by `test:unit` (135 pass) | — |
| 8.19 | post-deploy curls — release plan, pending first-march | — |
| 9.1 [1]/[2] (root, before first diff) | events.ts self-test OK; `7` | 0 |
| 9.2 | `! grep` hex exit 0; `7`; `7` (exactly seven keys); no `dark:`; no `church:` | 0 |
| 9.3 | AC-2 src-wide clean; `9ec630` clean | 0 |
| 9.5 (advisory) | prints 8 lines: `MasterLayoutTest.tsx:<h1>` (unrouted scaffold), the five multi-line headings `:304,394,537,560,637` (className with `font-serif` on the next line — grep artefact), and **`ScriptureStudy.tsx:1000` and `:1017`** (real: bibliography `h3`s have no `font-serif`, fence-protected) | 0 |
| 9.6 | `OK: no forbidden strings found in source.`; `philippin` `0`,`0`,`0`; `Pleasant Hill` in index.html = 7 | 0 |
| 9.7 (a)–(e) | `0`,`0`,`0`, exit 0, `1`,`1`,`2`; [5] legacy portraits in index `0` | 0 |
| 9.8 | duration grep clean; css seconds clean; `prefers-reduced-motion` `1`; no `animate-`/`@keyframes`; `! grep -l '<animate' $F25` exit 0; pairing count `1` (advisory — `Header.tsx:114` template-literal className, Paul P-m5 case) | 0 |
| 9.13 | `1`; `2`; `1` (both Home full-rule tests have no `withRules`); no stale ids; `landmark-unique` `4`; `2026-09-16` `1`; removed `toBeLessThanOrEqual` `0`; `reducedMotion: 'reduce'` in strip spec `6` | 0 |
| 9.18 | gzip CSS **5,389 B** (ceiling 16,202; pre-flight baseline 5,962) · JS **75,652 B** (ceiling 80,348; baseline 75,228; +424 B) | 0 |
| 9.19 [1] | port pre-check clean before every Playwright run and before the serve | 0 |
| 9.20 | `1`,`1`,`0`; App.test in battery | 0 |
| 9.21 | nine `== path` lines, no diffs; function-name set diff empty; `homepage_verse` absent; analytics.ts untouched (`0`) | 0 |
| 9.23 / DoD 3 | SideBar.test.tsx tracked and byte-identical to master | 0 |
| 9.24 | route set identical; only added src files = TimeStrip pair; config diff = `events.ts` only; package.json/lock unchanged; Terraform/.github `0` | 0 |
| 9.25 (pre-commit reading) | list is exactly the 10 expected entries; numstats events `1\t1`, multi-env `1\t1`, external `2\t0`, About `54\t0`, calendarLinks `19\t0`, LinkNavigation `17\t4`; a11y removed `expect(` = `0` | 0 |
| 9.27 | `npm audit --omit=dev` feature = master = `{low 3, moderate 12, high 17, critical 2, total 34}` (no new advisories); lockfile diff empty | 0 |
| 9.28 [1] | `--listTests` = `11` | 0 |
| 9.29 [1] | devlog tracked | 0 |
| 9.26 | post-commit — not run (no commit) | — |

### TC-LW-9.22 heading / text / link parity (throwaway `/tmp/lw9/parity/*.spec.ts`, NOT committed; master worktree `/tmp/lw-master` at `origin/master`, `npm ci`, `build:prod`, served `:3101`; feature `build-prod` on `:3100`; both serves killed; worktree removed afterwards)
Full diff attached: `lw-9-parity-diff.txt`. Every delta traces to an approved story AC — none is new to LW-9:
- `h`: `H1` textContent gains the `md:hidden aria-hidden` "Open Door" short wordmark (LW-3, TC-LW-3.2); SideBar `h3`/`h4` (Quick Contact, Schedule, Sunday Service, Woman of the Well, Welcome, Follow Us on Facebook) leave Location/About/Scripture — SideBar is mounted inside Home only (AC-12). All other headings byte-identical on all four routes.
- `t`: master's header verse `blockquote`/`cite` gone (LW-3 Header); Footer verse is now a `blockquote` (TC-LW-3.12 [3]); nav `li` lose emoji (AC-7); Home adds `Our church verse` + card `blockquote`/`cite (NKJV)` (AC-15); Location adds `Sundays 10:30 AM, about two hours` (AC-23); SideBar `p`s move with SideBar (AC-12); footer `🚀` removed (LW-3).
- `a`: additions exactly `Directions -> /opendoor/Home/Location` (every route) and `Read the study of Galatians 6:1 -> /opendoor/Home/Scripture` (Home); `Learn More About Us→` -> `Learn More About Us` (AC-14 arrow); SideBar links move to Home (AC-12). Zero href changes.

### Battery (`export CI=true`, cwd `OpenDoorWebsiteApp/`, byte-exact chain; final run on the final tree — the six `M` files above; `git status` identical before and after; logs `/tmp/lw9/final3/*.log`)
| Command | Exit | Key output |
|---|---|---|
| `npm run lint` | 0 | clean |
| `npm run type-check` | 0 | clean |
| `npm run test:unit` | 0 | 11 suites, 135 tests |
| `npm run build:prod` | 0 | Compiled successfully |
| `npm run test:e2e:pr` | 0 | **31 passed** (22 + the 9 new a11y tests; Home full-rule 0/0 at both viewports, 8 contrast scans 0) |
Chain exit `battery=0`. `OpenDoorWebsiteApp/` subtree hash of the battery tree = committed tree: `157240567c6da36c5f3316095e139a152935fb36`. The battery ran three times in total on this story (pre-ruling, post-ruling-9/10a, final after the Hebrew-blockquote fix); every edit was followed by the FULL ordered chain; the recorded run is the last.

### Full suite, firefox, Lighthouse (fixed order, ruling items 1/2/7/11; logs `/tmp/lw9/final3/*.log`)
| Step | Exit | Result |
|---|---|---|
| (9a) port pre-check | 0 | 3100-3102/3200 free before each run and before the serve |
| `npm run test:e2e:full` (`CI=true`, chromium) | 1 | **112 passed, 1 failed** — only `multi-environment-navigation.spec.ts:131` Root Domain `should have no broken internal links` (pre-existing, triaged below; accepted as the single red by ruling 11). AC-6 fonts on `/opendoor/Home/Scripture` now green. |
| `env -u CI npx playwright test --project=firefox` (evidence-only) | 1 | **112 passed, 1 failed** — the same single Root Domain case; no firefox-only failure |
| WebKit | — | not verifiable on this host (ruling item 3): release-note line "WebKit not verified locally; CI gate is chromium-only by config" |
| Lighthouse (9b verbatim, `bash --noprofile --norc /tmp/lh9b.sh`: `build:prod`, `npx serve -s build-prod -l 3200 & SERVE_PID=$!`, 3x, `kill $SERVE_PID`) | 0 | serve killed by PID; `ss -ltn` shows 3200 free; `OpenDoorWebsiteApp/lh.json` absent (`test ! -f` ok); median run (run 1) copied to `/tmp/lh.json` |

**NFR-4 / AC-45 Lighthouse (mobile, simulated throttling, `chromium-1217`) — final tree, after ruling 10 step (a):**
| Metric | Pre-flight baseline (master) | Pre-ruling LW-9 (median) | Final run 1 / 2 / 3 | Median | Gate | Verdict |
|---|---|---|---|---|---|---|
| Performance | 0.99 | 0.98 | 0.99 / 0.99 / 0.98 | **0.99** | >= 0.94 | PASS |
| Accessibility | 0.96 | 1.00 | 1 / 1 / 1 | **1.00** | = 1.00 | PASS |
| LCP | 1957 ms | 2258 ms (FAIL) | 2112 / 2108 / 2257 | **2112 ms** | <= 2163 ms | **PASS** (−146 ms vs pre-ruling; +155 vs master) |
| CLS | 0 | 0.005 | 0.0051 / 0.0050 / 0.0050 | **0.005** | <= 0.10 (ADR-lw-001 if > 0.05) | PASS, no ADR trigger, step (b) not needed |
| TBT | 0 | 0 | 0 / 0 / 0 | **0 ms** | <= 50 | PASS |
| FCP | ~754 | 1670 | 758 / 755 / 1424 | 758 ms | (recorded) | back to master level — Google Fonts CSS no longer render-blocking |
| `unsized-images` | 0.5 | 1 | 1 / 1 / 1 | **1** (0 items) | = 1 | PASS |
| `render-blocking-resources` | `main.css` only | fonts.googleapis.com 872 ms wasted | `main.css` only | 1 item | (recorded) | fonts CSS gone from the list |
| LCP element | `<p class="text-stone-700 …">` | verse blockquote | `<blockquote class="font-serif text-ink text-xl leading-relaxed first-letter:…">` (verse card) | text block | not `<img` | PASS (`jq … \| grep -vq '<img'` exit 0) |

**gzip (final `build-prod`, `gzip -9c | wc -c`):** CSS `main.cfd74402.css` **5,375 B** (baseline 5,962; ceiling 16,202) · JS `main.412a31df.js` **75,358 B** (baseline 75,228, +130 B; ceiling 80,348). Both PASS.

**AC-45 congregation `y` (chromium, before scroll, fonts loaded; test annotations):** Home 375x667 **1107.75** (expected ≈1108) · About 375x667 **1851** (expected ≈1823, +28, within ±60) · About 1280x720 **1069** (expected ≈1049, +20) · Home 1280x720 **736** (annotation only, expected ≈736). Three hard `>= viewport.height` assertions pass; `naturalWidth` 1424 on all four cases.

### Triage — Root Domain `should have no broken internal links` (pre-existing)
- Reproduced on `origin/master` (worktree `/tmp/lw-master`, its own `npm ci` + `build:prod` served on 3100-3102, `env -u CI npx playwright test tests/multi-environment-navigation.spec.ts -g "Root Domain.*broken internal" --project=chromium`): **1 failed — `Test timeout of 30000ms exceeded … waiting for locator('a[href^="/opendoor"]').nth(14)`**. On the feature tree the same failure sits at `nth(13)`.
- Root cause (test design, `tests/multi-environment-navigation.spec.ts:133-145`): `const internalLinks = await page.locator('a[href^="/opendoor"]').all()` yields **live locators** (`nth(0..N-1)` bound to the page, not to the collected elements). Inside the loop `page.goto(href)` navigates away; the next `link.getAttribute('href')` re-resolves `nth(i)` on the *destination* page. Link counts measured (`/tmp/lw9/parity/links.spec.ts`): master Home 15, Location 14, About 13, Scripture 13; feature Home 17, Location 13, About 12, Scripture 12. Master: index 13 is a Location link -> Location page has 14 links -> `nth(14)` never exists -> 30 s timeout. Feature: index 12 is a Location link -> Location page has 13 -> `nth(13)` never exists. Any page with more internal links than one of its link targets trips it; the restyle only shifts which index. The two prefixed environments never see it because their hrefs start with `/OpenDoorPH-website/opendoor` or `/CustomPath/opendoor`, so `a[href^="/opendoor"]` is empty there.
- Fix is a test-only edit (collect the `href` strings first, e.g. `evaluateAll`, then iterate) but `tests/multi-environment-navigation.spec.ts` is bounded by PRD Section 6 / TC-LW-9.25 to exactly `1\t1` (the LW-7 `level: 1` edit). NOT fixed here. Release-note known issue: "`multi-environment-navigation.spec.ts` Root Domain 'should have no broken internal links' fails on master since before 2026-09-16 (live-locator re-resolution after `page.goto`); full-suite only, not in the CI PR gate; follow-up GitHub issue." The suite is otherwise green on both trees.

### Orchestrator ruling items 9–11 (sequencing.md) — applied
9. **AC-6 vs TC-LW-7.3 [2]** — `font-serif` added to `ScriptureStudy.tsx:1000` and `:1017`; fence [2] read class-stripped (exit 0); whole-file class-stripped diff empty; fidelity gate re-run post-commit (below). The two RTL Hebrew blockquotes found by the same AC-6 gate on the next run were fixed the same way (class-only, same file) and are declared under this item.
10. **LCP** — step (a) preload/onload swap in `public/index.html` (above). Lighthouse 3x on `:3200` with `SERVE_PID` kill: median LCP **2112 ms**, CLS **0.005** → both under the step-(b) thresholds, so **self-hosting was NOT done**. TC-LW-8.17 holds (meta delta 0).
11. **Root Domain internal-links red** — unchanged, pre-existing, documented in the triage above; `test:e2e:full` and firefox accepted at that single red, AC-6 green.

### Follow-ups touched / logged (not in the LW-9 Files list — skipped, not done)
- `WelcomeBanner` export in `src/assets/svg/index.ts` and the `LinkNavigation.test.tsx` mock key: not removed (index.ts outside the Files list; the test is bounded to deletions = 4 by TC-LW-9.25 — removing the mock line would make it 5).
- `git rm --cached OpenDoorWebsiteApp/playwright-report/index.html` (DO-11): not done — outside the story Files list. `.gitignore:34` already lists `playwright-report/`, so un-tracking it makes every later run clean (`git checkout -- playwright-report` step becomes unnecessary); recommended as the release-plan hygiene commit.
- Docs hygiene (`docs/website-restyling-plan.md`, `docs/technical/ideal-directory-structure.md:162-182,279-302`, `docs/detailed-task-list.md:45-46`, `docs/development/components.md`, `docs/development/development-guide.md:88`, `docs/features/features.md`, `scripts/discourse-fidelity-check.sh:43`): no docs path is in the LW-9 Files list or PRD-permitted; all skipped, list carried to the release plan.
- U-1 skip link, U-3, U-4, U-5, `<noscript>`: stories.md Section 5 lists them as follow-up issues to open at merge, not LW-9 scope — none built.
- TC-LW-4.22 fence split (D-2): the contiguous `bg-white text-sage hover:bg-parchment hover:text-sage-dark` grep is split into `grep -c 'bg-white text-sage'` = 2 and `grep -c 'hover:bg-parchment hover:text-sage-dark'` = 2 (SideBar.tsx), both ≥ 2 — spec 2.6 orders hover after focus so the contiguous form can never match. Recorded here, not in stories.md.
- AC-32 / AC-42 post-deploy curls and the Facebook re-scrape: release plan, pending first-march.
- Release-note lines: WebKit not verified locally; Root Domain broken-links known issue (above); Scripture Study text byte-identical to master.

### Deviations
- Reduced-motion `transitionDuration` assertion is a numeric compare (`toBeCloseTo(0.00001, 6)` on the value in seconds), not the literal `toBe('0.01ms')` — no engine serialises it as `0.01ms` (Chromium `1e-05s`, Firefox `0.00001s`; followups hint). Same value proven, portable.
- `withoutConsent(page)` helper (a second `addInitScript` that removes `analytics-consent`) lets the two banner-mounted tests run under the file-level `grantConsent` `beforeEach` without touching the LW-4 lines.
- The chromium `congregation-y` values were re-read after Lighthouse with a scoped `--project=chromium -g "Congregation photo geometry"` run (feature `build-prod` served on 3100-3102 with `CI` unset, serves killed after; port 3200 was already free) because the firefox pass had overwritten the HTML report. Evidence read only; not part of the gating sequence.
- **Declared deviation (ruling 9 extension):** `font-serif` added to the two RTL Hebrew `<blockquote>` in `ScriptureStudy.tsx` (`:578`, `:665`) — not named in ruling 9 but the same file, same class-only mechanism, surfaced by the same AC-6 gate; accepted by the coordinator. Lora carries no Hebrew glyphs; the passages render in the stack's fallback serif, unchanged in text.
- `playwright-report/index.html` churn reverted before staging (`git checkout -- OpenDoorWebsiteApp/playwright-report`); master worktree removed; no `OpenDoorWebsiteApp/lh.json` ever written.

### Timing
~110 min: first pass ~75 (edits 10, sentinel extraction/run/triage 20, Playwright passes + batteries ~20, master worktree + parity + link triage 10, Lighthouse 5, devlog 10); ruling pass ~35 (ruling edits 5, three more full chains ~25, devlog/commit 5).

### Commit
`chore(lw-9): token retirement, sentinel battery, a11y baseline 0` — one commit on `feature/living-word-restyle`, parent `0623314`, tag `lw-9-green`, not pushed. Recipe: `git checkout -- OpenDoorWebsiteApp/playwright-report && git add -A OpenDoorWebsiteApp/ && git add -f .delivery/artifacts/06-dev/developer/devlog.md && git commit`. Post-commit: TC-LW-9.26 `BASE_REF=origin/master sh scripts/discourse-fidelity-check.sh` exit 0; TC-LW-9.25 [1] / TC-LW-8.20 / TC-LW-9.29 [1] re-checked on the tag (values in the sentinel log addendum below).
