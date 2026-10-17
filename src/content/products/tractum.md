---
title: "Tractum"
tagline: "Your agents already vote. Nobody kept the ballots."
description: "Tractum makes multi-agent decisions verifiable: every agent signs its own stance, the result ships as a k-of-n signed receipt anyone can verify, and the .curt transcripts it was computed from are bound inside the same signature."
status: "released"
shipDate: 2026-10-17
repo: "https://github.com/JordanNewell/tractum"
homepage: "https://tractum.dev"
logo: "/products/tractum/logo.png"
ogImage: "/products/tractum/og.png"
platform:
  name: "Python 3.11+"
  url: "https://pypi.org/project/tractum/"
install:
  - label: "pip install tractum"
    kind: "pip"
    href: "https://pypi.org/project/tractum/"
    detail: "Extras: [mcp] [nostr] [pq] [langgraph] [maf] [crewai]"
pricing: "free"
license: "BUSL-1.1"
order: 6
stats:
  - k: "form"
    v: "Python SDK + MCP server"
  - k: "receipts"
    v: "k-of-n signed quorum"
  - k: "signatures"
    v: "Ed25519 · ML-DSA-65"
  - k: "transports"
    v: "JSON · W3C VC · Nostr NIP-78"
features:
  - title: "Every agent signs its own stance"
    body: "A Tractum receipt is a k-of-n multi-sig over machine judgment, not one operator's claim about what the agents said. Each statement carries its own signature over the answer, confidence, model, role, and task — and verify_receipt_detailed counts them, cross-checks each against the response it claims to attest, and catches key substitution when you pin per-agent keys."
  - title: "Decision and evidence, one signature"
    body: "The quorum receipt is the decision; the .curt transcript is the evidence. link_receipt embeds the transcript hashes inside the signed payload, so the aggregate signature covers the linkage — the evidence can't be swapped under a valid receipt. One artifact, verifiable end to end."
  - title: "Any agent can call it"
    body: "No framework to adopt. The MCP server exposes reach_consensus and verify_consensus to Claude Code, Cursor, Goose — one tool call gets a signed agreement, and the verifier answers statement-by-statement. Adapters for CrewAI, LangGraph, and Microsoft Agent Framework wrap the crews that already exist."
faq:
  - q: "Wasn't this called Claudeway?"
    a: "Yes — renamed in v0.5.0 (2026-10-17). The wire-format type tags are unchanged and the verifier accepts them forever: receipts published under the old name still verify."
  - q: "Why not just use LangGraph or CrewAI?"
    a: "They coordinate; Tractum agrees. Frameworks run the agents. Tractum produces what none of them do: per-agent signed, quorum-verifiable artifacts you can hand to an auditor, a regulator, or a future teammate — with adapters that drop into those frameworks."
  - q: "Why post-quantum signatures?"
    a: "An Ed25519 signature is 64 bytes; ML-DSA-65 (FIPS 204, NIST level 3) is ~3.3KB. Bytes are cheap; an attestation that stops being evidence the day a cryptographically relevant quantum computer lands is not. Sign big on day one — retrofit after the fact costs the whole archive."
privacy: "Your prompts and answers go to exactly one place: the model provider you configure. Nothing else leaves the process. Receipts sign canonical payloads — answer, confidence, model, role, task — and verification is local. The Nostr transport is opt-in: when you publish, you publish exactly the signed receipt you chose to emit."
---

Frameworks coordinate. Tractum agrees — on the record.

[Tractum](https://tractum.dev) makes multi-agent decisions verifiable: three specialists debate, each signs its own stance, and the result ships as a k-of-n signed receipt anyone can verify — with the .curt transcripts it was computed from bound inside the same signature. Signed evidence, signed agreement, one artifact. Install with `pip install tractum` and get a signed receipt from any MCP-aware agent in five minutes.
