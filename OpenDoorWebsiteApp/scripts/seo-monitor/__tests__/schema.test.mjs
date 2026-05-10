/**
 * T-I-02 — schema-from-fixture integration test.
 *
 * Mocks the fetch transport via dependency-injection (the runSchema
 * subcommand accepts a `fetchHtml` override). Two scenarios per FR-SCHEMA-01..07:
 *   - Golden fixture (mirrors public/index.html shape) → all PASS lines, exit 0
 *   - Self-loop fixture (sameAs has 5 entries) → FAIL on FR-SCHEMA-05, exit 1
 *   - Mock throws → ERROR, exit 2
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runSchema, extractJsonLdBlocks, extractCanonicalLinks } from '../lib/schema.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');

const GOLDEN_HTML = readFileSync(join(FIXTURES, 'index-with-jsonld.html'), 'utf8');
const SELFLOOP_HTML = readFileSync(join(FIXTURES, 'index-with-jsonld-selfloop.html'), 'utf8');

function captureStdout(asyncFn) {
    const realWrite = process.stdout.write.bind(process.stdout);
    let captured = '';
    process.stdout.write = (chunk) => {
        captured += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        return true;
    };
    return Promise.resolve()
        .then(asyncFn)
        .then((code) => {
            process.stdout.write = realWrite;
            return { code, stdout: captured };
        })
        .catch((e) => {
            process.stdout.write = realWrite;
            throw e;
        });
}

describe('schema subcommand integration', () => {
    test('golden fixture → all PASS lines, exit 0', async () => {
        const { code, stdout } = await captureStdout(() => runSchema(
            { flags: {}, argv: ['schema'] },
            { fetchHtml: async () => GOLDEN_HTML },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('PASS schema: ld+json blocks count=1');
        expect(stdout).toContain('PASS schema: @context value=https://schema.org');
        expect(stdout).toContain('PASS schema: @type includes=Church');
        expect(stdout).toContain('PASS schema: url byte-equal=https://opendoorph.org/');
        expect(stdout).toContain('PASS schema: link rel=canonical href byte-equal=https://opendoorph.org/');
        expect(stdout).toContain('PASS schema: sameAs length=1 sole=https://www.facebook.com/profile.php?id=100064858415448');
        expect(stdout).toContain('PASS schema: NAP byte-equal scope=address+phone (DEC-2026-05-03-003)');
        expect(stdout).toMatch(/SUMMARY schema exit=0 pass=7 fail=0 warn=0 error=0/);
    });

    test('self-loop fixture → FAIL on sameAs length, exit 1', async () => {
        const { code, stdout } = await captureStdout(() => runSchema(
            { flags: {}, argv: ['schema'] },
            { fetchHtml: async () => SELFLOOP_HTML },
        ));
        expect(code).toBe(1);
        expect(stdout).toContain('FAIL schema: sameAs length expected=1 got=5');
    });

    test('transport error → exit 2 with ERROR line', async () => {
        const { code, stdout } = await captureStdout(() => runSchema(
            { flags: {}, argv: ['schema'] },
            { fetchHtml: async () => { throw new Error('ECONNREFUSED'); } },
        ));
        expect(code).toBe(2);
        expect(stdout).toContain('ERROR schema: https://opendoorph.org/ unreachable cause=ECONNREFUSED');
        expect(stdout).toContain('EXIT: 2');
    });
});

describe('schema HTML helpers', () => {
    test('extractJsonLdBlocks returns one block from the golden fixture', () => {
        const blocks = extractJsonLdBlocks(GOLDEN_HTML);
        expect(blocks).toHaveLength(1);
        const parsed = JSON.parse(blocks[0]);
        expect(parsed['@context']).toBe('https://schema.org');
        expect(parsed.url).toBe('https://opendoorph.org/');
    });

    test('extractCanonicalLinks returns the byte-as-written href', () => {
        const links = extractCanonicalLinks(GOLDEN_HTML);
        expect(links).toEqual(['https://opendoorph.org/']);
    });

    test('extractCanonicalLinks handles href-before-rel attribute order', () => {
        const html = '<link href="https://opendoorph.org/" rel="canonical">';
        const links = extractCanonicalLinks(html);
        expect(links).toEqual(['https://opendoorph.org/']);
    });
});
