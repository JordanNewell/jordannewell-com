#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/JordanNewell/jordannewell-com
#
# One-command pre-flight: voice lint -> build.
# Deployment happens on push to main: GitHub Actions builds and deploys to
# Cloudflare Pages (.github/workflows/deploy.yml). Fails closed on lint/build
# failure so a broken post never reaches the commit.

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

echo "==> Lint + build passed. Ship it:"
echo "  git add src/content/posts/${slug}.md public/posts/${slug}/"
echo "  git commit -m \"post: ${slug}\""
echo "  git push"
echo "Then watch: https://github.com/JordanNewell/jordannewell-com/actions/workflows/deploy.yml"
echo "Live check: curl -sI https://jordannewell.com/posts/${slug}/ | head -1"
