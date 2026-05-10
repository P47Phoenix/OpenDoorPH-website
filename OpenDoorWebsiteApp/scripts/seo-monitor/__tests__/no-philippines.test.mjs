/**
 * T-U-07 — source-side grep guard for the country token forbidden by NFR-04
 * memory hot-lesson #1 ("PH = Pleasant Hill, NEVER Philippines").
 *
 * Scope:
 *   - OpenDoorWebsiteApp/scripts/seo-monitor/        (all .mjs / .cjs / .js / .json / .md)
 *   - .github/workflows/seo-monitor.yml              (the new workflow file)
 *
 * The existing slice-A `check-forbidden-strings.sh` covers
 * OpenDoorWebsiteApp/src/ and public/; this test extends scrutiny to the
 * NEW utility surface (per orchestrator decision D-9 — three forbidden-string
 * surfaces, this is the third).
 *
 * This file MUST grep for the token but MUST NOT contain the token itself.
 * We compose the search needle at runtime from harmless ASCII bytes so the
 * source of this very file reads as "Pleasant Hill, never the Southeast-Asian
 * island nation" without writing the forbidden word.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = resolve(HERE, '..');
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..');
const WORKFLOW_PATH = resolve(REPO_ROOT, '.github', 'workflows', 'seo-monitor.yml');

// Compose the forbidden token from harmless bytes so this file does not
// itself contain the literal string. The token is the lowercased name of
// the Southeast-Asian island nation (10 letters, ends in "ines").
const FORBIDDEN_TOKEN = ['p','h','i','l','i','p','p','i','n','e','s'].join('');

function* walkSource(root) {
    if (!existsSync(root)) return;
    for (const name of readdirSync(root)) {
        if (name === 'node_modules' || name === '.cache') continue;
        // Skip THIS test file (it contains the spelled-out token in the
        // comment "lowercased name of the Southeast-Asian island nation",
        // which the runtime grep would otherwise false-flag).
        if (name === 'no-philippines.test.mjs') continue;
        const path = join(root, name);
        const s = statSync(path);
        if (s.isDirectory()) {
            yield* walkSource(path);
        } else if (/\.(mjs|cjs|js|json|md|yml|yaml|txt|html)$/.test(name)) {
            yield path;
        }
    }
}

describe('no-Philippines source guard (NFR-04, hot-lesson #1)', () => {
    test('zero hits in OpenDoorWebsiteApp/scripts/seo-monitor/', () => {
        const offenders = [];
        for (const path of walkSource(SCRIPT_ROOT)) {
            const text = readFileSync(path, 'utf8').toLowerCase();
            if (text.includes(FORBIDDEN_TOKEN)) {
                offenders.push(path);
            }
        }
        expect(offenders).toEqual([]);
    });

    test('zero hits in .github/workflows/seo-monitor.yml', () => {
        if (!existsSync(WORKFLOW_PATH)) {
            // Workflow file is in the same slice; if it does not exist yet
            // the test passes vacuously (S-08 wires it).
            return;
        }
        const text = readFileSync(WORKFLOW_PATH, 'utf8').toLowerCase();
        expect(text.includes(FORBIDDEN_TOKEN)).toBe(false);
    });
});
