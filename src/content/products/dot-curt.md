---
title: ".curt"
tagline: "One file, one conversation, kept whole. The open format for AI chat history."
description: "Open single-file format for AI conversations — frozen spec v1, MIT everything, 27 conformance vectors in CI, curt-format on npm."
status: "released"
shipDate: 2026-10-16
repo: "https://github.com/JordanNewell/dot_curt"
homepage: "https://dotcurt.org"
platform:
  name: "npm"
  url: "https://www.npmjs.com/package/curt-format"
install:
  - label: "npm install curt-format"
    kind: "npm"
    href: "https://www.npmjs.com/package/curt-format"
    detail: "serializeCurt, parseCurt, curtFilename — TypeScript, zero dependencies"
pricing: "free-oss"
license: "MIT"
order: 8
stats:
  - k: "spec"
    v: "v1, frozen"
  - k: "conformance vectors"
    v: "27, in CI"
  - k: "extensions"
    v: "5 (2 stable, 3 draft)"
  - k: "license"
    v: "MIT — spec, code, schema, fixtures"
features:
  - title: "Full fidelity or it's not a .curt"
    body: "Base64 images and tool calls ride in content, verbatim. Unknown fields survive a re-save — an app's extras are never a liability. One diffable UTF-8 file per conversation: archives, version control, and grep all just work."
  - title: "Frozen core"
    body: "The spec doesn't move. New capability means a named, versioned, optional registry entry — never an edit to v1. Readers reject extensions they don't know, cleanly and whole. A format that can't break its readers is a format you can build on."
  - title: "Conformance is testable"
    body: "L1 CORE through L4 per-extension — 27 executable vectors, plain fixtures, CI-runnable. \"Compatible\" is a claim you can check, not an adjective."
  - title: "The two-implementation rule"
    body: "An extension goes draft → stable only when two independent implementations round-trip it. One author stamping their own work stable is how formats rot. consensus-receipt needs one more implementation — yours would do it."
comparison:
  title: "How it compares"
  columns:
    - ".curt"
    - "Vendor exports"
    - "Ad-hoc JSON / markdown"
  rows:
    - label: "Images & tool calls"
      cells: ["Verbatim, in-file", "Flattened or dropped", "Varies by author"]
    - label: "Unknown fields on re-save"
      cells: ["Preserved", "N/A — opaque schema", "Usually lost"]
    - label: "Machine-checkable conformance"
      cells: ["27 vectors, CI-runnable", "None", "None"]
    - label: "One file per conversation"
      cells: ["Yes — diffable UTF-8", "One giant archive", "Varies"]
    - label: "License"
      cells: ["MIT — spec, code, schema, fixtures", "Vendor terms", "Varies"]
privacy: "A .curt file is a plain UTF-8 file — there is nothing to telemetry. The reference implementation makes zero network calls: serialize, parse, done."
faq:
  - q: "Why not just export markdown?"
    a: "Markdown is a rendering, not a record. It drops or mangles images, tool calls, usage data, and structure — the parts that make a conversation reusable. .curt keeps all of it, and markdown-from-.curt is a one-liner whenever you want it."
  - q: "Who controls the spec?"
    a: "One maintainer, BDFL — deliberately. The core is frozen at v1, so control is smaller than it sounds: evolution is registry-only, and readers must reject unknown extensions cleanly, so nothing breaks under you."
  - q: "Curtis apps are BUSL — is the format locked too?"
    a: "No, and the split is the point: the format, reference code, schema, and fixtures are MIT. Build a business on .curt. Only Curtis applications themselves are BUSL."
  - q: "How does my app get listed?"
    a: "Implement against curt-format, run the conformance vectors, then PR against capabilities.json in the dot_curt repo: who you are, what you read and write, which extensions, conformance level. It's public and checkable — that's the feature."
---

Your AI history is files, not hostages — [the line is Curtis's](/posts/curtis-line-2-0/), and [.curt](https://dotcurt.org) is where it stops being a slogan. Spec v1 is frozen. [`curt-format@1.2.0`](https://www.npmjs.com/package/curt-format) is on npm, MIT, zero dependencies. Twenty-seven conformance vectors run in CI so "compatible" means something. [Curtis Porter](/posts/curtis-porter-curt-format/) reads the hostile exports — ChatGPT branch trees, Claude content blocks, Grok archives, Gemini Takeout — and writes .curt.

The honest score: six registry entries, one author, zero outside consumers. That's what a launch looks like before it launches. [The spec is here](https://github.com/JordanNewell/dot_curt/blob/main/SPEC.md), the [adopt path is here](https://dotcurt.org/adopt/), and the [launch post](/posts/curt-format-v1/) tells it straight.
