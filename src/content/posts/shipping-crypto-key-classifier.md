---
title: "Shipping crypto-key-classifier: 17 validators, 4 plans, 1 argparse bug caught post-ship"
description: "Built a tool that classifies any crypto-key string and enumerates the cross-chain addresses the same private key unlocks. The Cosmos HRP swap is the headline. Here's how it shipped."
pubDate: 2026-07-17
tags: ["rebuild", "infra", "projects"]
mode: "hobart"
project: "crypto-key-classifier"
kind: "win"
series: ["claude"]
tool: "claude-code"
---

Every crypto recovery has the same moment. Someone hands you a string — a relative with a seed phrase they wrote down wrong, a support ticket at an exchange, a forensic engagement, a custody dispute. You have to figure out what it is. Address or private key? Which chain? Is the checksum valid? And — the question that always comes next — what else does this key unlock?

I'd answered that question badly one too many times. So I wrote the tool. [`crypto-key-classifier`](https://github.com/JordanNewell/crypto-key-classifier) — `classify-key` on the command line, `ckc` if you're pip-installing it. Four days, four plans, four tags. It's public as of today.

## The Cosmos thing

The same Ed25519 private key underlies every Cosmos SDK chain. Decode the bech32 once, swap the human-readable prefix, re-encode: you have a valid address on every chain in the family.

```
$ classify-key cosmos1... --json | jq '.[0].cross_chain_alternates | length'
20
```

Twenty chains, one key. ATOM, OSMO, JUNO, AKT, INJ, EVMOS, STRD, REGEN, XPRT, SCRT, KAVA, CRO, LUNA, BAND, UMEE, STARS, DVPN, LIKE, AXL, CRE. If you've ever recovered an ATOM wallet and wondered whether you also own the OSMO at the matching address — yes. You do. This tool enumerates them.

The same pattern applies to EVM (11 L2s from one address) and the BTC forks (LTC and DOGE from one WIF). That cross-chain re-encoding is the entire reason the tool exists. Everything else is supporting infrastructure.

## Coverage

17 validators, ~50 chains:

| Family | Chains |
|---|---|
| BTC | BTC, LTC, DOGE |
| EVM | ETH + 10 L2s |
| Solana | SOL |
| Cosmos | 20 IBC chains |
| Polkadot | DOT, KSM |
| Cardano / Ripple / Stellar / Tron / Algorand / Tezos / TON / Monero / Sui / Aptos / Near / Kaspa | one each |
| Mnemonics | BIP-39 (12/15/18/21/24) and Electrum (12/13) |

229 tests. Hypothesis fuzz suite that asserts a minimum recovery floor across all of them.

## Four tags in four days

I worked plan by plan. Spec, plan, execute, tag, repeat.

- `v0.1.0-mvp` — BTC + EVM + SOL + Cosmos. The four chains that justify the tool's existence.
- `v0.2.0-long-tail` — 12 more. The long tail of base58, bech32, CRC16, Blake2b.
- `v0.3.0-mnemonic` — BIP-39 wordlist + Levenshtein repair for OCR-corrupted seed phrases.
- `v0.4.0-hardened` — hypothesis property tests, fuzz aggregate, recovery-rate floor.

None of the four took more than a few hours of wall time. The shape of the work — small spec, numbered plan, tag at the end — mattered more than any individual decision inside it.

## The argparse bug that shipped anyway

The day after v0.4.0 I ran `classify-key --help`. It crashed.

```
ValueError: unsupported format character ' ' (0x20) at index 178
```

Argparse interpolates `%` characters in help strings. The string `"filter matches below N%"` had a bare `%` at the end. Argparse read it as a format spec, found no matching character, blew up. `--help` is the one command you really don't want to crash.

The fix was a one-liner — escape `%` as `%%`. I shipped two regression tests alongside it because that bug class will recur the next time someone writes a help string with a percent sign in it. The tests assert (a) `--help` exits 0, and (b) any `%` character in any help string is doubled. If the second test ever fails, the first test will too.

The bug was in the codebase for a full day before I caught it. Every `pytest` run was green. The fuzz suite was happy. The CLI worked for every input I threw at it. But I never ran `--help` until after the tag. Lesson: `--help` is part of the smoke test.

## Use it

If you're staring at a string you don't recognize: `pip install -e .` and start with `classify-key --help`.

If you find a chain the tool doesn't recognize, drop a validator in `src/ckc/validators/` — they auto-discover. If you find a bug, file it. I read issues.

---

*Filed under [/rebuild](/tags/rebuild) and [/projects](/projects). Project page: [crypto-key-classifier](/projects/crypto-key-classifier). Source: [github.com/JordanNewell/crypto-key-classifier](https://github.com/JordanNewell/crypto-key-classifier).*
