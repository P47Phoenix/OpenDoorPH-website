/**
 * Wave 1 / Issue #76 — forbidden-pattern tripwires for the seo-monitor subsystem.
 *
 * NFR-04 commitments (no-TypeScript, no-secrets-in-source) lived as README prose
 * before this file. These four assertions convert them into loud-fail tests:
 *
 *   AC-33-a  no `.ts`/`.tsx` files under `scripts/seo-monitor/**`
 *   AC-33-b  `package.json` scripts["test:seo"] free of `tsx` / `ts-node`
 *   AC-35-a  no `GITHUB_TOKEN` literal in `scripts/seo-monitor/**` source
 *   AC-35-b  no `SEARCH_CONSOLE_` / `GSC_` / `GOOGLE_API` env reads in source
 *
 * Anti-narrowing (Plan Lesson 7):
 *   - Each assertion uses positive match-set semantics: offenders array embedded
 *     in failure message; bare `length === 0` is FORBIDDEN.
 *   - Each scan also asserts `filesScanned > 0` so an empty-tree refactor cannot
 *     silently green these tests.
 *
 * Self-reference exclusion:
 *   This file contains the literal strings it greps for. We exclude the
 *   `__tests__/` directory from the AC-35 scans (we only care about runtime
 *   source modules under `seo-monitor/` proper, not the test guards). The
 *   AC-33 scans operate on file extensions and are not at risk.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = resolve(HERE, '..');
const REPO_APP_ROOT = resolve(HERE, '..', '..', '..');
const PACKAGE_JSON_PATH = resolve(REPO_APP_ROOT, 'package.json');

/**
 * Recursive directory walker that skips well-known cache/dependency dirs.
 * @param {string} root  Absolute directory to walk
 * @param {{ excludeTestsDir?: boolean }} [opts]
 * @returns {Generator<string>}  Absolute file paths
 */
function* walkSource(root, opts = {}) {
    if (!existsSync(root)) return;
    for (const name of readdirSync(root)) {
        if (name === 'node_modules' || name === '.cache') continue;
        if (opts.excludeTestsDir && name === '__tests__') continue;
        const path = join(root, name);
        const s = statSync(path);
        if (s.isDirectory()) {
            yield* walkSource(path, opts);
        } else {
            yield path;
        }
    }
}

describe('AC-33 — no TS toolchain in seo-monitor (NFR-01 plain Node JS)', () => {
    test('AC-33-a: zero .ts / .tsx files under scripts/seo-monitor/', () => {
        const offenders = [];
        let filesScanned = 0;
        for (const path of walkSource(SCRIPT_ROOT)) {
            filesScanned += 1;
            if (/\.(ts|tsx)$/i.test(path)) {
                offenders.push(relative(SCRIPT_ROOT, path));
            }
        }
        // Anti-narrowing sentinel: prove the walker actually reached source.
        if (filesScanned === 0) {
            throw new Error(
                'AC-33-a sentinel violated: filesScanned was 0 — walker scope regressed.\n' +
                `Scanned root: ${SCRIPT_ROOT}\n` +
                'Fix: confirm scripts/seo-monitor/ still exists and contains source files.'
            );
        }
        if (offenders.length > 0) {
            throw new Error(
                `AC-33-a violated: ${offenders.length} TS file(s) found under scripts/seo-monitor:\n` +
                offenders.map((p) => `  - ${p}`).join('\n') +
                '\nFix: convert to .mjs / .cjs / .js per NFR-01 (plain Node JS + JSDoc).'
            );
        }
        expect(filesScanned).toBeGreaterThan(0);
        expect(offenders).toEqual([]);
    });

    test('AC-33-b: package.json scripts["test:seo"] contains no `tsx` or `ts-node`', () => {
        const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
        const value = pkg.scripts && pkg.scripts['test:seo'];
        if (typeof value !== 'string' || value.length === 0) {
            throw new Error(
                'AC-33-b sentinel violated: package.json scripts["test:seo"] missing or non-string.\n' +
                `Read from: ${PACKAGE_JSON_PATH}\n` +
                'Fix: restore the byte-exact key scripts["test:seo"] (story §4 forbids rename).'
            );
        }
        // Separate assertions so failure message names WHICH substring regressed.
        if (/tsx/.test(value)) {
            throw new Error(
                `AC-33-b violated (tsx): scripts["test:seo"] contains forbidden substring "tsx".\n` +
                `  value: ${value}\n` +
                'Fix: remove `tsx` invocation; this subsystem is plain Node JS (NFR-01).'
            );
        }
        if (/ts-node/.test(value)) {
            throw new Error(
                `AC-33-b violated (ts-node): scripts["test:seo"] contains forbidden substring "ts-node".\n` +
                `  value: ${value}\n` +
                'Fix: remove `ts-node` invocation; this subsystem is plain Node JS (NFR-01).'
            );
        }
        expect(value).not.toMatch(/tsx/);
        expect(value).not.toMatch(/ts-node/);
    });
});

describe('AC-35 — no auth-token surface in seo-monitor source (NFR-04 no-secrets)', () => {
    /**
     * Collect `.mjs` / `.cjs` / `.js` source files under SCRIPT_ROOT,
     * excluding the `__tests__/` directory (self-reference exclusion: this
     * very file contains the forbidden literals as grep needles).
     * @returns {string[]}  Absolute paths
     */
    function collectSourceFiles() {
        const out = [];
        for (const path of walkSource(SCRIPT_ROOT, { excludeTestsDir: true })) {
            if (/\.(mjs|cjs|js)$/i.test(path)) {
                out.push(path);
            }
        }
        return out;
    }

    test('AC-35-a: zero `GITHUB_TOKEN` literals in scripts/seo-monitor/ source', () => {
        const sourceFiles = collectSourceFiles();
        const filesScanned = sourceFiles.length;
        const offenders = [];
        // Compose needle from harmless ASCII bytes so this scan logic does not
        // itself contain the literal substring (belt-and-braces; the
        // __tests__/ exclusion above is the primary mechanism).
        const NEEDLE = ['G','I','T','H','U','B','_','T','O','K','E','N'].join('');
        for (const path of sourceFiles) {
            const text = readFileSync(path, 'utf8');
            if (text.includes(NEEDLE)) {
                // Record the path + first matching line for the failure message.
                const lines = text.split('\n');
                const lineIdx = lines.findIndex((l) => l.includes(NEEDLE));
                offenders.push(
                    `${relative(SCRIPT_ROOT, path)}:${lineIdx + 1}  ${lines[lineIdx].trim()}`
                );
            }
        }
        if (filesScanned === 0) {
            throw new Error(
                'AC-35-a sentinel violated: filesScanned was 0 — walker scope regressed.\n' +
                `Scanned root: ${SCRIPT_ROOT} (excluding __tests__/)\n` +
                'Fix: confirm scripts/seo-monitor/ still contains .mjs/.cjs/.js source.'
            );
        }
        if (offenders.length > 0) {
            throw new Error(
                `AC-35-a violated: ${offenders.length} source file(s) reference the GitHub auth token literal:\n` +
                offenders.map((o) => `  - ${o}`).join('\n') +
                '\nFix: do NOT read auth tokens in seo-monitor source. Workflow YAML may inject env, but source must not name the token (NFR-04 no-secrets).'
            );
        }
        expect(filesScanned).toBeGreaterThan(0);
        expect(offenders).toEqual([]);
    });

    test('AC-35-b: zero `SEARCH_CONSOLE_` / `GSC_` / `GOOGLE_API` env reads in source', () => {
        const sourceFiles = collectSourceFiles();
        const filesScanned = sourceFiles.length;
        const offenders = [];
        // Case-sensitive prefixes for typical auth-env naming conventions.
        const PATTERN = /process\.env\.(SEARCH_CONSOLE_|GSC_|GOOGLE_API)/;
        for (const path of sourceFiles) {
            const text = readFileSync(path, 'utf8');
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i += 1) {
                const m = PATTERN.exec(lines[i]);
                if (m) {
                    offenders.push(
                        `${relative(SCRIPT_ROOT, path)}:${i + 1}  (prefix=${m[1]})  ${lines[i].trim()}`
                    );
                }
            }
        }
        if (filesScanned === 0) {
            throw new Error(
                'AC-35-b sentinel violated: filesScanned was 0 — walker scope regressed.\n' +
                `Scanned root: ${SCRIPT_ROOT} (excluding __tests__/)\n` +
                'Fix: confirm scripts/seo-monitor/ still contains .mjs/.cjs/.js source.'
            );
        }
        if (offenders.length > 0) {
            throw new Error(
                `AC-35-b violated: ${offenders.length} env-read(s) of forbidden auth prefixes in source:\n` +
                offenders.map((o) => `  - ${o}`).join('\n') +
                '\nFix: remove Search Console / GSC / Google API auth env reads from source (NFR-04 no-secrets); seo-monitor stays unauthenticated.'
            );
        }
        expect(filesScanned).toBeGreaterThan(0);
        expect(offenders).toEqual([]);
    });
});
