---
title: "Synapse restarted. The fleet went silent for four and a half hours."
description: "A routine container restart on my Matrix homeserver silently broke encrypted replies across every agent on the tailnet. Agents looked healthy. None of them could talk. Here's the mechanism and the lesson."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude", "synapse-wars"]
tool: "claude-code"
kind: "postmortem"
draft: false
---

> A routine homeserver restart. systemd showed every agent green. The fleet went silent on Matrix for four and a half hours. Discord kept working — different path. The agents could hear. They couldn't reply.

## What I was trying to do

The Matrix homeserver is the encrypted spine of the tailnet. Every agent, every automation, every client uses it for anything that has to stay private. Discord carries the casual tier. Matrix carries everything else.

A Synapse restart is meant to be a non-event. Container comes down, container comes back up, clients reconnect, life continues. The restart was clean — no crash-loop, no error. Probably operator-initiated. Doesn't matter. It restarted.

Eight minutes later, the fleet had stopped talking on Matrix.

## What broke

Matrix E2EE has a property that's easy to miss until it bites you: receiving and sending are independent paths. An agent receives encrypted events through `/sync` — a long-poll GET. Sending an encrypted reply is a separate operation that needs a fresh one-time key (OTK) to wrap the megolm room key in.

When Synapse restarts, it cycles device-key state. Agents reconnect, `/sync` returns 200, the receive path looks healthy. But the OTK pool the agent thought it had uploaded is now stale. The agent tries to send, asks the homeserver for OTKs for the target devices, comes back empty. No key to wrap the room key in. No encrypted blob to PUT. The send never happens.

The systemd lie is the worst part. The agent process is alive. Memory is normal. CPU is idle. Logs are quiet. systemd reports `active (running)`. The agent is, by every operational metric, fine. It just can't talk.

## The dig

The silence lasted four and a half hours. Four and a half hours of healthy-looking status, 200 OK on every `/sync`, zero outbound encrypted sends from any agent on the tailnet.

That's the trap. Monitoring that watches process health reports green. Monitoring that watches `/sync` latency reports green. Monitoring that watches for the *absence of sends* — that doesn't exist in most default dashboards, because who monitors for something not happening?

The diagnostic that finally nailed it was a single log line from one of the bridge agents: a warning that it had tried to share room keys with target devices and come back with nothing — no one-time keys, no device keys. That's the OTK-exhaustion fingerprint. Once you know the pattern, it's obvious. Until you know the pattern, it's a fleet full of silent agents and no obvious reason.

## The fix

The immediate recovery was every agent service restarted, in the right order. Canary first to confirm the diagnosis — fresh key upload, first encrypted send within a minute. Then the rest of the fleet in parallel. Recovery time was under ten minutes once the diagnosis landed.

The four-and-a-half-hour number is time-to-detect, not time-to-fix. Detection is the whole problem.

## The wrapper

The durable fix is a wrapper — same pattern as a safe database migration. Drain agent sessions, restart the homeserver, wait for the server to report healthy, bring the agents back in the right order. Run the wrapper instead of a bare restart.

The bare restart is the bug. The wrapper handles the operational details — ownership fixes, ordering, health checks, verification — that a bare restart skips. The wrapper's specific recipe stays internal; the point is the pattern, not the steps.

## The lesson

Synapse restarts are not safe by default. Wrap them.

## What I'd do differently

**Monitor the negative space.** A check that alerts when an agent that should be sending encrypted events hasn't sent one in N minutes would have caught this in twenty minutes instead of four and a half. Negative-space monitoring is harder to build than positive-space monitoring — you're watching for the absence of something — but it's the only thing that catches this class of failure.

**Wrap the operation the first time you do it.** The wrapper didn't exist before this incident because I'd gotten away with bare restarts until then. The first restart that silently broke something cost four and a half hours of detection time. The wrapper costs ten minutes to write. The math is obvious in retrospect.

**Treat OTK exhaustion as a known failure mode, not a surprise.** This pattern — server-side crypto state drifts from agent crypto state, neither recovers without intervention — has happened before on this server, on a smaller scale. I fixed the one agent. I didn't fix the class. The class is what comes back at 4:30 in the morning.

The wrapper is shipped. The next homeserver restart won't be a coin flip on whether the fleet recovers. That's the win. The four hours of silence already happened.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). Previous in the Synapse Wars series: [the audit](/posts/synapse-audit).*
