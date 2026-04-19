/**
 * Hebrew/Greek fixture strings — test-side view of the source PRD authoritative forms.
 *
 * This file intentionally re-exports from `src/constants/biblical-languages.ts`,
 * which is the single canonical module for the Unicode code-points rendered on
 * the Scripture Study page. Re-exporting here — rather than duplicating the
 * literals — guarantees byte-for-byte equality between what the page renders
 * and what tests assert.
 *
 * Import rule: Playwright specs, discourse-fidelity CI scripts, and Jest unit
 * tests import from THIS path. Production code imports from the src-side path.
 *
 * Pass-2 scope: STORY-ISSUE-005, -006, -007.
 * Pass-3 scope: STORY-ISSUE-011, -012, -013 (Hebrew Foundations).
 */

// Source PRD ISSUE-005: aorist passive subjunctive of prolambanō
export {
    GREEK_PROLEMPHTHE,
    TRANSLIT_PROLEMPHTHE,
} from '../../src/constants/biblical-languages';

// Source PRD ISSUE-006: prautes
export {
    GREEK_PRAUTES,
    TRANSLIT_PRAUTES,
} from '../../src/constants/biblical-languages';

// Source PRD ISSUE-007: baros and phortion
export {
    GREEK_BAROS,
    TRANSLIT_BAROS,
    GREEK_PHORTION,
    TRANSLIT_PHORTION,
} from '../../src/constants/biblical-languages';

// Source PRD ISSUE-011: Leviticus 19:17 — tochacha / hocheach tochiach
// (Source PRD supplies no whole-verse transliteration of Lev 19:17; only the
//  phrase-level TRANSLIT_HOCHEACH_TOCHIACH is re-exported.)
export {
    HEBREW_LEV_19_17,
    ENGLISH_LEV_19_17,
    HEBREW_HOCHEACH_TOCHIACH,
    TRANSLIT_HOCHEACH_TOCHIACH,
} from '../../src/constants/biblical-languages';

// Source PRD ISSUE-012: teshuvah (תְּשׁוּבָה) and root שׁוּב (shuv)
export {
    HEBREW_TESHUVAH,
    TRANSLIT_TESHUVAH,
    HEBREW_SHUV,
    TRANSLIT_SHUV,
} from '../../src/constants/biblical-languages';

// Source PRD ISSUE-013: Leviticus 19:18 — ve'ahavta lere'acha kamocha
export {
    HEBREW_LEV_19_18,
    TRANSLIT_LEV_19_18,
    ENGLISH_LEV_19_18,
} from '../../src/constants/biblical-languages';
