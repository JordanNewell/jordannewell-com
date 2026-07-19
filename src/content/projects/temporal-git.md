---
title: "Temporal Git"
description: "Git blame on steroids. Travel through time to find when bugs were introduced."
status: "exploratory"
tags: ["projects", "tools", "oss"]
repo: "https://github.com/JordanNewell/temporal-git"
order: 21
facts:
  - k: "status"
    v: "exploratory"
  - k: "form"
    v: "CLI + VS Code"
highlights:
  - title: "Timeline visualization"
    body: "Code history rendered as a navigable timeline. Click any point, see what changed."
  - title: "Bug-introduction tracing"
    body: "Pick a line, walk backwards to the commit that introduced the pattern. Automated bisect adjacent."
stack:
  - "TypeScript"
  - "VS Code Extension API"
---

VS Code extension that visualizes code history as a timeline. Go back to any point, see what changed, trace when a bug was introduced. Exploratory — concept validated, extension prototype built.
