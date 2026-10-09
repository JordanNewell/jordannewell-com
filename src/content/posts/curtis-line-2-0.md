---
title: "The Curtis line is brewing — 2.0.0 carries the plugin into 2027"
description: "v1.0.0 shipped 2026-07-23 with a promise: there will be more. Twelve releases later the more has a shape — a portable chat format, an editor agent, a compliance line, and a staged 2.0.0 that turns chat history into files you own. The state of the Curtis ecosystem, with receipts."
pubDate: 2026-10-09
tags: ["ai", "oss"]
mode: "hobart"
series: []
era: "2026-fleet"
kind: "win"
project: "curtis-chat"
draft: false
---

The [v1 launch post](/posts/curtis-ai-chat-v1-launch/) ended with a promise: *"Curtis AI Chat is one small piece of that. There will be more."* Eleven weeks later, the more has a shape. This is the state of the Curtis line — what exists, what's staged, and why 2.0.0 is the release built to carry the plugin into 2027.

## The line, as it stands

**Curtis AI Chat** — the core. v1.0.0 shipped 2026-07-23; twelve releases have followed, the latest on 2026-10-07. Persistent model discovery, consent-first memory capture (facts propose, you Save or Skip), the two-model arena with context parity, the custom Curtis mark, right-to-left mirroring under Obsidian 1.14. Live in the community directory, MIT, no telemetry. [Product page](/products/curtis-ai-chat/).

**[Curtis Porter](https://github.com/JordanNewell/curtis-ai-chat-porter)** — the standalone converter. Chats out of ChatGPT, Claude, Grok, Gemini, DeepSeek — any tool that can export — into `.curt`, Curtis's portable conversation format, and vault-ready markdown. v0.2.0 speaks both directions: Curtis chats export back out as continuation packs, ChatGPT-shape JSON, or API JSONL. Local-first, no accounts, no uploads. For people not in Obsidian yet.

**curtis-acp** — Curtis as an [ACP](https://agentclientprotocol.com) agent inside Zed's agent panel (or JetBrains, or any ACP client). One prompt fanned to every configured model, composed in-thread — the arena, in the editor. Protocol-complete and self-tested; the live-provider path is wired.

**curtis-compliance** — the line's second product, different domain, same model: local-first checks with citations, not magic. HIPAA / SOC2 / PCI-DSS patterns, hash-chained audit trail, MIT on npm since 2026-07-20. [Project page](/projects/curtis-compliance/). Its pro tier — hosted GitHub App, multi-repo rollup, PDF export — is [exploratory](/projects/curtis-compliance-pro/), source-available, license class still TBD.

And the heritage: the Curtis AI OS monorepo — the federated, MCP-native stack that taught the [OS-not-tool reframe](/posts/curtis-ai-phase-0-os-not-tool/). Shelved, not dead. The agent layer it proved lives on in everything above.

None of the satellites duplicate the core. They extend it: Porter owns the format boundary, curtis-acp owns the editor surface, compliance proves the line works outside Obsidian. That's what an ecosystem is — not a bundle, a set of things that share infrastructure.

## What 2.0.0 carries

2.0.0 is assembled — changelog written, manifest bumped, checkpointed at `9ee96b3` — and lands as the next release. What's in it:

- **Chat import** — bring your history in. Auto-detects official ChatGPT and Claude exports (plain or zipped), `.curt` files, Curtis markdown, generic role-labeled JSON and markdown. Four entry points: palette command, drag-and-drop, double-click a `.curt` in the vault, right-click in the explorer. Idempotent — re-running an import skips what's already there.
- **`.curt`, both ways** — one file, one conversation, full fidelity: ids, token stats, images survive byte-perfect. Export all chats as a zip of `.curt`; Curtis-to-Curtis moves are now a file copy.
- **Fidelity guards** — platform system prompts and orphan tool-output nodes from foreign exports are dropped, so imported history is always safe to re-send to a provider. Documents without a confident user/assistant split are rejected, not guessed.
- **Multi-pane chat** — a second chat as a full-width tab, or an OS popout window. Each pane keeps its own conversation, provider, and model. Titled panes, renameable in place.
- **Memory provenance** — every captured fact records the conversation it came from. Settings shows "learned \<date\> · from \<conversation\>" with a jump button. Replies carry a chip counting the facts that were in context; edited or deleted facts degrade honestly — "since removed" — instead of showing stale text.
- **Session recaps + the Curtis Journal** — `/recap` compresses a chat to two or three terse bullets (worked on / decided / left open) and appends them to an append-only markdown journal in your vault. Curtis only ever appends.
- **Relevance pulse** — open a note that closely matches an indexed past conversation and a quiet "discussed in \<title\> · \<date\>" hint appears. Local-only similarity over the existing vault index — no embedding calls — with a precision floor tuned to stay out of the way.
- **First-run welcome** — new installs get a short panel: what Curtis is, that memory is one editable file, an optional read-my-vault indexing pass with visible progress. Upgrades never see it.
- **Housekeeping** — composer relayout (input on its own line, two-row header on narrow panes), the Meta Muse provider seeded at 1.05M context, every built-in model list re-verified against vendor catalogs on 2026-10-09, and the fact-extraction race fixed (facts follow the conversation the reply was pinned to).

## Why this is the into-2027 release

The v1 post made the durability argument: the plugin's decisions live on a horizon longer than a release cycle. 2.0.0 is that horizon showing up in the changelog.

Import plus `.curt` turns chat history from app data into files you own — readable in fifty years because they're text, movable because they're files, provable because provenance rides along. Memory stopped being a black box: every fact carries its source, every answer shows its inputs. The journal makes the plugin keep its own log, in markdown, in your vault. And the parts that could rot were tended: model seeds re-verified against today's catalogs, RTL mirroring for Obsidian 1.14, minimum version 1.13.

The reframe said models are commodity and integration is the moat. 2.0.0 is the moat work: the importer is an integration layer for every other AI tool's history, and `.curt` is the stable ABI between Curtis surfaces — plugin, Porter, and whatever's next.

## The plan, in public

The [strategy doc](https://github.com/JordanNewell/curtis-ai-chat/blob/master/docs/MONETIZATION.md) lives in the repo, because the strategy is honest:

- The plugin stays free forever. MIT, BYOK, no feature ever paywalled. That's a contract with early users, written down.
- The plugin's job is adoption, not revenue. It's the top of the funnel for a planned Curtis AI line.
- The triggers are adoption signals, not calendar dates. Roughly 500 stars / 2K DAU scopes product #2; roughly 2K stars with real retention commits to it.
- The candidates, in likely shipping order: **Curtis Cloud** (one API key instead of thirty, cross-device sync, hosted memory — opt-in, the plugin stays local-first), then separate surfaces — desktop app, CLI, browser extension. The compliance line already runs the second model: MIT core, source-available pro.

Nothing ships before its signal fires. Until then the work is the plugin, the format, and the surfaces.

There will be more. Still true.

[![The Curtis line release ledger — 1.0.0 shipped, 1.6.0 shipped, 2.0.0 pending](/posts/curtis-line-2-0/hero.png)](/products/curtis-ai-chat/)

If you made it this far, I appreciate it. — JN
