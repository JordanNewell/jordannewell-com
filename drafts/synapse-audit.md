---
title: "My homeserver was world-readable. Here's what the audit found."
description: "Synapse audit on my Matrix homeserver turned up four P0 findings: a placeholder DB password, a world-readable config file, public Funnel exposure, and stale admin accounts. All shipped. Two P1 items stay blocked on bigger migrations."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude", "synapse-wars"]
tool: "claude-code"
kind: "win"
draft: false
---

> The Matrix homeserver that carries encrypted chat for my whole tailnet had a placeholder database password, a world-readable config file, a public Funnel pointing scanners straight at it, and five stale admin accounts. Two days of audit work later, all of it is closed. Two items stay blocked — and those are the interesting ones.

## What I was auditing

The homeserver is Synapse, the reference Matrix server, fronting encrypted chat for the tailnet. It runs in Docker alongside a Postgres database. No federation. No public signups. Internal-only by design — agents, my own clients, a few service accounts.

Federation has been off since day one. That removes the largest class of Synapse attack surface. What's left is the smaller, sneakier stuff: secrets on disk, exposure you didn't intend, accounts you forgot were admins, the auth layer itself.

I hadn't done a full posture review since the initial deploy. The deploy was fast and functional. Fast and functional is how you end up with a placeholder DB password that never gets rotated.

## What I found

Four P0 issues, five P1 issues, a handful of P3 noise. The P0s are the story.

**P0 #1 — database password was the literal placeholder.** The string `synapse_password_change_me`, sitting in both the YAML config and the Postgres container environment, for the entire life of the server. Anyone who read either file had the DB credential. Default credentials are how half of internet-exposed services get popped. Mine wasn't exposed, but the failure mode is the same: if it ever became exposed, the DB is wide open.

**P0 #2 — `homeserver.yaml` was mode `644`, world-readable.** That file carries four secrets: the macaroon secret (session forgery), the registration shared secret, the form secret, and the DB password. Any local user — any compromised process running as an unprivileged user — could read all four. The fix is one `chmod`.

**P0 #3 — the homeserver was reachable from the public internet via a Tailscale Funnel.** A Funnel is the inverse of a tailnet: instead of letting tailnet devices reach a public service, it lets the public reach a tailnet device. I'd enabled one during initial bring-up, intended to disable it, didn't. Scanner traffic in the access logs: `/.env` probes, `/.git/config` probes, the usual background radiation of the public internet. None of it reached anything — but none of it needed to be there.

**P0 #4 — five stale admin-flagged accounts.** Old temporary admin accounts from prior sessions, never cleaned up. No password hashes attached — but the admin bit was set, and a leaked macaroon secret would have been enough to forge a session for any of them. Admin in Matrix can do a lot, especially on an E2EE server where the admin can't read messages but can re-route them, deactivate users, and tamper with device trust.

The P1 findings were smaller but worth doing: a metrics port bound to `0.0.0.0` instead of tailnet-only, a minimum password length of 8, and two items I couldn't fix (covered below).

## What I fixed

The P0 fixes were the easy part — straightforward, durable, verifiable.

| Finding | Fix |
|---|---|
| Placeholder DB password | 40-char generated password, rotated live via `ALTER USER`, updated in config + compose + Vaultwarden |
| World-readable config | `644` → `640`, owner `polkitd:polkitd` (matches the container's UID) |
| Public Funnel exposure | Disabled — and edited the self-healing timer that re-enables Funnels, because manual `funnel reset` gets reverted on the next tick |
| Stale admins | `UPDATE users SET admin=0 WHERE name IN (...)` — admin count dropped from seven to two |

The Funnel fix deserves a paragraph. The host runs a self-healing timer that restores Tunnels, Funnels, and serve configs every fifteen minutes from a baseline file. That timer is normally a feature — it catches drift, accidental resets, reboot state. It also means `tailscale funnel reset` from the command line is theatre: the timer puts it back. The durable fix is to edit the baseline, remove the Funnel entry, and let the timer converge on the corrected state. Same pattern any time you want a permanent change to the serve topology: edit the baseline, don't fight the timer.

The P1 fixes shipped too:

- **Metrics port** — dropped the host port mapping entirely. Prometheus now scrapes the Synapse container over a Docker network, not over a host-bound port. Metrics are reachable only from inside the Docker network, and only Prometheus is attached.
- **Minimum password length** — bumped from 8 to 12 in config. Affects new passwords only; existing users keep what they have.

Two bonus wins fell out of the audit, unrelated to the P0 list:

- **Tailscale memory leak.** `tailscaled` had climbed to 22 GB peak. Upgraded to current release, restarted, stabilized around 100 MB. The leak was a known issue in the version I'd been running.
- **OTK reuse errors.** One of the agents was generating ~40 `SynapseError 400` events per hour on `/_matrix/client/v3/keys/upload`. Root cause: the agent's local crypto store had lost track of which one-time keys it had already uploaded, so it kept retrying with a fresh keypair for a key ID the server already had. The fix was to delete every OTK the server had stored for that device and let the agent regenerate from scratch. Uploads are atomic — any conflicting key ID fails the whole batch — so deleting one conflict at a time doesn't work. Nuke them all, restart, done.

## What I deferred

Two P1 items are still open. Both are blocked on bigger migrations, not on effort.

**2FA / WebAuthn.** Synapse's native auth has no second factor. Enforcing one means deploying Matrix Authentication Service (MAS), which is an OAuth 2.0 / OIDC provider that replaces password auth entirely. MAS is the path forward for Matrix auth — it's also the path to QR-code login (MSC4108), passwordless, WebAuthn, the modern auth surface. It's a separate project. I'm not doing it as a Friday afternoon item on a security audit. Every agent and client re-authenticates against the new auth layer when MAS goes in. Same blast-radius profile as the macaroon rotation that broke E2EE fleet-wide two days last time.

**Password pepper.** Adding `password_config.pepper` to the config invalidates every existing password hash. Every user — every agent — has to reset and re-login. Same blast radius as MAS, same reason to defer: the fix is correct, the rollout is a project.

Both go on the carry-forward list with the same constraint: dedicated session, planned blast radius, canary agent first, rollback path.

## The lesson

Proactive audits find the placeholder password before the exposure does. Incident-response audits find it after. The cost difference is orders of magnitude, and the only thing that separates them is calendar discipline. Two days of audit work closed four P0s that had been live since deploy. None of them would have shown up in monitoring. None of them were causing visible failures. The server was healthy by every operational metric — and leaking four secrets to any local read.

Audit the thing that works. That's where the placeholders live.

## What's next

The OTK-reuse bug and the Synapse-restart-triggered E2EE exhaustion I hit during the audit are the same class of failure: the agent crypto layer and the homeserver drift out of sync, and neither side recovers without intervention. The durable fix is a restart wrapper that drains agent sessions, restarts Synapse, waits for `/matrix/client/versions` to return 200, and only then brings the agents back. Without that wrapper, every Synapse restart is a coin flip on whether the fleet re-establishes E2EE cleanly.

That wrapper is next. Then MAS, then pepper — in that order, each in its own session, each with a canary.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). Next in the Synapse Wars series: the restart wrapper.*
