---
title: "TokenHunt"
tagline: "Finds the secrets your AI agents leak — before someone else does."
description: "A hook-based secret scanner for the agentic workflow: 48 credential rules across 53 provider families, six hook surfaces with block-and-rotate, and a runtime detector for the leak class regex can't see. Zero cloud, zero telemetry."
status: "released"
shipDate: 2026-10-15
repo: "https://github.com/JordanNewell/token-hunt"
homepage: "https://tokenhunt.dev"
logo: "/products/token-hunt/token-hunt-logo.svg"
platform:
  name: "PyPI"
  url: "https://pypi.org/project/token-hunt/"
install:
  - label: "pip install token-hunt"
    kind: "pip"
    href: "https://pypi.org/project/token-hunt/"
    detail: "Standalone CLI; also a Claude Code plugin (JordanNewell marketplace)"
pricing: "freemium"
license: "BUSL-1.1"
order: 4
ogImage: "/products/token-hunt/og.png"
stats:
  - k: "credential rules"
    v: "48"
  - k: "provider families"
    v: "53"
  - k: "hook surfaces"
    v: "6"
features:
  - title: "The blind spot git-time tools don't watch"
    body: "gitleaks, trufflehog, ggshield — they scan git history. By commit time your key has been sitting in an agent transcript for thirty minutes: indexed, synced, possibly re-emitted in later tool calls. TokenHunt fires when you paste, when your agent reads, and when its tools return."
  - title: "Shape, not strings"
    body: "Regex matches text. TokenHunt also probes for the shape of a leak: the bash escape-hatch class where an unguarded parameter expansion prints the value, env vars whose contents ride into command lines, subprocess environments. The runtime class static scanners can't see."
  - title: "Block and rotate"
    body: "Six hook surfaces, fail-closed by default. A leak blocks the call, lands in a local audit trail, and enters a rotation workflow — scan, list, close, watch — until the key is turned over."
faq:
  - q: "How is this different from gitleaks or trufflehog?"
    a: "They're git-time tools; TokenHunt is a chat-time tool. The wedge is the agent runtime — transcripts, tool outputs, subprocess environments — the layer above the repository where leaks happen first. It complements them; it doesn't replace them."
  - q: "Which agents does it work with?"
    a: "Claude Code out of the box via six hooks. The standalone CLI watches any agent's transcript directory directly. pat-scanner is the one-command plugin flavor of the same engine — install that when you just want the guard."
  - q: "What's in Pro?"
    a: "Silent redaction — your agent never sees the secret at all — plus live key verification against providers. The free scanner stays free; Pro is the commercial tier on top. Waitlist: info@tokenhunt.dev."
privacy: "Zero cloud, zero telemetry, fail-closed. Scanning runs locally on your machine; findings stay in a local audit trail until you act on them."
---

I leaked 8 credentials in 9 days — every one a paste or an unsupervised agent read. [The story is on this site.](/posts/token-hunt/)

[TokenHunt](https://tokenhunt.dev) is the scanner that exists because of it. It catches secrets at chat time — when you paste, when your agent reads a config file, when a tool returns — not at commit time, when the key has already been sitting in a transcript for half an hour. Forty-eight rules across 53 provider families, plus runtime detectors for the classes regex can't see. It caught a GitHub PAT the day it shipped. Mine. The irony is the feature.
