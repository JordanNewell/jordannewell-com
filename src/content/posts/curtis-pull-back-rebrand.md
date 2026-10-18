---
title: "I had the OS piece a year ago. I had to stop building the OS to ship it."
description: "Curtis started as an AI operating system — control plane, IDP, policy engine, the whole stack diagram. It sat for a year. Shipping it meant pulling the OS back out: three tools, one history format, and a rebrand done by reclaiming the name instead of inventing one."
pubDate: 2026-10-18
tags: ["ai", "oss", "business"]
mode: "hobart"
era: "2026-fleet"
kind: "decision"
draft: true
---

A year ago I had the hard part. I just didn't know which part the hard part was.

August 2025: I wrote down the thesis — *the unit is the operating system, not the tool.* Models are commodity, integration is the moat. I still believe that. So I did what the thesis seemed to order: I built the operating system. Control plane. Identity provider. Policy engine. Message bus. Vault. The full stack diagram, as a monorepo, with real code behind every box.

It worked. And then it sat. For about a year.

## Why the OS sat

Not because it was vapor — it ran. It sat because an OS is a platform with nothing on it. Every new feature required re-litigating an architecture decision. Every integration touched four layers. The docs were honest about it: this was an AI development operating system, not a tool collection. What the docs couldn't say was that nobody — including me — needed an operating system yet. They needed the things an OS was supposed to do for them.

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

The OS thesis said the value is in the integration layer. A year of sitting taught me the follow-up: the integration layer isn't a process supervisor. It's a shared definition of what a conversation *is*, and who holds the receipt.

That's what shipped. A year late by the original plan, exactly on time by every other measure:

- **[curtisai.tech](https://curtisai.tech)** — the suite, live
- **[.curt](/posts/curtis-porter-curt-format/)** — the standard the suite hangs on
- **[Tractum](/products/tractum/)** — the consensus/receipt layer, its own product now

The OS piece is still in the drawer where it belongs. Some of it will come back out when something needs it. Nothing ships because a stack diagram says it should.
