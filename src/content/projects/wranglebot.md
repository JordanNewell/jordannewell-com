---
title: "WrangleBot"
description: "A supervisor daemon for AI coding agents — gates the tools, breaks runaway loops, scopes the diffs, and writes every session to disk as a .curt file you own. Free OSS, agent-agnostic."
status: "active"
promotedTo: "/products/wranglebot/"
tags: ["projects", "ai", "oss", "agents"]
startDate: 2026-10-16
repo: "https://github.com/JordanNewell/wranglebot"
liveUrl: "https://wranglebot.com"
pkg: "https://www.npmjs.com/package/@wranglebot/cli"
order: 20
facts:
  - k: "current"
    v: "v0.1.1 (@wranglebot/cli)"
  - k: "form"
    v: "supervisor daemon"
  - k: "sessions"
    v: ".curt files you own"
  - k: "license"
    v: "open source"
highlights:
  - title: "Tools get gated, not trusted"
    body: "Every tool call passes a policy gate before it runs — scoped diffs, confirmed writes, ceilings per agent. The agent proposes; the supervisor disposes."
  - title: "Runaway loops get broken"
    body: "Retry spirals and cost runaways are detected and cut, not watched. The failure mode of an unsupervised coding agent is a burned afternoon; WrangleBot makes it a log line."
  - title: "Every session on disk"
    body: "Sessions write out as .curt files — the same open record format Curtis uses. What the agent did, when, and with what input, in a file you own."
stack:
  - "Node"
  - "npm (hook bin)"
  - ".curt"
---

A supervisor daemon for AI coding agents: gates the tools, breaks runaway loops, scopes the diffs, and writes every session to disk as a .curt file you own. Free and open source, agent-agnostic — npm `wranglebot` ships the hook bin; docs and the full spec at [wranglebot.com](https://wranglebot.com).
