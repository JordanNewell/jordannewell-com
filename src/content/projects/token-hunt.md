---
title: "TokenHunt"
description: "Secret scanning built for the agentic workflow. 48 credential rules across 53 provider families, six hook surfaces with block-and-rotate, and a runtime detector for the leak class regex can't see. Zero cloud, zero telemetry."
status: "active"
promotedTo: "/products/token-hunt/"
tags: ["projects", "security", "oss", "python"]
startDate: 2026-10-03
shipDate: 2026-10-15
repo: "https://github.com/JordanNewell/token-hunt"
liveUrl: "https://tokenhunt.dev"
pkg: "https://pypi.org/project/token-hunt/"
order: 18
successor: pat-scanner
facts:
  - k: "shipped"
    v: "2026-10-15 (v0.1.0)"
  - k: "rules"
    v: "48 across 53 providers"
  - k: "surfaces"
    v: "6 hook points"
  - k: "form"
    v: "Python CLI + hooks"
  - k: "license"
    v: "BUSL-1.1 (MIT 2030)"
highlights:
  - title: "Six surfaces, one scanner"
    body: "Pre-commit, pre-push, chat-time, CI, directory sweep, and runtime — the same 48 rules at every point a secret can move, with block-and-rotate guidance per match."
  - title: "The leak class regex can't see"
    body: "A runtime detector catches secrets already in memory or transit that pattern rules miss — the class that slipped past PAT Scanner's regex net."
  - title: "Zero cloud, zero telemetry"
    body: "Everything runs local. No account, no dashboard, no phone-home — the scanner that watches for leaks doesn't get to be one."
stack:
  - "Python"
  - "POSIX hooks"
  - "CI"
---

Successor to [PAT Scanner](/projects/pat-scanner/) — same problem, wider net. PAT Scanner caught credentials at chat-time with 13 PAT classes; TokenHunt takes the whole agentic workflow: 48 credential rules across 53 provider families, enforced at six hook surfaces from pre-commit to runtime, with block-and-rotate guidance on every match.

v0.1.0 shipped 2026-10-15 on PyPI with the live spec at [tokenhunt.dev](https://tokenhunt.dev). Zero cloud, zero telemetry — a secret scanner that phones home would be the leak.
