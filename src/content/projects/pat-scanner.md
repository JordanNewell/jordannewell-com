---
title: "PAT Scanner"
description: "Block credential leaks at chat-time. Claude Code UserPromptSubmit hook that catches 13 PAT classes before they enter the transcript."
status: "shipped"
promotedTo: "/products/token-hunt/"
tags: ["projects", "security", "oss", "claude-code"]
shipDate: 2026-07-27
repo: "https://github.com/JordanNewell/pat-scanner"
liveUrl: "https://github.com/JordanNewell/pat-scanner"
order: 10
facts:
  - k: "shipped"
    v: "2026-07-27"
  - k: "version"
    v: "v0.1.2"
  - k: "classes"
    v: "13 PAT types"
  - k: "form"
    v: "Claude Code plugin"
  - k: "license"
    v: "BUSL-1.1"
highlights:
  - title: "Catches leaks before they happen"
    body: "UserPromptSubmit hook runs before the prompt enters the transcript. If a PAT pattern matches, the prompt is blocked — not redacted after the fact."
  - title: "13 PAT classes"
    body: "GitHub (classic + fine-grained), Anthropic, OpenAI (legacy + project), Stripe, Slack, PyPI, AWS, Figma, Z.ai/Zhipu, generic JWTs, and more. Regex-tuned per provider."
  - title: "Bypass keyword for false positives"
    body: "BYPASS_SECRET_SCAN in the prompt skips the check. Explicit, auditable, not silent."
  - title: "Companion to git-time scanning"
    body: "Pairs with git-hygiene's commit-time hooks (opsec-scan.sh) — chat-time + commit-time coverage. Defense in depth against credential leaks."
stack:
  - "Bash"
  - "jq"
  - "POSIX ERE"
---

Claude Code UserPromptSubmit hook that catches 13 PAT classes at chat-time — before secrets enter the transcript, not after. BUSL-1.1 (converts to MIT 2030). v0.1.0 + v0.1.1 shipped 2026-07-27 with 18/18 tests passing; v0.1.2 current.

## Install

```bash
/plugin marketplace add JordanNewell/pat-scanner
/plugin install pat-scanner
```

Or clone and add locally via `/plugin marketplace add`.

## What it catches

GitHub (`ghp_`-family, `github_pat_`), Anthropic (`sk-ant-`), OpenAI (legacy `T3BlbkFJ` + `sk-proj-`), Stripe (`sk_`/`rk_`/`pk_`), Slack (`xox`-family), PyPI (`pypi-`), AWS (`AKIA`), Figma (`figd_`), Z.ai/Zhipu (`32hex.16alnum`), generic JWTs (`eyJ…`), Natural.com (`ak_ntl_prod_`).

Plus a bypass keyword — `BYPASS_SECRET_SCAN` — for legitimate test fixtures. Audit log at `~/.pat-scanner/audit.log`.

## Why

Eight PAT-in-chat leaks in nine days on this fleet before this shipped. The git-time hook catches them at commit, but the transcript is already polluted by then. PAT Scanner blocks at the source — the prompt never reaches Claude.

## Roadmap

v0.2 — hosted team tier with central logging + policy controls. Targeting $19/seat/mo for small teams that want fleet-wide visibility without self-hosting.
