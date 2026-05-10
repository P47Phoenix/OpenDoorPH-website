/**
 * Minimal long-form-only argv parser.
 *
 * Per cli-ux-spec.md §1.3, all flags are long-form (`--flag` or `--flag value`).
 * Unknown subcommand or flag → USAGE_ERROR (exit 2). No interactive prompts;
 * stdin is never read.
 *
 * Supported flag shapes: `--name value`, `--name=value`, `--bool-flag`.
 * Boolean flags listed in BOOLEAN_FLAGS take no value.
 */

const BOOLEAN_FLAGS = new Set([
    '--help',
    '--verbose',
    '--no-color',
    '--json',
    '--baseline-write',
]);

const VALUE_FLAGS = new Set([
    '--baseline-date',
    '--today',
    '--baseline-from',
    '--target-url',
    '--timeout-seconds',
    '--runs',
    '--config',
]);

const KNOWN_FLAGS = new Set([...BOOLEAN_FLAGS, ...VALUE_FLAGS]);

const SUBCOMMANDS = ['canonical', 'schema', 'lighthouse', 'rich-results', 'rank-due', 'all'];

/**
 * @typedef {{
 *   subcommand: string|null,
 *   flags: Record<string, string|boolean>,
 *   positional: string[],
 *   helpRequested: boolean,
 *   error: string|null
 * }} ParsedArgs
 */

/**
 * Parse argv (excluding `node` and the script path).
 *
 * @param {string[]} argv
 * @returns {ParsedArgs}
 */
export function parseArgs(argv) {
    /** @type {ParsedArgs} */
    const out = {
        subcommand: null,
        flags: {},
        positional: [],
        helpRequested: false,
        error: null,
    };

    let i = 0;
    while (i < argv.length) {
        const tok = argv[i];

        if (tok === '--help' || tok === '-h') {
            out.helpRequested = true;
            i += 1;
            continue;
        }

        if (tok.startsWith('--')) {
            // --name=value form
            const eq = tok.indexOf('=');
            if (eq !== -1) {
                const name = tok.slice(0, eq);
                const value = tok.slice(eq + 1);
                if (!KNOWN_FLAGS.has(name)) {
                    out.error = `unknown flag "${name}"`;
                    return out;
                }
                if (BOOLEAN_FLAGS.has(name)) {
                    out.error = `flag "${name}" does not take a value`;
                    return out;
                }
                out.flags[name] = value;
                i += 1;
                continue;
            }

            if (!KNOWN_FLAGS.has(tok)) {
                out.error = `unknown flag "${tok}"`;
                return out;
            }

            if (BOOLEAN_FLAGS.has(tok)) {
                out.flags[tok] = true;
                i += 1;
                continue;
            }

            // VALUE_FLAGS: consume next token as value.
            const next = argv[i + 1];
            if (next === undefined || next.startsWith('--')) {
                out.error = `flag "${tok}" requires a value`;
                return out;
            }
            out.flags[tok] = next;
            i += 2;
            continue;
        }

        // Positional. The first positional is the subcommand.
        if (out.subcommand === null) {
            if (!SUBCOMMANDS.includes(tok)) {
                out.error = `unknown subcommand "${tok}"`;
                return out;
            }
            out.subcommand = tok;
        } else {
            out.positional.push(tok);
        }
        i += 1;
    }

    return out;
}

/** @returns {string[]} */
export function listSubcommands() {
    return [...SUBCOMMANDS];
}

/**
 * Suggest the closest subcommand by Levenshtein distance.
 *
 * @param {string} bad
 * @returns {string|null}
 */
export function suggestSubcommand(bad) {
    let best = null;
    let bestDist = Infinity;
    for (const s of SUBCOMMANDS) {
        const d = levenshtein(bad, s);
        if (d < bestDist && d <= 3) {
            best = s;
            bestDist = d;
        }
    }
    return best;
}

function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    /** @type {number[][]} */
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i += 1) dp[i][0] = i;
    for (let j = 0; j <= n; j += 1) dp[0][j] = j;
    for (let i = 1; i <= m; i += 1) {
        for (let j = 1; j <= n; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            );
        }
    }
    return dp[m][n];
}
