/**
 * Output helpers — produce the cli-ux-spec.md §3 / §3.5 devlog block shape.
 *
 * Stable strings (per cli-ux-spec.md §10 glossary) — DO NOT alter casually:
 *   - `=== seo-monitor <subcmd> ===`
 *   - `UTC: <ISO-8601-Z>`
 *   - `COMMAND: <full command>`
 *   - `<MARKER> <subcmd>: <human sentence> [key=value ...]`
 *   - `SUMMARY <subcmd> exit=<N> pass=<N> fail=<N> warn=<N> error=<N>`
 *   - `EXIT: <N>`
 *
 * Markers (cli-ux-spec.md §3.2): PASS, FAIL, WARN, INFO, ERROR, DEBUG.
 * No emoji, no Unicode glyphs, no color-only signals. ASCII tokens carry
 * meaning so the output is screen-reader-friendly and grep-stable.
 */

/** @typedef {{pass:number, fail:number, warn:number, error:number, extra?:string}} Counters */

/**
 * Open a subcommand devlog block. Prints header + UTC + COMMAND lines.
 *
 * @param {string} subcmd
 * @param {string[]} argv  Argv for the COMMAND echo line.
 * @returns {Counters}     Counters object the caller mutates as PASS/FAIL/WARN/ERROR lines fire.
 */
export function openBlock(subcmd, argv) {
    process.stdout.write(`=== seo-monitor ${subcmd} ===\n`);
    process.stdout.write(`UTC: ${new Date().toISOString()}\n`);
    process.stdout.write(`COMMAND: ${argv.join(' ')}\n`);
    return { pass: 0, fail: 0, warn: 0, error: 0 };
}

/**
 * Close a subcommand devlog block. Prints SUMMARY + EXIT lines.
 *
 * @param {string} subcmd
 * @param {number} exitCode
 * @param {Counters} c
 */
export function closeBlock(subcmd, exitCode, c) {
    const extra = c.extra ? ` ${c.extra}` : '';
    process.stdout.write(
        `SUMMARY ${subcmd} exit=${exitCode} pass=${c.pass} fail=${c.fail} warn=${c.warn} error=${c.error}${extra}\n`,
    );
    process.stdout.write(`EXIT: ${exitCode}\n`);
}

/** @param {string} subcmd @param {string} msg @param {Counters} c */
export function pass(subcmd, msg, c) {
    process.stdout.write(`PASS ${subcmd}: ${msg}\n`);
    c.pass += 1;
}

/** @param {string} subcmd @param {string} msg @param {Counters} c */
export function fail(subcmd, msg, c) {
    process.stdout.write(`FAIL ${subcmd}: ${msg}\n`);
    c.fail += 1;
}

/** @param {string} subcmd @param {string} msg @param {Counters} c */
export function warn(subcmd, msg, c) {
    process.stdout.write(`WARN ${subcmd}: ${msg}\n`);
    c.warn += 1;
}

/** @param {string} subcmd @param {string} msg @param {Counters} [c] */
export function info(subcmd, msg, c) {
    process.stdout.write(`INFO ${subcmd}: ${msg}\n`);
    // INFO does not contribute to any counter.
    void c;
}

/** @param {string} subcmd @param {string} msg @param {Counters} c */
export function error(subcmd, msg, c) {
    process.stdout.write(`ERROR ${subcmd}: ${msg}\n`);
    c.error += 1;
}

/** @param {string} subcmd @param {string} msg @param {Counters} [c] */
export function debug(subcmd, msg, c) {
    process.stdout.write(`DEBUG ${subcmd}: ${msg}\n`);
    void c;
}

/** Plain stdout line (no marker prefix). For URLs, MILESTONE_DAY=, etc. */
export function raw(line) {
    process.stdout.write(`${line}\n`);
}
