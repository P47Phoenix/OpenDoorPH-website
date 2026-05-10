/**
 * `schema` subcommand — JSON-LD validation against served .org HTML
 * (FR-SCHEMA-01..07). Mirrors slice-A FR-01..FR-04 invariants byte-for-byte.
 *
 * REUSES: `extractNAPShim.cjs` (D-5 shim re-exporting normalize +
 * extractNAPFromHtml + buildNAPTuple from src/utils/extractNAP.ts). The
 * lockstep test (`extract-nap-shim.test.mjs`) asserts shim-vs-source
 * byte-equality on the slice-A `napByteMatch.test.ts` fixture pattern.
 *
 * Address-side scope: per DEC-2026-05-03-003, the HARD assertion is on the
 * `streetAddress + postalCode + telephone (if present)` tuple only;
 * `addressLocality`, `addressRegion`, `name` are advisory WARN-only.
 */

import { createRequire } from 'node:module';

import { EXIT_PASS, EXIT_FAIL, EXIT_ERROR } from './exitCodes.mjs';
import { openBlock, closeBlock, pass, fail, warn, info, error } from './output.mjs';

const require = createRequire(import.meta.url);
const { normalize, extractNAPFromHtml, buildNAPTuple } = require('./extractNAPShim.cjs');

const SUBCMD = 'schema';
const DEFAULT_TARGET = 'https://opendoorph.org/';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100064858415448';
const DEFAULT_TIMEOUT_S = 10;

/**
 * @param {{ flags: Record<string, string|boolean>, argv: string[] }} ctx
 * @param {{ fetchHtml?: (url: string, timeoutSec: number) => Promise<string> }} [deps]
 * @returns {Promise<number>}
 */
export async function runSchema(ctx, deps = {}) {
    const c = openBlock(SUBCMD, ctx.argv);
    const url = /** @type {string} */ (ctx.flags['--target-url']) || DEFAULT_TARGET;
    const timeoutSec = parseInt(/** @type {string} */ (ctx.flags['--timeout-seconds']) || `${DEFAULT_TIMEOUT_S}`, 10);
    const fetchHtml = deps.fetchHtml || defaultFetchHtml;

    info(SUBCMD, `fetching ${url}`);

    let html;
    try {
        html = await fetchHtml(url, timeoutSec);
    } catch (e) {
        const cause = String((e && e.message) || e || 'unknown');
        error(SUBCMD, `${url} unreachable cause=${cause}`, c);
        closeBlock(SUBCMD, EXIT_ERROR, c);
        return EXIT_ERROR;
    }

    /** @type {number} */
    let exitCode = EXIT_PASS;

    // FR-SCHEMA-01 — exactly one application/ld+json block.
    const blocks = extractJsonLdBlocks(html);
    if (blocks.length !== 1) {
        fail(SUBCMD, `ld+json blocks expected=1 got=${blocks.length}`, c);
        exitCode = EXIT_FAIL;
        closeBlock(SUBCMD, exitCode, c);
        return exitCode;
    }
    pass(SUBCMD, 'ld+json blocks count=1', c);

    /** @type {any} */
    let parsed;
    try {
        parsed = JSON.parse(blocks[0]);
    } catch (e) {
        fail(SUBCMD, `ld+json parse failed cause=${(e && e.message) || e}`, c);
        closeBlock(SUBCMD, EXIT_FAIL, c);
        return EXIT_FAIL;
    }

    // FR-SCHEMA-02 — @context byte-exact, @type includes Church.
    if (parsed['@context'] === 'https://schema.org') {
        pass(SUBCMD, '@context value=https://schema.org', c);
    } else {
        fail(SUBCMD, `@context expected=https://schema.org got=${JSON.stringify(parsed['@context'])}`, c);
        exitCode = EXIT_FAIL;
    }

    const t = parsed['@type'];
    const typeIncludesChurch = t === 'Church' || (Array.isArray(t) && t.includes('Church'));
    if (typeIncludesChurch) {
        pass(SUBCMD, `@type includes=Church value=${JSON.stringify(t)}`, c);
    } else {
        fail(SUBCMD, `@type expected to include Church got=${JSON.stringify(t)}`, c);
        exitCode = EXIT_FAIL;
    }

    // FR-SCHEMA-03 — url byte-exact.
    if (parsed.url === DEFAULT_TARGET) {
        pass(SUBCMD, `url byte-equal=${DEFAULT_TARGET}`, c);
    } else {
        fail(SUBCMD, `url expected=${DEFAULT_TARGET} got=${JSON.stringify(parsed.url)}`, c);
        exitCode = EXIT_FAIL;
    }

    // FR-SCHEMA-04 — exactly one <link rel="canonical"> with byte-equal href.
    const canonicalLinks = extractCanonicalLinks(html);
    if (canonicalLinks.length === 1 && canonicalLinks[0] === DEFAULT_TARGET) {
        pass(SUBCMD, `link rel=canonical href byte-equal=${DEFAULT_TARGET}`, c);
    } else {
        fail(
            SUBCMD,
            `link rel=canonical count=${canonicalLinks.length} hrefs=${JSON.stringify(canonicalLinks)} expected=[${DEFAULT_TARGET}]`,
            c,
        );
        exitCode = EXIT_FAIL;
    }

    // FR-SCHEMA-05 — sameAs.length === 1 + Facebook URL byte-equal.
    const sameAs = parsed.sameAs;
    if (Array.isArray(sameAs) && sameAs.length === 1 && sameAs[0] === FACEBOOK_URL) {
        pass(SUBCMD, `sameAs length=1 sole=${FACEBOOK_URL}`, c);
    } else {
        const got = Array.isArray(sameAs) ? sameAs.length : 0;
        const first = Array.isArray(sameAs) && sameAs.length > 0 ? sameAs[0] : '(none)';
        fail(SUBCMD, `sameAs length expected=1 got=${got} first=${first}`, c);
        exitCode = EXIT_FAIL;
    }

    // FR-SCHEMA-06 — NAP byte-equality (REUSE extractNAP shim).
    // If the live HTML has no rendered <address> element (the production
    // build is a SPA whose address is rendered client-side by React),
    // we cannot derive the rendered tuple from the served bytes. In that
    // case the byte-comparison is skipped with a WARN advisory; the slice-A
    // napByteMatch.test.ts covers the build-time invariant on the JSDOM
    // side. Per DEC-2026-05-03-003: address+phone scope only; locality and
    // region drift are ALWAYS WARN-only.
    const napHard = compareNapHard(html, parsed);
    if (napHard.skipped) {
        warn(SUBCMD, napHard.message, c);
    } else if (napHard.ok) {
        pass(SUBCMD, 'NAP byte-equal scope=address+phone (DEC-2026-05-03-003)', c);
    } else {
        fail(SUBCMD, napHard.message, c);
        exitCode = EXIT_FAIL;
    }

    // Advisory drift — locality/region/name. Never failing exit.
    const advisories = collectAdvisories(html, parsed);
    for (const adv of advisories) {
        warn(SUBCMD, adv, c);
    }

    closeBlock(SUBCMD, exitCode, c);
    return exitCode;
}

/**
 * Default HTTP fetch via Node 18+ built-in fetch.
 *
 * @param {string} url
 * @param {number} timeoutSec
 * @returns {Promise<string>}
 */
async function defaultFetchHtml(url, timeoutSec) {
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
 * Extract the inner text of every <script type="application/ld+json"> block
 * from a raw HTML string. Returns a list (length 0, 1, or many).
 *
 * @param {string} html
 * @returns {string[]}
 */
export function extractJsonLdBlocks(html) {
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const out = [];
    let m;
    while ((m = re.exec(html)) !== null) {
        out.push(m[1].trim());
    }
    return out;
}

/**
 * Extract every <link rel="canonical"> href value (byte-as-written; no URL
 * normalization).
 *
 * @param {string} html
 * @returns {string[]}
 */
export function extractCanonicalLinks(html) {
    const re = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
    const out = [];
    let m;
    while ((m = re.exec(html)) !== null) {
        out.push(m[1]);
    }
    // Also handle href-before-rel attribute order.
    const re2 = /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/gi;
    while ((m = re2.exec(html)) !== null) {
        if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
}

function compareNapHard(html, parsed) {
    const hasAddressEl = /<address\b[^>]*>/i.test(html);
    if (!hasAddressEl) {
        return {
            skipped: true,
            message: 'NAP byte-equal skipped: no <address> element in served HTML (SPA renders client-side; slice-A napByteMatch.test.ts covers the build-time invariant)',
        };
    }
    const rendered = extractNAPFromHtml(html);
    const renderedTuple = buildNAPTuple(rendered);

    const addr = (parsed && parsed.address) || {};
    const schemaSide = {
        street: addr.streetAddress ? normalize(String(addr.streetAddress)) : null,
        postalCode: addr.postalCode ? normalize(String(addr.postalCode)) : null,
        telephone: parsed.telephone ? normalize(String(parsed.telephone)) : null,
    };
    const schemaTuple = buildNAPTuple(schemaSide);

    if (renderedTuple === schemaTuple) {
        return { ok: true, message: '' };
    }
    return {
        ok: false,
        message: `NAP tuple mismatch schema="${schemaTuple}" rendered="${renderedTuple}"`,
    };
}

function collectAdvisories(html, parsed) {
    const out = [];
    const renderedText = html.replace(/<[^>]+>/g, ' ');
    const addr = (parsed && parsed.address) || {};

    if (addr.addressLocality) {
        const locality = String(addr.addressLocality);
        if (!renderedText.includes(locality)) {
            out.push(`addressLocality drift advisory=${locality} not found in rendered HTML (DEC-2026-05-03-003 advisory)`);
        }
    }
    if (addr.addressRegion) {
        const region = String(addr.addressRegion);
        if (!renderedText.includes(region)) {
            out.push(`addressRegion drift advisory=${region} not found in rendered HTML (DEC-2026-05-03-003 advisory)`);
        }
    }
    if (parsed && parsed.name) {
        const name = String(parsed.name);
        if (!renderedText.includes(name)) {
            out.push(`name drift advisory=${name} not found in rendered HTML (DEC-2026-05-03-003 advisory)`);
        }
    }
    return out;
}

export const subcommandName = SUBCMD;
