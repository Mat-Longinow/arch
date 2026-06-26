#!/usr/bin/env bash
# jsdelivr-purge.sh — purge the jsDelivr @main edge cache for repo files.
#
# WHY THIS EXISTS: live pages fetch guts (.html) + CMS data (cms/*.json) + images
# from cdn.jsdelivr.net/gh/Mat-Longinow/arch@main/... jsDelivr edge-caches @main for
# up to ~7 days. A `git push` does NOT go live until the cache is purged — the page
# keeps serving the OLD file. (Hit 2026-06-26: a pushed stars.json with new
# support_url kept serving the old copy, so dancer cards regressed to "Learn More".)
#
# USAGE:
#   scripts/jsdelivr-purge.sh                 # purge files changed in the last commit
#   scripts/jsdelivr-purge.sh path [path...]  # purge specific repo-relative paths
#
# Files that no live page fetches (markdown docs, _source/**, *.preview.html) are
# skipped automatically. Purging is idempotent and cheap; over-purging is harmless.
set -uo pipefail

OWNER_REPO="Mat-Longinow/arch"
BRANCH="main"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not in a git repo" >&2; exit 1; }

if [ "$#" -gt 0 ]; then
  FILES="$*"
else
  FILES="$(git -C "$REPO_ROOT" diff --name-only HEAD~1 HEAD 2>/dev/null)"
fi
[ -z "${FILES// /}" ] && { echo "[jsdelivr-purge] nothing to purge"; exit 0; }

rc=0
for f in $FILES; do
  case "$f" in
    _source/*|*.preview.html|.gitignore|*.md|.idea/*|scripts/*) continue ;;  # not fetched by live pages
  esac
  code="$(curl -fsS "https://purge.jsdelivr.net/gh/${OWNER_REPO}@${BRANCH}/${f}" -o /dev/null -w "%{http_code}" 2>/dev/null)" || code="ERR"
  echo "[jsdelivr-purge] HTTP ${code}  ${f}"
  [ "$code" = "200" ] || rc=1
done
exit $rc
