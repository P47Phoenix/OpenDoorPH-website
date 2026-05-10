/**
 * Exit-code dialect for the seo-monitor utility.
 *
 * Mirrors `OpenDoorWebsiteApp/scripts/check-forbidden-strings.sh` lines 27-31:
 *   0 = pass / informational
 *   1 = expected-class failure (assertion fired)
 *   2 = config error / unexpected (transport, USAGE_ERROR, missing binary)
 *
 * The `all` subcommand composes via bitwise-OR of S1..S4 only — `rank-due`
 * always exits 0 (FR-RANK-07) and is excluded from composition (FR-CLI-03).
 *
 * NEVER add a fourth exit code. AC-20 / FR-CLI-02 grep the source for
 * `process.exit(` and assert only {0, 1, 2} appear (and `process.exit(3)`
 * derived purely as the bitwise-OR composition of `all`, never as a literal).
 */

export const EXIT_PASS = 0;
export const EXIT_FAIL = 1;
export const EXIT_ERROR = 2;
