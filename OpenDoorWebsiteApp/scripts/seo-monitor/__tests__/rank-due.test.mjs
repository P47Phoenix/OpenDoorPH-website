/**
 * T-I-03 — rank-due-date-math integration test.
 *
 * Per cli-ux-spec.md §1.3, the `--today YYYY-MM-DD` flag injects a
 * deterministic "today" anchor for testing. Combined with `--baseline-date`
 * we exercise FR-RANK-01..07 / AC-15..18 without touching the system clock.
 */

import { runRankDue, RUNBOOK_5_4_QUERIES } from '../lib/rankDue.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT_CONFIG = join(HERE, '..', 'seo-monitor.config.json');

function captureStdout(fn) {
    const realWrite = process.stdout.write.bind(process.stdout);
    let captured = '';
    process.stdout.write = (chunk) => {
        captured += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
        return true;
    };
    try {
        const code = fn();
        return { code, stdout: captured };
    } finally {
        process.stdout.write = realWrite;
    }
}

function lastLine(stdout) {
    const lines = stdout.split(/\r?\n/);
    // Drop the trailing empty line(s).
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    return lines[lines.length - 1];
}

describe('rank-due subcommand integration', () => {
    test('day 30 fires; emits four queries + MILESTONE_DAY=30 last line; exit 0', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-04-18', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        for (const q of RUNBOOK_5_4_QUERIES) {
            expect(stdout).toContain(q);
        }
        expect(stdout).toContain('milestone=30');
        expect(stdout).toContain('SUMMARY rank-due exit=0');
        expect(stdout).toContain('milestone_day=30');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=30');
    });

    test('day 60 fires', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-03-19', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('milestone=60');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=60');
    });

    test('day 90 fires', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-02-17', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('milestone=90');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=90');
    });

    test('day 31 (non-milestone) silent; MILESTONE_DAY=none last line; exit 0', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-04-18', '--today': '2026-05-19' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=none');
        // Non-milestone day without --verbose: no DEBUG line.
        expect(stdout).not.toContain('DEBUG rank-due:');
    });

    test('--verbose on non-milestone day emits DEBUG line', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-04-18', '--today': '2026-05-19', '--verbose': true },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('DEBUG rank-due: non-milestone day, days-since-baseline=31');
    });

    test('future baseline → "will arm at" + MILESTONE_DAY=none + exit 0', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2027-01-01', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('baseline is in the future; will arm at 2027-01-01');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=none');
    });

    test('empty config → "not yet armed" + MILESTONE_DAY=none + exit 0', () => {
        // Use the repo's actual seo-monitor.config.json (baseline_date = null).
        const { code, stdout } = captureStdout(() => runRankDue(
            { flags: { '--today': '2026-05-18' }, argv: ['rank-due'] },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('not yet armed');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=none');
    });

    test('--baseline-date overrides config (single source of truth)', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': '2026-04-18', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('baseline=2026-04-18');
    });

    test('rank-due NEVER fails exit (FR-RANK-07): malformed-shape baseline still exits 0', () => {
        const { code, stdout } = captureStdout(() => runRankDue(
            {
                flags: { '--baseline-date': 'not-a-date', '--today': '2026-05-18' },
                argv: ['rank-due'],
            },
            { configPath: REPO_ROOT_CONFIG },
        ));
        expect(code).toBe(0);
        expect(stdout).toContain('WARN rank-due: baseline_date invalid');
        expect(lastLine(stdout)).toBe('MILESTONE_DAY=none');
    });
});
