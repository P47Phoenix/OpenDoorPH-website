/**
 * NAP (Name/Address/Phone) extraction helpers for Issue #58 slice A
 * FR-05 byte-equality test (`napByteMatch.test.ts`).
 *
 * `normalize(s)` applies the FR-05.1 rule: NFC + collapse whitespace +
 * strip commas + trim. `extractNAPFromElement(root)` reads from a rendered
 * DOM, preferring an `<address>` element. `extractNAPFromHtml(html)` does
 * the same against a raw HTML string. `buildNAPTuple(nap)` joins the
 * non-null fields with single-space (telephone is optional per AC-6).
 *
 * No new runtime dependencies (NFR-07).
 */

export type NAP = {
    street: string | null;
    postalCode: string | null;
    telephone: string | null;
};

export const normalize = (s: string): string =>
    s.normalize('NFC').replace(/\s+/g, ' ').replace(/,/g, '').trim();

const STREET_RE = /\d+\s+S\s+1st\s+St/i;
const ZIP_RE = /\b\d{5}\b/;
const PHONE_RE = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

function matchNAP(haystack: string): NAP {
    return {
        street: haystack.match(STREET_RE)?.[0] ?? null,
        postalCode: haystack.match(ZIP_RE)?.[0] ?? null,
        telephone: haystack.match(PHONE_RE)?.[0] ?? null,
    };
}

export function extractNAPFromElement(root: Element | null): NAP {
    if (!root) return { street: null, postalCode: null, telephone: null };
    const addressEl = root.querySelector('address');
    return matchNAP((addressEl ?? root).textContent ?? '');
}

export function extractNAPFromHtml(html: string): NAP {
    const addrMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i);
    const haystack = (addrMatch ? addrMatch[1] : html).replace(/<[^>]+>/g, ' ');
    return matchNAP(haystack);
}

export function buildNAPTuple(nap: NAP): string {
    return [nap.street, nap.postalCode, nap.telephone]
        .filter((s): s is string => Boolean(s))
        .join(' ');
}
