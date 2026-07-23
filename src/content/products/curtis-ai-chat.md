---
title: "Curtis AI Chat"
tagline: "Polyglot AI chat for Obsidian. Thirty-plus providers, one sidebar. Your data stays in your vault."
description: "Obsidian plugin that ships 30+ AI providers (Anthropic, OpenAI, Gemini, Ollama, OpenRouter, and 25+ more), agent tools that read and edit your vault notes, multi-model arena, voice I/O, inline diff rewrite, and long-term memory. MIT, no telemetry, local-first."
status: "released"
shipDate: 2026-07-22
repo: "https://github.com/JordanNewell/curtis-ai-chat"
homepage: "https://github.com/JordanNewell/curtis-ai-chat"
logo: "/products/curtis-ai-chat/logo.svg"
platform:
  name: "Obsidian"
  url: "https://obsidian.md"
pricing: "free-oss"
license: "MIT"
order: 1
ogImage: "/og-curtis-ai-chat.png"
install:
  - label: "Community directory"
    kind: "directory"
    href: "https://community.obsidian.md/plugins/curtis-ai-chat"
    detail: "community.obsidian.md/plugins/curtis-ai-chat"
  - label: "BRAT (beta channel)"
    kind: "brat"
    href: "https://github.com/TfTHacker/obsidian42-brat"
    detail: "BRAT → Add Beta plugin → JordanNewell/curtis-ai-chat"
  - label: "Manual install"
    kind: "manual"
    href: "https://github.com/JordanNewell/curtis-ai-chat/releases/latest"
    detail: "Download main.js + manifest.json + styles.css → drop in <vault>/.obsidian/plugins/curtis-ai-chat/"
stats:
  - k: "providers"
    v: "30+"
  - k: "built-in tools"
    v: "9"
  - k: "min obsidian"
    v: "1.13"
  - k: "license"
    v: "MIT"
features:
  - icon: "🤖"
    title: "Curtis Agent"
    body: "AI calls tools to read, create, and edit your vault notes. Nine built-ins: read_note, search_notes, create_note, edit_note, list_notes, get_tags, get_backlinks, get_current_note, calculator. OpenAI-compat providers; opt-in."
    docUrl: "https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/AGENT.md"
  - icon: "⚔️"
    title: "Multi-model arena"
    body: "Pick 2–5 models, send one prompt, watch responses stream side-by-side. Click Promote to chat on any column to continue with that model. Compare quality, latency, and cost live."
    docUrl: "https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/ARENA.md"
  - icon: "🎨"
    title: "Inline diff rewrite"
    body: "Select any text in a note → Ctrl+Shift+R (or right-click → Rewrite with AI). AI generates an improved version and a modal shows line-by-line green/red diff. Accept or reject. Cursor-style."
    docUrl: "https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/DIFF_REWRITE.md"
  - icon: "@"
    title: "@-mention vault notes"
    body: "Type @ in chat, fuzzy-search your vault, attach. Note content is prepended to your message as invisible context. The active note also gets a one-click pill in the chat header."
    docUrl: "https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/MENTIONS.md"
  - icon: "🎙️"
    title: "Voice I/O"
    body: "Whisper speech-to-text on the mic button. Browser speechSynthesis TTS on every assistant message — no API key needed. Auto-speak toggle in the header for hands-free listening."
    docUrl: "https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/VOICE.md"
  - icon: "🔍"
    title: "Cross-conversation search"
    body: "Ctrl+Shift+F opens a fuzzy-matched picker across all conversations and messages. Click a result to jump."
  - icon: "📝"
    title: "Markdown export"
    body: "Download any conversation as a .md file with provider display names, timestamps, and image references preserved. /export slash command or download icon in the chat header."
  - icon: "🧠"
    title: "Memory editing UI"
    body: "Durable facts about you live in a markdown file in your vault — readable, portable, and now editable from Settings → Memory. Delete or edit individual facts; previously append-only."
comparison:
  title: "How it compares"
  columns:
    - "Curtis AI Chat"
    - "Smart Connections"
    - "Text Generator"
    - "Copilot for Obsidian"
  rows:
    - label: "Agent tools (vault-modifying)"
      cells: ["9 built-in", "—", "—", "Partial"]
    - label: "Provider count"
      cells: ["30+", "1–2", "1–2", "5–10"]
    - label: "Local-first (Ollama, LM Studio)"
      cells: ["Yes", "—", "Yes", "Yes"]
    - label: "Multi-model arena"
      cells: ["Yes", "—", "—", "—"]
    - label: "Inline diff rewrite"
      cells: ["Yes", "—", "—", "—"]
    - label: "Voice I/O"
      cells: ["Yes", "—", "—", "—"]
    - label: "Long-term memory"
      cells: ["Markdown file", "Vector index", "—", "JSON"]
    - label: "Native Obsidian rendering"
      cells: ["Yes", "Partial", "—", "Partial"]
privacy: "All vault access is user-initiated — agent tools when you invoke them, image picker when you click the paperclip, folder picker when you configure auto-save or wallpaper, @-mention when you type @. No file contents are sent to AI providers except message text, attached images, attached note contents, and tool-call results. API keys are stored in your OS keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service), never in the vault. No telemetry, no tracking, no phone-home."
faq:
  - q: "On v3 (Curtis). Do I need to do anything?"
    a: "Yes — v4.0.0 changes the plugin ID from curtis to curtis-ai-chat. Existing v3 installs need to reinstall; the ID change is not auto-migratable. Conversation history keyed under the old ID won't carry over. Disable the old plugin, install the new one, re-enter API keys (they live in the OS keychain per-plugin, not per-provider, so they need re-entering once)."
  - q: "Does it work fully offline?"
    a: "Yes. Install Ollama (ollama.com), run ollama pull qwen2.5:7b-instruct or whatever model you prefer, then enable Ollama (Local) in provider settings. No API key. Nothing leaves your machine. The agent tools, memory, image attachments — every feature works the same way."
  - q: "Does it work on mobile?"
    a: "Yes, iOS and Android. Hover-only elements are always visible on touch at reduced opacity. Touch targets sized to Apple HIG minimums. Wallpaper background auto-disabled on phones for scroll performance. Streaming may degrade to buffered responses on some providers due to mobile CORS."
  - q: "Where do my API keys live?"
    a: "OS keychain — Windows Credential Manager, macOS Keychain, Linux Secret Service. Uses Obsidian's safeStorage API (1.11.4+). Never written to the vault, never logged, never sent anywhere except the provider you configured."
  - q: "Tool calls go to my provider — what does that mean for privacy?"
    a: "When you invoke a Curtis Agent tool that reads a note (read_note, search_notes, etc.), the note contents become part of the conversation and are sent to your AI provider as context. On a cloud provider that content leaves your machine. Switch to Ollama for fully offline operation. The non-agent chat features only send the message text and any images/note contents you explicitly attach."
  - q: "Can I verify the release assets?"
    a: "Yes — every main.js, manifest.json, and styles.css ships with a Sigstore build-provenance attestation from GitHub Actions. Run: gh attestation verify main.js --repo JordanNewell/curtis-ai-chat. Confirms what you install was built from public source."
  - q: "Will it stay free?"
    a: "Yes. MIT licensed, every feature works with your own API keys, no paid tier planned. Sponsorship (GitHub Sponsors, Buy Me a Coffee) is voluntary and never gates features."
---

## Why this exists

Every existing Obsidian AI plugin on the market nailed one workflow — chat, RAG, or templates. Curtis AI Chat puts all three in one sidebar, with a provider model that does not lock anyone in.

Local-first via Ollama when you don't want anything to leave your machine. Cloud providers when you want frontier models. Same plugin, same vault, same conversation history. Your data stays yours.

## What shipped in v4.0.0

Eight flagship features, a full type-safety pass (no `any` at any provider boundary — every external JSON response shape is strictly typed with narrowing at the boundary), and Sigstore build-provenance attestations on every release asset.

The agent layer that ties chat, tools, and memory together — finally native Obsidian.
