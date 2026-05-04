/**
 * Issue #58 slice A — JSON-LD presence + shape regression contract.
 *
 * Implements PRD FR-01, FR-03, FR-04, FR-07, FR-08:
 *   - exactly one <script type="application/ld+json"> in <head>
 *   - JSON parses
 *   - @type is "Church" (or array containing "Church")
 *   - @context is "https://schema.org"
 *   - url is "https://opendoorph.org/" byte-exact
 *   - <link rel="canonical"> href is "https://opendoorph.org/" byte-exact
 *   - sameAs length is exactly 1 (FR-08 regression contract)
 *   - sameAs[0] does NOT match any of the four self-domains (case-insensitive)
 *
 * Reads `OpenDoorWebsiteApp/public/index.html` literally from disk so the
 * deployed artifact (not a derived constant) is the system under test.
 * Uses jsdom — bundled with CRA `react-scripts test`, NFR-07 satisfied.
 */

import * as fs from 'fs';
import * as path from 'path';

// `react-scripts test` runs in a jsdom test environment by default, so
// `DOMParser` is a global. We do not `import { JSDOM } from 'jsdom'`
// because jsdom's transitive deps include ESM modules that Jest's
// default CRA transform does not unwrap (e.g. `@tootallnate/once`).

const INDEX_HTML_PATH = path.resolve(
    __dirname,
    '..',
    '..',
    'public',
    'index.html'
);

function parseHead(html: string): Document {
    return new DOMParser().parseFromString(html, 'text/html');
}

const SELF_DOMAINS = [
    'opendoorph.info',
    'opendoorph.net',
    'opendoorph.org',
    'opendoorph.com',
];

/**
 * Normalize a URL host for self-loop comparison: lowercase, strip `www.`,
 * strip scheme, strip trailing slash, isolate host token only.
 */
function normalizeHost(url: string): string {
    let s = url.trim().toLowerCase();
    s = s.replace(/^https?:\/\//, '');
    s = s.replace(/^www\./, '');
    // Host is the first segment up to `/` or `?` or `:` (port).
    const hostEnd = s.search(/[/?:#]/);
    if (hostEnd >= 0) s = s.slice(0, hostEnd);
    return s;
}

describe('JSON-LD presence + shape (FR-01, FR-03, FR-04, FR-07, FR-08)', () => {
    let html: string;
    let doc: Document;

    beforeAll(() => {
        html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
        doc = parseHead(html);
    });

    function jsonLdScripts(): NodeListOf<HTMLScriptElement> {
        return doc.head.querySelectorAll(
            'script[type="application/ld+json"]'
        ) as NodeListOf<HTMLScriptElement>;
    }

    function parsedJsonLd(): any {
        const scripts = jsonLdScripts();
        return JSON.parse(scripts[0].textContent ?? '');
    }

    test('exactly one <script type="application/ld+json"> block in <head> (FR-07)', () => {
        expect(jsonLdScripts().length).toBe(1);
    });

    test('JSON-LD parses without error (FR-07)', () => {
        const script = jsonLdScripts()[0];
        expect(script).toBeDefined();
        expect(() => JSON.parse(script.textContent ?? '')).not.toThrow();
    });

    test('@context is "https://schema.org" byte-exact (FR-07)', () => {
        expect(parsedJsonLd()['@context']).toBe('https://schema.org');
    });

    test('@type is "Church" or an array containing "Church" (FR-01, FR-07)', () => {
        const t = parsedJsonLd()['@type'];
        const ok = t === 'Church' || (Array.isArray(t) && t.includes('Church'));
        expect(ok).toBe(true);
    });

    test('url is "https://opendoorph.org/" byte-exact (FR-03)', () => {
        expect(parsedJsonLd().url).toBe('https://opendoorph.org/');
    });

    test('address contains streetAddress, locality, region, postalCode, country', () => {
        const parsed = parsedJsonLd();
        expect(parsed.address).toBeDefined();
        expect(typeof parsed.address.streetAddress).toBe('string');
        expect(parsed.address.streetAddress.length).toBeGreaterThan(0);
        expect(typeof parsed.address.addressLocality).toBe('string');
        expect(parsed.address.addressLocality.length).toBeGreaterThan(0);
        expect(typeof parsed.address.addressRegion).toBe('string');
        expect(parsed.address.addressRegion.length).toBeGreaterThan(0);
        expect(typeof parsed.address.postalCode).toBe('string');
        expect(parsed.address.postalCode.length).toBeGreaterThan(0);
        expect(typeof parsed.address.addressCountry).toBe('string');
        expect(parsed.address.addressCountry.length).toBeGreaterThan(0);
    });

    test('exactly one <link rel="canonical"> with href "https://opendoorph.org/" (FR-04)', () => {
        const links = doc.head.querySelectorAll('link[rel="canonical"]');
        expect(links.length).toBe(1);
        expect((links[0] as HTMLLinkElement).getAttribute('href')).toBe(
            'https://opendoorph.org/'
        );
    });

    test('sameAs is an array of exactly length 1 (FR-08 regression contract)', () => {
        const parsed = parsedJsonLd();
        expect(Array.isArray(parsed.sameAs)).toBe(true);
        expect(parsed.sameAs).toHaveLength(1);
    });

    test('sameAs[0] is not any of the four self-domains (FR-08)', () => {
        const parsed = parsedJsonLd();
        const host = normalizeHost(parsed.sameAs[0]);
        for (const selfDomain of SELF_DOMAINS) {
            expect(host).not.toBe(selfDomain);
        }
    });

    test('no entry in sameAs matches any self-domain under URL-form variants (FR-08)', () => {
        // Defense in depth: even if sameAs grows, none of its entries may
        // be any of the four self-domains under any URL-form variant
        // (trailing slash, http vs https, www. prefix, host case).
        const parsed = parsedJsonLd();
        const offenders: string[] = [];
        for (const entry of parsed.sameAs as string[]) {
            const host = normalizeHost(entry);
            if (SELF_DOMAINS.includes(host)) {
                offenders.push(entry);
            }
        }
        expect(offenders).toEqual([]);
    });
});
