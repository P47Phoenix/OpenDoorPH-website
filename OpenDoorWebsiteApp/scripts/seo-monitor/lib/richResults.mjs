/**
 * `rich-results` subcommand — print the pre-filled Google Rich Results URL.
 *
 * Always exits 0 (FR-RR-02). Never makes a network call (per Solomon's
 * "rich-results non-call is wisdom" commendation; the failure mode is moved
 * off the utility's surface). No `fetch`, no `https.request`, no
 * `child_process` — verified by the unit test (T-I-07 `rich-results-no-network`).
 */

import { EXIT_PASS } from './exitCodes.mjs';
import { openBlock, closeBlock, info, raw } from './output.mjs';

const SUBCMD = 'rich-results';
const RICH_RESULTS_URL = 'https://search.google.com/test/rich-results?url=https%3A%2F%2Fopendoorph.org%2F';

/**
 * @param {{ argv: string[] }} ctx
 * @returns {number}
 */
export function runRichResults(ctx) {
    const c = openBlock(SUBCMD, ctx.argv);
    info(SUBCMD, 'open the URL below in a browser; capture the LocalBusiness eligibility verdict in your devlog.');
    raw(RICH_RESULTS_URL);
    closeBlock(SUBCMD, EXIT_PASS, c);
    return EXIT_PASS;
}

export const subcommandName = SUBCMD;
export const RICH_RESULTS_TEST_URL = RICH_RESULTS_URL;
