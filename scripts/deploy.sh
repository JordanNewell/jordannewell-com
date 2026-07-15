#!/usr/bin/env bash
# Builds the Astro site, generates .md mirrors, backs up the current production site,
# and rsyncs the new build into place.

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-user@<host>}"
REMOTE_PATH="${REMOTE_PATH:-/opt/www/<site>}"

echo "==> Building Astro site"
npm run build

echo "==> Generating .md mirrors for LLM citations"
bash scripts/generate-md-mirrors.sh

echo "==> Backing up current production site"
bash scripts/backup-existing-site.sh

echo "==> Rsyncing new build to production"
rsync -avz --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='_backups/' \
  ./dist/ "${REMOTE_HOST}:${REMOTE_PATH}/"

echo "==> Deploy complete"
echo "Visit: https://jordannewell.com"
echo "Verify: curl -sI https://jordannewell.com | head -3"
echo "LLM check: curl -s https://jordannewell.com/llms.txt | head"
