---
title: "Tractum"
description: "Verifiable multi-agent consensus. Every agent signs its own stance, decisions ship as k-of-n signed quorum receipts, and the .curt transcripts they were computed from are bound inside the same signature. Formerly claudeway."
status: "active"
tags: ["projects", "ai", "oss", "agents"]
startDate: 2026-02-07
shipDate: 2026-07-26
repo: "https://github.com/JordanNewell/tractum"
liveUrl: "https://tractum.dev"
pkg: "https://pypi.org/project/tractum/"
order: 11
facts:
  - k: "current"
    v: "v0.5.0 2026-10-17"
  - k: "form"
    v: "Python SDK + MCP server"
  - k: "receipts"
    v: "k-of-n signed quorum"
  - k: "signatures"
    v: "Ed25519 · ML-DSA-65"
  - k: "transports"
    v: "JSON · W3C VC · Nostr NIP-78"
  - k: "license"
    v: "BUSL-1.1 (MIT 2030)"
highlights:
  - title: "Per-agent multi-sig"
    body: "Each agent signs its own stance — answer, confidence, model, role, task. The receipt is a k-of-n quorum over machine judgment, not one operator's claim, and verify_receipt_detailed counts it statement by statement."
  - title: "Decision + evidence, one signature"
    body: "The quorum receipt is the decision; the .curt transcript is the evidence. The transcript hashes live inside the signed payload, so the evidence can't be swapped under a valid receipt."
  - title: "Post-quantum from day one"
    body: "ML-DSA-65 (FIPS 204, NIST level 3) alongside Ed25519, same receipt, same canonical hash. Attestations built to stay verifiable across the transition to cryptographically relevant quantum hardware."
  - title: "Any agent can call it"
    body: "The MCP server exposes reach_consensus and verify_consensus to any MCP-aware agent — Claude Code, Cursor, Goose. Adapters for CrewAI, LangGraph, and Microsoft Agent Framework wrap the crews that already exist."
stack:
  - "Python 3.11+"
  - "Ed25519 · ML-DSA-65 (FIPS 204)"
  - "MCP"
  - "Nostr (NIP-01, NIP-78)"
---

Frameworks coordinate. Tractum agrees — on the record. Three specialists debate, **each signs its own stance**, and the result ships as a k-of-n signed receipt anyone can verify, with the .curt transcripts it was computed from bound inside the same signature.

First shipped 2026-07-26 as Claudeway; renamed and re-scoped in v0.5.0 (2026-10-17), which added .curt linkage — signed evidence (.curt) → signed agreement (quorum receipt) → one artifact an auditor can verify end to end. The wire-format type tags are unchanged since v0.2.0 and the verifier accepts them forever: receipts published under the old name still verify.

## Why signatures

Agent output already decides things — merges, purchases, incident response. The record of how a decision was reached is either born signed or it's hearsay. EU AI Act enforcement is live (Art. 12/50): tamper-evident agent audit trails are a legal requirement, not a nice-to-have.

## Verify one right now

A real consensus receipt, BIP-340 signed, live on four public relays since July: [nostr.mom/e/3974ebfe…](https://nostr.mom/e/3974ebfe688f1639a8534b46bbbfeddf354d18efcd190352da877756d1bac60b). `nak verify` is one command.
