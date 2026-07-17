---
title: "One decode, nineteen re-encodings: the crypto key classifier I shipped from a dead project's ghost"
description: "Seventeen validators covering ~40 chains plus BIP-39 mnemonics, with a Cosmos HRP swap that turns one bech32 decode into nineteen valid re-encodings. 229 tests. Four version tags. Built from scratch because the original project was gone."
pubDate: 2026-07-17
tags: ["rebuild"]
mode: "hobart"
series: ["claude"]
tool: "claude-code"
era: "2026-fleet"
session: "Sxxx"
kind: "win"
draft: false
---

> The original project was gone. No disk, no git history, no backup. What survived was the description: "a crypto script where we took random strings and deciphered if they were btc, eth, or sol keys." I rebuilt it from scratch. Four version tags later, the rebuild is sharper than the original would have been.

## What it is

A CLI that takes any plausible crypto-key string and tells you what it is — across roughly forty chains, with aggressive recovery from formatting noise, bad checksums, wrong encodings, and OCR corruption.

Seventeen validators. The headline chains:

- **BTC family** (BTC, LTC, DOGE, BCH) — cross-encodes via version byte swap
- **EVM** (ETH plus ten L2s) — EIP-55 checksum
- **Cosmos** (twenty IBC chains) — one decode, nineteen re-encodings via HRP swap
- **Long tail** — Tron, Ripple, Algorand, Tezos, Polkadot, Stellar, TON, Cardano, Monero, Kaspa, Sui, Aptos, Near

Plus BIP-39 mnemonic recovery: 12/15/18/21/24-word seeds with Levenshtein word repair. Type `abondon` instead of `abandon` and the classifier corrects it before validating.

229 tests across 34 files. Zero network calls — pure local, no telemetry, no key material leaves the process.

## Why I built it

I described the original to a collaborator as "a crypto script we worked on where we took random strings and deciphered if they were btc eth or sol etc keys." Search of the projects directory, the session logs, the file history, the editor workspace storage turned up nothing. The original was gone — likely a stale workspace reference to a drive that isn't mounted anymore.

Two options at that point. Shrug and move on, or rebuild it sharper. The original was a loose script. The rebuild is a packaged, tested, tagged CLI with a five-stage repair pipeline and a confidence score for fuzzy matches. Losing the source turned out to be the forcing function.

## What makes it interesting

The Cosmos HRP swap.

Cosmos uses bech32 with a Human-Readable Part (HRP) prefix that identifies the chain: `cosmos`, `osmo`, `juno`, `akash`, `kava`, and so on. The prefix is part of the bech32 envelope. The payload inside — the 20-byte decoded address — is identical across every chain in the IBC ecosystem that shares the same address format.

Most classifiers look at a `cosmos1...` string and tell you it's a Cosmos address. That's the obvious answer. The interesting answer is: it's also a valid `osmo1...`, `juno1...`, `akash1...` — nineteen more addresses, one per IBC chain sharing the format, all reachable by re-encoding the same decoded payload with a different HRP.

```text
Input:  cosmos1qqqsyqcyq5rqwzqfpg9scrgwpugpzysnrk363e
Decode: 20-byte payload
Output: 20 valid addresses — cosmos, osmo, juno, akash, kava,
        secret, cerberus, bitcanna, comdex, emoney, ...
```

One decode, nineteen re-encodings. Same trick works for BTC forks (swap the version byte, re-encode in base58check). The classifier enumerates them in the output, masked by default.

The second interesting feature is fuzzy recovery. Most secret scanners — TruffleHog, Gitleaks — match the clean case. The classifier handles the dirty cases that real-world key material arrives in: whitespace-mangled, OCR-corrupted, wrong-case, embedded in prose. A five-stage repair pipeline with a hard cap of fifty candidates per input tries each transformation, breaks on first valid within a validator's candidate loop. Confidence score (nine tiers, 100 down to 10) tells you how much to trust a fuzzy match. Solana can't checksum, so SOL caps at 50. Checksum-failed is 40. Charset-only is 20. No industry standard exists for this scoring. I designed my own.

## How it shipped

Four version tags, each its own brainstorm → spec → plan → subagent-execute cycle.

| Tag | Scope |
|---|---|
| `v0.1.0-mvp` | BTC, EVM, Solana, Cosmos — the four headline families |
| `v0.2.0-long-tail` | Twelve more validators: Tron through Near |
| `v0.3.0-mnemonic` | BIP-39 wordlist, Levenshtein word repair, Electrum heuristic |
| `v0.4.0-hardened` | Property tests, fuzz harness, masking audit |

The subagent dispatch pattern: give the implementing agent the full task text inline, with context (environment quirks, what's already done, what helpers exist), a self-review checklist, and the exact commit message. No pointer-to-plan-file. The agent reads the task, writes the code, runs the tests, commits. Review at the end of each plan, not per task. Fourteen tasks in a plan is a long day if you gate each one on human review; in auto mode it's a couple of hours.

The argparse `%` bug shipped anyway. `--help` crashed with `ValueError: incomplete format` because one help string had a bare `%` (`"filter matches below N%"`). Argparse does printf-style substitution on help text. Tests didn't catch it because tests call `main()` with args, not `--help`. Fixed in one commit, then added a two-layer regression: subprocess `--help` smoke test plus an AST-based lint that uses Python's own `%` operator as the oracle.

Real bug caught in final review: ETH private key cross-chain alternates were leaking the key ten times in default output. The masking covered the primary match but not the alternates list. Fixed at the reporter layer — when the key type is private, the alternates mask too.

## What I learned

Test discipline compounds. The first plan had unit tests. The fourth plan added property tests with Hypothesis — generate valid keys per chain, mutate them (whitespace, case, truncation, OCR swap), assert the classifier recovers. The property tests caught the preprocessor bug that stripped all whitespace and broke mnemonic recovery. The fuzz harness caught the argparse bug that the unit tests couldn't reach. By `v0.4.0-hardened`, the test suite was finding bugs the implementer couldn't.

Spec bugs caught by implementers are cheaper than spec bugs caught by users. Three of them: a Tron base58 test vector contained an `I` (not in the base58 alphabet); the TON regex expected forty-five chars after the prefix when the real count is forty-six; the Polkadot regex range `{45,48}` was wrong, real max is forty-nine. Each one was the implementer pushing back on the spec with evidence. Each one would have shipped as a false negative otherwise.

The process is the feature. Brainstorm, write spec, write plan, dispatch subagents, review. The classifier is the artifact. The discipline is the product.

---

*Filed under [/rebuild](/tags/rebuild). Repo is public — ship log in the commit history.*
