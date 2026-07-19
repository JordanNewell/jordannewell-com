---
title: "jordannewell.com"
description: "This site. Astro SSG, Swiss Minimal dark theme, LLM-discoverable. Build-in-public field notes from an operator's desk."
status: "active"
tags: ["projects", "web", "oss"]
startDate: 2026-07-15
repo: "https://github.com/JordanNewell/jordannewell"
liveUrl: "https://jordannewell.com"
order: 3
facts:
  - k: "framework"
    v: "Astro 7"
  - k: "styling"
    v: "Tailwind 4"
  - k: "hosting"
    v: "Hetzner + CF"
  - k: "deploy"
    v: "tar-over-ssh"
highlights:
  - title: "Astro 7 + Tailwind 4"
    body: "Static site generation. Zero client JS except where strictly necessary. Inter Tight display, JetBrains Mono metadata."
  - title: "Tar-over-ssh deploy"
    body: "Build locally, push a tarball over ssh, expand on the host. No CI middleman, no Docker layer cache."
  - title: "Cloudflare in front of Hetzner"
    body: "Origin hidden behind CF. MTA-STS + TLS-RPT + CAA + CSP layered hardening as of 2026-07-16."
stack:
  - "Astro 7"
  - "Tailwind 4"
  - "TypeScript"
  - "Cloudflare"
  - "Hetzner"
---

The blog itself as a project. Astro 7 + Tailwind 4 static site, deployed via tar-over-ssh to a Hetzner host behind Cloudflare. Zero-JS by default, Fontsource fonts, Shiki code highlighting, schema.org JSON-LD, llms.txt, AI crawler allowlist, voice lint pre-commit hook, OPSEC-aware content pipeline.

Built from scratch in two days. Ships posts, projects, ventures, contributions. Series taxonomy (Off-Model for AI-tool sessions, Heritage for origin-story). Publishing pipeline: voice lint → build → deploy → verify, one command.

MIT code, CC BY-NC content, All Rights Reserved brand.
