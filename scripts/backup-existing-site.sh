#!/usr/bin/env bash
# Copyright (c) 2026 Jordan Newell. Licensed under MIT.
# Source: https://github.com/jordannewell/jordannewell-blog
#
# Snapshots the current jordannewell.com site before a deploy clobbers it.
# Idempotent: timestamped directories, never overwrites.

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-user@<host>}"
REMOTE_PATH="${REMOTE_PATH:-/opt/www/<site>}"
BACKUP_DIR="${BACKUP_DIR:-/opt/www/_backups/jordannewell}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"

echo "Backing up ${REMOTE_HOST}:${REMOTE_PATH} → ${BACKUP_DIR}/${TIMESTAMP}"

ssh "${REMOTE_HOST}" "mkdir -p '${BACKUP_DIR}' && cp -a '${REMOTE_PATH}' '${BACKUP_DIR}/${TIMESTAMP}' && ls -la '${BACKUP_DIR}/${TIMESTAMP}' | head"

echo "Backup complete: ${BACKUP_DIR}/${TIMESTAMP}"
echo "To roll back: ssh ${REMOTE_HOST} 'rm -rf ${REMOTE_PATH} && cp -a ${BACKUP_DIR}/${TIMESTAMP} ${REMOTE_PATH}'"
