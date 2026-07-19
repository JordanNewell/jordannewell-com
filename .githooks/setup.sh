#!/usr/bin/env bash
# First-time setup for tracked git hooks.
# Run after cloning: bash .githooks/setup.sh
# Idempotent — safe to re-run.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "FATAL: not inside a git repo" >&2
  exit 1
fi

cd "$REPO_ROOT"

# Point git at the tracked hooks directory
git config core.hooksPath .githooks

# Make sure hook files are executable (preserved by git, but some filesystems lose the bit)
chmod +x .githooks/pre-commit .githooks/pre-push 2>/dev/null || true

echo "OK: core.hooksPath set to .githooks"
echo "Active hooks:"
ls -la .githooks/ | grep -v '^total\|^d' | awk '{print "  " $NF}' | grep -v '^\.$\|^\.\.$' | sed 's/^  $//'
