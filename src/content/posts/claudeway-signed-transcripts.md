---
title: "Shipping Claudeway: 140 tests, post-quantum receipts, one consensus live on four Nostr relays"
description: "Claudeway ships multi-agent consensus as signed Nostr events, with an ML-DSA-65 post-quantum backend from day one. You can't retrofit provenance onto artifacts that were never signed — day one costs one pip extra."
pubDate: 2026-07-26
tags: ["projects", "ai", "oss"]
mode: "hobart"
kind: "win"
project: "claudeway"
series: ["claude"]
tool: "claude-code"
draft: false
---

Claudeway shipped 2026-07-26: multi-agent consensus with cryptographic receipts, on PyPI, with a post-quantum signature backend from the first release. The thesis underneath it is one line. Agent transcripts and consensus rounds are long-lived, high-value artifacts, and every one of them signed with secp256k1 today is forgeable the day a cryptographically relevant quantum computer lands. Post-quantum signing on day one costs one pip extra. Retrofit after the fact costs the whole archive.

Numbers from the ship tag: 140 tests green. Eleven commits to get the wheel onto PyPI. One consensus receipt — Nostr event `3974ebfe…` — live on four public relays, verifiable in any browser right now.

## The receipt

Claudeway's unit of output is not text, it's a ConsensusReceipt: the final answer, the agents, the agreement score, canonicalized to JSON and hashed. A swappable SignatureBackend signs that hash. Ed25519 is the default; `pip install claudeway[pq]` swaps in ML-DSA-65 and the receipt self-tags `algorithm="mldsa65"`, so a verifier always knows which scheme it is checking. The same receipt renders three ways — plain JSON, a W3C Verifiable Credential, or a Nostr NIP-78 event.

Three ways in. A Python SDK, where a swarm of specialists debates and the disagreement is surfaced rather than averaged away. An MCP server — `claudeway-mcp`, tools `reach_consensus` and `verify_consensus` — so any MCP-aware agent gains consensus without adopting a framework. And adapters for CrewAI, LangGraph, and Microsoft Agent Framework, for the crews that already exist.

## Why Nostr

Nostr gives the receipt a wire for free. NIP-01 defines the event serialization, kind 30078 (NIP-78) is the addressable namespace for application data, and the relay network re-serves events to anyone, indefinitely, with npub identity baked in. A consensus artifact on relays is verifiable by parties who were never in the room: auditors, counterparties, future teammates.

The evidence trail is published, and layer one of it is a bug worth quoting. The Nostr signing path originally called `coincurve.schnorr_sign` — an API that has never existed in any released coincurve. Dead code, zero signatures, green tests around it. The fix routes through `PrivateKey.sign_schnorr` and matches BIP-340 spec test vector 0 exactly:

```
sig expected: e907831f80848d1069a5371b402410364bdf1c5f8307b0084c55f1ce2dca821525f66a4a85ea8b71e482a74f382d2ce5ebeee8fdb2172f477df4900d310536c0
sig actual:   e907831f80848d1069a5371b402410364bdf1c5f8307b0084c55f1ce2dca821525f66a4a85ea8b71e482a74f382d2ce5ebeee8fdb2172f477df4900d310536c0
sig match:    True
```

The produced event verifies under `nak`, the reference Nostr CLI — silent, exit 0. Then the live artifact: three agents debated "what's the missing primitive for agent agreement?", signed the result, and published it. It sits at [nostr.mom/e/3974ebfe…](https://nostr.mom/e/3974ebfe688f1639a8534b46bbbfeddf354d18efcd190352da877756d1bac60b) on `wss://nos.lol`, `wss://offchain.pub`, `wss://relay.primal.net`, `wss://nostr.mom`. `nak verify` is one command. Steal it.

## Why ML-DSA now

The economics are lopsided in favor of signing big. An Ed25519 signature is 64 bytes; an ML-DSA-65 signature is ~3.3KB with ~2KB public keys — FIPS 204, NIST level 3, lattice-based. Fifty times the bytes, and bytes have never been cheaper. What costs real money is an attestation that stops being evidence fifteen years early.

Agent coordination records have that horizon. The repo's own docstring names the use cases — M&A diligence records, audit logs — attestations that must stay verifiable across the transition to cryptographically relevant quantum hardware.

One layer split, stated honestly: the Nostr envelope itself is BIP-340 Schnorr over secp256k1 — classical, like every envelope on the network today. The post-quantum signature sits on the payload inside the envelope. When the envelope's crypto ages out, the receipt re-wraps into a newer transport; the attestation never depended on the wrapper.

Retrofit runs the other direction, and it loses. To backfill provenance you need archives you still control, on machines you still trust, with keys you can still prove — and even then you're signing a claim about history, not history. Signing correctly the first time skips all of it.

## What shipped

The repo's first commit is dated 2026-02-07 — a platform implementation with a Next.js dashboard. What went public is the rework: 2026-07-24, squashed to a clean v0.2.0 (SDK, signed receipts, MCP server, real-relay round-trip); 2026-07-25, v0.3.0 (framework adapters, the ML-DSA-65 backend, an RFC 6962-style transparency log anchored to Nostr, an adversarial security suite, the docs site); 2026-07-26, on PyPI as v0.3.2. One hundred sixty-nine days from inception to package index. Three days from rework to package index.

The adversarial suite is 20 tests across 7 attack classes, with the threat model published alongside it. The blind-judge benchmark — Claudeway vs single Claude vs CrewAI, Mann-Whitney U — scores Claudeway +7/20 over one Claude and +5/20 over a CrewAI crew. Four base dependencies, MIT, Python 3.11+.

Eleven of the ship-day commits fought PyPI, not cryptography: twine 403s, a Metadata 2.4 pin, an OIDC-versus-token flip, ending in "PyPI publish verified working." The signatures verified on the first relay round-trip. The packaging took eleven tries.

## What's next

The roadmap in the repo: an A2A (agent-to-agent) protocol adapter, a W3C VC presentation-exchange flow, and a single-tenant runner. Multi-tenancy and billing stay deferred until demand exists — the README calls it the Curtis lesson: don't build before there's demand.

This is the August 2025 [OS-not-tool reframe](/posts/curtis-ai-phase-0-os-not-tool) with a keypair. The integration layer was always the asset; now the asset is signed.

## The rule

**An unsigned consensus is a rumor with a model name attached.**

Agent output already decides things — merges, purchases, incident response. The record of how a decision was reached is either born signed or it's hearsay. Claudeway makes it born signed, on a wire anyone can read.

The receipts are on four relays right now. Verify one.

If you made it this far, I appreciate it. — JN

---
*Filed under [/projects](/projects) and [/ai](/tags/ai). Project page: [Claudeway](/projects/claudeway). Source: [github.com/JordanNewell/claudeway](https://github.com/JordanNewell/claudeway). Docs: [jordannewell.github.io/claudeway](https://jordannewell.github.io/claudeway/).*
