/**
 * T-U-02 — exit-code derivation table.
 *
 * Asserts FR-CLI-02: every literal `process.exit(N)` in the seo-monitor
 * source uses N ∈ {0, 1, 2}. Plus a synthetic test of the `all` composition:
 *   bitwise-OR of (S1..S4) over the legal 4-tuple matrix produces only
 *   {0, 1, 2, 3} per cli-ux-spec.md §2.1.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = join(HERE, '..');

function stripComments(text) {
    // Remove block comments first.
    const noBlock = text.replace(/\/\*[\s\S]*?\*\//g, '');
    // Then line comments. Naive (does not respect strings) but sufficient
    // for our small ESM source layer where no string literal contains '//'.
    return noBlock.replace(/\/\/[^\n]*/g, '');
}

function* walkSource(root) {
    for (const name of readdirSync(root)) {
        if (name === '__tests__' || name === 'node_modules' || name === '.cache') continue;
        const path = join(root, name);
        const s = statSync(path);
        if (s.isDirectory()) {
            yield* walkSource(path);
        } else if (/\.(mjs|cjs|js)$/.test(name)) {
            yield path;
        }
    }
}

describe('exit-code derivation', () => {
    test('every process.exit() literal in source uses N in {0, 1, 2}', () => {
        const offenders = [];
        for (const path of walkSource(SRC_ROOT)) {
            const text = readFileSync(path, 'utf8');
            // Strip /* ... */ block comments and // ... line comments before
            // scanning so JSDoc references to `process.exit(3)` (which appear
            // in module-level comments documenting the all-composition) do
            // not register as code-side offenders.
            const stripped = stripComments(text);
            const re = /process\.exit\(\s*(\d+)\s*\)/g;
            let m;
            while ((m = re.exec(stripped)) !== null) {
                const n = Number(m[1]);
                if (n !== 0 && n !== 1 && n !== 2) {
                    offenders.push(`${path}:${n}`);
                }
            }
        }
        expect(offenders).toEqual([]);
    });

    test('all-composition bitwise-OR over (S1..S4) matrix', () => {
        // (canonical, schema, lighthouse, rich-results) — rich-results always 0.
        const cases = [
            { sub: [0, 0, 0, 0], expected: 0 },
            { sub: [1, 0, 0, 0], expected: 1 },
            { sub: [0, 1, 0, 0], expected: 1 },
            { sub: [0, 0, 1, 0], expected: 1 },
            { sub: [0, 2, 0, 0], expected: 2 },
            { sub: [2, 0, 0, 0], expected: 2 },
            { sub: [0, 0, 2, 0], expected: 2 },
            { sub: [1, 2, 0, 0], expected: 3 },
            { sub: [0, 1, 2, 0], expected: 3 },
            { sub: [1, 1, 1, 0], expected: 1 },
            { sub: [2, 2, 2, 0], expected: 2 },
        ];
        for (const { sub, expected } of cases) {
            const composed = sub.reduce((acc, n) => acc | n, 0);
            expect(composed).toBe(expected);
        }
    });

    test('only legal exit codes ever surface from `all` composition', () => {
        const legal = new Set([0, 1, 2, 3]);
        for (let a = 0; a < 3; a += 1) {
            for (let b = 0; b < 3; b += 1) {
                for (let c = 0; c < 3; c += 1) {
                    const composed = a | b | c | 0;
                    expect(legal.has(composed)).toBe(true);
                }
            }
        }
    });
});
