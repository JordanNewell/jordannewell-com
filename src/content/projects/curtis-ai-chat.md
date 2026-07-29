---
title: "Curtis AI Chat"
description: "Polyglot AI chat for Obsidian. 30+ providers, agent mode with vault tools, multi-model arena, voice I/O, inline diff rewrite. The v1 successor to Curtis Chat."
status: "shipped"
tags: ["projects", "ai", "oss", "obsidian"]
shipDate: 2026-07-22
repo: "https://github.com/JordanNewell/curtis-ai-chat"
liveUrl: "https://jordannewell.com/products/curtis-ai-chat/"
order: 2
facts:
  - k: "shipped"
    v: "2026-07-22"
  - k: "version"
    v: "v1.x"
  - k: "providers"
    v: "30+"
  - k: "form"
    v: "Obsidian plugin"
  - k: "license"
    v: "MIT"
highlights:
  - title: "Curtis Agent"
    body: "AI calls tools to read, create, and edit vault notes. Vault-aware — knows your tags, links, and structure."
  - title: "Multi-model arena"
    body: "Stream one prompt to two models side-by-side. Compare answers in real time, pick the winner."
  - title: "Inline diff rewrite"
    body: "Cursor-style rewrite with Accept/Reject diff modal. Review every change before it lands."
  - title: "Voice I/O"
    body: "Whisper STT in, browser TTS out. Talk to your vault."
stack:
  - "TypeScript"
  - "Obsidian Plugin API"
  - "OpenAI / Anthropic / Google / 30+ providers"
---

The polyglot AI chat for Obsidian. Curtis Chat v3 rebranded and rebuilt with a breaking v1 release on 2026-07-22 — eight flagship features landed in one ship:

- **Curtis Agent** — AI calls tools to read/create/edit vault notes
- **Multi-model arena** — stream one prompt to 2 models side-by-side
- **Inline diff rewrite** — Cursor-style rewrite with Accept/Reject diff modal
- **@-mention vault notes** in chat
- **Voice I/O** (Whisper STT + browser TTS)
- **Cross-conversation search**
- **Markdown export**
- **Memory editing UI**

Plus a full type-safety pass — every external JSON response shape strictly typed, narrowing at the boundary, zero `any` in the provider code.

Full feature list and install instructions on the [product page](/products/curtis-ai-chat/). For the rename history (ObsidiBuddi → Curtis Chat → Curtis AI Chat), see [Curtis Chat](/projects/curtis-chat/).
