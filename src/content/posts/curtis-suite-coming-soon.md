---
title: "The Curtis suite is live — curtisai.tech"
description: "The Curtis line has consolidated into a suite at curtisai.tech. Four pieces: Chat, Port, Audit, Data. Chat and Port are live; Audit is on npm; Data is the new one. What shipped, briefly."
pubDate: 2026-10-11
tags: ["ai", "oss"]
mode: "hobart"
era: "2026-fleet"
kind: "decision"
project: "curtis-chat"
draft: false
ogImage: "/posts/curtis-suite-coming-soon/og.png"
---

The line has been scattered across a plugin directory, two repos, and an npm package. That ends. Everything Curtis converges at **[curtisai.tech](https://curtisai.tech)** — live now.

[![The Curtis suite — Chat, Port, Audit, Data](/posts/curtis-suite-coming-soon/hero.png)](https://curtisai.tech)

Four pieces, one crystal. A small amount about each:

**Chat.** The core — [Curtis AI 2.0.0](/products/curtis-ai-chat/) shipped this week. Agents and swarm mode, a terminal pane, scheduled runs, an MCP server and client, 53 providers, chat history as files you own. Live in the Obsidian community directory, MIT, no telemetry.

**Port.** [Curtis Porter](https://github.com/JordanNewell/curtis-ai-chat-porter) moves conversations in and out — ChatGPT, Claude, Grok, Gemini, DeepSeek exports in; `.curt`, markdown, continuation packs out. v0.2.0 speaks both directions. Your chats stop being trapped in whoever's app you typed them into.

**Audit.** [curtis-compliance](/projects/curtis-compliance/) — local-first compliance checks with citations, not magic. HIPAA, SOC2, PCI-DSS patterns, hash-chained audit trail. On npm since July.

**Data.** The new one — the suite's data layer, where portable `.curt` history becomes something you can query, back up, and own outright. Still under wraps. More soon.

One mark, four verbs. [curtisai.tech](https://curtisai.tech).
