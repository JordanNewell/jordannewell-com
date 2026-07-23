---
title: "Curtis Chat"
description: "The earlier name for what's now Curtis AI Chat. Started as ObsidiBuddi, became Curtis Chat at v3, evolved into Curtis AI Chat at v4. This page is the evolution story."
status: "deprecated"
successor: "curtis-ai-chat"
deprecatedDate: 2026-07-22
shipDate: 2026-07-21
tags: ["projects", "ai", "tools", "oss"]
repo: "https://github.com/JordanNewell/curtis-ai-chat"
liveUrl: "https://jordannewell.com/products/curtis-ai-chat/"
order: 99
facts:
  - k: "status"
    v: "Deprecated"
  - k: "successor"
    v: "Curtis AI Chat v4"
  - k: "final version"
    v: "v3.0.1"
  - k: "deprecated"
    v: "2026-07-22"
  - k: "license"
    v: "MIT"
---

> **This project has a new name and a new home.** Continue to [**Curtis AI Chat**](/products/curtis-ai-chat/) — the v4 successor with agent tools, multi-model arena, voice I/O, and 30+ providers.

## The short version

**ObsidiBuddi** → **Curtis Chat** → **Curtis AI Chat**. Three names, one lineage, one plugin. This page is the story of how it evolved and why each rename happened.

If you're looking for the current release, install instructions, or feature list, head to the [**Curtis AI Chat product page**](/products/curtis-ai-chat/). What follows is for context — the archaeological layer.

## Phase 1 — ObsidiBuddi (2025)

Started as a single-provider AI assistant. The pitch was in the name: *your buddy in the vault*. One provider (OpenAI), one job — answer questions about your notes in a sidebar. Built to learn the Obsidian plugin API and scratch a personal itch.

The scope was deliberately narrow. No tool calling, no image attachments, no multi-provider gymnastics. Just chat.

The itch kept growing.

## Phase 2 — Curtis Chat (v3.0.0, 2026-07-20)

The plugin outgrew the "buddy" framing. By v3 it supported 30+ providers, had vault memory, image attachments, slash commands, and a redesigned Telegram-style bubble UI. Calling it ObsidiBuddi felt wrong — it wasn't a buddy any more, it was a polyglot.

**The rename:** ObsidiBuddi → **Curtis Chat**. "Curtis" because it didn't mean anything specific (no provider inferences, no workflow presuppositions). "Chat" because that was still the primary surface.

v3.0.0 shipped 2026-07-20. v3.0.1 followed the next day with housekeeping from Obsidian's community plugin review feedback. Listed at `community.obsidian.md/plugins/curtis` — directory entry still works, points at v3.0.1.

## Phase 3 — Curtis AI Chat (v4.0.0, 2026-07-22)

Two days after v3, the scope jumped again. Eight flagship features landed in a single release:

- Curtis Agent — AI calls tools to read/create/edit vault notes
- Multi-model arena — stream one prompt to 2–5 models side-by-side
- Inline diff rewrite — Cursor-style rewrite with Accept/Reject diff modal
- @-mention vault notes
- Voice I/O (Whisper STT + browser TTS)
- Cross-conversation search
- Markdown export
- Memory editing UI

Plus a full type-safety pass — every external JSON response shape strictly typed, narrowing at the boundary, zero `any` in the provider code.

**The rename:** Curtis Chat → **Curtis AI Chat**. Two reasons:

1. The plugin ID changed from `curtis` to `curtis-ai-chat` (the v4 release is breaking — install state can't auto-carry across ID changes, so a clean break made more sense than a migration shim).
2. "Curtis Chat" was hard to find in the Obsidian directory for users searching "chat". Adding "AI" puts the search-discoverable keyword in the name.

## Why break the install ID

Every previous rename was just a display-name change — the underlying plugin ID stayed `curtis`, so existing installs auto-upgraded. v4 doesn't have that luxury. The decision matrix:

- **Keep ID `curtis`, bump major** — users get auto-upgraded but the v4 type-safety work and declarative-settings modernization want a clean foundation. Carrying v1→v2→v3 migration shims indefinitely is technical debt.
- **Change ID to `curtis-ai-chat`** — clean break, fresh directory entry, no legacy state to honor. Existing v3 installs reinstall fresh. Honest about the breaking change.

I took the second path. v3 installs need to reinstall; conversation history keyed under the old ID doesn't carry over. API keys live in the OS keychain per-plugin, so they need re-entering once under the new plugin's settings.

## Where things live now

| What | Where |
|---|---|
| **Current release (v4.0.0+)** | [/products/curtis-ai-chat/](/products/curtis-ai-chat/) |
| Source | [github.com/JordanNewell/curtis-ai-chat](https://github.com/JordanNewell/curtis-ai-chat) |
| Old `curtis` directory entry | [community.obsidian.md/plugins/curtis](https://community.obsidian.md/plugins/curtis) — still lists v3.0.1, will be marked superseded once the v4 directory review clears |
| Old GitHub repo | [github.com/JordanNewell/curtis-chat](https://github.com/JordanNewell/curtis-chat) — redirects to the new repo automatically |

## Lessons from three renames

1. **Pick a name that doesn't constrain the scope.** "ObsidiBuddi" implied a single-provider assistant. When the plugin became a polyglot, the name had to go. "Curtis" was deliberately meaningless — and that's what let it absorb three major scope expansions without further renaming.

2. **Don't be precious about renaming.** Each rename cost an hour of work (manifest, README, community submission update). Each rename unlocked clearer positioning. The cost was trivial; the benefit compounded.

3. **Plugin ID changes are a real cost.** Display names are cheap to change; install IDs are not. If you're going to break the ID, batch every breaking change you've been deferring into the same release — you only get to pay that price once per user.

4. **Directory discoverability matters.** "Curtis Chat" was hard to find via search. "Curtis AI Chat" puts the keyword in the name. Not glamorous, just effective.

The plugin is in a much better place than the v1 buddy I shipped in 2025. Onward.
