---
title: "Two hours of outage the watchdog watched happen"
description: "Gail's gateway churned for two hours while its watchdog restarted a process that was already running and missed the one that mattered. Three stacked failures, one netstat line that settled it, and a memory-offload config that only worked after the docs stopped being trusted."
pubDate: 2026-10-28
tags: ["ai", "infra"]
mode: "hobart"
kind: "debug-story"
draft: false
---

The gateway was down for two hours and the watchdog's log is a complete record of it doing the wrong thing every five minutes: "no gateway process found, starting." A gateway process was up the entire time. The watchdog's query couldn't see it, so every check spawned a duplicate, every duplicate fought the real one, and the visible symptom on Discord was an agent stuck in a reconnect loop.

Gail is my head-of-construction agent — [discussed here before](/posts/bbq-bid-takeover/), console-bound, and no stranger to instance death. This outage was different: three failures stacked on top of each other, each one masking the next.

## Three failures, one outage

**15:15 — the config clobber.** The gateway config got truncated by a bad write. Process dies. Ordinary failure, ordinary restart — except the restart inherits the broken config, so it dies too, and now the watchdog is in the loop.

**The blind watchdog.** The watchdog checks liveness by querying the process list for a command line matching its launch pattern. That query has a failure mode I'd already been burned by earlier in the month: it returns nothing while the target process is demonstrably running. A WMI query is a claim about the process table, not the process table. Every five minutes it claimed nothing was there, started a second gateway, and the two of them churned.

**The zombie websocket.** Config fixed, watchdog settled, gateway booted — and the Discord connection never went ready. Log: "client initialized, awaiting gateway readiness," forever. This is the one that took longest to see clearly, because the obvious probe lied: the REST API probe was green. Bot token valid, HTTP endpoints answering, everything a curl can reach said healthy. But Discord lives on a websocket, and the websocket had hung with zero established connections to Discord's gateway range — while the log insisted readiness was pending.

The diagnostic that settled it is one line: count established connections to Discord's gateway address range. Zero while the log says "awaiting readiness" means the socket is dead and the process doesn't know it. The fix is a bounce. The insight is the probe mismatch: **REST and the websocket are different organs.** A REST probe can be green for hours over a dead websocket because they share nothing — not the connection, not the timeout, not the failure mode.

Liveness checking a process query is the same error one layer down. The watchdog verified "a process matching my command line exists." The failure it was built to catch is "the agent is not reachable." Those claims share no mechanism, so the check can be simultaneously correct and useless — which it was, for two hours, in five-minute increments.

## The memory offload that followed

Same session, unrelated goal: moving Gail's session state from an append-forever transcript to structured storage — daily resets, per-peer scoping, thread bindings, compaction flushes. The config is one block. Getting it applied took archaeology, because the installed build and the published docs describe two different schemas.

The docs put the memory settings at the top level of the config. The installed build rejects top-level memory keys and reads them from an agent-defaults block instead. A config that validates against the docs silently no-ops in the build. Same class as the doctor exit code in the rebuild: **the docs, the schema, and the running binary are three claims, and only the binary is under oath.** `config validate` against the installed build is the only check that counts.

Two more findings from that pass, kept for the record:

| Finding | Consequence |
|---|---|
| Local embedding model needs VRAM the workstation path doesn't have | Semantic memory recall off the table for now |
| Keyword (FTS) recall works with no GPU at all | Shipping cut: structure + keyword now, vectors later |

That's a deliberate downgrade accepted on purpose. The memory system's value is in the reset cadence and scoping, not the embedding. Ship the part that works on the hardware that exists.

## State of it

The watchdog still queries the process table — the rewrite to check the listening port, or better, an external transaction, is queued behind it. The netstat one-liner is now a documented bounce criterion: connections to the gateway range at zero plus "awaiting readiness" in the log means stop waiting and restart. Two hours of that outage was the log and reality disagreeing, and every automated check siding with the log.
