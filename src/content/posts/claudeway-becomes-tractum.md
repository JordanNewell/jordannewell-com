---
title: "Claudeway is now Tractum — and the signature now covers the evidence"
description: "v0.5.0 renames claudeway to tractum and closes the loop the July release left open: the quorum receipt is the decision, the .curt transcript is the evidence, and one signature now covers both."
pubDate: 2026-10-17
tags: ["projects", "ai", "oss"]
mode: "hobart"
kind: "win"
project: "tractum"
series: ["claude"]
tool: "claude-code"
draft: false
ogImage: "/posts/claudeway-becomes-tractum/hero.webp"
---

![Tractum — the signature now covers the evidence.](/posts/claudeway-becomes-tractum/hero.webp)

In July I shipped Claudeway: multi-agent consensus with cryptographic receipts, post-quantum signing from day one, one live receipt on four Nostr relays. Today v0.5.0 lands under a new name — **tractum** — and ships the thing the name was always pointing at: the signed chain from evidence to decision. `pip install tractum`. The site is [tractum.dev](https://tractum.dev).

## The name

Claudeway was always the wrong name. It said Claude; the layer underneath isn't Claude-specific and never was — the MCP server reaches any MCP-aware agent, and the adapters wrap CrewAI, LangGraph, and Microsoft Agent Framework. A consensus primitive named after one model vendor dates itself the day someone runs it against something else.

*Tractum* is Latin: "a drawing together" — the root of contract and treaty. That is the product. Agents drawn together into one signed agreement.

The rename economics worked out because of a decision made in July: the `claudeway` name never shipped to PyPI (v0.2.0–v0.4.0 were GitHub-only), so the rename cost a grep, not a migration. `pip install tractum` just works, first try.

One deliberate fossil: the wire-format type tags are unchanged. Receipts still carry `claudeway.consensus.v1`/`v2`, `claudeway.agent-statement.v1`, and the `claudeway.receipt.v1` envelope, and the verifier accepts them forever. Receipts published in July still verify under v0.5.0. Artifacts don't get rewritten because branding did.

## Decision + evidence, one signature

The gap the July release left open: a receipt attested the answer, but not the transcripts it was computed from. A quorum receipt without its evidence is a verdict with no case file.

v0.5.0 ships **.curt linkage** and closes it:

- `build_curt_transcript` renders a consensus result as a conforming .curt v1 document, with per-message agent provenance via the `agent-context` extension
- `link_receipt` embeds the transcript refs — `{id, sha256}` — *inside* the signed payload, so the aggregate signature covers the linkage itself; you can't swap the evidence under a valid receipt
- `emit_curt_decision` emits receipt + evidence as one .curt artifact (the `consensus-receipt` extension)
- `verify_curt_link` verifies the whole chain through the existing crypto paths — operator key, per-agent keys, quorum, and now the hash binding

Unlinked payloads stay byte-identical to the 0.4.0 wire format. Linkage is additive or nothing.

The bug worth quoting from the build: .curt message ids used only the first 12 characters of the content-addressed conversation id. Two transcripts whose ids shared leading digest characters — about 1 in 256 — collided when merged into a decision artifact, and `emit_curt_decision` silently dropped the evidence. A signed receipt pointing at evidence that quietly isn't there is worse than no receipt at all: it's a verdict with the case file missing and no one the wiser. Ids now embed the full conversation id, with a regression test. The suite is 197 tests.

## The MCP server can't pretend

The MCP server got hardened in three directions, all the same instinct — the tool must never produce something less than it appears:

- **`reach_consensus` always signs.** No configured operator key? It signs with a fresh ephemeral keypair and tells you so — the public key rides in the response, `metadata.operator_key: "ephemeral"` marks the mode. v0.4.x returned an unsigned receipt that `verify_consensus` would then reject. Dead end removed.
- **`TRACTUM_REQUIRE_PINNED_KEY=1`** for deployments that must never ship an ephemeral-signed receipt: without a configured signing key, the call fails loudly instead of signing with a throwaway key.
- **Dry-run mode** (`TRACTUM_MCP_DRY_RUN=1`, or `"dry_run": true` per call) runs deterministic offline stub agents — real per-agent keypairs, real statement signatures, zero API calls — and the receipt self-identifies as a dry run so it can never pass for a live decision.

## What shipped

v0.5.0 on [PyPI as `tractum`](https://pypi.org/project/tractum/): the rename, .curt linkage, MCP signing + dry-run hardening. 197 tests green. The docs moved to [jordannewell.github.io/tractum](https://jordannewell.github.io/tractum/), the MCP demo is a five-minute path (`docs/mcp-demo.md`), and the [no-code relay receipt from July](https://nostr.mom/e/3974ebfe688f1639a8534b46bbbfeddf354d18efcd190352da877756d1bac60b) still verifies — different name, same signatures.

The thesis hasn't moved since July: agent coordination records are long-lived artifacts, EU AI Act enforcement is live, and provenance is either born signed or it's hearsay. What changed is that the chain is complete. Signed evidence (.curt) → signed agreement (quorum receipt) → one artifact an auditor can verify end to end.

## The rule

**A receipt without its evidence is a verdict without a transcript.**

Decisions that matter need both, born signed, in one artifact. That's the whole product.

---
*Filed under [/projects](/projects) and [/ai](/tags/ai). Product page: [Tractum](/products/tractum). Source: [github.com/JordanNewell/tractum](https://github.com/JordanNewell/tractum). Site: [tractum.dev](https://tractum.dev). Previous: [Shipping Claudeway](/posts/claudeway-signed-transcripts).*
