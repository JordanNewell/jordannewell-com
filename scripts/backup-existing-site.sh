#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/JordanNewell/jordannewell-com
#
# Snapshots the current jordannewell.com site before a deploy clobbers it.
# Idempotent: timestamped directories, never overwrites.

set -euo pipefail

# Load .env if present (gitignored — see .env.example for required vars)
[ -f .env ] && set -a && . .env && set +a

# Required env vars — fail loud if missing. See .env.example.
: "${REMOTE_HOST:?REMOTE_HOST required — copy .env.example to .env and fill in real values}"
: "${REMOTE_PATH:?REMOTE_PATH required — copy .env.example to .env and fill in real values}"
: "${BACKUP_DIR:?BACKUP_DIR required — copy .env.example to .env and fill in real values}"

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"

echo "Backing up ${REMOTE_HOST}:${REMOTE_PATH} → ${BACKUP_DIR}/${TIMESTAMP}"

ssh "${REMOTE_HOST}" "mkdir -p '${BACKUP_DIR}' && cp -a '${REMOTE_PATH}' '${BACKUP_DIR}/${TIMESTAMP}' && ls -la '${BACKUP_DIR}/${TIMESTAMP}' | head"

echo "Backup complete: ${BACKUP_DIR}/${TIMESTAMP}"
echo "To roll back: ssh ${REMOTE_HOST} 'rm -rf ${REMOTE_PATH} && cp -a ${BACKUP_DIR}/${TIMESTAMP} ${REMOTE_PATH}'"
