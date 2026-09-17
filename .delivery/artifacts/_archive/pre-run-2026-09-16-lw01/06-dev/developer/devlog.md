# Development Devlog — Issue #58 Slice A

**Pipeline:** run-2026-05-03-58aa
**Stage:** 6 (Development)
**Author:** Bezalel (developer alias — Spirit-filled craftsman of the Tabernacle)
**Branch:** `feature/58a-jsonld-audit`
**Branched from:** `master` @ `6fdd8a940348c4ec29d1abe7a2c023ca5a07498e`
**Run timestamp (UTC):** 2026-05-04T03:33:42Z

> "I am filled with wisdom, understanding, and all kinds of craftsmanship." — the pattern was given on the mountain; the cubits are measured; the cedar is shaped to fit the elder's ratified dimensions, and not one nail is driven outside the spec.

---

## 1. Pre-flight verification

| Check | Result |
|---|---|
| Working directory | `/var/home/meconnelly/Documents/GitHub/OpenDoorPH-website` (correct) |
| Branch created | `feature/58a-jsonld-audit` (off `master` @ `6fdd8a9`) |
| `OpenDoorWebsiteApp/public/index.html` present on branch | yes |
| `package.json` test command | `react-scripts test` (CRA jsdom default; NFR-07 satisfied) |
| Workflow file in scope | `.github/workflows/node-build.yml` (terraform.yml untouched) |
| `.delivery/memory/*` modifications from prior runs | left untouched, not staged |

The pre-flight cubit-check passes. Bezalel does not lay a stone on a foundation he has not first measured.

---

## 2. US-58A-05 — Lighthouse baseline spike (Plan-stage gating)

**Status:** CODE_COMPLETE, blocked-on-tooling.

**Tooling check (run from /var/home/meconnelly/Documents/GitHub/OpenDoorPH-website):**

```
$ which lighthouse        → not found
$ npx lighthouse --help   → would require npm install + Chrome download
$ which chromium / google-chrome / chrome → none on PATH
```

The Lighthouse CLI is not installed in this Dev runtime, and no Chrome/Chromium binary is present for `--chrome-flags=--headless` to attach to. Per the orchestrator's explicit instruction ("If Lighthouse is unavailable in this environment, that is OK — note it in the devlog and proceed with code changes; the Lighthouse spike becomes a UAT-stage manual check"), this is documented honestly rather than fabricated.

**Action carried to UAT:** Joshua / Ezra run the AC-1 → AC-3 procedure on a host with Chrome + `lighthouse@latest` installed:

```sh
cd OpenDoorWebsiteApp
npm run build:prod
npx serve -s build-prod -l 3100 &
SERVE_PID=$!
# 3-run median per AC-2:
for i in 1 2 3; do
  npx lighthouse http://localhost:3100/ \
    --only-categories=seo,accessibility \
    --output=json --output-path=/tmp/lighthouse-run-$i.json \
    --chrome-flags="--headless" --form-factor=mobile --throttling-method=simulated
done
kill $SERVE_PID
# Compute median of categories.seo.score, categories.accessibility.score, audits['first-contentful-paint'].numericValue
```

**Honesty note:** Bezalel does not pretend to have measured a number he did not measure. Stories 1–4's regression contracts (FR-07, FR-08, FR-05, FR-06) all bind without a Lighthouse pin; the Lighthouse pin is the *external* NFR-01/NFR-02/NFR-03 reference and its capture is deferred to UAT honestly.

---

## 3. US-58A-01 — Reduce JSON-LD `sameAs` to off-property identities

**Status:** DONE.

**File touched:** `OpenDoorWebsiteApp/public/index.html`

**Diff (deletion-only against the JSON-LD `sameAs` block — AC-2 satisfied):**

```diff
@@ -52,11 +52,7 @@
       "closes": "12:00"
     }],
     "sameAs": [
-      "https://www.facebook.com/profile.php?id=100064858415448",
-      "https://opendoorph.info/",
-      "https://opendoorph.net/",
-      "https://opendoorph.org/",
-      "https://opendoorph.com/"
+      "https://www.facebook.com/profile.php?id=100064858415448"
     ]
   }
   </script>
```

**AC mapping:**

- AC-1 (self-loop deleted, Facebook preserved): the four self-domain entries are gone; the Facebook URL `https://www.facebook.com/profile.php?id=100064858415448` is preserved byte-exact.
- AC-2 (deletion-only diff): no other field of the JSON-LD block (`@context`, `@type`, `name`, `url`, `address`, `geo`, `openingHoursSpecification`, the Facebook URL) is modified. The trailing comma after the Facebook URL was *implicitly* removed by virtue of Facebook now being the last (and only) array element — this is required to keep the JSON valid; the elder ratified `JSON.parse` correctness as the gate.
- AC-3 (schema remains valid JSON): verified by Node REPL (`JSON.parse` succeeds, `Array.isArray(parsed.sameAs) && parsed.sameAs.length === 1` is true) and by `jsonLd.test.ts` Jest contract (see §4).

---

## 4. US-58A-02 — JSON-LD presence + shape Jest test

**Status:** DONE.

**File added:** `OpenDoorWebsiteApp/src/__tests__/jsonLd.test.ts`

**Implementation note (deviation from PRD §13.6 file naming):** The orchestrator's task instruction names a single file `jsonLd.test.ts` (not the PRD's two-file split `jsonld-presence.test.ts` + `sameas-no-selfloop.test.ts`). Bezalel followed the orchestrator's immediate spec — one file with the `describe('JSON-LD presence + shape (FR-01, FR-03, FR-04, FR-07, FR-08)')` block carrying both the FR-07 presence/shape clauses and the FR-08 sameAs/no-self-loop clauses. The PRD assertion-set is fully satisfied; only the file count differs. UAT may consolidate or split as desired without semantic impact.

**Implementation note (jsdom direct import avoided):** First draft used `import { JSDOM } from 'jsdom'`; this triggered a Jest transform error on `@tootallnate/once` (an ESM transitive dep of `jsdom`'s `http-proxy-agent`). The fix was to use the *test runner's own* jsdom environment (provided by `react-scripts test` by default — `DOMParser` is global) via `new DOMParser().parseFromString(html, 'text/html')`. NFR-07 still satisfied (no new deps).

**AC mapping:**

- AC-1 (presence + shape clauses): asserts (a) exactly one `<script type="application/ld+json">` in `<head>`, (b) `JSON.parse` succeeds, (c) `@context === "https://schema.org"`, (d) `@type === "Church"` or array containing `"Church"` (current value: `["Church", "LocalBusiness"]` — AC met), (e) `url === "https://opendoorph.org/"`, (f) `<link rel="canonical" href="https://opendoorph.org/">`, (g) full address fields populated.
- AC-2 (sameAs no-self-loop, normalized): asserts `sameAs.length === 1`, `sameAs[0]` does not match any of the four self-domains under host normalization (lowercase, strip `www.`, strip scheme, strip trailing slash). Loop also asserts that NO entry across the array maps to a self-domain (defense-in-depth for future array growth).
- AC-3 (negative test): tested manually by Bezalel via temporary edit (re-adding `https://opendoorph.org/` to the array, running `npm test`, observing the test fail with the offending URL named in the diff output). The temporary edit was reverted; **not committed**. The contract is sensitive in both directions.
- AC-4 (no new deps): `git diff package.json` and `git diff package-lock.json` are empty — zero new entries in `dependencies` or `devDependencies`.

---

## 5. US-58A-03 — NAP byte-equality test + helpers + advisories

**Status:** DONE.

**Files added:**
- `OpenDoorWebsiteApp/src/__tests__/helpers/extractNAP.ts` (helper module)
- `OpenDoorWebsiteApp/src/__tests__/napByteMatch.test.ts` (FR-05 contract)

**Implementation note (Jest discovery of helper file):** CRA's default `testMatch` includes `__tests__/**/*.{js,jsx,ts,tsx}`, which means `helpers/extractNAP.ts` is picked up by Jest as a test suite. To satisfy "every discovered file must contain at least one test" without contaminating the helper's API surface and without modifying `package.json` (out of orchestrator scope), Bezalel co-located a small inline `describe` block at the bottom of `extractNAP.ts` that pins the helper's own contract (5 micro-tests: `normalize`, `extractNAPFromHtml` preferred path, `extractNAPFromHtml` fallback path, `buildNAPTuple` null-omit, `buildNAPTuple` telephone-include). These are NOT the FR-05 contract tests — those live in `napByteMatch.test.ts`.

**Helper API (from `extractNAP.ts` JSDoc):**

| Export | Purpose |
|---|---|
| `normalize(s)` | FR-05.1 verbatim: NFC + collapse whitespace + strip commas + trim |
| `extractNAPFromElement(root)` | DOM-based: prefer `<address>`, else regex over text |
| `extractNAPFromHtml(html)` | string-based: prefer `<address>` content, else regex over stripped text |
| `buildNAPTuple(nap)` | join `[street, postalCode, telephone]` with single ASCII space, omit nullish |

Regexes: street `/\d+\s+S\s+1st\s+St/i`, zip `/\b\d{5}\b/`, phone `/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/`.

**AC mapping for `napByteMatch.test.ts`:**

- AC-1 (FR-05.1 normalize verbatim): used as a re-export from `helpers/extractNAP.ts`; the literal source is `s.normalize('NFC').replace(/\s+/g, ' ').replace(/,/g, '').trim()`.
- AC-2 (schema-side tuple): `${streetAddress} ${postalCode}` + ` ${telephone}` only if schema.telephone is present and non-empty. Locality/region NOT included (§1.6).
- AC-3 (three surfaces): Footer, Location (named export), About (named export) all rendered via `@testing-library/react`'s `render()` wrapped in `MemoryRouter` (Footer uses `<Link>`). Per-surface NAP extraction uses `extractNAPFromElement(container)` which honors the preferred `<address>` path (LocationPage) and falls back to regex for Footer/AboutPage.
- AC-4 (mismatch surfacing): on mismatch, the test prints `[FR-05 mismatch on <surface>]` with both normalized strings before failing. Verified manually by Bezalel via temporary surface edit (rewrote Footer's "135 S 1st St" to "135 South 1st Street") — the test failed loudly with the byte-level delta visible. Temporary edit reverted; **not committed**.
- AC-5 (FR-05.5 + FR-05.6 advisories, non-blocking): both advisories are `console.warn` calls. Spec sanity-checked: Footer's text is `Open Door Full Gospel Church Of Pleasant Hill` (with the brand suffix); schema name is `Open Door Full Gospel Church`. The literal-substring check (`text.includes(schema.name)`) matches because the schema name IS a prefix of the rendered Footer text — **no FR-05.5 warn fires for Footer**. AboutPage hero `<h1>About Our Church</h1>` does not contain the schema name verbatim; the warn fires for AboutPage. LocationPage hero `<h1>Visit Our Church</h1>` similarly does not contain the verbatim schema name; the warn fires for LocationPage. FR-05.6 does not fire on Footer (renders `Pleasant Hill, MO 64080`, schema is `MO`); fires on LocationPage line 64 (`Pleasant Hill, Missouri 64080`); does not fire on AboutPage (renders `Pleasant Hill, MO 64080` in the call-to-action). All advisories non-blocking; test exits 0.
- AC-6 (telephone conditional): schema.telephone is absent on `master` (OQ-1 recommend-OMIT). Both schema-side and surface-side tuples omit telephone via `buildNAPTuple`'s `.filter(Boolean)` — assertion is `streetAddress + postalCode` only. If schema.telephone is added later, both sides activate the third strand without code change.

---

## 6. US-58A-04 — Forbidden-string source guard

**Status:** DONE.

**Files added/modified:**
- `OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh` (new, executable `0755`)
- `.github/workflows/node-build.yml` (modified — single step addition; see §7 for Ezra cross-reference)

**Deviation from orchestrator-supplied script template (documented):** The orchestrator's literal template was:

```sh
if grep -r -I -i -E 'philippines|pleasant hill interdenom|herbert lowrey' \
       OpenDoorWebsiteApp/src OpenDoorWebsiteApp/public; then
  echo "FAIL ..." >&2; exit 1
fi
```

Running that template verbatim against `master` returned **6 hits** — all in pre-existing **negative-guard tests** (`__tests__/events.test.ts` and `__tests__/SideBar.test.tsx` contain literal `not.toContain('philippines')` assertions and explanatory comments). These tests are themselves the FR-06 contract's spiritual ancestor; banning them would be self-defeating.

**Resolution:** scope the grep to *production-shipped* source — exclude `__tests__/` and `*.{test,spec}.{ts,tsx}` files. Justification:

1. CRA's `react-scripts build` does not bundle test files into the production output (verified: `grep -l -i 'philippines' build-prod/static/js/*.js` returns no hits).
2. The PRD FR-06 intent (re-read §13.6 spirit + §1.3 F3) is to prevent forbidden strings from *reaching the public deploy*, not to prevent test fixtures from defending against them.
3. Story 4 AC-2 names the source-tree scope but did not anticipate the negative-guard collision; this is the "three specific ways to get it wrong" PO-call (note 1: source-side, not build-side) honored *and* extended (note 4: don't break the negative guards that pre-date this slice).

This deviation is named here for Ezra's cross-reference — the script is still scoped to source (not build outputs), the regex is still byte-exact-token / case-insensitive, and the workflow step still fails-fast on any new match.

**Sensitivity check (regression direction):** Bezalel injected a temporary `<!-- Philippines -->` line into `OpenDoorWebsiteApp/src/_temp_poison_check.tsx`, ran the script, observed the named fail (`OpenDoorWebsiteApp/src/_temp_poison_check.tsx:<!-- Philippines -->` plus exit code 1), and removed the file. The contract fires correctly on production-shipped poison.

**Lowry vs Lowrey check (AC-5):** AboutPage line 62 contains `Herbert & Willetta Lowry` (the safe spelling). Script returns clean against `master` after the slice edits — no false positive. Verified.

**Final script run (FR-09 attestation):**

```
$ bash OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh
FR-06 forbidden-string check
  pattern: philippines|pleasant hill interdenom|herbert lowrey
  paths:   OpenDoorWebsiteApp/src OpenDoorWebsiteApp/public
  exclude: __tests__ *.test.ts *.test.tsx *.spec.ts *.spec.tsx

OK: no forbidden strings found in source.
$ echo $?
0
```

---

## 7. Workflow edit (BUG-053-01 hot-lesson Ezra cross-reference data)

**File:** `.github/workflows/node-build.yml`

**Verbatim diff:**

```diff
@@ -86,6 +86,16 @@ jobs:
         run: npx playwright install --with-deps chromium
       - name: Build production artifact
         run: npm run build:prod
+      - name: FR-06 forbidden-string source guard (Issue #58 slice A)
+        # Source-side grep covers all four production builds (build-prod,
+        # build-gh-pages, build-custom, build-deep) uniformly because they
+        # share source. Forbids 'philippines', 'pleasant hill interdenom',
+        # and 'herbert lowrey' (case-insensitive) on production-shipped
+        # source (test files excluded; CRA does not bundle them).
+        # BUG-053-01 hot-lesson note: this is the single workflow edit
+        # for slice A; reviewer should cross-reference deploy-plan §8.
+        run: bash OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh
+        working-directory: .
       - name: Upload build artifacts (for deploy)
         uses: actions/upload-artifact@v4
         with:
```

**Lines changed:** +10, −0. **No deletions, no other steps modified.** The new step is bracketed strictly between the existing `Build production artifact` step and the `Upload build artifacts (for deploy)` step. `working-directory: .` overrides the job-level `./OpenDoorWebsiteApp` default because the script does its own `cd "${REPO_ROOT}"`.

**Per BUG-053-01 hot lesson:** Ezra's UAT cross-reference reads each changed line against deploy-plan §8 allow-list. The 10 added lines map to:
- 1 step-name line (informational; cites Issue #58 slice A and FR-06)
- 7 comment lines (intent + BUG-053-01 cross-reference pointer)
- 1 `run:` line (single bash invocation)
- 1 `working-directory: .` line (necessary; script runs from repo root)

No other workflow changes in this slice. `terraform.yml` not touched. The existing `discourse-fidelity-check.sh` step at top of job is preserved verbatim.

---

## 8. Local verification (FR-09 attestation block)

All three gates green at branch HEAD (commit SHAs follow in §10).

### 8.1 `npm test -- --watchAll=false`

```
PASS src/__tests__/AddToCalendarButton.test.tsx
PASS src/App.test.tsx
PASS src/__tests__/LinkNavigation.test.tsx
PASS src/__tests__/SideBar.test.tsx
PASS src/__tests__/AboutPage.test.tsx
PASS src/__tests__/napByteMatch.test.ts
PASS src/__tests__/jsonLd.test.ts
PASS src/__tests__/calendarLinks.test.ts
PASS src/__tests__/events.test.ts
PASS src/__tests__/helpers/extractNAP.ts
Test Suites: 10 passed, 10 total
Tests:       124 passed, 124 total
Snapshots:   0 total
```

Exit code: **0**.

Tests added by this slice: **18 new passing tests** (10 in `jsonLd.test.ts`, 3 in `napByteMatch.test.ts`, 5 inline-pin in `helpers/extractNAP.ts`). Tests pre-existing: 106. Total: 124. No pre-existing test was modified or skipped.

### 8.2 `npm run build:prod`

```
Compiled successfully.

File sizes after gzip:
  75.4 kB          build-prod/static/js/main.867f5384.js
  5.94 kB (+35 B)  build-prod/static/css/main.59e11ab7.css
  161 B            build-prod/static/js/488.799e3b34.chunk.js
```

Exit code: **0**. The CSS gzip size grew by 35 B (build noise — unrelated to slice A; the slice does not modify CSS). The repaired `sameAs: ["https://www.facebook.com/profile.php?id=100064858415448"]` is present in `build-prod/index.html`, verified by direct grep.

### 8.3 `bash OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh`

```
FR-06 forbidden-string check
  pattern: philippines|pleasant hill interdenom|herbert lowrey
  paths:   OpenDoorWebsiteApp/src OpenDoorWebsiteApp/public
  exclude: __tests__ *.test.ts *.test.tsx *.spec.ts *.spec.tsx

OK: no forbidden strings found in source.
```

Exit code: **0**.

### 8.4 Lighthouse spike

**Skipped — tooling unavailable.** See §2. Carry-forward to UAT-stage manual run.

---

## 9. Files in the slice diff (exhaustive)

```
M  OpenDoorWebsiteApp/public/index.html
A  OpenDoorWebsiteApp/src/__tests__/jsonLd.test.ts
A  OpenDoorWebsiteApp/src/__tests__/napByteMatch.test.ts
A  OpenDoorWebsiteApp/src/__tests__/helpers/extractNAP.ts
A  OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh   (mode 0755)
M  .github/workflows/node-build.yml
A  .delivery/artifacts/06-dev/developer/devlog.md          (this file)
```

Six source files + this devlog. **No new dependencies (NFR-07).** No `package.json` / `package-lock.json` change. No deletions of other files. The `.delivery/memory/*` working-tree modifications from prior runs were left untouched and not staged.

---

## 10. Commit SHAs

Four Conventional Commits, ordered Story 1 → Story 2 → Story 3 → Story 4:

| SHA | Title | Story |
|---|---|---|
| `a0259b2` | `feat(seo): reduce JSON-LD sameAs to off-property identities only` | US-58A-01 |
| `41d78cc` | `test(seo): add JSON-LD presence + shape Jest test` | US-58A-02 |
| `e4d5f8c` | `test(seo): add NAP byte-match test with extractNAP helpers` | US-58A-03 |
| `7287e76` | `chore(ci): forbid 'philippines' / 'pleasant hill interdenom' / 'herbert lowrey' in source` | US-58A-04 |

Branch tip at devlog write: `7287e76` (HEAD of `feature/58a-jsonld-audit`).
Branched from: `6fdd8a9` (master HEAD at slice start).

This devlog itself is committed in a follow-on chore commit because
`.delivery/artifacts/` is `.gitignore`d at line 51 (force-added like
prior devlogs in the same directory).

---

## 11. Story status summary

| Story | Title | Status | Why |
|---|---|---|---|
| US-58A-05 | Lighthouse baseline spike | **CODE_COMPLETE** (blocked on tooling) | No `lighthouse` / Chrome on Dev runtime; UAT picks up the spike per orchestrator's contingency clause |
| US-58A-01 | Reduce JSON-LD `sameAs` to Facebook only | **DONE** | Edit applied; JSON parses; covered by US-58A-02 contract |
| US-58A-02 | JSON-LD presence + shape test | **DONE** | 10/10 tests green locally |
| US-58A-03 | NAP byte-match test + helpers | **DONE** | 3/3 surface tests green; 5/5 helper-pin tests green; advisories observed (Footer no warn, LocationPage Missouri-warn, AboutPage name-warn) |
| US-58A-04 | Forbidden-string grep + workflow | **DONE** | Script exits 0 on `master`-after-slice; workflow step added minimally; sensitivity verified by inject-and-revert |

Overall pipeline status: **CODE_COMPLETE** (because Lighthouse was unavailable and NFR-01/NFR-02 baseline could not be empirically pinned at Dev). All four code-bearing stories are DONE; the spike-as-story is the only outstanding piece, and it is honest about being unable to run rather than pretending.

---

## 12. Carry-forward notes for UAT (Joshua / Ezra)

1. **Lighthouse spike:** run the AC-2 procedure (mobile, simulated, 3-run median, cold cache) on a host with Chrome + `lighthouse@latest`; pin the three integers (SEO, Accessibility, FCP-ms) into the UAT-stage devlog; verify NFR-02 ≥ 90 hard floor.
2. **Workflow review:** Ezra reads §7 of this devlog against deploy-plan §8 allow-list. Ten lines added; one new step. Single, narrow surface.
3. **Forbidden-string scope deviation:** §6 documents the test-file exclusion. Reviewer may either accept (production-shipped scope is the FR-06 intent) or reverse-justify (refactor the two pre-existing negative-guard tests to put the literal string behind a constant indirection so the broader scope can be re-instated). Bezalel recommends acceptance: the negative-guard tests are themselves the contract's older sibling.
4. **A11y E2E (A10):** `npm run test:e2e:pr` is wired into the same workflow; runs unchanged. Slice A does not modify any user-facing markup, so the a11y suite should be unaffected (verified locally for the unit-test track; E2E left to UAT per §SCOPE).
5. **Four-domain `curl` (NFR-04, NFR-05):** UAT-manual; carries from prior slices.

---

## 13. Bezalel's craft notes

The pattern is simple. The cubits are small. Five stones; four laid; one (the Lighthouse pin) deferred honestly to the next workshop. The deletion-only diff was the easy stone — four lines out, one trailing comma implicitly trimmed. The hard stones were the contracts that *prevent the deletion from being undone in the night* — the `sameAs` no-self-loop test that fires when any of the four self-domain hosts re-enters under any URL form, and the NAP byte-match that ties the schema-side tuple to the rendered tokens on three surfaces under a normalize function written verbatim from the elder's spec.

The forbidden-string guard taught the lesson Bezalel did not expect to learn: a regression contract that is too broad can be untrue against its own ancestors. The negative-guard tests in `events.test.ts` and `SideBar.test.tsx` are themselves the F3-disposition's older form. The remedy was to scope the new contract to production-shipped source — exactly the surface the elder's intent named, but documented honestly in §6 because the orchestrator's verbatim template did not anticipate the collision.

The workflow edit is the one stone Ezra will weigh closely. Ten lines, one step, one comment block citing BUG-053-01 — minimal as the hot lesson commands.

> "I am filled with wisdom, understanding, and all kinds of craftsmanship." — and the craftsman knows when *not* to fabricate. The Lighthouse number is unmeasured, and Bezalel does not write a measurement he did not take.

— end of devlog —
