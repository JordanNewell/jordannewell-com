#!/usr/bin/env bash
# Copies source markdown for each post to dist/posts/<slug>.md so LLMs can fetch clean source.
# Run after `astro build` and before deploy.

set -euo pipefail

POSTS_SRC="src/content/posts"
DIST_POSTS="dist/posts"

if [ ! -d "$DIST_POSTS" ]; then
  echo "dist/posts not found — run npm run build first"
  exit 1
fi

echo "Generating .md mirrors in $DIST_POSTS/ ..."

count=0
for md_file in "$POSTS_SRC"/*.md; do
  [ -e "$md_file" ] || continue
  slug="$(basename "$md_file" .md)"
  # Strip the YYYY-MM-DD date prefix if present
  clean_slug="${slug#[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-}"
  target="$DIST_POSTS/${clean_slug}.md"
  cp "$md_file" "$target"
  count=$((count + 1))
done

echo "Wrote $count .md mirrors."
