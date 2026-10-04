---
title: "Claudeway"
description: "Verifiable multi-agent consensus for Claude. The coordination layer frameworks punted on — Nostr-native event signing, post-quantum (ML-DSA) signatures, MCP server."
status: "active"
tags: ["projects", "ai", "oss", "agents"]
shipDate: 2026-07-26
repo: "https://github.com/JordanNewell/claudeway"
liveUrl: "https://jordannewell.github.io/claudeway/"
order: 11
facts:
  - k: "shipped"
    v: "v0.3.2 2026-07-26"
  - k: "form"
    v: "Python library + MCP server"
  - k: "transport"
    v: "Nostr"
  - k: "signatures"
    v: "ML-DSA (post-quantum)"
  - k: "license"
    v: "MIT"
highlights:
  - title: "Verifiable consensus"
    body: "Every agent message is a signed Nostr event. Cryptographic provenance — who said what, when, with what key."
  - title: "Post-quantum signatures"
    body: "ML-DSA (FIPS 204) signatures alongside standard Nostr secp256k1. Built for the next decade, not the last one."
  - title: "MCP server included"
    body: "Drop Claudeway into any MCP-aware agent (Claude Code, Cursor, etc.) as a coordination layer — no framework lock-in."
  - title: "Framework-agnostic"
    body: "Works with CrewAI, LangGraph, plain Claude. Adds the verification + coordination layer those frameworks punted on."
stack:
  - "Python"
  - "Nostr (NIP-01, NIP-19)"
  - "ML-DSA (post-quantum signatures)"
  - "MCP"
---

Multi-agent consensus for Claude with cryptographic provenance. Every agent message is a signed, verifiable Nostr event — who said what, when, with what key. The coordination layer that CrewAI / LangGraph / etc. punted on.

First public release, v0.3.2, shipped 2026-07-26. Includes a Python library + MCP server so any MCP-aware agent (Claude Code, Cursor) can use it without framework lock-in.

## Why Nostr

Nostr gives us a battle-tested event format, decentralized relay network, and identity (npub) model for free. We add ML-DSA post-quantum signatures alongside the standard secp256k1 — quantum-resistant provenance on top of a verified transport.

## Why post-quantum now

Agent transcripts are high-value, long-lived artifacts. Anything signed today with secp256k1 is forgeable the day a cryptographically relevant quantum computer lands. ML-DSA (NIST FIPS 204) is the standard; we ship it from day one.

## Live

Try it at [jordannewell.github.io/claudeway/](https://jordannewell.github.io/claudeway/) — Nostr event explorer with verified Claudeway consensus events.
