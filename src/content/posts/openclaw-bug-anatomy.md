---
title: "Anatomy of a bug report that actually got fixed: my OpenClaw submission"
description: "What a good bug report looks like, demonstrated via a real one I filed against OpenClaw — community-confirmed, then fixed upstream in six days."
pubDate: 2026-07-15
tags: ["rebuild", "contributions"]
mode: "hobart"
project: "openclaw-fleet"
kind: "tooling"
---

On 2026-05-12 I filed a bug against [OpenClaw](https://github.com/openclaw/openclaw). Other users had documented the same pattern in related issues. The maintainer shipped a fix and closed my issue on 2026-05-18 — six days from filed to fixed.

That sequence is unremarkable on its own. Bugs get filed and fixed every day. What's worth writing about is *why this one moved* when most bug reports die in the queue. The answer is mostly craft, not luck.

This post is the anatomy. If you file bugs against OSS projects, the structure below will increase your hit rate. If you maintain OSS projects, the same structure is what makes a report actionable.

## The bug

**Symptom:** OpenClaw agents were hanging mid-conversation on Discord DMs. Frozen, unresponsive, requiring a manual restart.

**Expected:** The agent processes the DM and responds within a few seconds, the way it does for channel messages.

**Actual:** The agent called `memory_search` as part of its processing, the Node.js event loop blocked for 60+ seconds, the Discord gateway websocket closed for inactivity, and the agent stuck in "processing" state until a watchdog restarted it.

**Versions:**

| Component | Version |
|---|---|
| OpenClaw | 2026.5.7 |
| memory-core (bundled plugin) | 2026.5.7 |
| OS | Ubuntu 24.04 (Linux 6.8.0-106-generic) |
| Node.js | v22.x |
| Channel | Discord direct messages |

**Repro:** I could trigger it deterministically by sending a Discord DM to any agent with `memory-core` enabled (default). Channel messages were less affected — the timing was different enough that the gateway didn't time out.

**The clue that mattered:** The liveness diagnostic showed `tool:memory_search:started` with `age=63s`. Sixty-three seconds in `memory_search`, with the event loop pegged. That single line isolated the bug to the memory plugin, not the Discord transport.

## Why it landed

A bug report is a request for someone else's time. The maintainer has more bug reports than hours. Reports that respect that fact get triaged first.

What this one did right:

### 1. Minimal repro

The original draft of the report had me speculating about Discord gateway behavior, embedding timeouts, and a couple of other hypotheses. After trimming everything that wasn't load-bearing, the repro was three steps: enable `memory-core`, send a DM, watch the diagnostic.

A seven-step repro says "I haven't isolated this." A three-step repro says "I have."

### 2. Versions pinned

I included the exact OpenClaw version, the bundled plugin version, the host OS, the Node version, and the channel type. Maintainers can't reproduce without these. A report without versions is asking them to guess.

### 3. What I'd already tried

I listed what I'd already ruled out: restarting the agent (worked temporarily, recurred immediately on next DM), disabling `memory-core` (eliminated the symptom entirely — which confirmed the plugin was the locus), checking Discord token validity, checking network paths to the Discord gateway. The maintainer didn't have to suggest any of these.

This also signals competence. You're not asking them to do your debugging for you.

### 4. The clue that mattered

The single observation that `memory_search` was the operation stuck at 63 seconds — visible in the liveness diagnostic — was probably what made the fix fast. The maintainer didn't have to find the clue. I'd already pointed at it.

The bug had been latent in the codebase. Related issues ([#65517](https://github.com/openclaw/openclaw/issues/65517), [#56733](https://github.com/openclaw/openclaw/issues/56733), [#52231](https://github.com/openclaw/openclaw/issues/52231), [#9751](https://github.com/openclaw/openclaw/issues/9751)) documented the same pattern: blocking embedded operations starving I/O on a single-process Node event loop. None of those had isolated it to `memory_search`. That isolation was the contribution.

### 5. I didn't propose a fix

Beginner mistake: filing a bug *and* proposing a code change in the same report. Reviewers have to context-switch between "is the bug real?" and "is the proposed fix correct?" Keep them separate. File the bug. Let the maintainer diagnose. Open a PR only if they ask, or after the bug is confirmed and they're open to a fix.

I did list four suggested fix directions in a separate section (worker threads, configurable timeout, fail-gracefully on embedding failures, async embedding) — clearly labeled as suggestions, not a PR. That's different from proposing a diff.

## What happened next

**Day 0 (2026-05-12):** Filed the issue with the repro, the diagnostic, and the suggested-fix list.

**Days 1-3:** Watchdog mitigation deployed fleet-wide — detects `eventLoopDelayMaxMs > 10000` or `memory_search` stuck for 60s+, restarts the agent. Reduces user-visible downtime from indefinite to ~2 minutes.

**Days 3-5:** Other users chimed in via the related issues confirming the same pattern. The repro was clean — anyone with `memory-core` enabled could trigger it on a DM.

**Day 6 (2026-05-18):** Maintainer shipped the fix. Issue closed by `clawsweeper[bot]` (the maintainer's automation). The fix moved `memory_search` off the event loop.

## What you can steal

If you file bugs against OSS projects, the template below will improve your hit rate. Steal it.

```markdown
## Symptom
[one line]

## Expected
[one line]

## Actual
[one line]

#***REMOVED***
- OSS project: [exact version]
- Plugin/module: [exact version, if applicable]
- Host OS: [exact version]
- Runtime: [Node/Python/etc. version]
- Channel/transport: [if applicable]

## Repro
1. [step]
2. [step]
3. [step]

## Diagnostic evidence
[paste the actual log line, metric, or stack trace that isolates the issue]

## What I've already tried
- [thing 1] — didn't fix
- [thing 2] — didn't fix
- [thing 3] — didn't fix

## Clue
[the one observation that doesn't match the obvious hypothesis]

## Suggested fix directions (not a PR)
- [direction 1]
- [direction 2]
```

If you can't fill in every section, that itself is information: it tells you what you haven't yet isolated. Don't file until you can at least fill in Symptom, Expected, Actual, Versions, Repro, and Diagnostic evidence. The other three can be in-progress.

## The point

Most "builders" in the AI era are pure consumers of OSS. Filing bugs that get fixed is one of the ways you stop being a consumer and start being a participant. It's also one of the few credibility markers that's verifiable: the issue URL is a public artifact, the merge commit is permanent, anyone can check.

I'm keeping a [/contributions](/contributions) page on this blog for exactly this reason. The OpenClaw event-loop bug is the first entry. More to come.

---

[Canonical artifact: openclaw/openclaw#81172](https://github.com/openclaw/openclaw/issues/81172)

*Filed under [/rebuild](/tags/rebuild) and [/contributions](/tags/contributions). Logged on the [/contributions](/contributions) page.*
