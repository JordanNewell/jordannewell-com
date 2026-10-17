---
title: "Three agents, one file: dogfooding Curtis AI Audit"
description: "Shipped today: Curtis AI Audit v0.3.1, an Obsidian plugin that gives every AI agent action an append-only markdown receipt in your vault — and three of my fleet agents are now filing receipts every six hours into a ledger I can read, verify, and sync. No database, no telemetry. Files."
pubDate: 2026-10-16
tags: ["ai", "oss"]
mode: "hobart"
series: []
era: "2026-fleet"
kind: "win"
project: "curtis-ai-audit"
draft: false
---

I run a small fleet of AI agents on a server in my closet. They monitor
dependencies, sweep security alerts, handle mail triage, file pull requests.
They work in my vault and on my machines all day, every day, and for most of
that history nothing recorded what they actually did. If I wanted to know what
an agent had been up to, I grepped logs, read Discord history, or just trusted
it. That bothered me less as a security question than as an ownership one: I
kept asking agents to do work on my behalf and had no record of the work.

So I built [Curtis AI Audit](https://github.com/JordanNewell/curtis-ai-audit),
and the premise is almost embarrassing. Every AI action leaves a receipt. A
receipt is a plain markdown block appended to a per-day ledger file —
`Audit/ledger/2026-10-16.md`, one shard per day, append-only. The envelope is
the receipt as canonical JSON, so any script can parse it. The body is a
rendered one-line summary, so a human can read it. No database. No dashboard
login. No telemetry. Files.

That's the whole storage layer. Readable in Obsidian, parseable by anything,
syncable by whatever you already use. When people ask what format it uses, the
honest answer is: markdown, the format your notes were already in.

## The dogfood

The position I ratified for this project was "make receipts the story" —
which means before writing about it, I wanted receipts that weren't mine.
Three OpenClaw agents on my server now file a receipt every six hours through
a cron heartbeat. Each one appends a block to an inbox file. That folder
Syncthings to my workstation, where Obsidian picks it up and the plugin
ingests it into the daily ledger, dedupes redeliveries, and rejects junk.

Here are real receipts from the inbox as I write this — ids and timestamps
exactly as filed, agent handles trimmed:

```
<!-- messenger: {"from":"alpha","id":"msg_mvbcvzz3ox3hos","replyTo":null,"to":"audit","ts":"2026-10-16T19:23:58.815Z"} -->
{"action":"agent-turn","status":"ok","summary":"dogfood heartbeat"}
<!-- /messenger -->

<!-- messenger: {"from":"bravo","id":"msg_mvbcz5skfxxhs7","replyTo":null,"to":"audit","ts":"2026-10-16T19:26:26.323Z"} -->
{"action":"agent-turn","status":"ok","summary":"dogfood heartbeat"}
<!-- /messenger -->

<!-- messenger: {"from":"charlie","id":"msg_mvbczabknzj2of","replyTo":null,"to":"audit","ts":"2026-10-16T19:26:32.192Z"} -->
{"action":"agent-turn","status":"ok","summary":"dogfood heartbeat"}
<!-- /messenger -->
```

I'm showing them unredacted because there is nothing to redact, and that's
not luck — it's the design. The receipt writer drops everything except
path-like fields and statuses. Command text, prompt text, note contents never
reach the ledger; the writer enforces it at the source, not by convention.
Privacy here isn't a settings page, it's a narrow write surface.

Three agents, three receipts, minutes apart, one file each of them can append
to without asking permission from anything. That's the entire integration: if
you can write to the vault, you can file a receipt. The one-liner any agent
can run is in
[INTEGRATION.md](https://github.com/JordanNewell/curtis-ai-audit/blob/master/INTEGRATION.md) —
no packages, no network, nothing but Node and a file append.

## What it is not

This is the part I care most about, so I'll be plain. Curtis AI Audit is a
journal, not a tamper-proof forensic system. There are no hash chains, no
blockchain, no cryptographic anchoring, no third-party verifiability. You
control the vault, which means you can edit anything in it. The verify
command detects malformed blocks, duplicate ids, reordered shards, and
per-agent sequence gaps — deletions leave holes — but a careful editor who
also renumbers sequences defeats it completely.

I'm fine with that, and it isn't a caveat I'm burying. It's the position.
Most of what goes wrong with agent activity is casual, accidental, or lazy —
a script that crashed mid-write, an agent that silently skipped a step,
someone (me) poking at a file to see what happens. A journal with residue
catches all of that. Detecting a determined adversary is a different-sized
project, and pretending otherwise is how audit tools end up promising things
nobody can deliver. The upgrade path — hash chaining, external anchoring —
is written down in SPEC §8 and deliberately unbuilt. I'll build it if
external demand ever shows up. Not before.

## Also not

Worth saying what this isn't commercially, too. It's not a compliance
product, and I'm not going to market it like one. It's not enterprise
human-data infrastructure of the Scale AI variety — no pipelines, no
annotation workflows, no sales team. It's the boring, durable thing: files
you own, in a format that will still open in twenty years, on machines you
control. Retention is off by default, because an audit trail that silently
ages out is a policy contradiction — and when you do enable pruning, each
prune pass gets recorded as its own receipt, so the gaps explain themselves.

The plugin is free and source-available under BUSL-1.1 (v0.3.1), each release
converts to MIT four years after it ships, and production use for personal
and noncommercial purposes is permitted outright.

## If you want it

- GitHub: [JordanNewell/curtis-ai-audit](https://github.com/JordanNewell/curtis-ai-audit)
- Live site: <https://jordannewell.github.io/curtis-ai-audit/>
- Obsidian plugin, BUSL-1.1, v0.3.1 (BRAT can track the repo; the
  community-directory listing is in progress)

## What's next

The Obsidian community-directory submission is pending — that's the gate
everything else waits on. The dogfood keeps running: the three agents file
every six hours, and more in the fleet will start filing over time as I wire
them up. The receipts get more interesting as the agents do more than
heartbeat. The journal, as they say, continues.
