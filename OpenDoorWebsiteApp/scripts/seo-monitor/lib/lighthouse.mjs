/**
 * `lighthouse` subcommand — wraps `@lhci/cli collect` against the live .org page.
 *
 * Behavior contract (FR-LH-01..06, AC-9..13, AC-37, NFR-02 / NFR-09):
 *   - 3-run median by default; `--runs N` overrides (advisory WARN if N < 3).
 *   - First run with no baseline → write
 *     `OpenDoorWebsiteApp/scripts/seo-monitor/.cache/lighthouse-baseline.json`
 *     with seven fields (seo, accessibility, performance, lhci_version,
 *     node_version, os, utc).
 *   - A11y < 90 → exit 1 (FR-LH-03; NFR-02 hard floor).
 *   - SEO/Perf below baseline (band ±2 per Daniel §1.2) → WARN line, exit
 *     UNCHANGED (informational only).
 *   - lhci binary missing (ENOENT / non-zero CLI bootstrap) → exit 2 with
 *     `LHCI_BINARY_MISSING` diagnostic.
 *   - Chromium not discovered (Fedora gap; NFR-09) → exit 2 with diagnostic
 *     naming `CHROME_PATH=/usr/bin/chromium-browser` (or equivalent).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import os from 'node:os';

import { EXIT_PASS, EXIT_FAIL, EXIT_ERROR } from './exitCodes.mjs';
import { openBlock, closeBlock, pass, fail, warn, info, error } from './output.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SUBCMD = 'lighthouse';

const DEFAULT_TARGET = 'https://opendoorph.org/';
const DEFAULT_RUNS = 3;
const A11Y_FLOOR = 90;
const REGRESSION_BAND = 2; // Daniel §1.2 ±2 tolerance

const CACHE_DIR = resolve(HERE, '..', '.cache');
const DEFAULT_BASELINE_PATH = join(CACHE_DIR, 'lighthouse-baseline.json');

/**
 * @param {{ flags: Record<string, string|boolean>, argv: string[] }} ctx
 * @param {{ runLhci?: (target: string, runs: number, outDir: string) => Array<{seo:number,a11y:number,perf:number,lhciVersion:string}> }} [deps]
 * @returns {Promise<number>}
 */
export async function runLighthouse(ctx, deps = {}) {
    const c = openBlock(SUBCMD, ctx.argv);
    const target = /** @type {string} */ (ctx.flags['--target-url']) || DEFAULT_TARGET;
    const runs = parseInt(/** @type {string} */ (ctx.flags['--runs']) || `${DEFAULT_RUNS}`, 10);
    const baselinePath = /** @type {string} */ (ctx.flags['--baseline-from']) || DEFAULT_BASELINE_PATH;
    const forceRewrite = ctx.flags['--baseline-write'] === true;

    if (runs < DEFAULT_RUNS) {
        warn(SUBCMD, `runs=${runs} (PRD pins ${DEFAULT_RUNS})`, c);
    }

    info(SUBCMD, `${runs} collections, mobile, simulated throttling, cold cache, target=${target}`);

    const runLhci = deps.runLhci || defaultRunLhci;

    /** @type {Array<{seo:number, a11y:number, perf:number, lhciVersion:string}>} */
    let collections;
    try {
        if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
        collections = runLhci(target, runs, CACHE_DIR);
    } catch (e) {
        const cls = classifyLhciError(e);
        if (cls.kind === 'BINARY_MISSING') {
            error(SUBCMD, `LHCI_BINARY_MISSING — run \`cd OpenDoorWebsiteApp && npm install\``, c);
        } else if (cls.kind === 'CHROME_MISSING') {
            error(
                SUBCMD,
                `chromium binary not discovered. Set CHROME_PATH=/usr/bin/chromium-browser (or equivalent) and re-run. See OpenDoorWebsiteApp/scripts/seo-monitor/README.md "Fedora notes".`,
                c,
            );
        } else if (cls.kind === 'TRANSPORT') {
            error(SUBCMD, `TRANSPORT_ERROR ${target} cause=${cls.detail}`, c);
        } else {
            error(SUBCMD, `unexpected lhci failure cause=${cls.detail}`, c);
        }
        closeBlock(SUBCMD, EXIT_ERROR, c);
        return EXIT_ERROR;
    }

    if (!collections.length) {
        error(SUBCMD, 'lhci returned zero collection results', c);
        closeBlock(SUBCMD, EXIT_ERROR, c);
        return EXIT_ERROR;
    }

    const a11y = median(collections.map((r) => r.a11y));
    const seo = median(collections.map((r) => r.seo));
    const perf = median(collections.map((r) => r.perf));
    const lhciVersion = collections[0].lhciVersion;

    /** @type {{seo:number|null, a11y:number|null, perf:number|null}|null} */
    const baselineFile = (existsSync(baselinePath) && !forceRewrite) ? readBaseline(baselinePath) : null;

    let exitCode = EXIT_PASS;

    if (a11y >= A11Y_FLOOR) {
        pass(SUBCMD, `A11y median=${a11y} floor=${A11Y_FLOOR}`, c);
    } else {
        fail(SUBCMD, `A11y median=${a11y} floor=${A11Y_FLOOR} delta=${a11y - A11Y_FLOOR}`, c);
        exitCode = EXIT_FAIL;
    }

    // SEO / Perf reporting + regression band.
    if (baselineFile === null || forceRewrite) {
        info(SUBCMD, `SEO median=${seo} (no baseline; writing first baseline)`);
        info(SUBCMD, `Performance median=${perf} (no baseline; writing first baseline)`);
        const written = writeBaseline(baselinePath, { seo, a11y, perf, lhciVersion });
        info(
            SUBCMD,
            `${forceRewrite ? 'BASELINE_REWRITE' : 'BASELINE_WRITTEN'} path=${written}`,
        );
    } else {
        const seoDelta = seo - (baselineFile.seo ?? seo);
        const perfDelta = perf - (baselineFile.perf ?? perf);
        if (baselineFile.seo !== null && seoDelta < -REGRESSION_BAND) {
            warn(
                SUBCMD,
                `SEO regression baseline=${baselineFile.seo} current=${seo} delta=${seoDelta} (informational; no exit change)`,
                c,
            );
        } else {
            info(SUBCMD, `SEO median=${seo} baseline=${baselineFile.seo} delta=${seoDelta >= 0 ? '+' : ''}${seoDelta}`);
        }
        if (baselineFile.perf !== null && perfDelta < -REGRESSION_BAND) {
            warn(
                SUBCMD,
                `Performance regression baseline=${baselineFile.perf} current=${perf} delta=${perfDelta} (informational; no exit change)`,
                c,
            );
        } else {
            info(SUBCMD, `Performance median=${perf} baseline=${baselineFile.perf} delta=${perfDelta >= 0 ? '+' : ''}${perfDelta}`);
        }
    }

    c.extra = `a11y=${a11y} seo=${seo} perf=${perf}`;
    closeBlock(SUBCMD, exitCode, c);
    return exitCode;
}

/**
 * @param {string} target
 * @param {number} runs
 * @param {string} outDir
 * @returns {Array<{seo:number,a11y:number,perf:number,lhciVersion:string}>}
 */
function defaultRunLhci(target, runs, outDir) {
    // Use the project-local lhci binary; works whether invoked from project root or app dir.
    const lhciBin = resolve(HERE, '..', '..', '..', 'node_modules', '.bin', 'lhci');
    const args = [
        'collect',
        `--url=${target}`,
        `--numberOfRuns=${runs}`,
    ];
    // Run lhci; stdout/stderr inherited so we see progress in CI logs.
    execFileSync(lhciBin, args, {
        stdio: ['ignore', 'inherit', 'pipe'],
        encoding: 'utf8',
        env: { ...process.env },
    });

    // Discover the JSON reports lhci wrote. Prefer slice cache, then fall back
    // to the project-root .lighthouseci/ default.
    /** @type {string[]} */
    const candidates = [];
    const projectLhciDir = resolve(HERE, '..', '..', '..', '.lighthouseci');
    for (const d of [projectLhciDir, outDir]) {
        if (!existsSync(d)) continue;
        for (const name of readdirSync(d)) {
            if (name.startsWith('lhr-') && name.endsWith('.json')) {
                candidates.push(join(d, name));
            }
        }
    }
    if (candidates.length === 0) {
        throw new Error('lhci produced no lhr-*.json reports');
    }
    candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
    const recent = candidates.slice(0, runs);

    /** @type {Array<{seo:number,a11y:number,perf:number,lhciVersion:string}>} */
    const results = [];
    for (const path of recent) {
        const json = JSON.parse(readFileSync(path, 'utf8'));
        results.push({
            seo: Math.round((json.categories?.seo?.score ?? 0) * 100),
            a11y: Math.round((json.categories?.accessibility?.score ?? 0) * 100),
            perf: Math.round((json.categories?.performance?.score ?? 0) * 100),
            lhciVersion: json.lighthouseVersion || 'unknown',
        });
    }
    return results;
}

function classifyLhciError(e) {
    const msg = String((e && e.message) || e || '');
    if (e && e.code === 'ENOENT') {
        return { kind: 'BINARY_MISSING', detail: 'ENOENT' };
    }
    if (/CHROME_PATH/i.test(msg) || /chrome-launcher/i.test(msg) || /No Chrome installations/i.test(msg) || /must be set to a Chrome/i.test(msg)) {
        return { kind: 'CHROME_MISSING', detail: 'chromium not discovered' };
    }
    if (/ECONNREFUSED/i.test(msg) || /ENOTFOUND/i.test(msg) || /timed out/i.test(msg)) {
        return { kind: 'TRANSPORT', detail: msg.split('\n')[0].slice(0, 120) };
    }
    return { kind: 'UNKNOWN', detail: msg.split('\n')[0].slice(0, 120) };
}

function median(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
}

function readBaseline(path) {
    try {
        const obj = JSON.parse(readFileSync(path, 'utf8'));
        return {
            seo: obj.seo ?? null,
            a11y: obj.a11y ?? obj.accessibility ?? null,
            perf: obj.perf ?? obj.performance ?? null,
        };
    } catch {
        return { seo: null, a11y: null, perf: null };
    }
}

function writeBaseline(path, vals) {
    const dir = dirname(path);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const body = {
        seo: vals.seo,
        accessibility: vals.a11y,
        performance: vals.perf,
        lhci_version: vals.lhciVersion,
        node_version: process.version,
        os: `${os.platform()} ${os.release()}`,
        utc: new Date().toISOString(),
    };
    writeFileSync(path, JSON.stringify(body, null, 2) + '\n', 'utf8');
    return path;
}

export const subcommandName = SUBCMD;
