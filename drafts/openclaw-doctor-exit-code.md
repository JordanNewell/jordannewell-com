---
title: "The exit code said fixed. Filed it. Same-day merge."
description: "A repair tool that exits 0 without doing anything, the bug report that got it fixed in a day, and the new contract: exit 1 for invalid config, exit 2 for malformed, and a JSON status that says blocked."
pubDate: 2026-10-29
tags: ["contributions", "oss", "openclaw"]
series: ["claude"]
tool: "openclaw"
mode: "hobart"
kind: "tooling"
draft: true
---

During the rebuild, the fleet's repair tool did something worse than fail: it exited 0. Headless, pointed at config the new version rejects, it printed that the database "awaits its schema repair," migrated nothing, and returned success. Any automated sweep trusting exit codes — mine did — reads that as fixed and restarts the service onto the same unmigrated state. Which is exactly what happened, repeatedly, across [the fleet recovery](/posts/smart-said-the-drive-was-fine/).

[First time I did this](/posts/openclaw-bug-anatomy/), the bug took six days from filed to fixed. This one took under a day: [filed as #187122](https://github.com/openclaw/openclaw/issues/187122), fixed in [#187192](https://github.com/openclaw/openclaw/pull/187192), merged to main the same day the maintainer closed it. The delta isn't luck. It's report shape, and it's learnable — so here's the shape.

## What made this one move fast

**The invariant was one sentence.** "A non-interactive `doctor --fix` exits rc=0 without performing migrations when the config is invalid." Not a story about my fleet, not a build log — a single falsifiable claim about the tool's contract. Maintainers fix sentences they can test.

**The evidence was a class, not an instance.** Three prior issues in the tracker documented rc=0-without-migrating in other paths. Cross-referencing them turned "this happened to me" into "this exit-code contract is broken in several places, here's the pattern." Pattern reports get design fixes. Instance reports get patches.

**The fix was already spec'd.** The report proposed the contract: migrate or fail loud. Invalid config → nonzero exit with the rejected keys and remediation in the same run. Malformed → a different nonzero. Structured output reports a blocked status so machines can branch. The maintainer implemented the contract: exit 1 for invalid, exit 2 for malformed, `--json` says `"blocked"`, and headless `--fix` now actually performs the schema repair and migrations.

That last part matters most. Before the fix, the failure wasn't just a wrong exit code — headless repair genuinely did nothing. After, the headless path does the work, and the exit codes tell the truth about it. Trustworthy automation needs both.

**What I'd already ruled out** went in the report: terminal-present vs. headless behavior, the specific rejected config keys, the boot gate that refuses startup on unmigrated state. The maintainer didn't have to discover any of it.

## The fine print

Merged to main only. The latest stable release predates it, so the fix is queued, not deployed — the verification pass (update a box, point headless `--fix` at a known-bad config, expect exit 1 with keys and remediation, expect `"blocked"` in JSON) runs when a release cuts it. I've told the maintainer the report-back is coming; a fleet-wide headless sweep is about as strong a verification environment as this bug could ask for.

A separate report on the repair tool hanging outright on the rebuilt box is [still open](https://github.com/openclaw/openclaw/issues/187900) — that one's environmental and still being narrowed. Two bugs in one tool in one week reads like piling on; it isn't. Tools that repair state hold the highest-stakes contract in the system, because the operator has already lost when they reach for one. They earn the scrutiny.

## The general contract

If you build any tool whose job is "detect and repair state," the exit code is the API. Humans read your pretty output; automation reads the number. The full contract, worth stealing for anything you ship:

| Condition | Behavior |
|---|---|
| Nothing to do | Exit 0, say so explicitly ("no changes required") |
| Repaired | Exit 0, list what changed |
| Found problems, didn't touch anything | Nonzero, list them, propose remediation |
| Can't parse the input | Different nonzero, don't half-run |

The middle row is the one tools get wrong most. "I looked, it's broken, I did nothing, here's what I'd do" deserves its own exit code, because the next actor in the chain — a script, a sweep, a cron job — needs to branch on exactly that case. Silence plus success is the worst possible answer in that slot, and it's the one this bug shipped with.

An exit code that lies doesn't stay a tooling bug. It becomes an outage with your name on the restart command.
