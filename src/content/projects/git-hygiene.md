---
title: "git-hygiene"
description: "A focused set of bash git hooks that keep AI-tool attribution out of commit messages, secrets out of staged files, and operator infrastructure identifiers (hostnames, agent handles, codenames) out of public diffs. No hard dependencies beyond bash, grep, awk, and git — gitleaks drops in for ~700 extra secret detectors."
status: "shipped"
tags: ["projects", "tools", "oss"]
shipDate: 2026-07-18
repo: "https://github.com/JordanNewell/git-hygiene"
order: 6
facts:
  - k: "initial ship"
    v: "2026-07-18"
  - k: "current architecture"
    v: "2026-07-20 (Layer 3 OPSEC scan shipped)"
  - k: "license"
    v: "MIT"
  - k: "deps"
    v: "bash · grep · awk · git (gitleaks optional)"
  - k: "hooks"
    v: "commit-msg · pre-commit · opsec-scan.sh"
  - k: "fleet deploy"
    v: "live on 7/10 hosts"
highlights:
  - title: "Tools don't get co-author credit"
    body: "commit-msg strips Co-Authored-By / Generated with / Written by trailers naming Claude, Copilot, Cursor, Gemini, ChatGPT, and ZCode/GLM variants. Human co-authors preserved. Body prose mentioning tools as tools is preserved — only trailer-shaped patterns are stripped."
  - title: "Three-layer secret defense in pre-commit"
    body: "Layer 1: high-precision regex for AWS / OpenAI / GitHub / Slack / Bearer / generic API key shapes (always on). Layer 2: gitleaks when installed (~700 extra detectors — Stripe live keys, GCP service account JSON, private keys, DB URLs). Layer 3: OPSEC content scan on added lines when a patterns file is present."
  - title: "OPSEC scan catches what regex can't"
    body: "Hostnames, tailnet name, agent handles, codenames — patterns you define once at machine-level (~/.config/opsec-patterns.local, gitignored) or per-repo. Diff-only: unchanged prose with legitimate mentions isn't resurfaced. Per-repo opt-out via `git config opsec.scan=disable` for internal repos."
  - title: "Local enforcement, no SaaS"
    body: "Hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans beyond gitleaks (which is local). Deployed globally across the fleet — 7 of 10 hosts running it via the shared hooks path."
stack:
  - "Bash"
  - "grep"
  - "awk"
  - "git"
  - "gitleaks (optional, Layer 2)"
---

Three positions, held firmly.

1. **AI tools are tools.** Claude, Copilot, Cursor, Gemini, ChatGPT, ZCode — they're how the work gets done, not who did the work. The author is the human; the tool is the tool. You don't credit DeWalt on the shed you built with their drill.
2. **Secrets stay out of git.** API keys, tokens, passwords — pre-commit's regex layer catches the high-precision patterns, gitleaks catches the long tail when installed.
3. **Operator identifiers stay out of public diffs.** The OPSEC scan layer catches hostnames, agent handles, and codenames that credential-shaped regex can't — patterns you define once at machine level, applied to every repo you commit to.
4. **Local enforcement, no SaaS dependency.** The hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans beyond gitleaks (which is itself local).

## Install

Per-user (recommended — applies to every repo you own):

```bash
git clone https://github.com/JordanNewell/git-hygiene.git ~/git-hygiene
mkdir -p ~/.githooks
ln -s ~/git-hygiene/hooks/commit-msg ~/.githooks/commit-msg
ln -s ~/git-hygiene/hooks/pre-commit  ~/.githooks/pre-commit
chmod +x ~/.githooks/*
git config --global core.hooksPath ~/.githooks
```

Live across the fleet — 7 of 10 hosts run it globally. The position became policy on 2026-07-18 and has been hardened three times since: pre-commit gained gitleaks + OPSEC content scan (Layer 2 + Layer 3), the OPSEC pattern library became machine-level, and per-repo opt-out shipped for internal repos.

See the [repo README](https://github.com/JordanNewell/git-hygiene) for the full Layer 1/2/3 breakdown, the OPSEC scan setup recipe, and the layered-defense model (editor setting → hook → CLAUDE.md instruction).
