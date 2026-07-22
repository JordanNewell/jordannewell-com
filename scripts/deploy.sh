#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/JordanNewell/jordannewell-com
#
# Builds the Astro site, generates .md mirrors, backs up the current production site,
# and ships the new build via tar-over-ssh (no rsync dependency).
# Equivalent to rsync --delete: clears target, then extracts fresh.

set -euo pipefail

# Load .env if present (gitignored — see .env.example for required vars)
[ -f .env ] && set -a && . .env && set +a

# Required env vars — fail loud if missing. See .env.example.
: "${REMOTE_HOST:?REMOTE_HOST required — copy .env.example to .env and fill in real values}"
: "${REMOTE_PATH:?REMOTE_PATH required — copy .env.example to .env and fill in real values}"
: "${BACKUP_DIR:?BACKUP_DIR required — copy .env.example to .env and fill in real values}"

# Preflight: SSH connectivity check. Fails fast and loud before any destructive step.
echo "==> Preflight: verifying SSH connectivity to ${REMOTE_HOST}"
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "${REMOTE_HOST}" "true" 2>/dev/null; then
  echo "FATAL: Cannot reach ${REMOTE_HOST} via SSH. Aborting before build." >&2
  echo "" >&2
  echo "Debug:" >&2
  echo "  ssh ${REMOTE_HOST} 'echo ok'" >&2
  echo "" >&2
  echo "Common causes:" >&2
  echo "  - SSH alias not in ~/.ssh/config (set REMOTE_HOST=user@ip to bypass)" >&2
  echo "  - Tailscale/MagicDNS offline on local or remote" >&2
  echo "  - Remote host down" >&2
  exit 1
fi
echo "    SSH OK."

echo "==> Building Astro site"
npm run build

echo "==> Generating .md mirrors for LLM citations"
bash scripts/generate-md-mirrors.sh

echo "==> Backing up current production site"
bash scripts/backup-existing-site.sh

echo "==> Deploying new build via tar-over-ssh"
# Stream the dist tarball over SSH. Clears target first, extracts, ensures ownership.
# Uses sudo only if needed (first deploy after root-owned dir; subsequent runs won't).
# Capture PIPESTATUS so we can diagnose which half of the pipe failed.
set +e
tar -C dist -czf - . | ssh "${REMOTE_HOST}" "
  set -e
  if [ -w '${REMOTE_PATH}' ]; then
    cd '${REMOTE_PATH}' && rm -rf ./* && tar -xzf -
  else
    sudo bash -c \"cd '${REMOTE_PATH}' && rm -rf ./* && tar -xzf - && chown -R newell:newell .\"
  fi
"
PIPE_STATUS=("${PIPESTATUS[@]}")
set -e

TAR_EXIT="${PIPE_STATUS[0]}"
SSH_EXIT="${PIPE_STATUS[1]}"

if [ "$TAR_EXIT" != "0" ] || [ "$SSH_EXIT" != "0" ]; then
  echo "" >&2
  echo "FATAL: Deploy failed mid-pipe (tar exit=${TAR_EXIT}, ssh exit=${SSH_EXIT})." >&2
  echo "Production site may be in a partially-deployed state." >&2
  echo "" >&2
  echo "Recovery options:" >&2
  echo "  1. Roll back to latest backup:" >&2
  echo "     ssh ${REMOTE_HOST} 'ls -t ${BACKUP_DIR}/ | head -3'" >&2
  echo "     ssh ${REMOTE_HOST} 'sudo rm -rf ${REMOTE_PATH}/* && sudo cp -a ${BACKUP_DIR}/<TIMESTAMP>/* ${REMOTE_PATH}/'" >&2
  echo "" >&2
  echo "  2. Diagnose and re-run:" >&2
  echo "     ssh ${REMOTE_HOST} 'ls -la ${REMOTE_PATH}/'" >&2
  exit 1
fi

echo "==> Deploy complete"
echo "Visit: https://jordannewell.com"
echo "Verify: curl -sI https://jordannewell.com | head -3"
echo "LLM check: curl -s https://jordannewell.com/llms.txt | head"
