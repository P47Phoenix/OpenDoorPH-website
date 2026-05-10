/**
 * D-5 shim — re-exports the surface of `OpenDoorWebsiteApp/src/utils/extractNAP.ts`.
 *
 * The .ts source lives under src/ and is compiled by `tsc` for the CRA build,
 * but the seo-monitor script layer is plain Node JS (NFR-01) and cannot import
 * the .ts file directly. This shim re-implements the small surface in plain JS,
 * derived line-by-line from the .ts source. The `extract-nap-shim.test.mjs`
 * lockstep test asserts the shim's outputs match the .ts source's expected
 * outputs against the slice-A `napByteMatch.test.ts` fixture pattern.
 *
 * Source contract (verified at PRD authorship; PRD §13 lock):
 *   - normalize(s)            — NFC + collapse whitespace + strip commas + trim
 *   - extractNAPFromHtml(html) — match street/zip/phone from <address> or full body
 *   - buildNAPTuple(nap)       — join non-null fields with single space
 *
 * NEVER duplicate the regexes silently — they MUST stay byte-identical to the
 * .ts source. If src/utils/extractNAP.ts changes its STREET_RE / ZIP_RE /
 * PHONE_RE, this shim and the lockstep test must be updated in the same PR.
 */

'use strict';

/**
 * @param {string} s
 * @returns {string}
 */
const normalize = (s) =>
    s.normalize('NFC').replace(/\s+/g, ' ').replace(/,/g, '').trim();

const STREET_RE = /\d+\s+S\s+1st\s+St/i;
const ZIP_RE = /\b\d{5}\b/;
const PHONE_RE = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

/**
 * @typedef {{ street: string|null, postalCode: string|null, telephone: string|null }} NAP
 */

/**
 * @param {string} haystack
 * @returns {NAP}
 */
function matchNAP(haystack) {
    return {
        street: haystack.match(STREET_RE)?.[0] ?? null,
        postalCode: haystack.match(ZIP_RE)?.[0] ?? null,
        telephone: haystack.match(PHONE_RE)?.[0] ?? null,
    };
}

/**
 * @param {string} html
 * @returns {NAP}
 */
function extractNAPFromHtml(html) {
    const addrMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i);
    const haystack = (addrMatch ? addrMatch[1] : html).replace(/<[^>]+>/g, ' ');
    return matchNAP(haystack);
}

/**
 * @param {NAP} nap
 * @returns {string}
 */
function buildNAPTuple(nap) {
    return [nap.street, nap.postalCode, nap.telephone]
        .filter((s) => Boolean(s))
        .join(' ');
}

module.exports = { normalize, extractNAPFromHtml, buildNAPTuple };
