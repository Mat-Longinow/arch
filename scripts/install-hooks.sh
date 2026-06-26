#!/usr/bin/env bash
# install-hooks.sh — install this repo's tracked git hooks into .git/hooks.
# Git hooks live outside version control, so run this once per clone (and after
# editing scripts/hooks/*). Idempotent.
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
SRC="$REPO_ROOT/scripts/hooks"
DST="$REPO_ROOT/.git/hooks"
mkdir -p "$DST"
for hook in "$SRC"/*; do
  name="$(basename "$hook")"
  cp "$hook" "$DST/$name"
  chmod +x "$DST/$name"
  echo "installed hook: $name"
done
