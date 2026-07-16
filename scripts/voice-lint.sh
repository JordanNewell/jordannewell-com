#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/jordannewell/jordannewell-blog
#
# Voice lint — flags Claude-isms + hedge words in markdown drafts/posts.
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

failed=0

for file in "$@"; do
  if [ ! -f "$file" ]; then
    echo "SKIP: $file (not found)"
    continue
  fi

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
done

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "Voice lint failed. See VOICE.md for fixes."
  exit 1
fi

echo "OK: voice lint passed for $# file(s)"
