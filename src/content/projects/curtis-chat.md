---
title: "Curtis Chat"
description: "Polyglot AI chat for Obsidian. 30+ providers (Anthropic, Z.ai GLM, Gemini, Ollama, OpenAI-compatible), image attachments, vault memory, slash commands. Bring your own keys."
status: "shipped"
tags: ["projects", "ai", "tools", "oss"]
shipDate: 2026-07-21
repo: "https://github.com/JordanNewell/curtis-chat"
liveUrl: "https://community.obsidian.md/plugins/curtis"
order: 19
facts:
  - k: "shipped"
    v: "2026-07-21"
  - k: "providers"
    v: "30+"
  - k: "form"
    v: "Obsidian plugin"
  - k: "license"
    v: "MIT"
highlights:
  - title: "30+ providers, zero lock-in"
    body: "Anthropic, Z.ai GLM, Gemini, Ollama, and any OpenAI-compatible endpoint. Swap models without losing chat history."
  - title: "Vault-aware memory"
    body: "Index notes once, reference them in any chat. RAG that lives inside Obsidian — no separate vector DB."
  - title: "Images, files, slash commands"
    body: "Attach screenshots, drag files, run /commands. Sidebar UI stays out of the way until you call it."
  - title: "Listed on Obsidian's community directory"
    body: "Passed plugin review. Install directly from Obsidian: Settings → Community plugins → Browse → \"curtis\"."
stack:
  - "TypeScript"
  - "Obsidian Plugin API"
  - "OpenAI-compatible providers"
  - "Anthropic SDK"
  - "Ollama"
---

~~ObsidiBuddi~~ → **Curtis Chat**. Same project, new name, expanded scope.

Install from the [Obsidian community plugin directory](https://community.obsidian.md/plugins/curtis), or clone the [source](https://github.com/JordanNewell/curtis-chat).

## Why the rename

The project outgrew its original scope. Started as a single-provider assistant ("ObsidiBuddi" — your buddy in the vault). Now supports 30+ providers with vault RAG, image attachments, and tool calling. The new name reflects that — it's not a buddy any more, it's a polyglot.

(Post on the name change is coming.)

## What it does

Bring your own API keys for any provider — no middleman, no markup. Chat with your notes in the sidebar, attach images, run slash commands. Index the vault once and every chat can reference it.
