---
title: "I had the OS piece before OpenClaw existed. I had to stop building the OS to ship it."
description: "Curtis started as an AI operating system built months before OpenClaw dropped — control plane, IDP, policy engine, the whole stack diagram. When OpenClaw arrived I spent months comparing systems instead of shipping. What unstuck it was pulling the OS back out: three tools, one history format, and a rebrand done by reclaiming the name instead of inventing one."
pubDate: 2026-10-18
tags: ["ai", "oss", "business"]
mode: "hobart"
era: "2026-fleet"
kind: "decision"
draft: false
---

I had the hard part early. I just didn't know which part the hard part was.

Before the summer of 2025, I was already building the personal AI stack — local model routing through Ollama, a unified proxy across cloud providers, an MCP tool layer, an agent console. Not because a category existed. Nobody was calling this anything yet. It was just the obvious thing to build if you were living inside these models daily.

By August it had a name for itself. I wrote down the thesis on August 19, 2025 — *the unit is the operating system, not the tool.* Models are commodity, integration is the moat. A week later the monorepo had its initial commit: the operating system, for real. Control plane. Identity provider. Policy engine. Message bus. Vault. The full stack diagram, with working code behind every box.

For scale: that was months before OpenClaw launched (November 2025, under its first name). When OpenClaw did drop, and then Hermes, and the rest of the wave — I wasn't discovering the problem space like everyone else. I was running comparisons. My OS against theirs, my architecture decisions against ones made in public, re-litigating my own stack against every new entrant. That comparison habit was useful and it was also the trap.

The OS worked. And then it sat — through the entire era where personal agent infrastructure went from my private project to a category with weeks-old projects trending on GitHub.

## Why the OS sat

Not because it was vapor — it ran. It sat because an OS is a platform with nothing on it. Every new feature required re-litigating an architecture decision. Every integration touched four layers. The docs were honest about it: this was an AI development operating system, not a tool collection. What the docs couldn't say was that nobody — including me — needed an operating system yet. They needed the things an OS was supposed to do for them. And the new entrants proved it: OpenClaw shipped as a single assistant that does chores, not a kernel, and it took the category anyway.

The thesis wasn't wrong. The build order was.

## The pull-back

The reframe that unstuck it was almost embarrassingly small: stop building the OS, ship the things the OS was going to run. Not a pivot — a pulling-back. Take the three pieces people could actually use on day one and make each one stand alone:

- **Chat** — your keys, your vault, your history kept as files.
- **Port** — every hostile AI chat export in, portable formats out, byte-for-byte round-trip verified.
- **Audit** — append-only receipts for everything an agent touches. Evidence by structure, not by promise.

Each one ships, installs, and pays for itself without the control plane, without the IDP, without the bus. The integration layer — the actual moat, per the original thesis — now has a job it can grow into: it's the thing that makes all three feel like one system. That's [curtisai.tech](https://curtisai.tech). Three pieces, one line.

## The rebrand, and the rerelease

The name went through its own arc. The monorepo was Curtis. Then Curtis became the live product and the old OS got renamed out of the way — `curtis-os`, explicitly out of scope, left alone. That's the part I'd underline for anyone holding a big repo they can't move: the reclaim cost nothing. I didn't invent a new name for the live line. I took the name off the thing that was sitting and put it on the thing that was shipping.

And the piece that finally stitches the three together isn't a control plane. It's a file format. `.curt` — portable, agent-readable chat history you own, with a spec and a conformance level. The "OS" turned out to be a records standard plus three tools that honor it.

## What came together

The OS thesis said the value is in the integration layer. A year of sitting — and a year of comparing my stack against every new entrant — taught me the follow-up: the integration layer isn't a process supervisor. It's a shared definition of what a conversation *is*, and who holds the receipt.

That's what shipped. Later than the August 2025 version of me planned, exactly on time by every other measure:

- **[curtisai.tech](https://curtisai.tech)** — the suite, live
- **[.curt](/posts/curtis-porter-curt-format/)** — the standard the suite hangs on
- **[Tractum](/products/tractum/)** — the consensus/receipt layer, its own product now

The OS piece is still in the drawer where it belongs. Some of it will come back out when something needs it. Nothing ships because a stack diagram says it should.
