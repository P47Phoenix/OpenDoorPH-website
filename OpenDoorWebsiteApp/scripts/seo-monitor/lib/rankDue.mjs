/**
 * `rank-due` subcommand — Slice C foundation milestone signaller.
 *
 * Behavior contract (FR-RANK-01..07; AC-15..18, AC-38):
 *   - Reads `baseline_date` from config; `--baseline-date YYYY-MM-DD` overrides.
 *   - Computes days-since-baseline using America/Chicago local civil-date on
 *     BOTH endpoints (NEVER bare new Date() per AC-38).
 *   - On day 30/60/90: emit milestone banner + four runbook 5.4 queries +
 *     `MILESTONE_DAY=<N>` as the LAST line of stdout.
 *   - On non-milestone day: silent (or DEBUG with --verbose); LAST line is
 *     `MILESTONE_DAY=none`.
 *   - On empty / future / malformed config: emit info/warn line, LAST line is
 *     `MILESTONE_DAY=none`. NEVER fails exit (FR-RANK-07).
 *   - The `--today YYYY-MM-DD` flag is a TEST-only override for the "today"
 *     anchor (used by AC-16 / AC-38 unit tests). Hidden from --help.
 *
 * The structured marker regex (cli-ux-spec.md §10 glossary; locked verbatim):
 *   ^MILESTONE_DAY=(30|60|90|none)$
 */

import { EXIT_PASS } from './exitCodes.mjs';
import { openBlock, closeBlock, info, warn, debug, raw } from './output.mjs';
import { loadConfig, DEFAULT_CONFIG_PATH } from './config.mjs';
import { chicagoCivilDate, daysSinceBaseline, civilDateToUtcNoon } from './datetime.mjs';

const SUBCMD = 'rank-due';

const RUNBOOK_QUERIES = [
    'church pleasant hill mo',
    'full gospel church pleasant hill',
    'pentecostal church pleasant hill mo',
    'open door full gospel church',
];

/**
 * Stable last-line marker regex shape. Documented byte-for-byte in
 * cli-ux-spec.md §10 glossary, the README §"Output format", and this file.
 *
 * Matches: MILESTONE_DAY=30 | =60 | =90 | =none
 */
export const MILESTONE_MARKER_REGEX = /^MILESTONE_DAY=(30|60|90|none)$/;

const MILESTONE_DAYS = new Set([30, 60, 90]);

/**
 * @param {{ flags: Record<string, string|boolean>, argv: string[] }} ctx
 * @param {{ now?: () => Date, configPath?: string }} [deps]
 * @returns {number}
 */
export function runRankDue(ctx, deps = {}) {
    const c = openBlock(SUBCMD, ctx.argv);

    let config;
    try {
        config = loadConfig(deps.configPath || DEFAULT_CONFIG_PATH);
    } catch (e) {
        // Malformed JSON — treat as empty per FR-RANK-07.
        warn(SUBCMD, `config.json malformed (cause=${(e && e.message) || e}); treating as empty.`, c);
        return finishWithMarker(c, 'none');
    }

    const flagDate = /** @type {string|undefined} */ (ctx.flags['--baseline-date']) || undefined;
    const baselineDate = (flagDate || config.baseline_date || '').trim();

    if (!baselineDate) {
        info(SUBCMD, 'not yet armed; populate config.json from runbook 5.1 (set baseline_date to your GBP verification date).');
        return finishWithMarker(c, 'none');
    }

    let baselineYmd;
    try {
        // Validate the YYYY-MM-DD shape via civilDateToUtcNoon.
        civilDateToUtcNoon(baselineDate);
        baselineYmd = baselineDate;
    } catch (e) {
        warn(SUBCMD, `baseline_date invalid (cause=${(e && e.message) || e}); treating as empty.`, c);
        return finishWithMarker(c, 'none');
    }

    const now = deps.now ? deps.now() : new Date();
    const todayYmd = /** @type {string|undefined} */ (ctx.flags['--today']) || chicagoCivilDate(now);

    let days;
    try {
        days = daysSinceBaseline(baselineYmd, todayYmd);
    } catch (e) {
        warn(SUBCMD, `today derivation failed (cause=${(e && e.message) || e}); treating as empty.`, c);
        return finishWithMarker(c, 'none');
    }

    if (days < 0) {
        info(SUBCMD, `baseline is in the future; will arm at ${baselineYmd}.`);
        return finishWithMarker(c, 'none');
    }

    if (MILESTONE_DAYS.has(days)) {
        info(SUBCMD, `today=${todayYmd} (America/Chicago) baseline=${baselineYmd} days_since=${days} milestone=${days}`);
        info(SUBCMD, 'run the four queries in runbook 5.4 and capture rank in the devlog:');
        for (let i = 0; i < RUNBOOK_QUERIES.length; i += 1) {
            info(SUBCMD, `  ${i + 1}. ${RUNBOOK_QUERIES[i]}`);
        }
        return finishWithMarker(c, String(days), { milestoneDay: days });
    }

    if (ctx.flags['--verbose'] === true) {
        debug(SUBCMD, `non-milestone day, days-since-baseline=${days}`);
    }
    return finishWithMarker(c, 'none');
}

/**
 * Close the block then emit the trailing MILESTONE_DAY= marker as the
 * absolute last line. Always returns EXIT_PASS (FR-RANK-07).
 *
 * @param {{pass:number,fail:number,warn:number,error:number,extra?:string}} c
 * @param {'30'|'60'|'90'|'none'} marker
 * @param {{ milestoneDay?: number }} [opts]
 * @returns {number}
 */
function finishWithMarker(c, marker, opts = {}) {
    c.extra = `milestone_day=${opts.milestoneDay ?? 'none'}`;
    closeBlock(SUBCMD, EXIT_PASS, c);
    raw(`MILESTONE_DAY=${marker}`);
    return EXIT_PASS;
}

export const subcommandName = SUBCMD;
export const RUNBOOK_5_4_QUERIES = RUNBOOK_QUERIES;
