/**
 * T-U-03 — MILESTONE_DAY= last-line marker shape.
 *
 * The regex shape `^MILESTONE_DAY=(30|60|90|none)$` is locked verbatim in:
 *   - cli-ux-spec.md §10 glossary
 *   - this source's lib/rankDue.mjs (exported as MILESTONE_MARKER_REGEX)
 *   - the README "Output format" section (Ezra fills at S-10)
 *
 * The last line of every rank-due block MUST match this regex; the workflow's
 * milestone-comment trigger (FR-CI-04 / deploy-plan §2.2) keys off the grep.
 */

import { MILESTONE_MARKER_REGEX } from '../lib/rankDue.mjs';

describe('milestone marker shape', () => {
    test('regex source is the locked glossary form', () => {
        expect(MILESTONE_MARKER_REGEX.source).toBe('^MILESTONE_DAY=(30|60|90|none)$');
    });

    test.each([
        ['MILESTONE_DAY=30',   '30'],
        ['MILESTONE_DAY=60',   '60'],
        ['MILESTONE_DAY=90',   '90'],
        ['MILESTONE_DAY=none', 'none'],
    ])('matches %s', (line, expectedGroup) => {
        const m = MILESTONE_MARKER_REGEX.exec(line);
        expect(m).not.toBeNull();
        expect(m[1]).toBe(expectedGroup);
    });

    test.each([
        'MILESTONE_DAY=29',
        'MILESTONE_DAY=31',
        'MILESTONE_DAY=120',
        'MILESTONE_DAY= 30',
        'MILESTONE_DAY=30 ',
        ' MILESTONE_DAY=30',
        'milestone_day=30',
        'INFO MILESTONE_DAY=30',
    ])('does NOT match %s', (line) => {
        expect(MILESTONE_MARKER_REGEX.test(line)).toBe(false);
    });
});
