/**
 * Date/time helpers for the rank-due milestone arithmetic.
 *
 * The PRD (FR-RANK-02 / NFR-08 / AC-16 / AC-38) requires both endpoints
 * (baseline + today) to be derived in `America/Chicago` local civil-date,
 * NOT in UTC. The runner clock on `ubuntu-latest` is UTC; bare `new Date()`
 * for "today" would silently fire the milestone one day early when the cron
 * tick lands at 06:00 UTC (= 01:00 CDT, still day-N-1 in Chicago).
 *
 * We use `Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' })` to
 * derive a stable YYYY-MM-DD on both sides, then subtract via UTC anchors so
 * the day-count is DST-safe.
 */

/**
 * Civil-date string YYYY-MM-DD in America/Chicago for the given Date.
 * `en-CA` locale is chosen because it formats as YYYY-MM-DD by default.
 *
 * @param {Date} d
 * @returns {string}
 */
export function chicagoCivilDate(d) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return fmt.format(d);
}

/**
 * Parse a YYYY-MM-DD string into UTC-noon Date (avoids DST midnight ambiguity
 * when subtracting two civil dates as days).
 *
 * Throws if the input is not a valid YYYY-MM-DD or names an impossible date.
 *
 * @param {string} ymd
 * @returns {Date}
 */
export function civilDateToUtcNoon(ymd) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) {
        throw new Error(`invalid YYYY-MM-DD: ${ymd}`);
    }
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    // Use UTC noon as the anchor to keep day-arithmetic stable across DST.
    const date = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
    if (
        date.getUTCFullYear() !== y ||
        date.getUTCMonth() !== mo - 1 ||
        date.getUTCDate() !== d
    ) {
        throw new Error(`invalid calendar date: ${ymd}`);
    }
    return date;
}

/**
 * Days between two civil-date strings (today - baseline). Both arguments
 * are YYYY-MM-DD; we anchor at UTC noon so DST transitions cannot perturb
 * the integer count.
 *
 * @param {string} baselineYmd
 * @param {string} todayYmd
 * @returns {number}
 */
export function daysSinceBaseline(baselineYmd, todayYmd) {
    const a = civilDateToUtcNoon(baselineYmd);
    const b = civilDateToUtcNoon(todayYmd);
    const ms = b.getTime() - a.getTime();
    return Math.round(ms / (24 * 60 * 60 * 1000));
}
