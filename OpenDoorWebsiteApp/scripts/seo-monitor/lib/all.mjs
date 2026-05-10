/**
 * `all` subcommand — run S1..S5 in sequence; compose exit code via bitwise-OR
 * of the FIRST FOUR exits ONLY (FR-CLI-03; rank-due always exits 0 per
 * FR-RANK-07 and is excluded from the composition).
 *
 * Per cli-ux-spec.md §2.1, legal `all` exit codes are:
 *   0 — all four pass
 *   1 — at least one expected-class failure (no transport-class)
 *   2 — at least one transport-class error (no expected-class)
 *   3 — both classes fired (1 | 2)
 *
 * The grand SUMMARY line aggregates pass/fail/warn/error counts across the
 * five sub-blocks AND surfaces the milestone_day marker for the workflow's
 * comment-posting step (FR-CI-04).
 */

import { runCanonical } from './canonical.mjs';
import { runSchema } from './schema.mjs';
import { runLighthouse } from './lighthouse.mjs';
import { runRichResults } from './richResults.mjs';
import { runRankDue, MILESTONE_MARKER_REGEX } from './rankDue.mjs';

/**
 * @param {{ flags: Record<string, string|boolean>, argv: string[] }} ctx
 * @returns {Promise<number>}
 */
export async function runAll(ctx) {
    process.stdout.write(`=== seo-monitor all ===\n`);
    process.stdout.write(`UTC: ${new Date().toISOString()}\n`);
    process.stdout.write(`COMMAND: ${ctx.argv.join(' ')}\n`);

    // Capture each subcommand's stdout to derive grand counts and milestone_day.
    /** @type {{e: number, captured: string}} */
    const results = { e: 0, captured: '' };

    const captures = [];

    captures.push(await captureStdout(() => runCanonical({ flags: ctx.flags, argv: ['canonical'] })));
    void results; // results object retained for potential future grand counters; current path uses `captures` only.
    captures.push(await captureStdout(() => runSchema({ flags: ctx.flags, argv: ['schema'] })));
    captures.push(await captureStdout(() => runLighthouse({ flags: ctx.flags, argv: ['lighthouse'] })));
    captures.push(await captureStdout(() => runRichResults({ flags: ctx.flags, argv: ['rich-results'] })));
    captures.push(await captureStdout(() => runRankDue({ flags: ctx.flags, argv: ['rank-due'] })));

    // Compose exit code: bitwise-OR of the FIRST FOUR ONLY.
    const exitsForOr = captures.slice(0, 4).map((r) => r.exitCode);
    const composedExit = exitsForOr.reduce((acc, n) => acc | n, 0);

    // Aggregate counters from the grand log.
    const allOut = captures.map((r) => r.stdout).join('');
    const counts = aggregateCounters(allOut);
    const milestoneDay = detectMilestoneDay(allOut);

    process.stdout.write(
        `SUMMARY all exit=${composedExit} pass=${counts.pass} fail=${counts.fail} warn=${counts.warn} error=${counts.error} milestone_day=${milestoneDay}\n`,
    );
    process.stdout.write(`EXIT: ${composedExit}\n`);

    // Re-emit the rank-due block's MILESTONE_DAY= line as the absolute last
    // stdout line, so workflow grep targeting end-of-stream still finds it.
    process.stdout.write(`MILESTONE_DAY=${milestoneDay}\n`);

    return composedExit;
}

/**
 * Run a function while capturing its stdout into a string. The captured
 * stdout is ALSO mirrored to the real stdout so the user sees a live log.
 *
 * @param {() => number|Promise<number>} fn
 * @returns {Promise<{exitCode: number, stdout: string}>}
 */
async function captureStdout(fn) {
    const realWrite = process.stdout.write.bind(process.stdout);
    let captured = '';
    /** @type {any} */
    process.stdout.write = (chunk, encodingOrCb, cb) => {
        const str = typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
        captured += str;
        return realWrite(chunk, encodingOrCb, cb);
    };
    try {
        const exitCode = await fn();
        return { exitCode, stdout: captured };
    } finally {
        process.stdout.write = realWrite;
    }
}

function aggregateCounters(text) {
    const re = /^SUMMARY \S+ exit=\d+ pass=(\d+) fail=(\d+) warn=(\d+) error=(\d+)/gm;
    let m;
    let pass = 0, fail = 0, warn = 0, error = 0;
    while ((m = re.exec(text)) !== null) {
        pass += Number(m[1]);
        fail += Number(m[2]);
        warn += Number(m[3]);
        error += Number(m[4]);
    }
    return { pass, fail, warn, error };
}

function detectMilestoneDay(text) {
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        const m = MILESTONE_MARKER_REGEX.exec(line);
        if (m) return m[1];
    }
    return 'none';
}
