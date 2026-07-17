#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/jordannewell/jordannewell-blog
#
# Builds the Astro site, generates .md mirrors, backs up the current production site,
# and ships the new build via tar-over-ssh (no rsync dependency).
# Equivalent to rsync --delete: clears target, then extracts fresh.

set -euo pipefail

# Configure REMOTE_HOST (SSH alias from ~/.ssh/config) and REMOTE_PATH (web root
# on the remote host) via env vars or by editing these defaults to match your setup.
REMOTE_HOST="${REMOTE_HOST:-user@your-ssh-alias}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/jordannewell}"

echo "==> Building Astro site"
npm run build

echo "==> Generating .md mirrors for LLM citations"
bash scripts/generate-md-mirrors.sh

echo "==> Backing up current production site"
bash scripts/backup-existing-site.sh

echo "==> Deploying new build via tar-over-ssh"
# Stream the dist tarball over SSH. Clears target first, extracts, ensures ownership.
# Uses sudo only if needed (first deploy after root-owned dir; subsequent runs won't).
tar -C dist -czf - . | ssh "${REMOTE_HOST}" "
  set -e
  if [ -w '${REMOTE_PATH}' ]; then
    cd '${REMOTE_PATH}' && rm -rf ./* && tar -xzf -
  else
    sudo bash -c \"cd '${REMOTE_PATH}' && rm -rf ./* && tar -xzf - && chown -R newell:newell .\"
  fi
"

echo "==> Deploy complete"
echo "Visit: https://jordannewell.com"
echo "Verify: curl -sI https://jordannewell.com | head -3"
echo "LLM check: curl -s https://jordannewell.com/llms.txt | head"

