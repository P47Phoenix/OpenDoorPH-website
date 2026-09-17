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
