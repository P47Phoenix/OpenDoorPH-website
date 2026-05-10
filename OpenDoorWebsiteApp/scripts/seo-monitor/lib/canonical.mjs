/**
 * `canonical` subcommand — four-domain redirect-chain posture (FR-CANON-01..03).
 *
 * For each of opendoorph.{info,net,com,org}/, runs `curl -sIL` and parses the
 * response chain. Acceptable postures:
 *   (a) HTTP 301/302 chain ending at https://opendoorph.org/ (per DEC-2026-05-03-001)
 *   (b) HTTP 200 with `<link rel=canonical>` to the .org (advisory; we treat 200
 *       on the .org root itself as the green case).
 *
 * Exit semantics (cli-ux-spec.md §2.2):
 *   - All four chains end at .org → 0
 *   - Any per-domain MISMATCH → 1 (all four still walked; no first-failure-abort)
 *   - Any TRANSPORT_ERROR → 2 (outranks 1 if both classes occur, per §4.2)
 *   - Mixed FAIL + ERROR → 2 (transport-class outranks expected-class)
 */

import { execSync } from 'node:child_process';

import { EXIT_PASS, EXIT_FAIL, EXIT_ERROR } from './exitCodes.mjs';
import { openBlock, closeBlock, pass, fail, info, error, raw } from './output.mjs';

const SUBCMD = 'canonical';
const DEFAULT_TIMEOUT_S = 10;
const DOMAINS = [
    'opendoorph.info',
    'opendoorph.net',
    'opendoorph.com',
    'opendoorph.org',
];
const EXPECTED_FINAL = 'https://opendoorph.org/';

/**
 * Run the subcommand. Returns the exit code (caller calls process.exit).
 *
 * @param {{ flags: Record<string, string|boolean>, argv: string[] }} ctx
 * @param {{
 *   runCurl?: (url: string, timeoutSec: number) => string,
 *   fetchBody?: (url: string, timeoutSec: number) => Promise<string>
 * }} [deps]
 * @returns {Promise<number>}
 */
export async function runCanonical(ctx, deps = {}) {
    const c = openBlock(SUBCMD, ctx.argv);
    const timeoutSec = parseInt(/** @type {string} */ (ctx.flags['--timeout-seconds']) || `${DEFAULT_TIMEOUT_S}`, 10);
    info(SUBCMD, `probing ${DOMAINS.length} domains timeout_s=${timeoutSec}`);

    const runCurl = deps.runCurl || defaultRunCurl;
    const fetchBody = deps.fetchBody || defaultFetchBody;

    let sawFail = false;
    let sawError = false;

    for (const domain of DOMAINS) {
        const url = `https://${domain}/`;
        try {
            const headers = runCurl(url, timeoutSec);
            const result = parseCurlChain(headers);
            const finalUrl = result.finalUrl || url;
            const chain = result.chain.join(',') || `${result.lastStatus}`;

            if (finalUrl === EXPECTED_FINAL) {
                pass(SUBCMD, `${domain} → ${EXPECTED_FINAL} chain=${chain}`, c);
                continue;
            }

            // Posture (b) per FR-CANON-01: 200 with <link rel=canonical> to
            // the .org. The .org root itself satisfies posture (b) trivially
            // (final URL == expected). For sister domains served identical
            // HTML out of S3/CloudFront, fetch the body and verify the
            // canonical link points home.
            if (result.lastStatus === 200 && finalUrl === url) {
                try {
                    const body = await fetchBody(url, timeoutSec);
                    const canonicalHref = extractCanonicalHref(body);
                    if (canonicalHref === EXPECTED_FINAL) {
                        pass(
                            SUBCMD,
                            `${domain} → 200 with <link rel=canonical>=${EXPECTED_FINAL} chain=${chain}`,
                            c,
                        );
                        continue;
                    }
                    fail(
                        SUBCMD,
                        `${domain} → 200 but <link rel=canonical>=${canonicalHref ?? '(absent)'} expected=${EXPECTED_FINAL}`,
                        c,
                    );
                    sawFail = true;
                    continue;
                } catch (bodyErr) {
                    const cause = classifyError(bodyErr);
                    error(
                        SUBCMD,
                        `${domain} body fetch failed cause=${cause} timeout_s=${timeoutSec}`,
                        c,
                    );
                    sawError = true;
                    continue;
                }
            }

            fail(
                SUBCMD,
                `${domain} → ${finalUrl} expected=${EXPECTED_FINAL}`,
                c,
            );
            sawFail = true;
        } catch (e) {
            const cause = classifyError(e);
            error(
                SUBCMD,
                `${domain} unreachable cause=${cause} timeout_s=${timeoutSec}`,
                c,
            );
            sawError = true;
        }
    }

    let exitCode = EXIT_PASS;
    if (sawError) {
        exitCode = EXIT_ERROR; // transport-class outranks expected-class (§4.2)
    } else if (sawFail) {
        exitCode = EXIT_FAIL;
    }

    closeBlock(SUBCMD, exitCode, c);
    return exitCode;
}

/**
 * Default transport — shells out to curl. Returns the raw header text on success;
 * throws on transport failure (non-zero curl exit).
 *
 * @param {string} url
 * @param {number} timeoutSec
 * @returns {string}
 */
function defaultRunCurl(url, timeoutSec) {
    return execSync(
        `curl -sIL --max-time ${timeoutSec} ${shellQuote(url)}`,
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
}

/**
 * Default body fetch via Node 18+ built-in fetch. Used for posture (b)
 * verification when a sister domain returns 200 instead of a 301.
 *
 * @param {string} url
 * @param {number} timeoutSec
 * @returns {Promise<string>}
 */
async function defaultFetchBody(url, timeoutSec) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutSec * 1000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        return await res.text();
    } finally {
        clearTimeout(t);
    }
}

/**
 * Extract the first <link rel="canonical"> href from raw HTML. Returns null
 * if absent. Accepts attribute order rel-then-href and href-then-rel.
 *
 * @param {string} html
 * @returns {string|null}
 */
export function extractCanonicalHref(html) {
    const re1 = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i;
    const m1 = re1.exec(html);
    if (m1) return m1[1];
    const re2 = /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["']/i;
    const m2 = re2.exec(html);
    if (m2) return m2[1];
    return null;
}

function shellQuote(s) {
    // Whitelist: schemes/hosts/paths can contain alphanumerics, dots, slashes,
    // colons, hyphens, percent-encoded bytes. Anything else gets single-quoted.
    if (/^[A-Za-z0-9.\-_/:%?&=]+$/.test(s)) return s;
    return `'${s.replace(/'/g, "'\\''")}'`;
}

/**
 * Parse `curl -sIL` output. Walks all HTTP status lines and Location headers
 * to determine the final URL and the chain of statuses.
 *
 * @param {string} headers
 * @returns {{ finalUrl: string|null, chain: string[], lastStatus: number }}
 */
export function parseCurlChain(headers) {
    /** @type {string[]} */
    const chain = [];
    let lastLocation = null;
    let lastStatus = 0;

    const lines = headers.split(/\r?\n/);
    for (const line of lines) {
        const statusMatch = /^HTTP\/[\d.]+\s+(\d{3})/.exec(line);
        if (statusMatch) {
            const code = Number(statusMatch[1]);
            chain.push(String(code));
            lastStatus = code;
            continue;
        }
        const locMatch = /^[Ll]ocation:\s*(\S+)/.exec(line);
        if (locMatch) {
            lastLocation = locMatch[1].trim();
        }
    }

    // Final URL is the last Location header if any (curl -L follows them);
    // otherwise we cannot know — caller treats null as "stayed at requested URL".
    return {
        finalUrl: lastLocation,
        chain,
        lastStatus,
    };
}

function classifyError(e) {
    const msg = String((e && e.message) || e || '');
    if (/ENOTFOUND/i.test(msg)) return 'ENOTFOUND';
    if (/ECONNREFUSED/i.test(msg)) return 'ECONNREFUSED';
    if (/ETIMEDOUT/i.test(msg) || /timed out/i.test(msg)) return 'ETIMEDOUT';
    if (/SSL|TLS|certificate/i.test(msg)) return 'TLS_ERROR';
    // Curl exit codes surface as "Command failed: ..." — extract first word that helps.
    const m = /\bcurl:\s*\(\d+\)\s*([^\n]+)/.exec(msg);
    if (m) return m[1].trim().slice(0, 80).replace(/\s+/g, '_');
    return 'CURL_ERROR';
}

// For CWD-independent use by `all`.
export const subcommandName = SUBCMD;
