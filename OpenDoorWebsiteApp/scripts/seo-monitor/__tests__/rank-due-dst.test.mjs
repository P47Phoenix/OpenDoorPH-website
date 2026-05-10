/**
 * T-U-04 — DST-boundary unit test (NFR-08; AC-16).
 *
 * Path locked by PRD §13: `__tests__/rank-due-dst.test.mjs`. Plan-stage MAY
 * NOT silently rename without a PRD §13 cross-update.
 *
 * Asserts daysSinceBaseline returns the correct integer across 2026 DST
 * transitions:
 *   - Spring-forward: 2026-03-08 (US DST start)
 *     baseline 2026-02-08 + today 2026-03-10 should equal 30 (NOT 29 or 31).
 *   - Fall-back: 2026-11-01 (US DST end)
 *     baseline 2026-10-02 + today 2026-11-01 should equal 30.
 *
 * The implementation anchors both endpoints at UTC noon (datetime.mjs)
 * specifically to neutralize DST drift in the day-count integer.
 */

import { daysSinceBaseline } from '../lib/datetime.mjs';

describe('rank-due DST-boundary day arithmetic', () => {
    test('spring-forward 2026-03-08: baseline 2026-02-08 → today 2026-03-10 = 30', () => {
        expect(daysSinceBaseline('2026-02-08', '2026-03-10')).toBe(30);
    });

    test('spring-forward boundary: baseline 2026-02-08 → today 2026-03-09 = 29', () => {
        expect(daysSinceBaseline('2026-02-08', '2026-03-09')).toBe(29);
    });

    test('spring-forward boundary: baseline 2026-02-08 → today 2026-03-11 = 31', () => {
        expect(daysSinceBaseline('2026-02-08', '2026-03-11')).toBe(31);
    });

    test('fall-back 2026-11-01: baseline 2026-10-02 → today 2026-11-01 = 30', () => {
        expect(daysSinceBaseline('2026-10-02', '2026-11-01')).toBe(30);
    });

    test('fall-back 2026-11-01: baseline 2026-10-02 → today 2026-10-31 = 29', () => {
        expect(daysSinceBaseline('2026-10-02', '2026-10-31')).toBe(29);
    });

    test('fall-back 2026-11-01: baseline 2026-10-02 → today 2026-11-02 = 31', () => {
        expect(daysSinceBaseline('2026-10-02', '2026-11-02')).toBe(31);
    });

    test('sanity: far from any DST boundary, midsummer 30-day window', () => {
        expect(daysSinceBaseline('2026-06-01', '2026-07-01')).toBe(30);
    });
});
