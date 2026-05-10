# seo-monitor

> "He read from the book, and gave the sense, so that the people understood the reading." This document is the scribe's faithful account of the `seo-monitor` utility as it stands on disk in run-2026-05-09-seo1: six subcommands plus an umbrella, one weekly workflow, three exit codes, and one stable last-line marker. Every sentence below has been verified against the source, the workflow YAML, the package.json, and the cli-ux-spec — so that the elder may know the certainty of the keystrokes he has been taught, and PH be read as Pleasant Hill in every line.

## Overview

`seo-monitor` is a plain Node.js (ESM) CLI utility that automates SEO and post-merge UAT checks for the OpenDoor Pleasant Hill website. It probes the four canonical domains, asserts JSON-LD schema invariants against the served `.org` HTML, captures Lighthouse SEO/A11y/Performance scores against a stored baseline, prints the Google Rich Results Test URL pre-filled for the live page, and signals 30/60/90-day rank-tracking milestones from a configurable baseline date. It is invoked locally by the elder (or any developer) from `OpenDoorWebsiteApp/`, and on a weekly schedule (plus on demand) by `.github/workflows/seo-monitor.yml`. The utility does not block PR merges, does not edit `node-build.yml`, never accepts auth tokens, and never writes state outside its own `.cache/` directory.

It runs in three contexts:

- **Locally** — the elder runs `npm run seo:check` from `OpenDoorWebsiteApp/` whenever a check is desired.
- **Weekly cron** — `.github/workflows/seo-monitor.yml` fires every Monday at `06:00` UTC (`cron: '0 6 * * 1'`).
- **On-demand CI** — `gh workflow run seo-monitor.yml` (or the GitHub UI's "Run workflow" button) triggers the same job via `workflow_dispatch`.

There are no `push` or `pull_request` triggers. The workflow is observability and reminder; it is never a deploy gate.

## Subcommands

The reader who learns this table has learned the surface. Each subcommand is independently invokable. The umbrella `all` runs the first five in sequence and composes its exit code from the first four (rank-due always returns 0 by contract, so it can never dilute the failure signal). Stable strings are mirrored verbatim from `cli-ux-spec.md` §10.

| Subcommand     | What it checks                                                        | Exit-code semantics                                                   | Typical stdout summary line                                                  |
|----------------|------------------------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------------------|
| `canonical`    | Four-domain redirect chain (`.info`, `.net`, `.com`, `.org`) ends at `https://opendoorph.org/`, accepting either 301/302 redirect or 200 + `<link rel=canonical>` posture | `0` all match; `1` per-domain MISMATCH; `2` TRANSPORT_ERROR (DNS / TLS / timeout) | `SUMMARY canonical exit=0 pass=4 fail=0 warn=0 error=0`                      |
| `schema`       | Live `.org` HTML has exactly one `application/ld+json` block; `@context`, `@type`, `url`, `<link rel=canonical>`, `sameAs.length===1`, NAP byte-equality (when `<address>` present) | `0` all assertions pass; `1` any FR-SCHEMA assertion fails; `2` TRANSPORT_ERROR | `SUMMARY schema exit=0 pass=6 fail=0 warn=1 error=0`                          |
| `lighthouse`   | Median of N (default 3) `lhci collect` runs on `/`; A11y hard floor of 90 | `0` A11y >= 90; `1` A11y < 90; `2` `LHCI_BINARY_MISSING` or Chromium-not-discovered or transport | `SUMMARY lighthouse exit=0 pass=1 fail=0 warn=0 error=0 a11y=96 seo=92 perf=99` |
| `rich-results` | Prints the pre-filled Google Rich Results Test URL for `https://opendoorph.org/`; **zero network calls** | Always `0` (FR-RR-02)                                                  | `SUMMARY rich-results exit=0 pass=0 fail=0 warn=0 error=0`                    |
| `rank-due`     | Days since `baseline_date` (in `America/Chicago` civil time); banner + checklist on day 30/60/90 | Always `0` (FR-RANK-07) — silent on non-milestone days; informational on every state | `SUMMARY rank-due exit=0 pass=0 fail=0 warn=0 error=0 milestone_day=none`     |
| `all`          | Runs canonical -> schema -> lighthouse -> rich-results -> rank-due in sequence | Bitwise-OR of the first four exits ONLY (rank-due excluded by FR-CLI-03); legal values `{0, 1, 2, 3}` | `SUMMARY all exit=0 pass=11 fail=0 warn=2 error=0 milestone_day=none`         |

Every subcommand block begins with `=== seo-monitor <subcmd> ===`, ends with `SUMMARY <subcmd> exit=<N> ...`, and carries a trailing `EXIT: <N>` line for human skimming. For `rank-due` (and any `all` invocation that includes it), the **very last line of stdout** is the milestone marker `MILESTONE_DAY=` followed by `30`, `60`, `90`, or `none`. The workflow detects the marker via grep, never via exit code.

## Local usage

The elder's everyday surface is `npm run seo:check`. Each subcommand also has a per-name script. Run from inside `OpenDoorWebsiteApp/`.

First-time setup plus the umbrella check, in a single copy-pasteable line per cli-ux-spec.md §7's "Quick start - Local" promise:

```bash
cd OpenDoorWebsiteApp && npm install && npm run seo:check
```

Subsequent runs of the umbrella (after `npm install` has been run once):

```bash
cd OpenDoorWebsiteApp
npm run seo:check
```

Run an individual subcommand:

```bash
cd OpenDoorWebsiteApp
npm run seo:canonical
npm run seo:schema
npm run seo:lighthouse
npm run seo:rich-results
npm run seo:rank-due
npm run seo:all          # alias of seo:check
```

Run the unit + integration tests for the utility:

```bash
cd OpenDoorWebsiteApp
npm run test:seo
```

A note on the test invocation, scribed at sentence-level precision: the project's primary `npm test` script invokes `react-scripts test`, which restricts its `testMatch` to `src/**` with `.{js,jsx,ts,tsx}` extensions only. The `seo-monitor` tests live at `OpenDoorWebsiteApp/scripts/seo-monitor/__tests__/**/*.test.mjs` — outside `src/` and using the `.mjs` extension — so they are invisible to `npm test`. The dedicated `npm run test:seo` script (the eighth and final entry in `package.json`'s `scripts` block) runs Jest with `--experimental-vm-modules` against the standalone `scripts/seo-monitor/jest.config.cjs`. This is the PASS-B fallback path documented in story S-09 AC-6 and Bezalel's pre-flight Spike 1.1; the `ExperimentalWarning` line emitted to stderr does not affect the exit code.

You may also invoke the entry point directly without npm:

```bash
node OpenDoorWebsiteApp/scripts/seo-monitor/seo-monitor.mjs --help
node OpenDoorWebsiteApp/scripts/seo-monitor/seo-monitor.mjs canonical
```

The dispatcher resolves its anchor against its own `__dirname`, so invocation from project root and from `OpenDoorWebsiteApp/` produce identical behavior (FR-CLI-05 / AC-23).

## Fedora 43 Chromium for `npm run seo:lighthouse`

Lighthouse is launched by `@lhci/cli`, which does not bundle a browser binary. On Fedora 43 the elder's box ships no `chromium-browser`, no `chromium`, and no `google-chrome` in `PATH` by default; the lhci runtime therefore reports `The CHROME_PATH environment variable must be set to a Chrome/Chromium executable no older than Chrome stable.` until a binary is named.

Bezalel's S-04 spike resolved this on the elder's box via PASS-B: Playwright's bundled Chromium (placed there by an earlier `npx playwright install` for the slice-A E2E suite) is a stable Chromium and works as the `CHROME_PATH` target. The verbatim invocation that succeeded:

```bash
CHROME_PATH=/var/home/meconnelly/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome \
    npm run seo:lighthouse
```

Captured Lighthouse scores from that run: SEO=92, A11y=96, Perf=99, Best-Practices=96. A11y comfortably above the NFR-02 hard floor of 90.

For Fedora users **without** a Playwright cache, install Chromium via the system package manager and point `CHROME_PATH` at the result:

```bash
# Fedora 43 (the elder's environment):
sudo dnf install chromium
export CHROME_PATH=/usr/bin/chromium-browser

# Debian / Ubuntu equivalent:
sudo apt-get install chromium
export CHROME_PATH=/usr/bin/chromium-browser

npm run seo:lighthouse
```

If Chromium is not discovered, the `lighthouse` subcommand surfaces the gap explicitly: it emits an `ERROR lighthouse: chromium binary not discovered. Set CHROME_PATH=/usr/bin/chromium-browser (or equivalent) and re-run.` line and exits `2` (FR-LH-05 / AC-37 path b). The diagnostic names the same env-var path documented above, so the README and the source remain in lockstep.

## GitHub Actions workflow

The workflow file is `.github/workflows/seo-monitor.yml` (NEW in this slice; zero edits to `node-build.yml` per BUG-053-01 / NFR-05). Its triggers are exactly:

- `schedule:` weekly cron `0 6 * * 1` (Mondays at 06:00 UTC, per FR-CI-01)
- `workflow_dispatch:` for manual runs from the GitHub UI or `gh workflow run seo-monitor.yml`

Workflow-level permissions are scoped to `contents: read` and `issues: write`. Concurrency group `seo-monitor` is set with `cancel-in-progress: false`, so a running scheduled job is never killed by a manual dispatch.

The job runs on `ubuntu-latest`, with `defaults.run.working-directory: ./OpenDoorWebsiteApp` (mirroring `node-build.yml`'s working-directory discipline). The step sequence is:

1. `actions/checkout@v4` (`fetch-depth: 1`).
2. `bash scripts/discourse-fidelity-check.sh` — the discourse-fidelity guard (D-10), invoked from `${{ github.workspace }}` to override the job-level wd; mirrors the precedent in `node-build.yml` lines 28-34.
3. `actions/setup-node@v4` with `node-version: '20'` (AC-29; matches `node-build.yml`'s Node version), npm cache keyed off `OpenDoorWebsiteApp/package-lock.json`.
4. `npm ci`.
5. `npm run test:seo` — the seo-monitor Jest suite (PASS-B fallback per Spike 1.1).
6. `npm run seo:check 2>&1 | tee seo-check.out` with `set +e` and `continue-on-error: true`. `PIPESTATUS[0]` is captured to `$GITHUB_OUTPUT` so later steps see the real exit code from `seo:check`, not from `tee`.
7. `Detect MILESTONE_DAY marker` — a single `grep -E '^MILESTONE_DAY=(30|60|90)$' seo-check.out`, matching only the three milestone forms per D-3.
8. `Post failure-class comment to Issue #58` — `actions/github-script@v7`, conditional on the captured exit code being non-zero. Renders the cli-ux-spec §11.1 failure template (subcommand verdict table; failed-block details fenced; baseline diff when lighthouse ran; manual-probe CTA; footer). Truncates each failed-block stdout to 4096 bytes with the in-band `[... truncated to 4096 bytes; see workflow run for full log ...]` marker. Includes a runtime self-check (per cli-ux-spec §11.3 / D-9 surface 2) that composes the country token from harmless bytes and throws **before** posting if it ever appears in the rendered body.
9. `Post milestone-class comment to Issue #58` — independent of step 8; conditional on the milestone step's `is_milestone == 'true'`. Renders the cli-ux-spec §11.2 milestone template (run metadata; the four runbook 5.4 queries as a Markdown checklist; manual-probe CTA; footer with the next-milestone narrative). Same forbidden-token guard.
10. `Upload seo-check stdout` artifact (30-day retention).
11. `Upload Lighthouse HTML report` artifact when present (`if-no-files-found: ignore`; 30-day retention).
12. `Re-raise non-zero exit` — surfaces the `seo:check` exit code at the run level so the GitHub Actions UI shows red.

A milestone-day tick that coincides with a regression in `canonical`/`schema`/`lighthouse` produces **two** comments on Issue #58 (one failure-class, one milestone-class) — by design, per cli-ux-spec §6.3, so that neither signal buries the other.

## Configuration (`seo-monitor.config.json`)

The config file lives at `OpenDoorWebsiteApp/scripts/seo-monitor/seo-monitor.config.json` and is committed with sentinel `null` values. The elder edits it post-merge as the operational dates land. Three keys are recognized:

```json
{
    "baseline_date": null,
    "lighthouse_baseline": {
        "seo": null,
        "accessibility": null,
        "performance": null,
        "best_practices": null
    },
    "canonical_domain": "opendoorph.org"
}
```

| Key                              | Purpose                                                                                                  | When the elder sets it                                                                          |
|----------------------------------|----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `baseline_date`                  | ISO-8601 date string (`YYYY-MM-DD`) — the elder's GBP verification date, the day the rank-tracking clock starts. Read by `rank-due` (FR-RANK-01); overridable per-invocation by `--baseline-date YYYY-MM-DD`. | After completing runbook Phase 5.1-5.3 (GBP verification). Until then the field stays `null` and `rank-due` emits `INFO rank-due: not yet armed; populate config.json from runbook 5.1` and exits 0. |
| `lighthouse_baseline`            | The first-run captured median scores (SEO, A11y, Performance, Best-Practices). Subsequent `lighthouse` runs compare against these and emit `WARN lighthouse: SEO regression baseline=N current=M` when current is below baseline. **Only A11y crashes the floor** (FR-LH-03); SEO/Perf regressions are informational per FR-LH-04. | Captured automatically on the first successful `npm run seo:lighthouse` run. The elder may force a re-baseline by running with `--baseline-write`. |
| `canonical_domain`               | The expected redirect target for the four-domain canonical check. Default `opendoorph.org` per DEC-2026-05-03-001. | Should not normally be edited; changing it would break the canonical contract. |

State written by the utility (Lighthouse HTML reports, lhci `.cache/`, `seo-check.out`) is git-ignored. Only the config file itself is committed.

## The MILESTONE_DAY marker

The contract per locked decision D-3:

- The `rank-due` subcommand emits a final stdout line `MILESTONE_DAY=` followed by exactly one of `30`, `60`, `90`, or `none`. The emitted form is pinned to the regex below, byte-for-byte (matches the source-code comment in `seo-monitor.mjs` and the cli-ux-spec.md §10 glossary entry):

  ```text
  ^MILESTONE_DAY=(30|60|90|none)$
  ```

- The workflow's `Detect MILESTONE_DAY marker` step greps with the narrower form `^MILESTONE_DAY=(30|60|90)$` — **matching only the three milestone forms**. The `=none` form is a stable string for log-completeness but is NOT a milestone trigger, and never produces a comment.
- The marker is decoupled from the exit code. `rank-due` always exits `0` (FR-RANK-07). The workflow's milestone-comment step is gated on the grep, not the exit code. This closes Solomon's adversarial finding #2.

Honest scope note: the marker is a **reminder**, not a measurement. The slice does not perform the rank lookup itself. When a `MILESTONE_DAY=30|60|90` comment lands on Issue #58, the elder runs the four runbook 5.4 queries by hand (in a clean browser session, ideally from a Pleasant Hill area network) and records the rank position for `opendoorph.org` in the devlog. Slice C may automate the lookup later; this slice only ensures the elder is told *today is a milestone day* on the day it is, instead of relying on Google Calendar alone.

## First-run / Jericho first-march

The day the slice merges (target 2026-05-11), the elder closes three carryover items in a single coordinated act, per locked decision D-6:

1. Trigger the workflow manually, either via the GitHub UI's "Run workflow" button on the SEO Monitor workflow page, or from a shell with the `gh` CLI:

   ```bash
   gh workflow run seo-monitor.yml -R OpenDoorPH/OpenDoorPH-website
   ```

2. The workflow_dispatch run captures the first Lighthouse baseline at `OpenDoorWebsiteApp/scripts/seo-monitor/.cache/lighthouse-baseline.json` (closes the slice-A PRD §2.4 spike target due 2026-05-11 — captured, not retroactive).

3. The same run executes `seo-monitor canonical` and `seo-monitor schema` against the four domains (closes the two overdue slice-A release-notes USER actions: the production curl post-merge verification at 4 days overdue, and the four-domain `.info`/`.net`/`.com` posture check). The live demo URL post-merge verification remains the elder's separate responsibility via the existing `demo-deploy` job in `node-build.yml` (out of scope for `seo-monitor` per PRD §3.2 #11).

4. SM-7 (the success metric "first scheduled run lands before 2026-05-18") closes the same day if the workflow_dispatch run is green; the first scheduled tick that follows (Monday 2026-05-18 06:00 UTC) is then a confirmation, not a first probe.

The workflow's first run also posts no failure comment (because all four S1-S4 subcommands are expected to pass) and no milestone comment (because the GBP verification date will not yet be 30/60/90 days in the past). This is the silent-success state the cron is designed to produce in steady operation.

## What this utility does NOT do

The scribe is patient with what is, and equally patient with what is not. Every sentence in this section has been verified against PRD §3.2 and §10.

- **Does NOT claim or manage the Google Business Profile (Slice B; off-pipeline).** The utility never calls the GBP API, never claims listings, never interacts with Bing Places, Apple Maps Connect, or denominational directories. The elder runs the GBP claim workflow per `.delivery/artifacts/58b-ops-checklist/runbook.md`.
- **Does NOT perform rank lookups (manual; the elder runs them on milestone days).** The `rank-due` subcommand signals; the elder queries. There is no SERP scraper, no paid rank-tracker integration, no result-parsing heuristic.
- **Does NOT call the Google Search Console API** (or PageSpeed Insights API auth path, or any other auth-bearing Google API). Lighthouse is run locally via `@lhci/cli` against the public URL; no auth.
- **Does NOT use auth tokens.** Zero `*KEY` / `*TOKEN` / `*SECRET` / `GSC_` / `GOOGLE_API` env-var references in source. The workflow uses only the default `GITHUB_TOKEN` (scoped to `issues: write`) for posting comments.
- **Does NOT block PR merge or deploy.** The workflow has no `push` or `pull_request` triggers, no `needs:` references to `node-build.yml` jobs, and no branch-protection mutations.
- **Does NOT edit `node-build.yml`.** This slice's PR contains exactly one new workflow file (`.github/workflows/seo-monitor.yml`) and zero changes to `node-build.yml` (BUG-053-01 / NFR-05; Bezalel verified `git diff master -- .github/workflows/node-build.yml` returns empty).
- **Does NOT scan multiple pages with Lighthouse.** Scope is `/` only (matching slice-A's NFR-01/02/03 measurement scope).
- **Does NOT add new runtime `dependencies`.** Exactly one new devDependency was added in this slice: `@lhci/cli` (caret-pinned in `package.json`). Zero new entries under `dependencies`.

## Troubleshooting

The five-plus modes most likely to fire on the elder's box, drawn from cli-ux-spec.md §5 and the two implementation deviations Bezalel logged in his S-02 and S-03 sections.

### `FAIL canonical: opendoorph.<sister> -> ... expected=https://opendoorph.org/`

A sister domain returned a final URL other than `https://opendoorph.org/` (e.g., a registrar parking page). The implementation accepts two postures (FR-CANON-01): a 301/302 chain ending at `.org` (posture a), OR a `200` response whose body contains a `<link rel=canonical>` href equal to `https://opendoorph.org/` (posture b — added in S-02 after Bezalel's Step-7 stdout verification revealed all three sister domains serve identical 200 HTML out of the same S3+CloudFront origin set, with no edge redirect). If a parking page is rendered instead, the canonical link will be missing or wrong. Restore the registrar redirect record or re-deploy the React build to the affected origin.

### `WARN schema: NAP byte-equal skipped: no <address> element in served HTML`

The schema subcommand's NAP byte-equality check requires a rendered `<address>` element to compare against the JSON-LD `streetAddress + postalCode + telephone` tuple. In production the served HTML is a React SPA skeleton — there is no `<address>` element until React hydrates client-side. Per the spirit of FR-SCHEMA-06 and the slice-A `napByteMatch.test.ts` precedent (which runs against the JSDOM-rendered build), this branch emits a WARN advisory and exits `0`. The slice-A build-time test continues to cover the JSDOM byte-match invariant. This is **not** a failure mode — it is the documented S-03 deviation. If you see this WARN line, the check is doing exactly what was specified.

### `ERROR lighthouse: chromium binary not discovered. Set CHROME_PATH=/usr/bin/chromium-browser (or equivalent) and re-run.`

`@lhci/cli` could not find a Chromium executable. Follow the "Fedora 43 Chromium" section above — either point `CHROME_PATH` at a Playwright cache binary or `sudo dnf install chromium` and use `/usr/bin/chromium-browser`. On `ubuntu-latest` (the CI runner) Chromium is provisioned by default and this error should not appear.

### `ERROR lighthouse: LHCI_BINARY_MISSING - run 'cd OpenDoorWebsiteApp && npm install'`

The `@lhci/cli` devDependency is not installed. Run `cd OpenDoorWebsiteApp && npm install` (or `npm ci` on a clean clone). The diagnostic line names the exact remediation command; no further investigation needed.

### `ERROR canonical: opendoorph.<domain> unreachable cause=ENOTFOUND timeout_s=10`

A transport-class failure (DNS NXDOMAIN, TLS handshake error, connection refused, or timeout) — distinct from an assertion failure. Exit code is `2`, not `1`. From the elder's shell, run `dig opendoorph.<domain> +short` to confirm whether DNS is broken at the registrar; if `dig` returns no answer, the registrar nameservers are misconfigured; if `dig` works but the subcommand still fails, re-run with `--timeout-seconds 30`. Same diagnostic shape applies to `schema` (`ECONNREFUSED` -> CloudFront / S3 origin issue; consult SV-001's most recent run in `node-build.yml`) and `lighthouse`.

### `ERROR usage: unknown subcommand "<typo>". did you mean "<suggestion>"?`

A typo or unrecognized subcommand. The dispatcher computes a Levenshtein-style suggestion and prints it; exit code is `2` (USAGE_ERROR class per FR-CLI-02). The HELP screen follows automatically — the help is always one keystroke away.

### `WARN lighthouse: runs=N (PRD pins 3)`

You ran `--runs=N` with `N != 3`. The PRD pins 3-run median for stable scoring. Lower values are accepted for spike work but the WARN is emitted so it is recorded in the devlog; exit code is unchanged.

## References

- PRD: [`.delivery/artifacts/02-refine/po/prd.md`](../../../.delivery/artifacts/02-refine/po/prd.md) (FR-CANON, FR-SCHEMA, FR-LH, FR-RR, FR-RANK, FR-CLI, FR-CI, FR-PKG; NFR-01..NFR-09; AC-1..AC-38)
- CLI / UX spec: [`.delivery/artifacts/03-design/ux/cli-ux-spec.md`](../../../.delivery/artifacts/03-design/ux/cli-ux-spec.md) (subcommand grammar, exit codes, output format, failure-mode catalogue, comment templates)
- Stories (S-01..S-10): [`.delivery/artifacts/05-plan/po/stories.md`](../../../.delivery/artifacts/05-plan/po/stories.md)
- Slice-A release notes (the two overdue items this slice retires): [`.delivery/artifacts/_inputs/slice-a/release-notes.md`](../../../.delivery/artifacts/_inputs/slice-a/release-notes.md) (verify path; consult `_inputs/` directly if the link drifts)
- Slice-A PRD §2.4 (the upcoming Lighthouse-baseline spike target this slice captures)
- Issue umbrella: [Issue #58](https://github.com/OpenDoorPH/OpenDoorPH-website/issues/58)
- Locked decisions: [`.delivery/state.md`](../../../.delivery/state.md) — D-3 (MILESTONE_DAY regex split), D-5 (extractNAP `.cjs` shim), D-6 (Jericho first-march), D-9 (forbidden-string surfaces), D-10 (workflow step-0 discourse-fidelity guard)
- Hot lessons honored: BUG-053-01 (NEW workflow file; zero edits to `node-build.yml`), NFR-04 (PH = Pleasant Hill, never the Southeast-Asian island nation), `feedback_test_before_push` (run tests locally before push), `feedback_source_prd_is_spec` (cron `0 6 * * 1` per FR-CI-01 verbatim), `project_canonical_domain` (`opendoorph.org` is canonical; `.info`/`.net`/`.com` redirect to it per DEC-2026-05-03-001)
