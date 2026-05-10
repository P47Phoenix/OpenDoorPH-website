/**
 * T-U-05 — Runner-UTC vs America/Chicago disambiguation (AC-38).
 *
 * Path locked by PRD §13: `__tests__/rank-due-tz.test.mjs`. Plan-stage MAY
 * NOT silently rename without a PRD §13 cross-update.
 *
 * The runner clock on `ubuntu-latest` is UTC; the cron tick at 06:00 UTC =
 * 01:00 CDT = STILL the prior day in America/Chicago. If the implementation
 * uses bare `new Date()` for "today", the milestone fires one day early.
 *
 * Contrived case: baseline 2026-04-15, frozen now = 2026-05-15T06:00:00Z.
 *   - In UTC, today = 2026-05-15 → days_since = 30 → milestone WOULD fire.
 *   - In America/Chicago, today = 2026-05-15 still maps to 01:00 CDT, which
 *     is 2026-05-15 in Chicago — wait, 06:00 UTC = 01:00 CDT (CDT = UTC-5
 *     in May), so the Chicago civil date IS 2026-05-15, and the milestone
 *     SHOULD fire on that day.
 *
 * The truer disambiguation case is BEFORE the local-midnight crossover:
 * frozen now = 2026-05-15T04:00:00Z = 2026-05-14T23:00:00 CDT — Chicago
 * is still 2026-05-14 (day-29), UTC is already 2026-05-15 (day-30). The
 * Chicago civil-date derivation must return 2026-05-14, NOT 2026-05-15.
 */

import { chicagoCivilDate, daysSinceBaseline } from '../lib/datetime.mjs';

describe('rank-due runner-UTC vs America/Chicago (AC-38)', () => {
    test('chicagoCivilDate at 2026-05-15T04:00:00Z (= 23:00 CDT prior day) is 2026-05-14', () => {
        // 2026-05-15T04:00:00Z, May → CDT (UTC-5) → 2026-05-14T23:00:00
        const utcInstant = new Date('2026-05-15T04:00:00Z');
        expect(chicagoCivilDate(utcInstant)).toBe('2026-05-14');
    });

    test('milestone DOES NOT fire when UTC=day-30 but Chicago=day-29', () => {
        const baselineYmd = '2026-04-15';
        const utcInstant = new Date('2026-05-15T04:00:00Z'); // 23:00 prior day in CDT
        const todayChicago = chicagoCivilDate(utcInstant); // 2026-05-14

        const days = daysSinceBaseline(baselineYmd, todayChicago);
        expect(days).toBe(29); // Chicago side: day 29
        expect(days).not.toBe(30); // would be 30 if bare new Date() were used
    });

    test('chicagoCivilDate at 2026-05-15T12:00:00Z (= 07:00 CDT same day) is 2026-05-15', () => {
        // Sanity: noon UTC on the same calendar day in Chicago is unambiguous.
        const utcInstant = new Date('2026-05-15T12:00:00Z');
        expect(chicagoCivilDate(utcInstant)).toBe('2026-05-15');
    });

    test('milestone DOES fire after Chicago local-midnight crossover', () => {
        const baselineYmd = '2026-04-15';
        const utcInstant = new Date('2026-05-15T12:00:00Z'); // 07:00 same day in CDT
        const todayChicago = chicagoCivilDate(utcInstant); // 2026-05-15

        const days = daysSinceBaseline(baselineYmd, todayChicago);
        expect(days).toBe(30);
    });

    test('CST (winter) — chicagoCivilDate at 2026-01-15T05:00:00Z (= 23:00 CST prior day)', () => {
        // 2026-01-15T05:00:00Z, January → CST (UTC-6) → 2026-01-14T23:00:00
        const utcInstant = new Date('2026-01-15T05:00:00Z');
        expect(chicagoCivilDate(utcInstant)).toBe('2026-01-14');
    });
});
