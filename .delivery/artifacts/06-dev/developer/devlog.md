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
