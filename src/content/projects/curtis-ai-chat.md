---
title: "Curtis AI"
description: "The agent for Obsidian. 53 providers, 12 vault tools, named agents and swarm mode, skills, an MCP server and client, scheduled runs, the multi-model arena — history as .curt files you own. Also runs in Zed via curtis-acp."
status: "shipped"
startDate: 2025-08-26
promotedTo: "/products/curtis-ai-chat/"
tags: ["projects", "ai", "obsidian"]
shipDate: 2026-10-12
repo: "https://github.com/JordanNewell/curtis"
liveUrl: "https://jordannewell.com/products/curtis-ai-chat/"
order: 2
facts:
  - k: "relaunched"
    v: "2026-10-12"
  - k: "version"
    v: "1.0.0"
  - k: "providers"
    v: "53"
  - k: "form"
    v: "Obsidian plugin + ACP agent + web"
  - k: "web"
    v: "curtisai.tech"
  - k: "license"
    v: "BUSL-1.1 (free to use)"
highlights:
  - title: "Curtis Agent"
    body: "12 tools to read, create, and edit vault notes — plus shells (opt-in, confirmed), MCP servers, and skills in the open Agent Skills standard."
  - title: "Multi-model arena"
    body: "Stream one prompt to 2–4 models side-by-side — in Obsidian and inside Zed's agent panel. Promote the winner."
  - title: "Named agents & swarm"
    body: "Persona + model routing + tool ceilings per agent; a leader spawns followers that take subtasks and report back."
  - title: "Memory with provenance"
    body: "Facts ask before saving and record which conversation they came from. Conversations live as markdown you own."
stack:
  - "TypeScript"
  - "Obsidian Plugin API"
  - "ACP (Zed + any client)"
  - "OpenAI / Anthropic / Google / Ollama / 53 providers"
---

The agent for Obsidian. Formerly Curtis AI Chat — the name caught up to the product at the 1.0.0 relaunch on 2026-10-12: repo and plugin id are now `curtis`, positioning is agent-first, and the license moved to BUSL-1.1 (source-available — free to use, modify, and redistribute; only offering Curtis itself as a competing service needs a commercial license; each version converts to Apache-2.0 after four years).

What shipped in the relaunch line:

- **Curtis Agent** — 12 vault tools, auditable in the transcript
- **Named agents & swarm mode** — leader spawns followers on subtasks
- **Skills** — open Agent Skills standard, portable to/from Claude Code, Cursor, Copilot
- **MCP both directions** — client, plus serving the vault to external AI apps
- **Multi-model arena** — 2–4 models, in Obsidian and Zed (curtis-acp)
- **Scheduled runs** — headless prompts on a cadence, filed as notes
- **Memory with provenance** + conversations as plain markdown in your vault
- **Import** — ChatGPT/Claude exports, portable `.curt` files

Full feature list, comparison table, and install instructions on the [product page](/products/curtis-ai-chat/). For the rename history (ObsidiBuddi → Curtis Chat → Curtis AI Chat → Curtis), see [Curtis Chat](/projects/curtis-chat/).
