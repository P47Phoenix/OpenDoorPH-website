/**
 * T-I-01 - canonical-from-mock-curl integration test.
 *
 * Mocks the curl + body-fetch transports via dependency-injection (the
 * runCanonical subcommand accepts `runCurl` and `fetchBody` overrides).
 * Scenarios per FR-CANON-01..03:
 *   - All four chains end at .org via 301 redirect → exit 0
 *   - .org returns 200 directly (acceptable) → exit 0
 *   - Sister domain returns 200 with <link rel=canonical>=.org (posture b)
 *     → exit 0
 *   - One chain returns a parking page → exit 1
 *   - One chain throws ENOTFOUND → exit 2 (transport-class outranks fail)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runCanonical, parseCurlChain, extractCanonicalHref } from '../lib/canonical.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');

const ALL_GREEN_FIXTURE = readFileSync(join(FIXTURES, 'curl-301-to-org.txt'), 'utf8');
const ORG_200_FIXTURE = readFileSync(join(FIXTURES, 'curl-org-200.txt'), 'utf8');
const PARKING_FIXTURE = readFileSync(join(FIXTURES, 'curl-200-parking.txt'), 'utf8');

async function captureStdout(fn) {
    const realWrite = process.stdout.write.bind(process.stdout);
    let captured = '';
    process.stdout.write = (chunk) => {
        captured += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        return true;
    };
    try {
        const code = await fn();
        return { code, stdout: captured };
    } finally {
        process.stdout.write = realWrite;
    }
}

describe('canonical subcommand integration', () => {
    test('all four chains end at .org → exit 0; four PASS lines', async () => {
        const { code, stdout } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: (url) => {
                    if (url === 'https://opendoorph.org/') return ORG_200_FIXTURE;
                    return ALL_GREEN_FIXTURE;
                },
            },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('PASS canonical: opendoorph.info → https://opendoorph.org/');
        expect(stdout).toContain('PASS canonical: opendoorph.net → https://opendoorph.org/');
        expect(stdout).toContain('PASS canonical: opendoorph.com → https://opendoorph.org/');
        expect(stdout).toContain('PASS canonical: opendoorph.org → https://opendoorph.org/');
        expect(stdout).toMatch(/SUMMARY canonical exit=0 pass=4 fail=0 warn=0 error=0/);
        expect(stdout).toContain('EXIT: 0');
    });

    test('posture (b): sister domain returns 200 with <link rel=canonical>=.org → exit 0', async () => {
        const html200WithCanonical = `<!doctype html><html><head><link rel="canonical" href="https://opendoorph.org/"><title>X</title></head><body></body></html>`;
        const { code, stdout } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: (url) => {
                    if (url === 'https://opendoorph.org/') return ORG_200_FIXTURE;
                    // Sister domains: 200 directly, no Location header.
                    return ORG_200_FIXTURE;
                },
                fetchBody: async () => html200WithCanonical,
            },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('PASS canonical: opendoorph.info → 200 with <link rel=canonical>=https://opendoorph.org/');
        expect(stdout).toMatch(/SUMMARY canonical exit=0 pass=4 fail=0 warn=0 error=0/);
    });

    test('posture (b): sister domain 200 with WRONG canonical → exit 1', async () => {
        const html200BadCanonical = `<!doctype html><html><head><link rel="canonical" href="https://other.example/"><title>X</title></head><body></body></html>`;
        const { code, stdout } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: () => ORG_200_FIXTURE,
                fetchBody: async (url) => {
                    if (url === 'https://opendoorph.org/') return '<html><link rel="canonical" href="https://opendoorph.org/"></html>';
                    return html200BadCanonical;
                },
            },
        ));
        expect(code).toBe(1);
        expect(stdout).toContain('FAIL canonical: opendoorph.info → 200 but <link rel=canonical>=https://other.example/ expected=https://opendoorph.org/');
    });

    test('one parking-page mismatch → exit 1; all four still walked', async () => {
        const { code, stdout } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: (url) => {
                    if (url === 'https://opendoorph.net/') return PARKING_FIXTURE;
                    if (url === 'https://opendoorph.org/') return ORG_200_FIXTURE;
                    return ALL_GREEN_FIXTURE;
                },
            },
        ));
        expect(code).toBe(1);
        expect(stdout).toContain('PASS canonical: opendoorph.info');
        expect(stdout).toContain('FAIL canonical: opendoorph.net → https://example-parking.example/ expected=https://opendoorph.org/');
        expect(stdout).toContain('PASS canonical: opendoorph.com');
        expect(stdout).toContain('PASS canonical: opendoorph.org');
        expect(stdout).toMatch(/SUMMARY canonical exit=1 pass=3 fail=1 warn=0 error=0/);
    });

    test('one ENOTFOUND → exit 2; transport-class outranks expected-class', async () => {
        const enotfound = Object.assign(new Error('curl: (6) Could not resolve host (ENOTFOUND)'), { code: 'ENOTFOUND' });
        const { code, stdout } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: (url) => {
                    if (url === 'https://opendoorph.com/') throw enotfound;
                    if (url === 'https://opendoorph.org/') return ORG_200_FIXTURE;
                    return ALL_GREEN_FIXTURE;
                },
            },
        ));
        expect(code).toBe(2);
        expect(stdout).toContain('ERROR canonical: opendoorph.com unreachable cause=ENOTFOUND');
        expect(stdout).toMatch(/SUMMARY canonical exit=2 pass=3 fail=0 warn=0 error=1/);
        expect(stdout).toContain('EXIT: 2');
    });

    test('mixed FAIL + ERROR → exit 2 (transport outranks expected)', async () => {
        const enotfound = Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' });
        const { code } = await captureStdout(() => runCanonical(
            { flags: {}, argv: ['canonical'] },
            {
                runCurl: (url) => {
                    if (url === 'https://opendoorph.net/') return PARKING_FIXTURE;
                    if (url === 'https://opendoorph.com/') throw enotfound;
                    if (url === 'https://opendoorph.org/') return ORG_200_FIXTURE;
                    return ALL_GREEN_FIXTURE;
                },
            },
        ));
        expect(code).toBe(2);
    });
});

describe('canonical helpers', () => {
    test('parseCurlChain walks status lines and the last Location header', () => {
        const result = parseCurlChain(ALL_GREEN_FIXTURE);
        expect(result.chain).toEqual(['301', '200']);
        expect(result.finalUrl).toBe('https://opendoorph.org/');
    });

    test('parseCurlChain handles a 200 with no redirect (returns null finalUrl)', () => {
        const result = parseCurlChain(ORG_200_FIXTURE);
        expect(result.chain).toEqual(['200']);
        expect(result.finalUrl).toBe(null);
        expect(result.lastStatus).toBe(200);
    });

    test('extractCanonicalHref reads rel-then-href shape', () => {
        const html = '<link rel="canonical" href="https://opendoorph.org/">';
        expect(extractCanonicalHref(html)).toBe('https://opendoorph.org/');
    });

    test('extractCanonicalHref reads href-then-rel shape', () => {
        const html = '<link href="https://opendoorph.org/" rel="canonical">';
        expect(extractCanonicalHref(html)).toBe('https://opendoorph.org/');
    });

    test('extractCanonicalHref returns null when absent', () => {
        expect(extractCanonicalHref('<html><head></head></html>')).toBe(null);
    });
});
