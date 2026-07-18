#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/jordannewell/jordannewell
#
# Voice lint — flags Claude-isms + hedge words + OPSEC leaks in markdown drafts/posts.
# Exits non-zero on any match. Designed as pre-commit hook.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <markdown-file> [<markdown-file>...]"
  exit 2
fi

# Anti-patterns (case-insensitive substring match)
anti_patterns=(
  "It's worth noting"
  "Let me explain"
  "Let's dive"
  "comprehensive guide"
  "Here's the thing"
  "delve into"
  "leverage"
  "robust"
  "seamless"
  "perhaps"
  "might be worth"
  "navigate the"
  "in this comprehensive"
)

# Hedge words (case-insensitive, word-boundary match)
hedge_patterns='maybe|I think|I believe|in my opinion|essentially|basically|actually,|simply put'

# OPSEC patterns — see VOICE.md § OPSEC. NEVER merge content containing these.
# Machine names, tailnet, internal IPs, session codes, internal project codenames,
# agent handles that map to Matrix identities, internal paths.
opsec_patterns='\bS[0-9]{3}\b|100\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|<tailnet>|<codename>|<codename>|\b(<agent-name>|<agent-name>|<agent-name>|<agent-name>)\b'

failed=0

for file in "$@"; do
  if [ ! -f "$file" ]; then
    echo "SKIP: $file (not found)"
    continue
  fi

  # VOICE.md documents the anti-patterns literally — exempt it from the lint
  case "$file" in
    VOICE.md|*/VOICE.md)
      echo "SKIP: $file (voice rulebook, exempt)"
      continue
      ;;
  esac

  # Anti-pattern scan
  for pattern in "${anti_patterns[@]}"; do
    if grep -qiE "$pattern" "$file"; then
      echo "FAIL: $file — anti-pattern '$pattern'"
      grep -inE "$pattern" "$file" | head -3
      failed=1
    fi
  done

  # Hedge scan
  hedge_count=$(grep -ciE "\b($hedge_patterns)\b" "$file" || true)
  if [ "$hedge_count" -gt 0 ]; then
    echo "FAIL: $file — $hedge_count hedge word(s)"
    grep -inE "\b($hedge_patterns)\b" "$file" | head -5
    failed=1
  fi

  # OPSEC scan — would have caught the 2026-07-17 docs/ leak
  opsec_count=$(grep -cE "$opsec_patterns" "$file" || true)
  if [ "$opsec_count" -gt 0 ]; then
    echo "FAIL: $file — $opsec_count OPSEC leak(s)"
    grep -nE "$opsec_patterns" "$file" | head -10
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "Lint failed. See VOICE.md for fixes (anti-patterns, hedges, OPSEC)."
  exit 1
fi

echo "OK: voice lint passed for $# file(s)"
