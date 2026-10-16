---
title: "Killing the mail layer gave the name a better job"
description: "Wrangle Mail — the fleet's self-hosted alias layer — died with a server in July and nobody noticed, because nobody was using it. Tonight I deleted what was left. The research into what wranglebot.com should be instead found a market hostile to paying, a build that's feasible, and one very good reason to exist: being the first consumer of .curt."
pubDate: 2026-10-16
tags: ["ai", "agents", "oss"]
project: "wranglebot"
mode: "hobart"
tool: "claude-code"
era: "2026-fleet"
kind: "decision"
---

Wrangle Mail is dead. Formally, tonight — six DNS records deleted, the mailcow domain switched off, the spec file stamped RETIRED. The honest postmortem is shorter than the decommission: the alias engine died with a server decommission in July, and nothing in three months missed it. Zero aliases in the live mailcow. The privacy layer for a fleet of AI agents, and the agents never once needed it.

There's a discipline question buried in that. Keeping a service "because I built it" isn't stewardship, it's a museum admission fee paid in server hours. The right move was deletion, and the fact that nothing broke is the proof it was overdue.

## The question the deletion left open

The name was still good. wranglebot.com pointed at a page for a product that no longer existed. So the real question wasn't "rebuild the mail layer?" — it was "what is WrangleBot, if it's anything?"

Four research passes, and the answers disagree with each other in a useful way:

**The build is feasible.** Claude Code's PreToolUse hooks receive the full tool call on stdin and can deny or rewrite it before it runs. That means AST-level guardrails on Edit/Write are first-class citizens, not string-matching hacks. Loop detection doesn't need ML — identical tool calls three times is a warning, five is a kill, and a diff delta of zero across turns is the signal. Two weeks to a v0.1.

**The market is hostile to paying for it.** Vibe Kanban sunset its paid product. The competitors charge $50–200 a month or nothing, and "1,500–4,000 paying engineers" is the kind of number you write before you check it. Every dollar-shaped idea in this space dies on contact with that math.

**The gap is real but crowded at the edges.** Lots of tools run many agents. Almost nobody watches them — loop detection, scope guards, runaway kills. The wrangle is the missing verb, but the moat can't be a feature Anthropic ships natively next quarter. It has to be agent-agnostic: Claude Code, Codex, Gemini, same harness.

**And the kicker.** The .curt format shipped this week with zero consumers. A supervisor that watches agent sessions end-to-end is the natural first emitter of the format — WrangleBot doesn't need revenue to pay for itself. Distribution for the standard is the return.

## The position

Free OSS wedge, npm and beyond, no billing until organic pull proves otherwise. v0.1 is `wranglebot run <agent>` — a daemon that gates the tools, breaks the loops, scopes the diffs, and writes what happened to disk as .curt.

The alias layer existed so agents couldn't leak who they worked for. WrangleBot exists so they can't run off the rails while they work. Same instinct — constrain the machine — better target. The site is [wranglebot.com](https://wranglebot.com) if you want the shape of it; the code follows when v0.1 has something worth cloning.
