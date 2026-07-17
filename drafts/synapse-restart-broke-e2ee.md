---
title: "Synapse restarted. The fleet went silent for four and a half hours."
description: "A routine container restart on my Matrix homeserver silently broke encrypted replies across every agent on the tailnet. Agents looked healthy. None of them could talk. Here's the mechanism, the dig, and the wrapper that stops it happening again."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude", "synapse-wars"]
tool: "claude-code"
era: "2026-fleet"
session: "Sxxx"
kind: "postmortem"
draft: false
---

> A routine homeserver restart at 20:10 UTC. systemd showed every agent green. The fleet went silent on Matrix for four and a half hours. Discord kept working — different path. The agents could hear. They couldn't reply.

## What I was trying to do

The Matrix homeserver is the encrypted spine of the tailnet. Every agent, every automation, every client uses it for anything that has to stay private. Discord carries the casual tier. Matrix carries everything else.

A Synapse restart is meant to be a non-event. Container comes down, container comes back up, clients reconnect, life continues. The Docker inspection after the fact showed a clean start — `restarts=0`, no crash-loop. Probably operator-initiated. I don't have a record of pulling the trigger. Doesn't matter. It restarted.

Eight minutes later, the fleet had stopped talking on Matrix.

## What broke

Matrix E2EE has a property that's easy to miss until it bites you: receiving and sending are independent paths. An agent receives encrypted events through `/sync` — a long-poll GET. Sending an encrypted reply is a separate operation that needs a fresh one-time key (OTK) to wrap the megolm room key in.

When Synapse restarts, it cycles device-key state. Agents reconnect, `/sync` returns 200, the receive path looks healthy. But the OTK pool the agent thought it had uploaded is now stale. The agent tries to send, asks the homeserver for OTKs for the target devices, comes back empty. No key to wrap the room key in. No encrypted blob to PUT. The send never happens.

The systemd lie is the worst part. The agent process is alive. Memory is normal. CPU is idle. Logs are quiet. systemd reports `active (running)`. The agent is, by every operational metric, fine. It just can't talk.

## The dig

The silence lasted four and a half hours. Four and a half hours of healthy-looking status, 200 OK on every `/sync`, zero outbound encrypted sends from any agent on the tailnet. Not one `PUT /send/m.room.encrypted` across the fleet.

That's the trap. Monitoring that watches process health reports green. Monitoring that watches `/sync` latency reports green. Monitoring that watches for the *absence of sends* — that doesn't exist in most default dashboards, because who monitors for something not happening?

The diagnostic that finally nailed it was a single log line from one of the bridge agents: a warning that it had tried to share room keys with target devices and come back with nothing — no one-time keys, no device keys. That's the OTK-exhaustion fingerprint. Once you know the string, it's obvious. Until you know the string, it's a fleet full of silent agents and no obvious reason.

I restarted one bridge agent as a canary. Within sixty seconds it had uploaded fresh OTKs and was sending encrypted events again. Cause confirmed. The fix is just a restart. The problem was knowing who to restart.

## The fix

The immediate recovery was every agent service, restarted, in the right order:

1. **Canary first.** One bridge agent. Confirmed the diagnosis — fresh key upload, first encrypted send within a minute.
2. **Second canary.** One of the orchestration agents. Same recovery pattern, slightly different code path. Confirmed the fix generalizes.
3. **Rest of the fleet, in parallel.** Every remaining agent service at once. Five minutes of coordinated restarts.
4. **Verification, not trust.** grep the homeserver logs for `PUT.*send/m.room.encrypted` from each agent. Encrypted sends landing within 60 seconds of restart. That's the actual signal — not process health, not `/sync` status.

Total recovery time once the diagnosis landed: under ten minutes. The four-and-a-half-hour number is the time-to-detect, not the time-to-fix. Detection is the whole problem.

## The wrapper

The durable fix is a restart wrapper. Same pattern as a safe database migration: drain, restart, wait for healthy, bring things back in order. Run the wrapper instead of restarting the homeserver directly.

The wrapper does five things:

1. **Fix ownership first.** Past `sudo` operations and backup scripts leave root-owned files in agent state directories. That causes its own silent failures — permission errors on session state, memory bloat from constant session rebuilds, verification timeouts because the crypto layer is starved. The wrapper chowns the agent state dirs before anything else.
2. **Stop every agent.** All of them, across every host. They can't talk anyway in a minute — bringing them down cleanly beats letting them wedge.
3. **Restart the homeserver.** The actual operation.
4. **Wait for healthy.** Poll the homeserver's `/matrix/client/versions` endpoint. 200 means the server is accepting clients. Don't proceed on faith, proceed on a green HTTP response.
5. **Bring the agents back.** Same order, reverse direction. Then wait sixty seconds and grep the homeserver logs for encrypted sends from every agent.

Run the wrapper. Skip the bare `docker restart`. The bare restart is the bug.

## The lesson

Synapse restarts are not safe by default. Wrap them.

## What I'd do differently

Three things, in order of how much they would have shortened the incident.

**Monitor the negative space.** A check that alerts when an agent that should be sending encrypted events hasn't sent one in N minutes would have caught this in twenty minutes instead of four and a half. Negative-space monitoring is harder to build than positive-space monitoring — you're watching for the absence of something — but it's the only thing that catches this class of failure. Process health and sync latency both report green through the entire incident.

**Wrap the operation the first time you do it.** The wrapper didn't exist before this incident because I'd gotten away with bare restarts until then. The first restart that silently broke something cost four and a half hours of detection time. The wrapper costs ten minutes to write. The math is obvious in retrospect.

**Treat OTK exhaustion as a known failure mode, not a surprise.** This pattern — server-side crypto state drifts from agent crypto state, neither recovers without intervention — has happened before on this server, on a smaller scale. I fixed the one agent. I didn't fix the class. The class is what comes back at 4:30 in the morning.

The wrapper is shipped. The next homeserver restart won't be a coin flip on whether the fleet recovers. That's the win. The four hours of silence already happened.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). Previous in the Synapse Wars series: [the audit](/posts/synapse-audit). Next: MAS, when there's a session for it.*
