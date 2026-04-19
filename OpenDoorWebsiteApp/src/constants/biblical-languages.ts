/**
 * Biblical-language canonical strings — source PRD authoritative forms.
 *
 * Single source of truth for every Greek/Hebrew Unicode string rendered on the
 * Scripture Study page. Every string below is copied VERBATIM from
 * `.delivery/artifacts/01-idea/inputs/source-prd.md` and stored in NFC-normalized
 * form (the TypeScript source-file default).
 *
 * The `tests/fixtures/hebrew-greek-strings.ts` fixture re-exports these constants
 * so that unit, Playwright, and discourse-fidelity CI scripts compare against the
 * identical code-point sequences the page renders.
 *
 * Pass-2 scope (this file): STORY-ISSUE-005, -006, -007. Pass-3 entries will
 * append on later stories (STORY-ISSUE-011, -012, -013).
 */

// Source PRD ISSUE-005 (line ~122): aorist passive subjunctive of prolambanō.
// "The verb in the text is **προλημφθῇ** (*prolēmphthē*) — aorist passive subjunctive."
export const GREEK_PROLEMPHTHE = "προλημφθῇ";
export const TRANSLIT_PROLEMPHTHE = "prolēmphthē";

// Source PRD ISSUE-006 (line ~136): prautes.
export const GREEK_PRAUTES = "πραΰτης";
export const TRANSLIT_PRAUTES = "prautes";

// Source PRD ISSUE-007 (lines ~163-164): baros and phortion.
export const GREEK_BAROS = "βάρος";
export const TRANSLIT_BAROS = "baros";
export const GREEK_PHORTION = "φορτίον";
export const TRANSLIT_PHORTION = "phortion";
