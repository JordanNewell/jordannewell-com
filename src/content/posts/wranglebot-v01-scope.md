---
title: "WrangleBot v0.1: what two weeks buys"
description: "The v0.1 scope for WrangleBot — a supervisor daemon that gates agent tools, breaks runaway loops, scopes worktree diffs, and writes .curt sessions. What's in the two-week slice, what's deliberately out, and the one metric that decides round two."
pubDate: 2026-10-16
tags: ["ai", "agents", "oss"]
project: "wranglebot"
mode: "hobart"
tool: "claude-code"
era: "2026-fleet"
kind: "tooling"
---

The [pivot post](/posts/wranglebot-pivot/) ended with a position: free OSS wedge, no billing until organic pull. This is the build order behind it — what `v0.1` means, in pieces small enough to finish.

The one-liner: `wranglebot run <agent>` wraps an agent session in a supervisor daemon that watches every tool call, gates the dangerous ones, kills the stuck ones, and writes the whole thing to disk as a .curt file you own.

## The five pieces

**Hooks adapter.** Claude Code's PreToolUse hooks hand the supervisor the full tool call — tool name, arguments, everything — on stdin, and accept a deny or a rewrite before it executes. v0.1 gates Edit and Write: parse the incoming patch with tree-sitter, check it against the session's scope, refuse what falls outside. This is the load-bearing piece; everything else reports, this one intervenes.

**Worktree-diff scope guard.** An agent approved to touch `src/auth/` shouldn't be editing the deploy scripts. The supervisor snapshots the worktree, diffs per turn, and treats out-of-scope changes as a denial plus a warning — not a log line for later.

**Loop breaker.** Runaway agents don't look dramatic; they look repetitive. Deterministic signals only: the same `(tool, args)` fingerprint three times is a warning, five is a kill. A diff delta of zero across consecutive turns scores the same way. No ML, no thresholds to tune — a stuck agent is mechanically obvious.

**Observer for the rest.** Codex exposes `exec --json`; that's a read-only observation stream. Gemini next. Agents without hooks can't be gated — being honest about that beats pretending — but they can be watched, and the loop breaker still applies at turn boundaries.

**.curt emission.** Every session ends as a .curt file — the same open format Curtis writes. This is the piece that makes WrangleBot more than a watchdog: it's the first consumer of the standard, and every supervised session is another reason the format exists.

## What's deliberately out

No billing. No dashboard — the artifacts are files, read them like files. No multi-agent orchestration; the supervisor watches one session at a time and does it well. No AST support beyond TypeScript and Python, because those are where the agents actually bite. Rust ASTs, Aider adapters, and rewriting tool input (denial only in v0.1) all wait for pull.

## The metric

One number decides whether round two gets built: weekly active users, sustained eight weeks after launch. Launch spikes are weather; eight weeks is climate. If it can't hold an audience for two months on its own, no pricing tier was ever going to save it.

Two weeks. If it slips, the scope was wrong, not the calendar.
