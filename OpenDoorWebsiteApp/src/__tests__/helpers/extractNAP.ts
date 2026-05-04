/**
 * extractNAP — NAP (Name/Address/Phone) extraction helpers for the
 * Issue #58 slice A FR-05 byte-equality test (`napByteMatch.test.ts`).
 *
 * Contract:
 *   - `normalize(s)` applies the FR-05.1 normalization rule verbatim:
 *     NFC Unicode normalization, collapse runs of whitespace to a single
 *     ASCII space, strip commas, and trim leading/trailing whitespace.
 *
 *   - `extractNAPFromHtml(html)` returns `{ street, postalCode, telephone }`
 *     where each field is either the matched substring or `null`. Extraction
 *     prefers a semantic `<address>` element when one is present in the
 *     supplied markup; otherwise it falls back to regex against the full
 *     text content. Telephone extraction is best-effort and may return
 *     `null` if no phone fragment is found in the surface text — callers
 *     are responsible for treating telephone as conditional per AC-6.
 *
 * The street regex matches the canonical "135 S 1st St" form with
 * whitespace flexibility; the zip regex matches the first 5-digit
 * standalone token; the telephone regex matches a 10-digit US phone
 * fragment with any of the common separators.
 *
 * No new runtime dependencies. Uses the JSDOM environment that
 * `react-scripts test` provides by default (NFR-07).
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

/**
 * Extract NAP fields from a rendered DOM element's text content.
 * Preferred path: read an `<address>` element when present.
 * Fallback path: regex over the full text.
 */
export function extractNAPFromElement(root: Element | null): NAP {
    if (!root) return { street: null, postalCode: null, telephone: null };

    // Preferred path: semantic <address>
    const addressEl = root.querySelector('address');
    const haystack = addressEl
        ? addressEl.textContent ?? ''
        : root.textContent ?? '';

    const streetMatch = haystack.match(STREET_RE);
    const zipMatch = haystack.match(ZIP_RE);
    const phoneMatch = haystack.match(PHONE_RE);

    return {
        street: streetMatch ? streetMatch[0] : null,
        postalCode: zipMatch ? zipMatch[0] : null,
        telephone: phoneMatch ? phoneMatch[0] : null,
    };
}

/**
 * Extract NAP fields from a raw HTML string (used against
 * `public/index.html` and similar disk-read HTML).
 */
export function extractNAPFromHtml(html: string): NAP {
    // Prefer <address>...</address> textual content if present.
    const addrMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i);
    const haystack = addrMatch
        ? stripTags(addrMatch[1])
        : stripTags(html);

    const streetMatch = haystack.match(STREET_RE);
    const zipMatch = haystack.match(ZIP_RE);
    const phoneMatch = haystack.match(PHONE_RE);

    return {
        street: streetMatch ? streetMatch[0] : null,
        postalCode: zipMatch ? zipMatch[0] : null,
        telephone: phoneMatch ? phoneMatch[0] : null,
    };
}

function stripTags(s: string): string {
    return s.replace(/<[^>]+>/g, ' ');
}

/**
 * Build the schema-side or surface-side joined tuple for byte-equality.
 * Telephone is omitted from the join when null/empty (FR-05 AC-6
 * conditional strand).
 */
export function buildNAPTuple(nap: NAP): string {
    return [nap.street, nap.postalCode, nap.telephone]
        .filter((s): s is string => Boolean(s) && s !== '')
        .join(' ');
}

// ----------------------------------------------------------------------------
// Inline self-tests (Jest picks up any *.{ts,tsx} under __tests__/, so the
// helper carries its own micro-suite to satisfy that discovery rule and to
// pin the contract documented at the top of this file). These are not the
// FR-05 contract tests — those live in `napByteMatch.test.ts`.
// ----------------------------------------------------------------------------

if (typeof describe !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    describe('extractNAP helpers (inline contract pinning)', () => {
        test('normalize collapses whitespace, strips commas, trims, NFC', () => {
            expect(normalize('  135   S 1st St,  64080 ')).toBe('135 S 1st St 64080');
        });

        test('extractNAPFromHtml prefers <address> when present', () => {
            const nap = extractNAPFromHtml(
                '<div><address>135 S 1st St<br/>Pleasant Hill, MO 64080</address></div>'
            );
            expect(nap.street).toMatch(/135\s+S\s+1st\s+St/);
            expect(nap.postalCode).toBe('64080');
        });

        test('extractNAPFromHtml falls back to full text when no <address>', () => {
            const nap = extractNAPFromHtml(
                '<p>Visit us at 135 S 1st St in Pleasant Hill MO 64080</p>'
            );
            expect(nap.street).toMatch(/135\s+S\s+1st\s+St/);
            expect(nap.postalCode).toBe('64080');
        });

        test('buildNAPTuple omits null fields', () => {
            expect(
                buildNAPTuple({ street: '135 S 1st St', postalCode: '64080', telephone: null })
            ).toBe('135 S 1st St 64080');
        });

        test('buildNAPTuple includes telephone when present', () => {
            expect(
                buildNAPTuple({ street: '135 S 1st St', postalCode: '64080', telephone: '816-555-0100' })
            ).toBe('135 S 1st St 64080 816-555-0100');
        });
    });
}
