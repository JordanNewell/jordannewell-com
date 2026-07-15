#!/usr/bin/env bash
# Greps nginx access logs on production for AI crawler activity.
# Run weekly to verify LLMs are actually fetching the site.

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-user@<host>}"
LOG_PATH="${LOG_PATH:-/var/log/nginx/access.log}"

echo "=== AI crawler activity (last 7 days) ==="
echo ""

# Use a portable 7-days-ago calculation
seven_days_ago=$(date -d '7 days ago' +%d/%b/%Y 2>/dev/null || date -v-7d +%d/%b/%Y 2>/dev/null || echo "01/Jan/2026")

ssh "${REMOTE_HOST}" "
  if [ -f '${LOG_PATH}' ]; then
    awk '\$0 >= \"${seven_days_ago}\"' '${LOG_PATH}' 2>/dev/null | grep -E 'GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|PerplexityBot|Googlebot|Applebot|CCBot|Bytespider|Meta-ExternalAgent' | awk '{print \$NF}' | sort | uniq -c | sort -rn
  else
    echo 'No access log at ${LOG_PATH} — check nginx log config'
  fi
" 2>&1

echo ""
echo "=== Top-fetched URLs by AI crawlers ==="
ssh "${REMOTE_HOST}" "
  grep -E 'GPTBot|ClaudeBot|PerplexityBot' '${LOG_PATH}' 2>/dev/null | awk '{print \$7}' | sort | uniq -c | sort -rn | head -10
" 2>&1 || echo "(no AI crawler hits yet)"
