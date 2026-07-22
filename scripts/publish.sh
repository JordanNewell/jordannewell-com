#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/JordanNewell/jordannewell-com
#
# One-command publish: voice lint -> build -> deploy.
# Fails closed on any check failure.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: npm run publish -- <slug>"
  echo "Example: npm run publish -- sxxx-synapse-restart-broke-e2ee"
  exit 2
fi

slug="$1"
post_path="src/content/posts/${slug}.md"

if [ ! -f "$post_path" ]; then
  echo "FAIL: $post_path not found"
  exit 1
fi

echo "==> Voice linting $post_path"
bash scripts/voice-lint.sh "$post_path"

echo "==> Building site"
npm run build

echo "==> Deploying via tar-over-ssh"
bash scripts/deploy.sh

echo "==> Verifying live"
sleep 3
status=$(curl -sI "https://jordannewell.com/posts/${slug}/" | head -1)
echo "$status"

if echo "$status" | grep -q "200"; then
  echo "OK: live at https://jordannewell.com/posts/${slug}/"
else
  echo "WARN: status not 200 - check manually"
fi
