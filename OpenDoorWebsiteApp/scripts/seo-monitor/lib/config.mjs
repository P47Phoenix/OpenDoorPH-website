/**
 * Config loader for seo-monitor.
 *
 * Behavior contract (FR-RANK-03 / AC-17 / AC-18):
 *   - Empty / null / missing-file → return { baseline_date: null, ... } sentinel.
 *   - Malformed JSON:
 *       - For non-rank-due callers: throw a SyntaxError so the caller can exit 2.
 *       - For rank-due callers: catch upstream and treat as empty (FR-RANK-07).
 *   - Valid JSON: return the parsed object.
 *
 * Default config path: <repo>/OpenDoorWebsiteApp/scripts/seo-monitor/seo-monitor.config.json
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Default JSON config path (same dir as the entry point's parent). */
export const DEFAULT_CONFIG_PATH = resolve(HERE, '..', 'seo-monitor.config.json');

/**
 * @typedef {{
 *   baseline_date: (string|null),
 *   lighthouse_baseline?: { seo: number|null, accessibility: number|null, performance: number|null, best_practices: number|null },
 *   canonical_domain?: string
 * }} SeoConfig
 */

/** @returns {SeoConfig} */
export function emptyConfig() {
    return {
        baseline_date: null,
        lighthouse_baseline: { seo: null, accessibility: null, performance: null, best_practices: null },
        canonical_domain: 'opendoorph.org',
    };
}

/**
 * Load config from disk. Throws on malformed JSON; the rank-due caller
 * catches and treats as empty per FR-RANK-07.
 *
 * @param {string} [path]
 * @returns {SeoConfig}
 */
export function loadConfig(path = DEFAULT_CONFIG_PATH) {
    if (!existsSync(path)) {
        return emptyConfig();
    }
    const raw = readFileSync(path, 'utf8');
    if (raw.trim() === '') {
        return emptyConfig();
    }
    /** @type {Partial<SeoConfig>} */
    const parsed = JSON.parse(raw); // may throw SyntaxError — caller decides
    return { ...emptyConfig(), ...parsed };
}
