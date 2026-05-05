#!/usr/bin/env bash
# Issue #58 slice A — FR-06 forbidden-string regression guard.
#
# Forbids any of `philippines`, `pleasant hill interdenom`, or
# `herbert lowrey` (case-insensitive) from appearing in the application
# source tree. Source-side scope (OpenDoorWebsiteApp/src and
# OpenDoorWebsiteApp/public) intentionally sidesteps the four-build-dirs
# coexistence concern flagged in Plan-stage adversarial round 2 (Lens 6
# / GAP-B): the four production builds (build-prod, build-gh-pages,
# build-custom, build-deep) all derive from this same source, so a
# pre-build source-side check covers every deploy target uniformly.
#
# POSIX grep semantics:
#   exit 0 = matches found  -> we want this script to exit 1 (FAIL)
#   exit 1 = no matches     -> we want this script to exit 0 (OK)
#   exit 2 = error          -> we propagate non-zero (FAIL)
#
# `Lowry` (the safe, correct spelling at AboutPage line 62) is NOT
# matched by the forbidden token `Lowrey`. This is intentional and
# documented in PRD §1.3 F6 / story 4 AC-5.

set -euo pipefail

# Run from repo root: the script invokes paths relative to repo root so
# it can be called from CI working-directory `./OpenDoorWebsiteApp`
# (in which case we adjust) or from repo root.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "${REPO_ROOT}"

PATTERN='philippines|pleasant hill interdenom|herbert lowrey'
SEARCH_PATHS=(
    "OpenDoorWebsiteApp/src"
    "OpenDoorWebsiteApp/public"
)

# Excludes: test files and the __tests__ directory. CRA's
# `react-scripts build` does NOT bundle test sources, so they cannot
# leak forbidden strings to any of the four production builds. Several
# existing negative-guard tests intentionally reference 'philippines'
# as a string-comparison literal (e.g. `expect(text).not.toContain('philippines')`).
# Excluding test files keeps FR-06 a meaningful regression contract on
# production-shipped source while preserving those existing guards.
EXCLUDE_DIRS=("__tests__")
EXCLUDE_PATTERNS=("*.test.ts" "*.test.tsx" "*.spec.ts" "*.spec.tsx")

echo "FR-06 forbidden-string check"
echo "  pattern: ${PATTERN}"
echo "  paths:   ${SEARCH_PATHS[*]}"
echo "  exclude: ${EXCLUDE_DIRS[*]} ${EXCLUDE_PATTERNS[*]}"
echo

# Build grep --exclude-dir / --exclude args.
GREP_EXCLUDES=()
for d in "${EXCLUDE_DIRS[@]}"; do
    GREP_EXCLUDES+=("--exclude-dir=${d}")
done
for p in "${EXCLUDE_PATTERNS[@]}"; do
    GREP_EXCLUDES+=("--exclude=${p}")
done

# `|| true` lets us inspect grep's exit code without `set -e` aborting.
set +e
grep -r -I -i -E "${GREP_EXCLUDES[@]}" "${PATTERN}" "${SEARCH_PATHS[@]}"
rc=$?
set -e

if [ "${rc}" -eq 1 ]; then
    echo "OK: no forbidden strings found in source."
    exit 0
elif [ "${rc}" -eq 0 ]; then
    echo
    echo "FAIL: forbidden string(s) found in source." >&2
    echo "      Open Door Full Gospel Church (DBA only) is the public name." >&2
    echo "      Pleasant Hill, MO is the locality (NOT Philippines)." >&2
    echo "      The deceased pastor is not cited (per project facts)." >&2
    exit 1
else
    echo "ERROR: grep returned unexpected exit code ${rc}." >&2
    exit "${rc}"
fi
