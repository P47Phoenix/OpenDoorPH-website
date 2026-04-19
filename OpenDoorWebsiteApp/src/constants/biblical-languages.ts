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
 * Pass-2 scope: STORY-ISSUE-005, -006, -007.
 * Pass-3 scope: STORY-ISSUE-011, -012, -013 (Hebrew Foundations).
 * Pass-4 scope: STORY-ISSUE-008 (Matt 18:15 εἰς σέ textual variant).
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

// Source PRD ISSUE-011 (lines ~237-240): Leviticus 19:17 — tochacha.
// Hebrew verse, English translation, and the infinitive-absolute phrase
// "hocheach tochiach" (הוֹכֵחַ תּוֹכִיחַ) with its phrase-level transliteration.
// NOTE: Source PRD does NOT supply a whole-verse transliteration of Lev 19:17,
// only the phrase-level hocheach tochiach. Per STORY-ISSUE-011 AC-3, no
// whole-verse transliteration renders unless present verbatim in the source
// PRD; therefore no TRANSLIT_LEV_19_17 constant exists.
export const HEBREW_LEV_19_17 = "לֹא-תִשְׂנָא אֶת-אָחִיךָ בִּלְבָבֶךָ הוֹכֵחַ תּוֹכִיחַ אֶת-עֲמִיתֶךָ";
export const ENGLISH_LEV_19_17 = "You shall not hate your brother in your heart. You shall surely rebuke your neighbor...";
export const HEBREW_HOCHEACH_TOCHIACH = "הוֹכֵחַ תּוֹכִיחַ";
export const TRANSLIT_HOCHEACH_TOCHIACH = "hocheach tochiach";

// Source PRD ISSUE-012 (lines ~262-270): Teshuvah (תְּשׁוּבָה) and its root שׁוּב (shuv).
export const HEBREW_TESHUVAH = "תְּשׁוּבָה";
export const TRANSLIT_TESHUVAH = "teshuvah";
export const HEBREW_SHUV = "שׁוּב";
export const TRANSLIT_SHUV = "shuv";

// Source PRD ISSUE-013 (lines ~286-289): Leviticus 19:18 — ve'ahavta lere'acha kamocha.
export const HEBREW_LEV_19_18 = "וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ";
export const TRANSLIT_LEV_19_18 = "ve'ahavta lere'acha kamocha";
export const ENGLISH_LEV_19_18 = "You shall love your neighbor as yourself";

// Source PRD ISSUE-008 (line ~183, ~186): Matthew 18:15 textual variant.
// "The phrase **εἰς σέ** (*eis se*, 'against you') is absent in several
//  significant manuscripts, including Sinaiticus (א)."
export const GREEK_EIS_SE = "εἰς σέ";
export const TRANSLIT_EIS_SE = "eis se";
