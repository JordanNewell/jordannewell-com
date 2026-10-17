---
title: "WrangleBot"
tagline: "Corralling rogue agents."
description: "A supervisor daemon for AI coding agents — gates the tools, breaks runaway loops, scopes the diffs, and writes every session to disk as a .curt file you own. Free OSS, agent-agnostic."
status: "preview"
shipDate: 2026-10-16
homepage: "https://wranglebot.com"
logo: "/products/wranglebot/logo.png"
pricing: "free-oss"
license: "TBD at v0.1"
order: 5
ogImage: "/products/wranglebot/og.png"
stats:
  - k: "form"
    v: "CLI daemon"
  - k: "status"
    v: "v0.1 scoped"
  - k: "pricing"
    v: "free OSS, no billing"
features:
  - title: "AST guardrails, not string matching"
    body: "PreToolUse hooks hand the supervisor the full tool call before it runs. v0.1 parses Edit and Write patches with tree-sitter and refuses anything outside the session's scope — denial plus a warning, not a log line for later."
  - title: "The loop breaker"
    body: "Runaway agents don't look dramatic; they look repetitive. Same tool-and-arguments fingerprint three times is a warning, five is a kill. A zero diff delta across turns scores the same way. Deterministic signals only — a stuck agent is mechanically obvious."
  - title: "Every session on record"
    body: "Each supervised run ends as a .curt file — the open session format. WrangleBot is the standard's first consumer, and a supervisor that watches everything is the right thing to write it."
faq:
  - q: "Is it out?"
    a: "Not yet. v0.1 is scoped — a two-week slice: hooks adapter, worktree scope guard, loop breaker, Codex observer, .curt emission. The code lands when it's worth cloning; the [scope](/posts/wranglebot-v01-scope/) is public."
  - q: "Which agents does it watch?"
    a: "Claude Code gets the full treatment — hooks gate and deny tool calls. Codex is observed read-only via exec --json. Agents without hooks can't be gated, and pretending otherwise would be a lie; they can still be watched and loop-broken at turn boundaries."
  - q: "What does it cost?"
    a: "Nothing. Free OSS wedge — npm first. No billing until organic pull proves there's a reason for it. The market research was blunt about paid tools in this space, and the point of WrangleBot was never the revenue."
privacy: "Everything is local. The supervisor runs beside the agent on your machine, and the artifacts are files — sessions land on your disk as .curt, read them like files. No telemetry, no cloud, no account."
---

Agents are powerful unsupervised, which is the problem. WrangleBot wraps an agent session in a supervisor daemon: every tool call passes a gate, repetition gets broken, and the worktree only changes inside the scope the session was given. What happened lands on disk as .curt.

The [decision that killed Wrangle Mail to make room for it](/posts/wranglebot-pivot/), and the [v0.1 scope](/posts/wranglebot-v01-scope/), are both on this site.
