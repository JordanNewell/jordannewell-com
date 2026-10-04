---
title: "GitHub strips commits from public events. My terminal reported 'feed quiet'."
description: "The homepage activity terminal went quiet for two stacked reasons: a proxy route that only exists on the Cloudflare-fronted origin, then GitHub's public events API omitting payload.commits entirely. Three fixes on 2026-10-03 in 23 minutes — and the correct one had been sitting in the codebase since 2026-07-28."
pubDate: 2026-10-04
tags: ["tooling", "oss"]
mode: "hobart"
kind: "debug-story"
draft: false
---

> The homepage terminal wasn't broken. GitHub's public API was telling less than it knows, and my stack believed it. Two failures stacked: a Worker route that 404s anywhere but production, and a feed that ships PushEvents with the commits field stripped out. Three fixes on 2026-10-03, 23 minutes apart. The right answer was already in the repo, dated 2026-07-28.

## The shim that solved tomorrow's problem

The jordannewell.com homepage runs a live activity terminal: a status-hero script that polls GitHub's public events feed and renders the latest commits and releases — 10 commits, 2 releases, refreshed every 5 minutes.

Calling `api.github.com` from the browser had two structural problems. The site's CSP `connect-src` doesn't allow api.github.com. And GitHub's anonymous rate limit is 60 requests per hour per IP — one busy visitor's tab exhausts it.

On 2026-07-28 I shipped the fix, commit 9445898: a same-origin Cloudflare Worker at `/api/activity.json` fronting `api.github.com/users/JordanNewell/events/public`. The Worker attaches a PAT via a wrangler secret, lifting the ceiling to 5,000 calls per hour, and caches the upstream response on the edge for 60 seconds. N visitors collapse into roughly one upstream call per minute. CSP stays tight, the rate limit stops mattering.

## The 404 nobody planned for

The symptom arrived with the new origin. On any host serving this build that Cloudflare doesn't front — the dev mirror, the fresh origin the site moved to — the terminal read `error: upstream 404`.

The wrong hypothesis: broken deploy. The actual cause was simpler. A Worker route exists only where the Worker is deployed. Static deploys off Cloudflare serve `/api/activity.json` as a missing static path, so the terminal got a same-origin 404 and printed it verbatim. (The site's move behind a splash and back is its own post; this is only the terminal's story.)

Fix one, 2026-10-03 12:15, commit 711de16: on proxy 404, 405, 5xx, or a network failure, set a `proxyDead` flag and fetch `api.github.com` directly. The endpoint is CORS-open, and direct fetching was already the localhost path, so the code existed. The terminal went green again.

A fallback that renders. Problem solved for four minutes.

## The feed that lies by omission

The next symptom: `feed quiet`. Not an error — a healthy green status line, `ok · 0 items`, and an empty terminal, on a day with pushes in the feed.

The wrong hypothesis: nothing to show. The actual cause was in the parsing loop:

```js
for (const c of ev.payload?.commits || []) {
```

GitHub's public events endpoint strips `payload.commits` from PushEvents. The events arrive — PushEvent, repo name, head SHA, branch ref — but the commits array is empty. The loop iterates zero times, zero commit rows render. HTTP 200, correct-looking data, an empty terminal. The direct-API path had this bug the whole time; localhost had always shown `feed quiet`. The proxyDead fallback promoted the bug from dev-only to production-visible.

Fix two, 12:19, commit bbf2216: when `payload.commits` is absent, render the push head SHA and the branch ref — `→ main` instead of a message. Four minutes after fix one.

The embarrassing receipt: the Worker's own source, shipped 2026-07-28, carries this comment:

```js
// GitHub's public events endpoint strips payload.commits even with auth.
// Branch ref is the best signal we can get without per-commit follow-up calls.
```

The knowledge sat in the repo for three months — applied in one code path, ignored in the other. Fix two didn't invent anything; it mirrored the Worker's parser. The sentinel-file status-fallback post already taught me this shape: three fixes, only the last one right. This run was two fixes plus a coda, and the correct one predated the bug report.

## The hint that didn't match the clock

Coda, 12:38, commit a96bd25. The status line read `next refresh in 60s` — a leftover from the terminal's original 60-second tick. The poll had long since moved to `POLL_MS = 300_000`. Visitors spent three weeks being promised a refresh at 12× the actual rate. One line: `next refresh in ${POLL_MS / 60_000}m`.

## The rule

GitHub's public API omits the exact field this feed displays. Not a bug in my code or theirs — a public endpoint shaped for aggregate counts, not message text. The failure was mine: a second implementation of the same parser, written three months after the first one learned better.

**A fallback proves itself by rendering the same data as the primary, not by returning HTTP 200.** Verify the degraded path against the real payload — every field you display, one bug deeper than the status code.

Terminal's live on every origin now: SHA, repo, `→ branch`, 5 minutes to the next refresh, and it says so.

If you made it this far, I appreciate it. — JN
