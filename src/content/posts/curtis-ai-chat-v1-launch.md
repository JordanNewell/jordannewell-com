---
title: "Curtis AI Chat v1.0.0 — and why it's called Curtis"
description: "v1.0.0 ships today. Eight features, 30+ providers, the agent layer for Obsidian. Also: why the plugin is named after the person whose existence made mine possible, and what that has to do with building code that outlasts me."
pubDate: 2026-07-23
tags: ["ai", "oss"]
mode: "hobart"
series: ["heritage"]
era: "2026-fleet"
kind: "win"
project: "curtis-chat"
draft: false
---

Today Curtis AI Chat v1.0.0 ships. Eight flagship features, thirty-plus AI providers, the agent layer for [Obsidian](https://community.obsidian.md/plugins/curtis-ai-chat) — chat, tools, memory, all native, all local-first, all MIT.

I want to talk about the name first.

## The name

The plugin is named after Curtis — the person whose existence made mine possible. Without him there is no me, no fleet, no plugins, no field notes for you to be reading. He's the reason any of this exists.

Most software is built to be replaced. A SaaS dashboard lives eighteen months, gets rewritten, gets forgotten. The work I'm trying to do is different — code that lasts long enough to become infrastructure for the next person. The plugin directory entry, the GitHub repo, the source — these should outlast me, and outlast my children. The plugin ID, the install path, the way the chat talks to the vault — those are decisions made on a horizon longer than a single release cycle.

Naming the plugin after him keeps that in view. Also a thanks.

## What shipped today

The v1 release is large. Eight features that, together, are the work I've wanted to ship for over a year:

1. **Curtis Agent** — the AI calls tools to read, create, and edit notes in your vault. Nine built-ins (`read_note`, `search_notes`, `create_note`, `edit_note`, `list_notes`, `get_tags`, `get_backlinks`, `get_current_note`, `calculator`). This is the part that makes the plugin an agent, not a chat.
2. **Multi-model arena** — stream one prompt to 2 models side-by-side. Pick a winner, promote to chat.
3. **Inline diff rewrite** — select text, `Ctrl+Shift+R`, get a green/red diff modal with Accept/Reject.
4. **@-mention vault notes** — attach notes as invisible context.
5. **Voice I/O** — Whisper speech-to-text on the mic, browser `speechSynthesis` TTS on every assistant reply.
6. **Cross-conversation search** — `Ctrl+Shift+F` fuzzy picker across all conversations.
7. **Markdown export** — `/export` slash or download icon.
8. **Memory editing UI** — edit or delete individual memory facts from Settings → Memory.

Plus a full type-safety pass. Every external JSON response shape (OpenAI-compat, Anthropic, Gemini, Ollama) strictly typed, narrowing at the boundary via type guards. Internal code never sees `any`. Zero lint warnings on `npm run build`. Boring on paper. The difference between shipping fixes at 2am and not.

Release assets (`main.js`, `manifest.json`, `styles.css`) each ship with a Sigstore build-provenance attestation from GitHub Actions. `gh attestation verify main.js --repo JordanNewell/curtis-ai-chat` confirms what you install was built from public source.

## Why Obsidian

Obsidian is one of the best digital tools for thought we have. Not the best note app — the best digital *medium* for thinking in writing. Local markdown files. Your filesystem. Portable forever. The notes written today will be readable in fifty years because they're just text.

That matters when most software wants to lock you in. Notes are where the real work happens — for operators, researchers, writers, founders. A plugin that lives inside Obsidian gets to be part of that.

Building Curtis as a native Obsidian plugin — not a wrapper, not a hosted service, not a SaaS — was the whole decision. The local-first model means the agent can read your vault, modify your notes, and respect your boundaries because the vault is yours and the plugin lives inside it. Switch to Ollama for the model and nothing ever leaves your machine. The notes stay yours. The plugin can be removed without losing the work.

That is the architecture. That is why this plugin, on this platform, built this way.

## What I broke on purpose

v1.0.0 changes the plugin ID from `curtis` to `curtis-ai-chat`. Existing v3 installs need to reinstall — the ID change is not auto-migratable. Conversation history keyed under the old ID does not carry over. API keys live in the OS keychain per-plugin, so they need re-entering once under the new plugin's settings.

The easy path was to keep the ID and bump the major version. I took the harder path because the type-safety work and the declarative-settings modernization want a clean foundation. Carrying v1→v2→v3 migration shims indefinitely is technical debt. Better to pay the breaking-change cost once, in public, with a clear story.

The full evolution — ObsidiBuddi → Curtis Chat → Curtis AI Chat — is on the [project page](/projects/curtis-chat/). Three names, one lineage, one plugin.

## Why ship in public

The work I admire most is built in public. Not for marketing reasons — because public work is accountable work. Decisions get written down. Trade-offs get named. Failures get logged. The v1 release is the seventh major thing shipped this month. The chain matters more than any individual release. Each one is a chance to be honest about what held up and what didn't.

The reframe that landed before *agent OS* was a category is [written up here](/posts/curtis-ai-phase-0-os-not-tool). The launch kit, the demo vault, the product page, the changelog — all of it is public. The plugin directory entry, when it clears review, will be public. The issues filed against it will be public. The fixes will land in public.

## The contribution

I'm an operator. I build across sectors — software, ventures, infrastructure. The thread tying the work together is the bet that digital infrastructure, built carefully and given away, is one of the more durable contributions one person can make. Code that outdates me. Tools that other people pick up and extend. Repos that someone else can fork in five years without asking permission.

Curtis AI Chat is one small piece of that. There will be more.

The plugin is free, MIT, no telemetry. Install from the Obsidian community directory, BRAT, or manual download. Source on [GitHub](https://github.com/JordanNewell/curtis-ai-chat).

[![Curtis AI Chat — polyglot AI chat for Obsidian](/posts/curtis-ai-chat-v1-launch/hero.png)](/products/curtis-ai-chat/)

If you made it this far, I appreciate it. — JN