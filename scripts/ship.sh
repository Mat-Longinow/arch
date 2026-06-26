#!/usr/bin/env bash
# ship.sh — the canonical one-command ship for this repo: stage, commit, push.
# The pre-push hook auto-purges jsDelivr afterward, so content goes live for real.
#
# USAGE:
#   scripts/ship.sh "commit message"              # stage everything (git add -A)
#   scripts/ship.sh "commit message" path [path]  # stage only the given paths
#
# Attribution defaults to Studio Lead; override with GIT_AUTHOR_NAME/EMAIL.
set -euo pipefail

MSG="${1:?usage: ship.sh \"commit message\" [path ...]}"
shift || true

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [ "$#" -gt 0 ]; then
  git add -- "$@"
else
  git add -A
fi

if git diff --cached --quiet; then
  echo "ship.sh: nothing staged — aborting." >&2
  exit 1
fi

NAME="${GIT_AUTHOR_NAME:-Studio Lead}"
EMAIL="${GIT_AUTHOR_EMAIL:-mat.longinow@gmail.com}"
git -c user.name="$NAME" -c user.email="$EMAIL" commit -m "$MSG"
git push
echo "ship.sh: pushed. jsDelivr purge scheduled by pre-push hook (tail .git/jsdelivr-purge.log)."
