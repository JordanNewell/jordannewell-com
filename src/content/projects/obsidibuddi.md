---
title: "ObsidiBuddi"
description: "Multi-provider AI assistant for Obsidian. 13+ providers (Anthropic, Z.ai GLM, Gemini, Ollama, and any OpenAI-compatible endpoint), sidebar chat, vault RAG, tool calling."
status: "active"
tags: ["projects", "ai", "tools"]
order: 19
facts:
  - k: "providers"
    v: "13+"
  - k: "form"
    v: "Obsidian plugin"
  - k: "status"
    v: "personal fork"
  - k: "store"
    v: "not published"
highlights:
  - title: "Provider-agnostic"
    body: "Anthropic Claude, Z.ai GLM, Google Gemini, Ollama, any OpenAI-compatible endpoint. Switch per chat, no lock-in."
  - title: "Vault-aware context"
    body: "RAG pipeline pulls relevant notes into the prompt. Chat with your vault, not just against a generic model."
  - title: "Tool calling"
    body: "Models can call tools — file ops, web fetch, custom commands. Streaming responses throughout."
  - title: "Sidebar chat"
    body: "Persistent chat alongside the editor. Markdown rendering, code blocks, conversation history."
stack:
  - "TypeScript"
  - "Obsidian Plugin API"
  - "esbuild"
  - "Multi-provider"
---

Personal-use fork, not published to the Obsidian community store. Built because existing Obsidian AI plugins locked you into one provider or didn't handle vault context properly.
