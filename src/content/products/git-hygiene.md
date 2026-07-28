---
title: "git-hygiene"
tagline: "Tools don't get co-author credit. Local git hooks that strip AI-attribution trailers and catch secrets pre-commit."
description: "Two git hooks (commit-msg, pre-commit) that enforce local commit hygiene: strips Co-Authored-By / Generated with / AI-assisted trailers from commit messages, scans staged files in three layers (regex, gitleaks, OPSEC content). Bash, zero dependencies beyond git. MIT, no telemetry, no SaaS."
status: "released"
shipDate: 2026-07-21
repo: "https://github.com/JordanNewell/git-hygiene"
homepage: "https://github.com/JordanNewell/git-hygiene"
pricing: "free-oss"
license: "MIT"
order: 2
install:
  - label: "Per-user (recommended)"
    kind: "manual"
    href: "https://github.com/JordanNewell/git-hygiene#install"
    detail: "git clone ~/git-hygiene → symlink hooks into ~/.githooks → git config --global core.hooksPath ~/.githooks"
  - label: "Per-repo"
    kind: "manual"
    href: "https://github.com/JordanNewell/git-hygiene#install"
    detail: "git config core.hooksPath /path/to/git-hygiene/hooks"
stats:
  - k: "hooks"
    v: "2"
  - k: "secret-scan layers"
    v: "3"
  - k: "dependencies"
    v: "zero"
  - k: "license"
    v: "MIT"
features:
  - icon: "🪒"
    title: "AI-trailer strip on commit-msg"
    body: "Case-insensitive pattern match removes Co-Authored-By / Generated with / AI-assisted trailers before the commit lands. Catches Claude, Copilot, Cursor, Gemini, ChatGPT, anthropic. Legitimate human co-authors preserved. Prose mentions of Claude Code as a tool are preserved — only trailer-shaped lines are touched."
    docUrl: "https://github.com/JordanNewell/git-hygiene#commit-msg"
  - icon: "🔑"
    title: "Three-layer pre-commit secret scan"
    body: "Layer 1: high-precision regex for known token shapes (AWS AKIA, OpenAI sk-or, GitHub ghp/gho/ghu/ghs/ghr/github_pat, Slack xox[bpe], Bearer, generic key=value assignments). Layer 2: gitleaks if installed (~700 detectors). Layer 3: optional OPSEC content scan against your gitignored .local patterns."
    docUrl: "https://github.com/JordanNewell/git-hygiene#pre-commit"
  - icon: "🛡️"
    title: "OPSEC content scan"
    body: "Sourceable opsec-scan.sh builds a regex from up to three layers: hardcoded baseline (session IDs, Tailscale CGNAT IPs), machine-level (~/.config/opsec-patterns.local), repo-local (./.opsec-patterns.local). Scans added diff lines, not full file contents — unchanged prose with legitimate mentions isn't resurfaced."
    docUrl: "https://github.com/JordanNewell/git-hygiene#opsec-scansh-optional--for-operators-with-internal-infrastructure"
  - icon: "🚫"
    title: "Zero dependencies"
    body: "Bash + grep + awk + git. No Python, no Node, no Ruby, no framework. gitleaks is opt-in — if installed, ~700 extra detectors drop in. If not, the hook prints a one-line warning and falls back to regex-only. Runs on any machine with a POSIX shell."
  - icon: "🔒"
    title: "Local enforcement, no SaaS"
    body: "Hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans, no API key required. The hook doesn't know or care which editor or agent emitted the trailer — it just matches pattern shapes."
  - icon: "🧰"
    title: "Path skipping"
    body: "All three scan layers skip node_modules/, vendor/, third_party/, *.min.js/*.min.css, test[s]/spec/fixtures/__tests__/, example[s]/sample[s]/demo/docs/, *.example/*.sample/*.template/*.dist. Real secrets live in source/config files, not fixtures."
comparison:
  title: "How it compares"
  columns:
    - "git-hygiene"
    - "pre-commit framework"
    - "GitGuardian / TruffleHog"
    - "Claude Code setting"
  rows:
    - label: "Strips AI-attribution trailers"
      cells: ["Yes", "—", "—", "Emits (doesn't strip)"]
    - label: "Secret scan (local, regex)"
      cells: ["Yes", "Plugin-dependent", "—", "—"]
    - label: "Secret scan (gitleaks integration)"
      cells: ["Auto-detect", "Plugin", "Native", "—"]
    - label: "OPSEC content scan (hostnames, handles)"
      cells: ["Yes", "—", "—", "—"]
    - label: "Dependencies"
      cells: ["Bash + grep + awk", "Python", "Service / Go binary", "n/a"]
    - label: "SaaS / cloud calls"
      cells: ["None", "None", "Yes (optional)", "n/a"]
    - label: "Telemetry"
      cells: ["None", "None", "Some", "n/a"]
privacy: "Hooks run entirely locally against staged file contents and the commit message. No network calls, no telemetry, no third-party scans. The OPSEC content scan reads your gitignored .local patterns files (~/.config/opsec-patterns.local and ./.opsec-patterns.local); those files contain your own internal identifiers and are never transmitted anywhere. gitleaks, when installed, runs as a local binary — also no network calls. The hook itself does not phone home for updates, version checks, or anything else."
faq:
  - q: "I already set includeCoAuthoredBy: false in Claude Code. Do I need this?"
    a: "Layered defense — the hook catches what slips through. Editor settings get reverted, agent configs drift, collaborators have different setups. The hook is tool-agnostic: it doesn't care which editor or agent emitted the trailer, just matches pattern shapes. Three independent layers (editor setting, hook, CLAUDE.md/AGENTS.md instruction) each fail open independently."
  - q: "Does the hook modify my commit message body or just trailers?"
    a: "Just trailer-shaped lines. commit-msg runs a case-insensitive pattern match on the standard trailer shapes (Co-Authored-By, Generated with, AI-assisted, noreply@anthropic.com, etc.). Body content referencing Claude Code as a tool ('the Claude Code agent was mangling whitespace') is preserved. Legitimate human co-authors (Co-Authored-By: Jane Doe <jane@example.com>) are preserved."
  - q: "What happens if gitleaks isn't installed?"
    a: "Layer 1 (regex) still runs — high-precision patterns for AWS, OpenAI, GitHub, Slack, Bearer, generic key=value. The hook prints a one-line warning that gitleaks wasn't found and falls back to regex-only. Still safe to commit. Install gitleaks (brew install gitleaks / apt install gitleaks) to enable Layer 2 with ~700 more detectors."
  - q: "Will it block my test fixtures with realistic-looking fake keys?"
    a: "No. Path skipping exempts test[s]/spec/fixtures/__tests__/, example[s]/sample[s]/demo/docs/, *.example/*.sample/*.template/*.dist, node_modules/, vendor/, third_party/, and *.min.js/*.min.css. Real secrets live in source/config files. Fixtures with fake-but-realistic keys (test fixtures often have them for realism) won't trip the gate."
  - q: "Can I opt out per-repo for the OPSEC scan?"
    a: "Yes. git config opsec.scan disable in any repo you want to skip. Accepts disable, off, false, no, 0 (case-insensitive). Lives in .git/config — never accidentally committed. The AI-attribution strip in commit-msg and the secret scan in pre-commit are unaffected; only the OPSEC pattern scan is silenced. Use it for internal-infra repos whose commits never reach a public remote."
  - q: "How is this different from pre-commit framework + gitleaks plugin?"
    a: "Different scope. pre-commit framework is a Python-installed polyglot hook manager — you configure which hooks (gitleaks, black, eslint, etc.) run per-repo via .pre-commit-config.yaml. git-hygiene is two focused hooks (commit-msg + pre-commit) with zero dependencies, installed globally via symlink. AI-trailer stripping is the headline feature no other tool ships. OPSEC content scan is the other. If you already use pre-commit framework, git-hygiene is complementary — install it as your global hooksPath and keep pre-commit per-repo."
  - q: "Why bash instead of Python?"
    a: "Runs on machines without a Python install. The awk is gnarly in places, and the test suite is bash-based. Tradeoff: portability over elegance. The hook is small enough (~300 lines across both files) that bash readability isn't the bottleneck."
  - q: "Can I verify the commits?"
    a: "Yes. The repo follows PGP-signed commits with fingerprint 67567DC5E7C5353F85F2AF0DAC05D3F3E0EFA32A. Run git verify-commit HEAD to confirm. See the SIGNATURE.md file in the repo for the full key and the signature pattern page at jordannewell.com/signature/."
---

## Why this exists

Every repo I worked in over the last two years slowly accumulated `Co-Authored-By: Claude` and `🤖 Generated with Claude Code` trailers in the commit log. Sometimes I forgot to disable the setting. Sometimes a collaborator's setup differed. Sometimes an agent config drifted.

Two things bothered me. The commit history is the one artifact future employers, acquirers, and collaborators read to evaluate how you work — a log full of AI trailers reads as performative, the opposite of how senior operators signal taste. You don't credit DeWalt on the shed you built with their drill. And for regulated industries (defense, finance, health), AI-assisted code is becoming a real disclosure question — a clean history sidesteps it, a dirty one raises it.

So I wrote two hooks. Strip the trailers, catch the secrets, keep the history clean.

## What shipped in v1.0.0

Two git hooks, zero dependencies beyond bash/grep/awk/git. `commit-msg` strips AI-attribution trailers via case-insensitive pattern match. `pre-commit` scans staged files in three layers: high-precision regex (AWS, GitHub, OpenAI, Slack, Bearer, generic key=value), gitleaks if installed (~700 detectors), and an optional OPSEC content scan for machine-level identifiers sourced from gitignored `.local` files.

Layered defense against the same problem from three angles: editor/agent setting, the hook, CLAUDE.md/AGENTS.md instruction. Each layer fails open independently. Belt, suspenders, third belt.
