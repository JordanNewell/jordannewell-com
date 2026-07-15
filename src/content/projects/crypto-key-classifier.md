---
title: "Crypto Key Classifier"
description: "17 validators covering ~40 chains + BIP-39 mnemonics. Cosmos HRP swap: one decode → 19 re-encodings. 229 tests."
status: "shipped"
tags: ["projects", "crypto"]
startDate: 2026-07-09
shipDate: 2026-07-12
order: 4
---

Born from a question about an old mystery-string-decoder project that no longer existed on disk. Built from scratch via full brainstorm→spec→plan→subagent-execute cycle ×4 plans. 4 version tags (v0.1.0-mvp → v0.4.0-hardened).

Argparse `%` bug (bare `%` in help crashed `--help`) caught post-ship, fixed + 2-layer regression test added.
