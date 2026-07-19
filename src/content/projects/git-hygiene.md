---
title: "git-hygiene"
description: "Two git hooks that keep AI-tool attribution out of commit messages and secrets out of staged files. No dependencies beyond bash, grep, awk, and git itself."
status: "shipped"
tags: ["projects", "tools", "oss"]
shipDate: 2026-07-18
repo: "https://github.com/JordanNewell/git-hygiene"
order: 6
facts:
  - k: "shipped"
    v: "2026-07-18"
  - k: "license"
    v: "MIT"
  - k: "deps"
    v: "bash · grep · awk"
  - k: "hooks"
    v: "commit-msg · pre-commit"
highlights:
  - title: "Tools don't get co-author credit"
    body: "commit-msg strips Co-Authored-By / Generated with / Written by trailers naming Claude, Copilot, Cursor, Gemini, ChatGPT. Human co-authors preserved."
  - title: "Secrets stay out of git"
    body: "pre-commit scans for AWS / OpenAI / GitHub / Slack / Bearer / generic API key patterns. Skips node_modules and minified files."
  - title: "Local enforcement, no SaaS"
    body: "Hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans. Optional TruffleHog when available."
stack:
  - "Bash"
  - "grep"
  - "awk"
  - "git"
  - "TruffleHog (optional)"
---

Three positions, held firmly.

1. **AI tools are tools.** Claude, Copilot, Cursor, Gemini, ChatGPT — they're how the work gets done, not who did the work. The author is the human; the tool is the tool. You don't credit DeWalt on the shed you built with their drill.
2. **Secrets stay out of git.** API keys, tokens, passwords — pre-commit catches the high-precision patterns before they land in your object store.
3. **Local enforcement, no SaaS dependency.** The hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans.

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

Deployed across the fleet — every machine I develop on runs these hooks globally. The position became policy on 2026-07-18.
