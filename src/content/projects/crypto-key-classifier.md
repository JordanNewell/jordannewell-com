---
title: "Crypto Key Classifier"
description: "17 validators covering ~50 chains + BIP-39/Electrum mnemonics. Cosmos HRP swap: one decode → 20 re-encodings. 229 tests."
status: "shipped"
tags: ["projects", "crypto", "oss"]
startDate: 2026-07-09
shipDate: 2026-07-12
repo: "https://github.com/JordanNewell/crypto-key-classifier"
order: 4
facts:
  - k: "shipped"
    v: "2026-07-12"
  - k: "validators"
    v: "17"
  - k: "tests"
    v: "229"
  - k: "license"
    v: "MIT"
highlights:
  - title: "Cosmos HRP swap"
    body: "One decode → 20 re-encodings across Cosmos chains. HRP (human-readable part) is the only thing that changes."
  - title: "BIP-39 + Electrum mnemonics"
    body: "Word-list validation, checksum verification, seed derivation. Corruption-tolerant recovery."
  - title: "229 tests + hypothesis fuzz"
    body: "Property-based fuzzing on top of explicit cases. Argparse % bug regression caught post-ship."
  - title: "4 version tags"
    body: "v0.1.0-mvp → v0.4.0-hardened. Full brainstorm → spec → plan → subagent-execute cycle ×4."
stack:
  - "Python"
  - "pytest"
  - "hypothesis"
---

Born from a question about an old mystery-string-decoder project that no longer existed on disk. Built from scratch via full brainstorm→spec→plan→subagent-execute cycle ×4 plans. 4 version tags (v0.1.0-mvp → v0.4.0-hardened).

**Source:** [github.com/JordanNewell/crypto-key-classifier](https://github.com/JordanNewell/crypto-key-classifier) — MIT, pip-installable, 229 tests, hypothesis fuzz suite.

Argparse `%` bug (bare `%` in help crashed `--help`) caught post-ship, fixed + 2-layer regression test added.
