---
title: "Curtis Audit"
description: "Append-only receipts for AI agent activity in your Obsidian vault. Local-first markdown ledger — every agent action leaves a verifiable trail."
status: "shipped"
tags: ["projects", "ai", "oss", "obsidian"]
shipDate: 2026-10-15
repo: "https://github.com/JordanNewell/curtis-ai-audit"
order: 11
facts:
  - k: "shipped"
    v: "2026-10-15 (v0.3.0)"
  - k: "form"
    v: "Obsidian plugin"
  - k: "tests"
    v: "267"
  - k: "license"
    v: "BUSL-1.1"
highlights:
  - title: "Receipts, not logs"
    body: "Agent activity lands in an append-only local-first markdown ledger. The record is the point — you can prove what the agent did, when, and with what input."
  - title: "Hardened v0.3.0"
    body: "Test suite grew 107 → 267 behind three adversarial verification passes; 21 findings fixed before release. Hardening as a release gate, not a TODO."
stack:
  - "TypeScript"
  - "Obsidian API"
---

Curtis Audit writes append-only receipts for everything an AI agent does in your vault — a local-first markdown ledger you can read, diff, and trust. Part of the Curtis line: Chat, Porter, Audit, CRM.
