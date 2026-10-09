---
title: "Curtis Porter — one file, one chat, no hostages"
description: "Shipped today: a local-first converter that reads every hostile AI chat export — ChatGPT branch trees, Claude content blocks, Grok archives, Gemini Takeout, pasted transcripts in English or Chinese — and hands back .curt files and vault markdown you own. v0.2.0 ports both directions: continuation packs, ChatGPT-shape JSON, API JSONL. MIT, no accounts, no uploads, no telemetry."
pubDate: 2026-10-09
tags: ["ai", "oss"]
mode: "hobart"
series: []
era: "2026-fleet"
kind: "win"
project: "curtis-chat"
draft: false
---

[The line post](/posts/curtis-line-2-0/) gave Curtis Porter one sentence: it owns the format boundary. As of today that sentence has a public repo behind it — [github.com/JordanNewell/curtis-ai-chat-porter](https://github.com/JordanNewell/curtis-ai-chat-porter). Initial release `d66b03b`, v0.2.0, MIT.

## The hostage problem

Every AI tool holds your history in its own schema, and the exits are hostile — by design or by neglect, the result is the same. ChatGPT's export nests messages in a branch tree. Claude's mixes text and content blocks. DeepSeek has no bulk export at all. Grok hands you a data-export archive; Gemini routes you through Takeout. Your conversations are your work product until you ask for them, at which point they become someone else's parsing problem.

Porter reads all of it, on your machine, and hands back files you own.

## What it reads

Detection is automatic — you never pick a format:

- **ChatGPT** — the export zip or `conversations.json`
- **Claude** — the export zip or `conversations.json`
- **Grok** — the data-export JSON archive
- **Gemini** — Takeout "My Activity" JSON
- **Curtis** — bulk `.curt` zips, single `.curt` files, markdown transcripts
- **Everything else** — the paste box. Copy a DeepSeek, Kimi, 豆包, MiniMax, or Z.ai chat with the speaker labels intact (`You:` / `AI:` / `## You` — 我/AI/助手 also recognized) and paste.

Re-running an import is idempotent: conversations already seen are skipped, so you can't double-port an export.

## `.curt` — one file, one conversation

The container is JSON with a magic field and a version: `curt: "curtis-conversation"`, `version: 1`. One conversation per file. Ids, timestamps, token stats, base64 images, tool-call metadata survive byte-perfect.

JSON over markdown for the container is deliberate: no escaping edge cases, nothing to ambiguity-corrupt. Markdown is what you read — every port also writes a plain transcript you can drop in any folder. `.curt` is what you move. Curtis-to-Curtis is now a file copy.

## Both directions

v0.2.0 ports out as well as in. A `.curt` file or Curtis transcript goes back out as:

- **Continuation packs** — markdown built to be attached to a ChatGPT, Claude, or Gemini chat. A preamble tells the model to adopt the transcript's context and continue from the last message. Turns are trimmed to a token budget (default 30,000) that always keeps the first user message plus the most recent turns.
- **ChatGPT-shape JSON** — a `conversations.json` for tools that read ChatGPT exports (TypingMind and the like).
- **API JSONL** — one `{"messages": [...]}` per line: replay, fine-tune prep, JSON importers.

## Three surfaces, one engine

- **Web UI** — `npm start`, or double-click `dist/porter.html`: a single self-contained file that runs from disk, no server at all.
- **CLI** — `curt-porter convert` / `export` / `serve`. Scriptable.
- **Obsidian plugin** — standalone (`curtis-ai-chat-porter`; it works without Curtis AI Chat installed). When both are present, the shared format means ported chats appear in Curtis history immediately.

The engine is not a copy that will drift: `src/core` mirrors the plugin's `src/import` module file-for-file, and the contract suite runs live against the sibling repo. Change one side without the other and the build says so.

## What does not survive

Both directions, stated plainly:

Going **out**: only message text travels. Tool calls, images, and memory-fact chip ids stay behind — foreign platforms have no place to put them, and a continuation pack is prose by design.

Coming **in**: foreign exports reference images server-side, so text is what imports (Curtis's own base64 images round-trip fine). Tool-call output is dropped, for continuation-safety — re-sending orphan tool messages gets a history rejected by providers. Branch trees flatten to one linear timeline, first-written branch. Account metadata stays with the account.

## Why a standalone tool

The plugin could have kept all of this to itself. Instead the format is public, the converter is its own repo, and it runs with no Obsidian in sight — because Porter is for people not in Obsidian yet, and a boundary you can't visit isn't a boundary, it's a wall.

The durability argument from the v1 launch applies to chats the same as notes: files readable in fifty years because they're text. An exit you have exercised is what makes staying a choice.

There will be more. Still true.

[![Curtis Porter routing table — every export in, .curt and markdown back, ports out to continuation packs, JSON, JSONL](/posts/curtis-porter-curt-format/hero.png)](https://github.com/JordanNewell/curtis-ai-chat-porter)

If you made it this far, I appreciate it. — JN
