#!/usr/bin/env bash
# Bootstrap the activity Worker end-to-end using a CF user API token.
# Run with:
#   USER_TOKEN='cfut_...' bash workers/activity-proxy/bootstrap.sh
#
# What this does:
#   1. Finds CF permission groups for Workers Scripts:Edit + Workers Routes:Edit
#   2. Creates a scoped token with both perms (account + jordannewell.com zone)
#   3. Deploys the Worker with wrangler using the scoped token
#   4. Route binds to jordannewell.com/api/activity*
#   5. Prints success with the new token value REDACTED

set -euo pipefail

: "${USER_TOKEN:?USER_TOKEN env var required}"
ACCOUNT_ID='554619f8c7d3a4010cb161df3037269d'
ZONE_ID='7b3c18289044e7e9610d55c1b7d1f8a6'

echo "==> Looking up permission groups"
PERM_GROUPS=$(curl -sS "https://api.cloudflare.com/client/v4/user/tokens/permission_groups" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json")

# Sanity: list all workers-related groups so we can see what's there
echo "    Workers-related permission groups:"
echo "$PERM_GROUPS" | jq -r '.result[] | select(.name | test("worker"; "i")) | "      \(.id) | \(.name) | scopes: \(.scopes | join(","))"'

# Match Write perms specifically (avoid picking Read first)
WORKERS_SCRIPTS_EDIT=$(echo "$PERM_GROUPS" | jq -r '.result[] | select(.name == "Workers Scripts Write") | .id' | head -1)
WORKERS_ROUTES_EDIT=$(echo "$PERM_GROUPS" | jq -r '.result[] | select(.name == "Workers Routes Write") | .id' | head -1)

if [ -z "$WORKERS_SCRIPTS_EDIT" ] || [ -z "$WORKERS_ROUTES_EDIT" ]; then
  echo "FATAL: could not find permission group IDs" >&2
  echo "  workers_scripts_edit=$WORKERS_SCRIPTS_EDIT"
  echo "  workers_routes_edit=$WORKERS_ROUTES_EDIT"
  echo "  Full workers-related groups printed above — adjust jq filter in script if names differ." >&2
  exit 1
fi
echo "    Using: Workers Scripts = $WORKERS_SCRIPTS_EDIT"
echo "    Using: Workers Routes  = $WORKERS_ROUTES_EDIT"

echo "==> Creating scoped token 'jordannewell-activity-deploy'"
TOKEN_BODY=$(jq -n \
  --arg ws "$WORKERS_SCRIPTS_EDIT" \
  --arg wr "$WORKERS_ROUTES_EDIT" \
  --arg acct "$ACCOUNT_ID" \
  --arg zone "$ZONE_ID" '
  {
    name: "jordannewell-activity-deploy",
    policies: [
      {
        effect: "allow",
        resources: { ("com.cloudflare.api.account." + $acct): "*" },
        permission_groups: [{ id: $ws }]
      },
      {
        effect: "allow",
        resources: { ("com.cloudflare.api.account.zone." + $zone): "*" },
        permission_groups: [{ id: $wr }]
      }
    ]
  }')

CREATE_RES=$(curl -sS -X POST "https://api.cloudflare.com/client/v4/user/tokens" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$TOKEN_BODY")

if ! echo "$CREATE_RES" | jq -e '.success' > /dev/null; then
  echo "FATAL: token create failed" >&2
  echo "$CREATE_RES" | jq '.errors' >&2
  exit 1
fi

SCOPED_TOKEN=$(echo "$CREATE_RES" | jq -r '.result.value')
echo "    scoped token created (value redacted, length=${#SCOPED_TOKEN})"

echo "==> Deploying Worker with scoped token"
cd "$(dirname "$0")"
CLOUDFLARE_API_TOKEN="$SCOPED_TOKEN" npx --yes wrangler deploy --config wrangler.jsonc

echo "==> Verifying route bound"
curl -sS "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
  -H "Authorization: Bearer $SCOPED_TOKEN" | jq -r '.result[] | "\(.pattern) → \(.script)"'

echo ""
echo "==> Done. New scoped token (save to BW, then revoke after deploy.sh runs):"
echo "    Name: jordannewell-activity-deploy"
echo "    Value: [redacted — value was used in-memory only]"
echo ""
echo "==> Revoke plan when ready:"
echo "    - This scoped token: dash.cloudflare.com → My Profile → API Tokens"
echo "    - The cfut_... user token you pasted: same page"
echo "    - The earlier cfat_... tokens: same page"
