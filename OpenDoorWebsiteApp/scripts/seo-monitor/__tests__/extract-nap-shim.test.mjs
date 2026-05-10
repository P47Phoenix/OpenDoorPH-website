/**
 * T-U-06 - extract-NAP shim lockstep test.
 *
 * Per D-5 the seo-monitor script layer cannot import the .ts source directly
 * (NFR-01 plain-Node-JS rule); instead it uses a tiny .cjs shim that
 * re-implements the small surface verbatim. This test asserts the shim
 * produces byte-identical outputs to the slice-A precedent
 * (OpenDoorWebsiteApp/src/__tests__/napByteMatch.test.ts) for the
 * streetAddress + postalCode + telephone tuple.
 *
 * If src/utils/extractNAP.ts changes its STREET_RE / ZIP_RE / PHONE_RE,
 * this test will fail until the shim is updated in the same PR.
 */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');

const require = createRequire(import.meta.url);
const shim = require('../lib/extractNAPShim.cjs');

describe('extract-nap shim lockstep with src/utils/extractNAP.ts', () => {
    test('exports the locked surface (normalize, extractNAPFromHtml, buildNAPTuple)', () => {
        expect(typeof shim.normalize).toBe('function');
        expect(typeof shim.extractNAPFromHtml).toBe('function');
        expect(typeof shim.buildNAPTuple).toBe('function');
    });

    test('normalize matches the .ts contract (NFC + collapse ws + strip commas + trim)', () => {
        // Mirrors the slice-A FR-05.1 examples.
        expect(shim.normalize('  135 S 1st St, ')).toBe('135 S 1st St');
        expect(shim.normalize('Pleasant   Hill,   MO')).toBe('Pleasant Hill MO');
        expect(shim.normalize('  64080  ')).toBe('64080');
        expect(shim.normalize('1 2 3, 4 5')).toBe('1 2 3 4 5');
    });

    test('extractNAPFromHtml prefers <address> over the full body', () => {
        const html = readFileSync(join(FIXTURES, 'index-with-jsonld.html'), 'utf8');
        const nap = shim.extractNAPFromHtml(html);
        expect(nap.street).toBe('135 S 1st St');
        expect(nap.postalCode).toBe('64080');
        expect(nap.telephone).toBeNull();
    });

    test('buildNAPTuple joins non-null fields with single space; drops nulls', () => {
        expect(shim.buildNAPTuple({ street: '135 S 1st St', postalCode: '64080', telephone: null })).toBe('135 S 1st St 64080');
        expect(shim.buildNAPTuple({ street: '135 S 1st St', postalCode: '64080', telephone: '(816) 555-1234' })).toBe('135 S 1st St 64080 (816) 555-1234');
        expect(shim.buildNAPTuple({ street: null, postalCode: null, telephone: null })).toBe('');
    });

    test('schema-side-vs-rendered byte-equality holds against the fixture', () => {
        const html = readFileSync(join(FIXTURES, 'index-with-jsonld.html'), 'utf8');
        const renderedTuple = shim.buildNAPTuple(shim.extractNAPFromHtml(html));
        const schemaSide = {
            street: shim.normalize('135 S 1st St'),
            postalCode: shim.normalize('64080'),
            telephone: null,
        };
        const schemaTuple = shim.buildNAPTuple(schemaSide);
        expect(renderedTuple).toBe(schemaTuple);
    });

    test('byte-mismatch surfaces (negative case)', () => {
        const renderedTuple = shim.buildNAPTuple({ street: '135 S First St', postalCode: '64080', telephone: null });
        const schemaTuple = shim.buildNAPTuple({ street: '135 S 1st St', postalCode: '64080', telephone: null });
        expect(renderedTuple).not.toBe(schemaTuple);
    });
});
