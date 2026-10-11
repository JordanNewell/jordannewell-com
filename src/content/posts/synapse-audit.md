---
title: "My homeserver was world-readable. Here's what the audit found."
description: "A proactive security audit on my Matrix homeserver turned up four P0 findings. All closed. Two P1 items stay blocked on bigger migrations. The specifics stay private; the lesson doesn't."
pubDate: 2026-07-18
tags: ["security", "infra"]
mode: "hobart"
series: ["claude", "synapse-wars"]
tool: "claude-code"
kind: "win"
draft: false
---

> The Matrix homeserver that carries encrypted chat for my whole tailnet had four P0 security findings — placeholder credentials, permissive permissions, leftover public exposure, stale admin accounts. Two days of audit work later, all four are closed. Two items stay blocked on bigger migrations. The specifics stay private; the lesson doesn't.

## What I was auditing

The homeserver is Synapse, the reference Matrix server, fronting encrypted chat for the tailnet. It runs in Docker alongside a Postgres database. No federation. No public signups. Internal-only by design — agents, my own clients, a few service accounts.

Federation has been off since day one. That removes the largest class of Synapse attack surface. What's left is the smaller, sneakier stuff: secrets on disk, exposure you didn't intend, accounts you forgot were admins, the auth layer itself.

I hadn't done a full posture review since the initial deploy. The deploy was fast and functional. Fast and functional is how you end up with a placeholder DB password that never gets rotated.

## What I found

Four P0s. Each one a different flavor of "this default should never have shipped." Placeholder credentials where real ones should be. Permissions too permissive for secrets on disk. Exposure left on from initial setup. Stale admin flags from temporary work that was never cleaned up.

The specifics stay private — the audit receipt is internal. What matters is the shape: every P0 was a "fast and functional" deploy decision that never got revisited. The server was healthy by every operational metric — and leaking secrets to any local read.

## What I fixed

All four P0s closed in the same session. Each one was straightforward — config edit, permission change, exposure removed, accounts cleaned. None required architectural change. The audit found them; the fixes were the easy part.

Two P1 items are deferred, both blocked on bigger migrations I'm not doing as a Friday afternoon item on a security audit:

- **2FA / WebAuthn.** Synapse's native auth has no second factor. Enforcing one means deploying Matrix Authentication Service (MAS), an OAuth 2.0 / OIDC provider that replaces password auth entirely. Every agent and client re-authenticates when MAS goes in. Dedicated session, canary first, rollback path.
- **Password pepper.** Adding a pepper to the config invalidates every existing password hash. Every user — every agent — has to reset. Same blast radius as MAS, same reason to defer.

Both go on the carry-forward list with the same constraint: planned blast radius, canary agent first.

## What fell out of the audit

Two unrelated issues surfaced during the sweep and got fixed:

- A memory leak in the Tailscale daemon had climbed to 22 GB peak. Upgrade + restart cleared it.
- One of the agents was generating ~40 errors per hour on a stale crypto state — uploading keys the server already had. Fix was to clear the server-side state and let the agent regenerate.

## The lesson

Proactive audits find the placeholder password before the exposure does. Incident-response audits find it after. The cost difference is orders of magnitude, and the only thing that separates them is calendar discipline. Two days of audit work closed four P0s that had been live since deploy. None of them would have shown up in monitoring. None of them were causing visible failures.

Audit the thing that works. That's where the placeholders live.

## What's next

The crypto-state drift bug class — server-side crypto state drifts from agent crypto state, neither recovers without intervention — is the same root cause as the restart-triggered E2EE exhaustion incident. The durable fix is a restart wrapper that drains agent sessions before a Synapse restart and brings them back only after the server is healthy.

That wrapper is next. Then MAS, then pepper — each in its own session, each with a canary.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). Next in the Synapse Wars series: the restart-triggered E2EE exhaustion.*
