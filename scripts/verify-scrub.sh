#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/JordanNewell/jordannewell
#
# Post-OPSEC-scrub verification. Run after any commit motivated by OPSEC
# (machine name scrub, path scrub, codename scrub, version scrub).
#
# Verifies nothing operational broke. Three checks:
#   1. Build still passes (catches path/config issues)
#   2. Voice lint still passes on all .md and .astro (catches leak regressions)
#   3. No unresolved <placeholder> tokens in operational files
#      (scripts/, astro.config.mjs, .github/, .githooks/)
#
# Exit non-zero on any failure. CI runs the same checks on push, but running
# locally catches issues before the push round-trip.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

failed=0

echo "==> [1/3] Build (npm run build)"
if ! npm run build --silent > /tmp/verify-scrub-build.log 2>&1; then
  echo "FAIL: Build failed"
  tail -30 /tmp/verify-scrub-build.log >&2
  failed=1
else
  echo "    Build OK."
fi

echo "==> [2/3] Voice lint (all .md + .astro)"
mapfile -t lint_files < <(find src content docs -type f \( -name '*.md' -o -name '*.astro' \) 2>/dev/null || true)
if [ "${#lint_files[@]}" -gt 0 ]; then
  if ! bash scripts/voice-lint.sh "${lint_files[@]}"; then
    failed=1
  fi
else
  echo "    No files to lint."
fi

echo "==> [3/3] Placeholder scan (operational files)"
# Same logic as the CI placeholder-scan job — keep them in sync.
# Skips comment lines AND usage-echo strings (e.g. `echo "Usage: ... <slug>"`)
# so documentation doesn't false-positive.
#
# RESOLVED 2026-07-20: voice-lint.sh now sources real patterns from gitignored
# `scripts/opsec-patterns.local` at runtime (opsec-patterns.local.example is the
# tracked contract). CI runs without the local file — catches hardcoded baseline
# (session IDs, Tailscale CGNAT IPs) only. Local runs catch everything:
# hardcoded + real hostnames, tailnet, agent handles, codenames.
# voice-lint.sh is still exempt from this placeholder scan because its own
# opsec_patterns string contains literal `<tailnet>`/`<codename>`/`<agent-name>`
# tokens (the scrubbed baseline patterns).
PATTERNS=(
  'scripts/*.sh'
  '.githooks/*'
  'astro.config.mjs'
  '.github/workflows/*.yml'
  'package.json'
)
# voice-lint.sh is allowed to contain pattern-syntax placeholders (it defines them)
ALLOW_PLACEHOLDERS=('scripts/voice-lint.sh')
is_allowed() {
  local f="$1"
  for a in "${ALLOW_PLACEHOLDERS[@]}"; do
    [ "$f" = "$a" ] && return 0
  done
  return 1
}
placeholder_found=0
for pattern in "${PATTERNS[@]}"; do
  while IFS= read -r file; do
    [ -f "$file" ] || continue
    if is_allowed "$file"; then
      echo "SKIP: $file (defines pattern vocabulary — see RESOLVED comment above)"
      continue
    fi
    matches=$(grep -vE '^[[:space:]]*#|Usage:' "$file" 2>/dev/null | grep -nE '<[a-z][-a-z0-9]*[a-z0-9]>' || true)
    if [ -n "$matches" ]; then
      echo "FAIL: $file has unresolved placeholder(s):"
      echo "$matches"
      placeholder_found=1
      failed=1
    fi
  done < <(eval ls -1 $pattern 2>/dev/null || true)
done
[ "$placeholder_found" -eq 0 ] && echo "    No unresolved placeholders."

echo ""
if [ "$failed" -ne 0 ]; then
  echo " Scrub verification failed. Fix the issues above before pushing."
  exit 1
fi
echo " OK: scrub verification passed. Safe to push."
