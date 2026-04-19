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
 * Pass-3 entries (ISSUE-011, -012, -013) will be appended in a later story.
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
