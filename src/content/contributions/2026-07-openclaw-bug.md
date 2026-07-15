---
title: "OpenClaw bug report — community-confirmed and fixed"
description: "memory_search blocked the Node event loop for 60+ seconds on Discord DMs, freezing agents fleet-wide. Filed the issue; maintainer shipped a fix in 6 days."
project: "OpenClaw"
date: 2026-05-12
type: "bug-report"
url: "https://github.com/openclaw/openclaw/issues/81172"
outcome: "Fixed upstream, closed 2026-05-18 (6 days)"
order: 1
---

Filed against OpenClaw: `memory-core` plugin's `memory_search` tool blocked the Node.js event loop for 60+ seconds when processing Discord DMs. Event-loop delay spiked to 62,746ms, Discord gateway closed, agents hung fleet-wide.

Related issues (#65517, #56733, #52231, #9751) documented the same pattern — blocking embedded operations starving I/O on single-process Node. Community confirmation came via those threads. Maintainer shipped the fix; issue closed 2026-05-18 by `clawsweeper[bot]`.

Anatomy writeup published as a launch post: [/posts/openclaw-bug-anatomy](/posts/openclaw-bug-anatomy).
