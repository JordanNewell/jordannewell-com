---
title: "jordannewell.com"
description: "This site. Astro SSG, Swiss Minimal dark theme, LLM-discoverable. Build-in-public field notes from an operator's desk."
status: "active"
tags: ["projects", "web", "oss"]
startDate: 2026-07-15
repo: "https://github.com/JordanNewell/jordannewell-com"
liveUrl: "https://jordannewell.com"
order: 3
facts:
  - k: "framework"
    v: "Astro 7"
  - k: "styling"
    v: "Tailwind 4"
  - k: "hosting"
    v: "Cloudflare Pages"
  - k: "deploy"
    v: "push to main → Actions"
highlights:
  - title: "Astro 7 + Tailwind 4"
    body: "Static site generation. Zero client JS except where strictly necessary. Inter Tight display, JetBrains Mono metadata."
  - title: "Deploy from the repo"
    body: "Push to main: GitHub Actions builds and wrangler-deploys to Cloudflare Pages. The edge cache purges with the deploy — no staleness window, no laptop in the path."
  - title: "Headers as code"
    body: "CSP and security headers ship from the repo as public/_headers. The /api/activity Worker route rides the same zone."
stack:
  - "Astro 7"
  - "Tailwind 4"
  - "TypeScript"
  - "Cloudflare Pages"
  - "GitHub Actions"
---

The blog itself as a project. Astro 7 + Tailwind 4 static site, served from Cloudflare Pages — every push to main deploys through GitHub Actions, headers and all from the repo. Zero-JS by default, Fontsource fonts, Shiki code highlighting, schema.org JSON-LD, llms.txt, AI crawler allowlist, voice lint pre-commit hook, OPSEC-aware content pipeline.

Built from scratch in two days. Ships posts, projects, ventures, contributions. Series taxonomy (Off-Model for AI-tool sessions, Heritage for origin-story). Publishing pipeline: voice lint → build → push; the repo does the rest.

MIT code, CC BY-NC content, All Rights Reserved brand.
