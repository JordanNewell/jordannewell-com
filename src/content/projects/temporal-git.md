---
title: "Temporal Git"
description: "Automated git bisect — find which commit introduced a bug with one command. Point it at a failing test or symptom script and let it drive the bisect."
status: "shipped"
tags: ["projects", "tools", "oss"]
shipDate: 2026-07-21
repo: "https://github.com/JordanNewell/temporal-git"
pkg: "https://www.npmjs.com/package/temporal-git"
order: 21
facts:
  - k: "shipped"
    v: "2026-07-21"
  - k: "version"
    v: "v2.1.4"
  - k: "form"
    v: "CLI"
  - k: "downloads"
    v: "600+"
  - k: "license"
    v: "MIT"
highlights:
  - title: "One-command bisect"
    body: "Point it at a failing test or a symptom script. Temporal Git drives the bisect — checkout, test, mark good/bad — until it isolates the introducing commit."
  - title: "Bug-introduction tracing"
    body: "Pick a line, walk backwards to the commit that introduced the pattern. Pairs naturally with the automated bisect."
stack:
  - "TypeScript"
  - "Node.js"
---

Automated git bisect. Tell it how to detect the bug — a failing test, a symptom script, a manual prompt — and Temporal Git runs the checkout-test-mark loop until it isolates the introducing commit. One command instead of fifteen.

Shipped to npm 2026-07-21. Five patch versions landed same day as the rough edges got sanded down. 600+ downloads in the first 24 hours — more traction than anything else I've shipped this quarter.

Install:

```bash
npm install -g temporal-git
```

GitHub releases coming once the surface stabilizes — for now, npm is the canonical artifact.
