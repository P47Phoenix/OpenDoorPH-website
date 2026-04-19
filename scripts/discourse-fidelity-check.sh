#!/bin/sh
# discourse-fidelity-check.sh
#
# POSIX-compatible discourse-fidelity gate for PRs touching the Galatians 6:1
# Scripture study page. Invoked from a CI job added to `.github/workflows/node-build.yml`
# by STORY-INFRA-01 during Sprint 1. This script is the successor to
# `ratification-check.sh`, which was retired per elder ruling 2026-04-16.
#
# Elder ruling (2026-04-16) — governing principle:
#   The source PRD IS the implementation spec. There is no ratifications
#   directory, and there is no source-availability inventory. Pass-1
#   (unverifiable quotes) disposition is VERIFY-OR-REMOVE only — no reframe.
#   Pass-3 (Hebrew Foundations) is source-PRD-verbatim only — no team-authored
#   theological prose.
#
# Purpose: enforce source-PRD fidelity on PRs modifying
#   OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx
#
# Checks (summarised — see inline comments for detail):
#   Pass-1 (removal gate): if a commentator block (Chrysostom / Calvin /
#     Spurgeon / Lloyd-Jones) remains in the file, it must either be a
#     cited block (has an accompanying <cite>...</cite>) or be removed
#     entirely. Unverifiable direct quotes without <cite> are the failure
#     mode.
#   Pass-3 (verbatim gate): if the PR touches the Hebrew Foundations
#     region (id="hebrew-foundations" / "tochacha" / "teshuvah" /
#     "law-of-christ"), the rendered Hebrew + transliteration + English
#     triad must match fixtures from
#     OpenDoorWebsiteApp/tests/fixtures/hebrew-greek-strings.ts (Dev creates
#     these fixtures from the source PRD at Sprint 1 start).
#   Pass-2 / Pass-4 (sanity): no added line may contain a direct-quote
#     <blockquote> or italic <p> without an accompanying <cite> somewhere
#     in the same commentator block.
#
# Contract:
#   - Bash-free. POSIX `/bin/sh` only.
#   - Uses `git diff BASE_REF...HEAD` to detect changed files.
#   - Exits 0 on PASS; exits 1 with a clear diagnostic on FAIL;
#     exits 2 on invocation error (missing git, no repo, bad BASE_REF).
#   - Runs as a CI job step in node-build.yml (added by STORY-INFRA-01).
#
# Local invocation:
#   BASE_REF=origin/master sh .delivery/artifacts/05-plan/devops/discourse-fidelity-check.sh

set -eu

# --- configuration ---------------------------------------------------------

SCRIPTURE_FILE="OpenDoorWebsiteApp/src/pages/ScriptureStudy/ScriptureStudy.tsx"
FIXTURES_FILE="OpenDoorWebsiteApp/tests/fixtures/hebrew-greek-strings.ts"
BASE_REF="${BASE_REF:-origin/master}"

# Pass-1 commentator names. If the commentator's name remains in the file,
# the commentator block must either (a) have a <cite>...</cite> citation or
# (b) be fully removed (name absent). We enforce this structurally below.
PASS1_NAMES="Chrysostom Calvin Spurgeon Lloyd-Jones"

# Pass-3 Hebrew Foundations anchor ids.
PASS3_IDS="hebrew-foundations tochacha teshuvah law-of-christ"

# --- preflight -------------------------------------------------------------

command -v git >/dev/null 2>&1 || {
  echo "discourse-fidelity-check: git not found" >&2
  exit 2
}
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "discourse-fidelity-check: not a git repo" >&2
  exit 2
}

if ! git rev-parse --verify --quiet "${BASE_REF}" >/dev/null 2>&1; then
  echo "discourse-fidelity-check: BASE_REF '${BASE_REF}' not found; trying HEAD~1" >&2
  BASE_REF="HEAD~1"
  if ! git rev-parse --verify --quiet "${BASE_REF}" >/dev/null 2>&1; then
    echo "discourse-fidelity-check: no suitable base ref" >&2
    exit 2
  fi
fi

# --- diff collection -------------------------------------------------------

CHANGED_FILES=$(git diff --name-only "${BASE_REF}"...HEAD)

# Nothing to gate if ScriptureStudy.tsx was not touched.
if ! printf '%s\n' "${CHANGED_FILES}" | grep -Fxq "${SCRIPTURE_FILE}"; then
  echo "discourse-fidelity-check: ${SCRIPTURE_FILE} not modified; nothing to gate."
  exit 0
fi

# Guard: the file must exist on HEAD (not a deletion).
if [ ! -f "${SCRIPTURE_FILE}" ]; then
  echo "discourse-fidelity-check: ${SCRIPTURE_FILE} deleted by this PR; nothing to gate." >&2
  exit 0
fi

# Added-only portion of the diff (lines starting with '+' but not '+++').
SCRIPTURE_DIFF_ADDED=$(git diff "${BASE_REF}"...HEAD -- "${SCRIPTURE_FILE}" \
  | grep -E '^\+[^+]' || true)

FAIL=0
FAIL_MSGS=""

append_fail() {
  FAIL=1
  if [ -z "${FAIL_MSGS}" ]; then
    FAIL_MSGS="$1"
  else
    FAIL_MSGS="${FAIL_MSGS}
$1"
  fi
}

# --- Pass-1: removal gate --------------------------------------------------
#
# Rule: for each commentator name in PASS1_NAMES, if the name appears in the
# current ScriptureStudy.tsx file, the file MUST also contain a <cite> tag.
# The <cite> tag is the marker that a primary-source citation accompanies
# the commentator block. If the commentator's name is absent from the
# current file (elder chose removal), the rule is satisfied vacuously.
#
# Rationale: Pass-1 disposition is VERIFY-OR-REMOVE only. "Verify" means a
# primary-source citation appears in the block; "remove" means the
# commentator's name (and block) is gone. There is no third option.

for name in ${PASS1_NAMES}; do
  if grep -Fq "${name}" "${SCRIPTURE_FILE}"; then
    if ! grep -Fq "<cite" "${SCRIPTURE_FILE}"; then
      append_fail "Pass-1 FAIL [${name}]: commentator name present in ${SCRIPTURE_FILE} but no <cite> tag found anywhere in file. Elder disposition is VERIFY-OR-REMOVE — add a <cite>primary-source</cite> citation, or remove the commentator's block entirely."
    fi
  fi
done

# Additional Pass-1 sanity: no <blockquote> or italic <p> in an added line
# that lacks the word 'cite' somewhere on a nearby added line. We implement
# the cheap version: if added lines introduce a <blockquote> AND the file
# contains no <cite>, flag it. (Tighter per-block pairing is left to PR
# review; this script is a CI gate, not a parser.)

if printf '%s\n' "${SCRIPTURE_DIFF_ADDED}" | grep -qE '<blockquote'; then
  if ! grep -Fq "<cite" "${SCRIPTURE_FILE}"; then
    append_fail "Pass-2/4 FAIL: PR adds <blockquote> lines to ${SCRIPTURE_FILE} but the file contains no <cite> tag. Direct quotes require a visible primary-source citation."
  fi
fi

# --- Pass-3: verbatim gate -------------------------------------------------
#
# Rule: if the PR touches any Pass-3 anchor (id="hebrew-foundations" etc.),
# the fixtures file must exist and Dev must have populated it with the
# source-PRD-verbatim Hebrew + transliteration + English triad. This
# script does not re-verify the PRD text itself (that is the elder's
# authority); it verifies the fixtures file is present and non-empty and
# that the rendered text in ScriptureStudy.tsx does not drift from the
# fixtures' canonical strings.

PASS3_TOUCHED=0
for slug in ${PASS3_IDS}; do
  # Match id="slug" OR id='slug' in the added-lines diff.
  if printf '%s\n' "${SCRIPTURE_DIFF_ADDED}" \
      | grep -qE "id=[\"']${slug}[\"']"; then
    PASS3_TOUCHED=1
    break
  fi
done

# Also consider "touched" if existing id lines surround modified content.
if [ "${PASS3_TOUCHED}" -eq 0 ]; then
  for slug in ${PASS3_IDS}; do
    if printf '%s\n' "${SCRIPTURE_DIFF_ADDED}" | grep -Fq "${slug}"; then
      PASS3_TOUCHED=1
      break
    fi
  done
fi

if [ "${PASS3_TOUCHED}" -eq 1 ]; then
  if [ ! -f "${FIXTURES_FILE}" ]; then
    append_fail "Pass-3 FAIL: PR touches Hebrew Foundations region but ${FIXTURES_FILE} does not exist. Dev must create the fixtures file from the source PRD (verbatim Hebrew + transliteration + English) at Sprint 1 start — see STORY-INFRA-01."
  else
    # Fixtures file must be non-trivial.
    FIXTURE_BYTES=$(wc -c < "${FIXTURES_FILE}" | tr -d ' ')
    if [ "${FIXTURE_BYTES}" -lt 64 ]; then
      append_fail "Pass-3 FAIL: ${FIXTURES_FILE} exists but is empty/trivial (${FIXTURE_BYTES} bytes). Populate with source-PRD-verbatim strings."
    fi

    # Extract canonical string literals from the fixtures file and verify
    # each appears in ScriptureStudy.tsx. This is the verbatim check: the
    # page must render what the fixtures declare.
    #
    # We scan for single-or-double-quoted string values on lines matching
    # a fixture export shape (e.g., `hebrew: "..."` or `english: '...'`).
    # Missing any fixture string in the page is a FAIL.
    FIXTURE_STRINGS=$(grep -E "^[[:space:]]*(hebrew|transliteration|english)[[:space:]]*:" "${FIXTURES_FILE}" \
      | sed -E "s/^[^:]*:[[:space:]]*['\"]//;s/['\"][[:space:]]*,?[[:space:]]*\$//" \
      | grep -v '^[[:space:]]*$' || true)

    if [ -n "${FIXTURE_STRINGS}" ]; then
      IFS='
'
      for fixture_line in ${FIXTURE_STRINGS}; do
        # Skip very short strings (< 6 chars) — too likely to be false-match.
        fixture_len=$(printf '%s' "${fixture_line}" | wc -c | tr -d ' ')
        if [ "${fixture_len}" -lt 6 ]; then
          continue
        fi
        if ! grep -Fq "${fixture_line}" "${SCRIPTURE_FILE}"; then
          append_fail "Pass-3 FAIL: fixture string not found verbatim in ${SCRIPTURE_FILE}: \"${fixture_line}\""
        fi
      done
      unset IFS
    fi
  fi
fi

# --- verdict ---------------------------------------------------------------

if [ "${FAIL}" -eq 0 ]; then
  echo "discourse-fidelity-check: PASS — source-PRD fidelity enforced on ${SCRIPTURE_FILE}."
  exit 0
fi

echo "discourse-fidelity-check: FAIL"
echo ""
printf '%s\n' "${FAIL_MSGS}"
echo ""
echo "Resolution:"
echo "  - Pass-1 errors: the commentator block must EITHER carry a <cite> primary-source"
echo "    citation OR be removed entirely. No reframe, no paraphrase, no team-authored"
echo "    replacement text."
echo "  - Pass-3 errors: the source PRD IS the implementation spec. Populate or correct"
echo "    ${FIXTURES_FILE} so that the rendered page matches the PRD verbatim."
echo "  - See deploy-plan.md §20 for the full gate contract."
exit 1
