---
title: "PAT Scanner"
description: "Block credential leaks at chat-time. Claude Code UserPromptSubmit hook that catches 13 PAT classes before they enter the transcript."
status: "shipped"
tags: ["projects", "security", "oss", "claude-code"]
shipDate: 2026-07-27
repo: "https://github.com/JordanNewell/pat-scanner"
liveUrl: "https://github.com/marketplace/pat-scanner"
order: 10
facts:
  - k: "shipped"
    v: "2026-07-27"
  - k: "version"
    v: "v0.1.1"
  - k: "classes"
    v: "13 PAT types"
  - k: "form"
    v: "Claude Code plugin"
  - k: "license"
    v: "MIT"
highlights:
  - title: "Catches leaks before they happen"
    body: "UserPromptSubmit hook runs before the prompt enters the transcript. If a PAT pattern matches, the prompt is blocked — not redacted after the fact."
  - title: "13 PAT classes"
    body: "GitHub, Anthropic, OpenAI, PyPI, npm, Stripe, Slack, Discord, AWS, GCP, Linear, Figma, generic high-entropy secrets. Regex-tuned per provider."
  - title: "Bypass keyword for false positives"
    body: "BYPASS_SECRET_SCAN in the prompt skips the check. Explicit, auditable, not silent."
  - title: "Companion to git-time scanning"
    body: "Pairs with opsec-scan.sh pre-push hook — chat-time + commit-time coverage. Defense in depth against credential leaks."
stack:
  - "Bash"
  - "jq"
  - "POSIX ERE"
---

Claude Code UserPromptSubmit hook that catches 13 PAT classes at chat-time — before secrets enter the transcript, not after. MIT-licensed OSS plugin. v0.1.0 + v0.1.1 shipped 2026-07-27 with 18/18 tests passing.

## Install

```bash
/plugin marketplace add JordanNewell/pat-scanner
/plugin install pat-scanner
```

Or copy `scan-secrets.sh` directly into `~/.claude/hooks/`.

## What it catches

GitHub (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`, `github_pat_`), Anthropic (`sk-ant-`), OpenAI (`sk-`), PyPI (`pypi-`), npm (`npm_`), Stripe (`sk_live_`, `rk_live_`), Slack (`xox`-family), Discord (`MTA`-format bot tokens), AWS (`AKIA`-prefix), GCP (`ya29.`), Linear (`lin_api_`), Figma (`figd_`/`figu_`).

Plus a bypass keyword — `BYPASS_SECRET_SCAN` — for legitimate test fixtures. Audit log at `~/.claude/hooks/scan-secrets.log`.

## Why

Six PAT-in-chat leaks in eight days on this fleet before this shipped. The git-time hook catches them at commit, but the transcript is already polluted by then. PAT Scanner blocks at the source — the prompt never reaches Claude.

## Roadmap

v0.2 — hosted team tier with central logging + policy controls. Targeting $19/seat/mo for small teams that want fleet-wide visibility without self-hosting.
