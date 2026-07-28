# activity-proxy

Cloudflare Worker that proxies GitHub's events API for the jordannewell.com
coming-soon terminal. Solves two production problems:

1. **CSP** — `connect-src` on jordannewell.com does not allow `api.github.com`.
   Routing through a same-origin Worker avoids any CSP change.
2. **Rate limit** — anonymous GitHub API calls are capped at 60/hr per IP. The
   Worker attaches a PAT (5,000/hr) and caches the upstream response on the
   Cloudflare edge for 60s, so N visitors collapse into ~1 upstream call/min.

## Deploy

```bash
cd workers/activity-proxy

# One-time: install wrangler
npm install -g wrangler
wrangler login

# Create a fine-grained PAT at:
# https://github.com/settings/personal-access-tokens/new
# Permissions: Public Repositories (read-only) → Contents: Read
# (Worker only reads /users/JordanNewell/events/public — Contents: Read
# is more than enough; could even be No Access since the endpoint is public.)
wrangler secret put GH_TOKEN   # paste the pat_*** value

wrangler deploy
```

## Route binding

After deploy, bind the Worker to a route in the Cloudflare dashboard:

- **Workers & Pages → jordannewell-activity → Settings → Triggers → Routes**
- Pattern: `jordannewell.com/api/activity*`
- Zone: `jordannewell.com`

The client at `/js/status-hero.js` will need its `EVENTS_URL` updated from
`https://api.github.com/users/JordanNewell/events/public` to
`/api/activity.json` once the route is live.

## Local dev

The Worker isn't exercised by the Astro dev server. To test locally:

```bash
cd workers/activity-proxy
npx wrangler dev
# exposes http://localhost:8787 — visit / to see the JSON payload
```

## PAT rotation

If `GH_TOKEN` is rotated, re-run `wrangler secret put GH_TOKEN` and `wrangler deploy`.
The Worker will pick up the new value at the next edge cache refresh (≤60s after deploy).

## Failure modes

- `503 upstream-rate-limited` — GitHub returned 403/429. Cached for 30s.
- `502 upstream-error` — any other non-OK from GitHub. Cached for 30s.
- `500 proxy-error` — exception in the Worker itself. Cached for 15s.

Client (`status-hero.js`) handles all of these by showing the error string in
the terminal status line and retrying on the next 60s tick.
