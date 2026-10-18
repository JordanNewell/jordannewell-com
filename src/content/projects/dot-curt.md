---
title: ".curt"
description: "The open single-file AI conversation format — spec, reference implementation, and JSON Schema. One file carries the whole session: messages, tool calls, receipts."
status: "shipped"
tags: ["projects", "ai", "oss", "standards"]
shipDate: 2026-10-16
startDate: 2026-10-11
repo: "https://github.com/JordanNewell/dot_curt"
pkg: "https://www.npmjs.com/package/curt-format"
order: 13
facts:
  - k: "shipped"
    v: "2026-10-16 (curt-format 1.2.0)"
  - k: "conformance"
    v: "L1–L4, 27 vectors"
  - k: "form"
    v: "spec + reference impl"
  - k: "license"
    v: "open spec"
highlights:
  - title: "One file, whole session"
    body: "Messages, tool calls, and receipts in a single portable file. Scrubbed against vCon and PAM — the format inherits the compliance surface instead of inventing its own."
  - title: "Conformance you can test against"
    body: "Four conformance levels with 27 vectors. A writer either conforms or doesn't — no dialect soup."
  - title: "First consumer shipped"
    body: "WrangleBot emits .curt for every supervised agent session — the standard's first consumer beyond Curtis itself."
stack:
  - "JSON Schema"
  - "TypeScript"
---

.curt is the open single-file format for AI conversations — spec, reference implementation, and JSON Schema. Chats, receipts, and deals as files you own. Curtis writes it, Porter ports it, Audit receipts it, [WrangleBot](/products/wranglebot/) emits it.
