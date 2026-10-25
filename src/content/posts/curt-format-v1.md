---
title: "curt-format v1: one file, one conversation, kept whole"
description: "Spec v1 is frozen, curt-format@1.2.0 is on npm under MIT, and 27 conformance vectors run in CI. The format behind Curtis is now a standard with receipts — and zero outside consumers. Here's the pitch and the score."
pubDate: 2026-10-25
tags: ["ai", "oss"]
mode: "hobart"
series: []
kind: "win"
project: "dot-curt"
draft: false
---

Every AI app holds your conversations in its own schema, behind an export button that flattens them. Images downgraded, tool calls dropped, structure mangled. Your work product, stored in a shape you'll never see, at the mercy of whoever built the export.

I keep writing that sentence. [Porter](/posts/curtis-porter-curt-format/) was the answer for reading hostile exports. Curtis made it the storage format. As of this week the format itself is a standard you can build on without asking me for anything.

## What shipped

[.curt](https://dotcurt.org) is one UTF-8 JSON file per conversation. Magic string, version, generator, extension list, then the conversation: id, title, timestamps, messages with roles and content. Base64 images ride in content, verbatim. Tool calls ride in content, verbatim. Anything your app adds that the spec doesn't know about survives a re-save untouched — that's normative, not a courtesy.

Three artifacts:

- **Spec v1, frozen.** The core doesn't move. New capability means a named extension in the registry — versioned, optional, rejected cleanly by readers that don't know it. Never an edit to v1.
- **[`curt-format@1.2.0`](https://www.npmjs.com/package/curt-format) on npm.** TypeScript, zero dependencies, MIT. `serializeCurt`, `parseCurt`, `curtFilename`. Serialize, parse, round-trip — the whole install.
- **27 conformance vectors in CI.** L1 CORE through L4 per-extension, plain fixtures. "Compatible" is a claim you can run, not an adjective on a landing page.

## Two rules

One: the core is frozen. Not "stable", not "mostly settled" — frozen. Expansion happens in the registry or at v2, never by editing v1 under people. Formats die by accretion: every "small" spec edit breaks a reader somewhere, and the readers find out last. Need something the core lacks? Add the field; unknown fields ride along on re-save. It catches on, it graduates to a named extension. If something genuinely can't be an extension, that's v2 — new version number, and every v1 archive on earth still parses.

Two: an extension goes draft → stable only when two independent implementations round-trip it. Six registry entries today, one author. Nothing is stable that I didn't prove against myself — that's the rule working, not an oversight. [consensus-receipt](https://github.com/JordanNewell/dot_curt/blob/main/EXTENSIONS.md) stays draft until someone else implements it.

## The score

Zero outside consumers. Six registry entries, one author. A spec, a library, a test suite, a site — all built in a vacuum, and I'm not going to dress that up. It's the current score, it's public in [capabilities.json](https://github.com/JordanNewell/dot_curt/blob/main/CAPABILITIES.md), and the first outside implementation sets the tone for everything after it.

If you build software where conversations matter — a chat app, an agent runtime, an archive tool — the move is an afternoon. `npm install curt-format`, round-trip a file, run the vectors. The [adopt page](https://dotcurt.org/adopt/) has the path, the [product page is here](/products/dot-curt/), and when you ship, you PR against the registry.

The format is free. The file is yours.
