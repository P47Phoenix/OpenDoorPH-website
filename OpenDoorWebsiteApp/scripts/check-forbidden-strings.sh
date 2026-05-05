#!/usr/bin/env bash
# Issue #58 slice A — FR-06 forbidden-string regression guard.
# Source-side scope (covers all 4 production builds since they share source).
# `Lowry` (the safe spelling at AboutPage) is intentionally not matched
# by the forbidden token `Lowrey`.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${REPO_ROOT}"

PATTERN='philippines|pleasant hill interdenom|herbert lowrey'
PATHS=("OpenDoorWebsiteApp/src" "OpenDoorWebsiteApp/public")

# Test files are excluded: CRA does not bundle them, and existing
# negative-guard tests reference 'philippines' as a literal.
EXCLUDES=(
    --exclude-dir=__tests__
    --exclude='*.test.ts' --exclude='*.test.tsx'
    --exclude='*.spec.ts' --exclude='*.spec.tsx'
)

set +e
grep -r -I -i -E "${EXCLUDES[@]}" "${PATTERN}" "${PATHS[@]}"
rc=$?
set -e

case "${rc}" in
    1) echo "OK: no forbidden strings found in source." ;;
    0) echo "FAIL: forbidden string(s) found in source." >&2; exit 1 ;;
    *) echo "ERROR: grep exit ${rc}" >&2; exit "${rc}" ;;
esac
