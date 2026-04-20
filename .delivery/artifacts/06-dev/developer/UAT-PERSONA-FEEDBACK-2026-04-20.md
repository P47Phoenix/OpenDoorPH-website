# UAT-PERSONA-FEEDBACK-2026-04-20 — Stage 7 UAT revision round

**Role:** developer (Bezalel alias)
**Target:** `OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx`
**Branch:** `feat/galatians-6-1-corrections` (local working tree)
**Date:** 2026-04-16
**Elder principle honored:** verify-or-remove; team does not author theological prose.

---

## Input persona reviews (all APPROVE WITH REVISIONS — no BLOCK)

| # | Persona | File |
|---|---------|------|
| 01 | Dr. Marcus Whitfield — Reformed Greek scholar | `.delivery/artifacts/07-uat/personas-review/01-reformed-greek-scholar.md` |
| 02 | Rabbi-Teacher Yonatan Ben-Ezra — Messianic Torah-roots teacher | `.delivery/artifacts/07-uat/personas-review/02-messianic-torah-roots-teacher.md` |
| 03 | Pastor Elijah Harrow — Full Gospel pastor-scholar | `.delivery/artifacts/07-uat/personas-review/03-full-gospel-pastor-scholar.md` |
| 04 | Dr. Rowan Callister — historical-theology watchman | `.delivery/artifacts/07-uat/personas-review/04-historical-theology-watchman.md` |
| 05 | Linda Hargrove — lay-congregant reader | `.delivery/artifacts/07-uat/personas-review/05-lay-congregant-reader.md` |

---

## Fixes APPLIED

### Fix 1 — Empty "Historical Christian Commentary" section removed

**Personas:** Whitfield finding #11, Harrow TONE-04, Callister §4, Hargrove L-09 (four personas converged).

**Change:** The `<h2>` heading "Historical Christian Commentary" and its now-empty `<section>` container were removed entirely. The previous five in-section audit-trail JSX comments (STORY-ISSUE-001, ISSUE-002, ELDER-AUDIT-2026-04-20 Matthew Henry, STORY-ISSUE-003, STORY-ISSUE-004) were consolidated into a single top-level JSX comment block that preserves the removal audit trail inline where the section used to sit. Specific per-story audit trails remain preserved in `.delivery/artifacts/06-dev/` story files.

**Rationale:** The elder's "if not empirically verified, remove" directive applies to the empty container too — an `<h2>` with no rendered content whispers a falsehood ("the historical tradition has nothing to say on this verse"), which is the opposite of what a verify-or-remove principle intends. Path (a) of the three personas' suggested options; simplest and most honest. No quotation was restored; no theological prose authored.

**JSX impact:** Single matched `<section>...</section>` removed, replaced with one JSX comment. Structurally balanced.

---

### Fix 2 — Teshuvah placement clarifier (FR-06.a preserved)

**Persona:** Hargrove L-05.

**Change:** Inserted a one-sentence italic clarifier as the first `<p>` after the `<h4 id="teshuvah">` heading and before the existing etymology paragraph:

> *Teshuvah* is a Hebrew concept, presented here because Paul's Greek *katartizo* ("restore") in Galatians 6:1 draws on this Jewish theological framework.

**Rationale:** FR-06.a commits *teshuvah* to h4 within h2 Detailed Analysis → h3 Key Greek Terms → Restore (katartizo) block (per STORY-ISSUE-012 AC-1). The committed heading structure stays untouched. The clarifier language is drawn from source PRD ISSUE-012 Problem ("*teshuvah* … is the foundational framework … for *katartizo* … the continuation of Israel's covenantal life") — not team-authored theology, just a structural orienter for the lay reader who meets a Hebrew term under a Greek-terms heading. No new claim; no new content. Anchor `#teshuvah` unchanged.

---

### Fix 3 — "Infinitive absolute" parenthetical gloss

**Personas:** Hargrove L-06 (primary); Harrow ACCESSIBILITY-01 (confirmation).

**Change:** The Tochacha paragraph on Lev 19:17 previously read: "is an infinitive absolute construction — the doubling of the verb intensifies and obligates the command." The "infinitive absolute construction" term was unglossed. Revised to:

> … is an infinitive absolute construction — a Hebrew grammatical pattern where the doubled verb intensifies and obligates the command.

**Rationale:** The gloss is grammatical fact (not theological interpretation); team authorship is acceptable. Phrasing is drawn from the suggested fix in the task brief. The original "the doubling of the verb intensifies and obligates the command" material is preserved verbatim; only the phrase before the em-dash now reads as a named grammatical form rather than as a bare technical term.

---

### Fix 4 — Hebrew Foundations pastoral framing sentence

**Personas:** Harrow TONE-02 (largest single finding in his review, "borderline deal-breaker for Full Gospel register"); Harrow OMISSION-01 (second-person voice thinning).

**Change:** Inserted one italic framing sentence as the first child of the Hebrew Foundations `<div className="space-y-6">` container, BEFORE the existing Tochacha h3:

> Before we look at how the early Church spoke of restoration, consider how the Hebrew Bible — Paul's own formation — taught the same practice.

**Rationale:** The task brief explicitly permits this as "introductory framing, not theological content per se — acceptable team authorship similar to section transitions." The sentence makes no positive theological claim; it is a transitional bridge from the preceding Greek-terms material to the existing Hebrew Foundations content. Register is pastoral (the second-person "we" / "consider" that Harrow OMISSION-01 flagged as absent from the revised blocks). Anchor ids (`#hebrew-foundations`, `#tochacha`, `#law-of-christ`) unchanged.

---

### Fix 5a — Luther "Katie von Bora" softened to attested form

**Personas:** Whitfield finding #9 (no WA TR table-number), Harrow FACTUAL-01 (LW 54 *Tischreden* locator missing), Callister S-1 (volume/page citation requested).

**Change:** The pre-existing sentence —

> Martin Luther called Galatians "my epistle" and "my Katie von Bora" (his wife), emphasizing its central role…

— was softened to retain only the universally-attested "my epistle" form:

> Martin Luther called Galatians "my epistle," emphasizing its central role…

**Rationale:** All three historical-review personas flagged the "Katie von Bora" clause as a popular-Tischreden paraphrase lacking a verifiable WA/LW volume-and-page locator. Callister S-1 explicitly recommends "drop the 'my Katie von Bora' clause and retain only 'my epistle' (which is safe)." The softening is a mechanical correction (not new theological content, not a restored quote) of pre-existing page content flagged by the empirical-verification principle the elder already applies. This is distinct from the 14 ISSUE-### work and predates the Pass-1 removals.

---

## Fixes SKIPPED (with reason)

### Skip-1 — Maqqef vs. ASCII hyphen in Lev 19:17 (Ben-Ezra Finding 1)

**Reason:** Ben-Ezra explicitly routes this to the elder as "a source-PRD Unicode-hygiene question, not a page-edit demand." The rendered Hebrew is PRD-verbatim (per the Pass-3 verbatim gate). Changing the Unicode form without elder ratification would break the verbatim-match CI check in `discourse-fidelity-check.sh` Pass-3 and would require a corresponding edit to `OpenDoorWebsiteApp/tests/fixtures/hebrew-greek-strings.ts` and ultimately to `source-prd.md` line 237. All three are out of scope for persona-feedback revision and require elder authority.

### Skip-2 — SBL transliteration convention not stated (Ben-Ezra Finding 2)

**Reason:** Ben-Ezra classifies his own finding as a documentary note: "the issue is not the choice; the issue is that the choice is *unstated*." He verified internal consistency (`ch`/`sh`/`'` used consistently), and his suggested fix is a header note in `biblical-languages.ts`. Adding documentation of transliteration scheme would require declaring a convention the team has not empirically chosen; elder attention recommended. No page content is wrong.

### Skip-3 — Heschel p. 375 quotation wording (Ben-Ezra Finding 3)

**Reason:** The team cannot physically verify Heschel *God in Search of Man*, FSG edition, p. 375 without access to the primary printed volume. The rendered two-sentence text is PRD-verbatim (source PRD lines 262–263, including the Heschel wording and the p. 375 citation). Per the elder's principle, the team does not edit theological content on its own authority. Ben-Ezra explicitly routes this "with a recommendation to pull the FSG copy from the reference shelf" — elder action required.

### Skip-4 — Lev 19:18 partial-verse labeling (Ben-Ezra Finding 4)

**Reason:** The partial verse rendering is PRD-verbatim (source PRD line 289). Ben-Ezra offers two fix paths: (a) relabel as "Leviticus 19:18b" or (b) render the full verse with the preceding clause (*lo tikkom ve-lo titor*) bolded. Both require edits to source PRD fixtures and to the Hebrew language constants in `biblical-languages.ts`. Ben-Ezra himself writes "the bug, if it is one, is upstream in the PRD." Elder ratification required.

### Skip-5 — Arachin 16b footnote content expansion (Ben-Ezra Finding 5)

**Reason:** Ben-Ezra classifies this himself as "purely a nice-to-have" and "optional — if the elder wants the footnote to teach as well as cite." Expanding the footnote to "R. Tarfon, R. Eleazar ben Azariah, and R. Akiva disputing the limits of the rebuke obligation" would be team authorship of rabbinic content beyond the PRD's current language. The citation as it stands is correct. Skipped per team authorship limit.

### Skip-6 — Harrow TONE-01 (pastoral-voice regression at lexical entries, prolēmphthē and prautēs)

**Reason:** Harrow's suggested fixes require team-authored pastoral prose ("The verse does not tell us whether the brother planned his fall or stumbled into it …" and "This is the fruit of the Spirit at work in the one doing the restoring — not weakness, but a steady hand…"). Harrow classifies these as "the pastor's own voice" — but the elder has confined team authorship to structural and mechanical changes. These sentences would be devotional/theological authorship. Elder attention recommended.

### Skip-7 — Harrow TONE-03 (Guarding Against Temptation applied paragraph)

**Reason:** Harrow's suggested fix is a team-authored pastoral paragraph ("Beloved, this is the word I find myself needing most when I go to restore a brother…"). Team cannot author this under the elder's empirical-verification principle. Elder attention recommended.

### Skip-8 — Harrow TRANSLATION-01 (NKJV "trespass" vs. ESV/KJV side-by-side note)

**Reason:** Would require team authorship of a new translation-comparison explanatory note ("All three translate the same Greek word — a stumble or fall-aside — and the study's exposition applies to whichever your Bible uses"). Crosses into exegetical interpretation of *paraptōma*. Elder attention recommended.

### Skip-9 — Harrow TONE-02 item 2 (Talmud / Mishneh Torah gloss)

**Reason:** Harrow suggests adding a gentle aside "(The Talmud is the rabbinic commentary on the Torah; the Mishneh Torah is Maimonides' 12th-century codification of Jewish law.)" This crosses into defining Jewish primary sources — arguably factual but on the boundary of the team-authorship line given the Hebrew Foundations section's "source-PRD verbatim only" gate. Pastoral-framing sentence in Fix 4 partially addresses the cold-block concern. Elder attention recommended for this specific aside.

### Skip-10 — Harrow TONE-02 item 3 (second-person voice reintroduction across subsections)

**Reason:** Each rewrite would require team-authored pastoral/applied sentences (e.g., "Hear what that command is asking of us: do not let the sin of a brother sit in your heart as hatred. Go to him."). These are theological applications, not structural edits. Fix 4 adds one second-person framing sentence at the Hebrew Foundations opening as a partial mitigation. Elder attention recommended for deeper voice restoration.

### Skip-11 — Hargrove L-01 (Judaizer background tied to 6:1 restoration command)

**Reason:** Suggested fix is a team-authored transitional sentence ("This background explains why Paul, in 6:1, urges *gentle* restoration — he has just spent five chapters warning against a harsh, law-minded spirit"). Crosses into exegetical claim-making. Elder attention recommended.

### Skip-12 — Hargrove L-02 (Greek-term format consistency across four bullets)

**Reason:** Adding Hebrew script to the *adelphoi* and *katartizo* bullets and standardizing format requires introducing new Greek-lemma constants (`GREEK_ADELPHOI`, `GREEK_KATARTIZO`) which the team has not empirically established from a verified source against the NA28 apparatus. Whitfield finding #2 (καταρτίζω) and finding #6 (ἀδελφοί) both also request Greek script. This cross-persona agreement suggests the fix is tractable, but requires adding new canonical Greek string constants, fixture entries, and PRD-verbatim verification. Beyond the scope of a persona-feedback tone revision; escalation to elder / Pass-3 fixtures work.

### Skip-13 — Hargrove L-03 (katartizo "set a broken bone / mend fishing nets" footnote)

**Reason:** Whitfield finding #2 flags the exact same concern and asks for BDAG or F.F. Bruce lexicon citation, or reframing to drop the quotation marks. Both paths cross into either (a) new lexicon citation authorship (would need BDAG p. 526 verification) or (b) theological reframing of the gloss. Elder attention recommended.

### Skip-14 — Hargrove L-04 (Kittel quote period placement)

**Reason:** Mechanical punctuation fix (move period inside closing quote mark) is on the boundary — easily done but the current placement is PRD-verbatim and altering punctuation of a cited quotation could be read as editorial drift into the source. Nice-to-have only per Hargrove. Escalation recommended.

### Skip-15 — Hargrove L-07 (Talmud Arachin / Maimonides verification)

**Reason:** Hargrove herself routes this: "Nothing from me, once a qualified reviewer (persona 02) confirms accuracy." Ben-Ezra Finding 6 confirms the Maimonides citation is exact; Ben-Ezra Finding 5 confirms Arachin 16b is correct with optional expansion. No action required.

### Skip-16 — Hargrove L-08 (Matthew Henry footnote link)

**Reason:** Would require adding a new footnote pointing to the biblestudytools URL already in the reference list. Tractable but introduces a new footnote number (`fn-pa-1` or similar) in the Practical Application section, which does not currently have a section-scoped footnote apparatus. This is structural scaffolding work that warrants its own focused story rather than inclusion in persona-feedback tone revision. Escalation recommended.

### Skip-17 — Hargrove L-10 (skip-to navigation)

**Reason:** Nice-to-have. Architectural change (new nav component with anchor links). Escalation recommended as separate story.

### Skip-18 — Hargrove L-11 (Codex Sinaiticus / aorist passive / halakhic glosses)

**Reason:** Three separate parenthetical glosses. "Codex Sinaiticus — a fourth-century Greek manuscript of the Bible" is a factual-historical gloss (potentially tractable), but "aorist passive" and "halakhic" glosses cross into grammatical-teaching territory with theological implications. Uneven — recommend elder review for the Sinaiticus parenthetical specifically; skip the others.

### Skip-19 — Hargrove L-12 (Google-search primary-source links)

**Reason:** Pre-existing architectural choice in the Sources/References section. Replacing search-URL placeholders with primary-source links requires sourcing canonical URLs for NA28, EGT, and multiple Bruce volumes — beyond persona-feedback revision scope.

### Skip-20 — Callister S-2 / S-3 / S-4 / commendations

**Reason:** S-2 and S-3 are explicit commendations (no action required). S-4 is a tone nudge Callister himself says "No action required."

### Skip-21 — Whitfield findings 1, 2, 3, 4, 5, 7, 8, 10

**Reason (each):**
- **Finding 1** (prolambanō lemma + subjunctive mood note): rewrite would be team-authored Greek-exegetical prose ("The verb προλαμβάνω … carries the nuance of being 'overtaken' or 'surprised before one can guard himself'"). Theological authorship limit.
- **Finding 2** (καταρτίζω Greek script + BDAG gloss): new Greek constant + lexicon verification required. See Skip-12 and Skip-13.
- **Finding 3** (Lightfoot edition/page): mechanical footnote edit available, but requires confirming which Zondervan reprint was consulted — team does not have the physical volume. Elder attention.
- **Finding 4** (Bruce NIGTC title/year): mechanical footnote edit. Narrowly tractable but the current title "Commentary on Galatians" is not wrong, just imprecise. Nice-to-have. Escalation recommended for a single focused footnote-cleanup pass.
- **Finding 5** (TDNT author inline): restructures a quoted sentence — ambiguous whether mechanical or theological. Nice-to-have. Escalation recommended.
- **Finding 7** (textual variant witnesses ℵ B vs. D W): team cannot extend apparatus discussion without NA28 in hand.
- **Finding 8** (Sola Fide bold heading → "Justification by Faith"): Whitfield himself notes "Optional — editorial taste, not a factual correction." Not applied.
- **Finding 10** (Matthew Henry edition spec): team cannot verify Hendrickson 1991 page number without the physical volume. Url is already in the reference list.

These are all legitimate historical-theology points requiring elder review or source access beyond team scope.

---

## Verification results

| Gate | Command | Result |
|------|---------|--------|
| Discourse-fidelity check | `BASE_REF=origin/master sh scripts/discourse-fidelity-check.sh` | **PASS** — source-PRD fidelity enforced (commentator names remain only in audit-trail comments; `<cite>` tags present; Pass-3 fixtures unchanged). |
| JSX structural balance | Python diff-hunk tag pair check on added/removed lines | **PASS** — all opened tags have matching closes in each diff hunk; section removal is a single matched `<section>...</section>` pair with its contents. |
| TypeScript compile | `npm run type-check` | **Not run locally** — Node/npm not on PATH on this Fedora Silverblue host (matches prior CODE_COMPLETE notes in STORY-ISSUE-011 / ISSUE-012 / ISSUE-013). CI runs the full gate. |
| Unit tests | `npm run test -- --watchAll=false` | **Not run locally** — same environmental limit. |
| E2E / Playwright | `npm run test:e2e` | **Not run locally** — same. |
| Anchor slug preservation (FR-05.a) | `grep 'id="(hebrew-foundations\|tochacha\|teshuvah\|law-of-christ\|baros-phortion)"'` | **PASS** — all 5 committed slugs present at expected lines. |
| Forbidden words | `grep Philippines` | **PASS** — no matches. "PH" appears only inside token-scoped symbol names (`GREEK_PHORTION`, `GREEK_PROLEMPHTHE`, etc.), never as a standalone location abbreviation. |
| Pleasant Hill reference | `grep "Pleasant Hill"` | **PASS** — meta description reads "Pleasant Hill, MO". |
| No ISSUE-### regression | Diff inspection | **PASS** — no changes to anchor ids, footnote structures, Hebrew/Greek constant imports, or canonical Hebrew/English text blocks. Matthew Henry inline `<cite>` in Practical Application preserved. |

---

## Files changed

- `OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx` — 5 targeted edits, summarized above:
  1. Luther "Katie von Bora" → "my epistle" (softened, line ~141 area).
  2. Teshuvah placement clarifier (line ~322 area, new italic `<p>`).
  3. Infinitive absolute gloss (line ~597 area, rewording within existing `<p>`).
  4. Hebrew Foundations pastoral framing sentence (line ~552 area, new italic `<p>` at top of `space-y-6`).
  5. Historical Christian Commentary section removed entirely (line ~920–997 area, replaced with top-level audit-trail JSX comment).

No changes to: anchor slugs, FR-05.a ids, Pass-3 Hebrew/Greek fixtures, Matthew Henry inline attribution, footnote apparatus, ISSUE-010 / ISSUE-014 text, any imported constant from `biblical-languages.ts`.

---

## Escalation summary for elder attention

The following persona findings remain open and require elder ratification (theological authorship) or primary-source access (physical reference shelves) that the team does not have:

1. Heschel p. 375 verbatim verification (Ben-Ezra #3, Hargrove route).
2. Maqqef vs. ASCII hyphen Unicode hygiene in source PRD (Ben-Ezra #1).
3. SBL transliteration scheme documentation (Ben-Ezra #2).
4. Lev 19:18 partial-verse labeling or expansion (Ben-Ezra #4).
5. Harrow TONE-01 pastoral voice restoration in prolēmphthē / prautēs entries.
6. Harrow TONE-03 Guarding Against Temptation applied paragraph.
7. Harrow TRANSLATION-01 NKJV/ESV/KJV side-by-side note.
8. Hargrove L-01 Judaizer-background-to-6:1 transitional sentence.
9. Hargrove L-02 / Whitfield #2 / Whitfield #6 — Greek-script standardization across four Key Greek Terms bullets.
10. Hargrove L-03 / Whitfield #2 — katartizo "broken bone / fishing nets" footnote or reframe.
11. Whitfield #1 — prolambanō subjunctive mood and lemma note.
12. Whitfield #3 / #4 — Lightfoot and Bruce footnote edition/year precision.
13. Whitfield #10 — Matthew Henry edition specification (Hendrickson 1991 p. ___).
14. Hargrove L-08 Matthew Henry footnote link (architectural — may warrant focused story).
15. Hargrove L-10 / L-11 / L-12 — skip-to nav, Sinaiticus/aorist/halakhic glosses, primary-source link hygiene.

These are legitimate improvements but each crosses one of the elder's boundaries:
- Team does not author new theological / pastoral / exegetical prose.
- Team does not fabricate citation apparatus the team cannot physically verify.
- Team does not alter PRD-verbatim fixtures without elder ratification.

---

## Commit

Single commit planned (not pushed):

```
fix(scripture): apply UAT persona feedback — remove empty commentary section,
add pastoral framing, gloss infinitive absolute, tighten Hebrew Foundations —
UAT-PERSONA-FEEDBACK-2026-04-20

Refs: UAT-PERSONA-FEEDBACK-2026-04-20
```

Trailer per task brief.

---

*Precise to the cubit.* — Bezalel
