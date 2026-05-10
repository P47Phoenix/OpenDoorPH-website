#!/usr/bin/env node
/**
 * seo-monitor — SEO monitoring + post-merge UAT automation utility.
 *
 * Six subcommands plus an `all` umbrella; plain Node JS + JSDoc per NFR-01;
 * no new runtime deps; one new devDep (@lhci/cli) per FR-PKG-02.
 *
 * Entry point dispatcher; each subcommand lives in lib/<name>.mjs.
 *
 * Stable strings (per cli-ux-spec.md §10) — DO NOT alter casually:
 *   - `=== seo-monitor <subcmd> ===`
 *   - `SUMMARY <subcmd> exit=<N> pass=<N> fail=<N> warn=<N> error=<N>`
 *   - `EXIT: <N>`
 *   - `MILESTONE_DAY=(30|60|90|none)` — last line of every rank-due block
 *
 * Memory hot-lessons honored:
 *   - "PH" expands to "Pleasant Hill", never the Southeast-Asian island
 *     nation a careless reader might assume. (NFR-04, hot-lesson #1.)
 *   - Tests run locally before push. (Memory feedback_test_before_push.)
 *   - Curl URL boundary BEFORE running tests. (Lesson 8 of dev memory.)
 *   - BUG-053-01 — NEW workflow file (.github/workflows/seo-monitor.yml);
 *     ZERO edits to node-build.yml.
 *   - Plain Node JS + JSDoc; NO TypeScript, NO tsx/ts-node.
 *   - Source PRD is the implementation spec. (Render verbatim; do not reframe.)
 */

import { parseArgs, listSubcommands, suggestSubcommand } from './lib/argv.mjs';
import { EXIT_PASS, EXIT_ERROR } from './lib/exitCodes.mjs';
import { runCanonical } from './lib/canonical.mjs';
import { runSchema } from './lib/schema.mjs';
import { runLighthouse } from './lib/lighthouse.mjs';
import { runRichResults } from './lib/richResults.mjs';
import { runRankDue } from './lib/rankDue.mjs';
import { runAll } from './lib/all.mjs';

const HELP = `seo-monitor — SEO monitoring + post-merge UAT automation utility.

Usage:
  node OpenDoorWebsiteApp/scripts/seo-monitor/seo-monitor.mjs <subcommand> [flags]

Subcommands:
  canonical     Four-domain redirect-chain posture check (curl -sIL).
  schema        Asserts FR-01..FR-04 schema invariants on the served .org HTML.
  lighthouse    3-run median Lighthouse SEO + A11y + Perf on /.
  rich-results  Print pre-filled Google Rich Results Test URL (no network).
  rank-due      Day-30/60/90 milestone signaller (Slice C foundation).
  all           Run all five subcommands; bitwise-OR exit of S1..S4.

Global flags:
  --help            Print this screen and exit 0.
  --verbose         Emit one extra DEBUG line per check.
  --no-color        Force ASCII status markers only (no ANSI color sequences).

Subcommand flags:
  canonical:    --timeout-seconds <int>   (default 10)
  schema:       --target-url <url>  --timeout-seconds <int>
  lighthouse:   --baseline-from <path>  --baseline-write  --runs <int>  --target-url <url>
  rank-due:     --baseline-date <YYYY-MM-DD>

Exit codes:
  0  pass / informational
  1  expected-class failure (assertion fired)
  2  config error / unexpected (transport, USAGE_ERROR, missing binary)

See OpenDoorWebsiteApp/scripts/seo-monitor/README.md for the full reference.
`;

async function main() {
    // process.argv = [node, script, ...rest]
    const rest = process.argv.slice(2);
    const parsed = parseArgs(rest);

    if (parsed.helpRequested && parsed.subcommand === null && !parsed.error) {
        process.stdout.write(HELP);
        return EXIT_PASS;
    }

    if (parsed.error) {
        process.stdout.write(`ERROR usage: ${parsed.error}\n`);
        // Did-you-mean suggestion when the error names an unknown subcommand.
        const m = /unknown subcommand "([^"]+)"/.exec(parsed.error);
        if (m) {
            const suggestion = suggestSubcommand(m[1]);
            if (suggestion) {
                process.stdout.write(`ERROR usage: did you mean "${suggestion}"?\n`);
            }
            process.stdout.write(`ERROR usage: see --help for the ${listSubcommands().length} recognized subcommands.\n`);
        }
        process.stdout.write(HELP);
        return EXIT_ERROR;
    }

    if (parsed.subcommand === null) {
        // No subcommand and no --help → show help, exit 0 (FR-CLI-01 / AC-19).
        process.stdout.write(HELP);
        return EXIT_PASS;
    }

    if (parsed.helpRequested) {
        // Subcommand-scoped help — for now identical to the root help screen.
        process.stdout.write(HELP);
        return EXIT_PASS;
    }

    const ctx = {
        flags: parsed.flags,
        argv: ['node', 'scripts/seo-monitor/seo-monitor.mjs', parsed.subcommand, ...rest.slice(rest.indexOf(parsed.subcommand) + 1)],
    };

    switch (parsed.subcommand) {
        case 'canonical':    return await runCanonical(ctx);
        case 'schema':       return await runSchema(ctx);
        case 'lighthouse':   return await runLighthouse(ctx);
        case 'rich-results': return runRichResults(ctx);
        case 'rank-due':     return runRankDue(ctx);
        case 'all':          return await runAll(ctx);
        default: {
            process.stdout.write(`ERROR usage: subcommand "${parsed.subcommand}" not wired\n`);
            process.stdout.write(HELP);
            return EXIT_ERROR;
        }
    }
}

main().then((code) => {
    process.exit(code);
}).catch((e) => {
    process.stdout.write(`ERROR fatal: ${(e && e.stack) || e}\n`);
    process.exit(EXIT_ERROR);
});
