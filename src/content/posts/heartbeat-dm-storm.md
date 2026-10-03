---
title: "Forty DMs. One cron. Here's the default I'm flipping."
description: "A five-minute cron wiped the note that kept my agent fleet quiet, the default-ON heartbeat took over, and the fix came down to one config line and a rule: anything that spends money per run defaults to off."
pubDate: 2026-09-27
tags: ["ai", "infra"]
mode: "hobart"
tool: "openclaw"
kind: "postmortem"
draft: false
---

> Came back to forty DMs from my own agents. All night, one every half hour or so: nothing to report, everything nominal, still here. Cause was a housekeeping cron plus a default I didn't know I was riding. Fixed fleet-wide with one config line.

## The note that ran the fleet

Every OpenClaw agent carries a small markdown file called HEARTBEAT.md. When that agent's heartbeat poll fires, the file is the instruction it reads. The fleet's copies all said the same thing in their own words: a heartbeat that finds nothing wrong says nothing. No status DMs. Silence is healthy.

The file worked. Polls fired, agents read the note, agents stayed quiet. Quiet by document.

That's the phrase to hold onto: quiet by document. Not quiet by config. Not quiet by anything that survives a rewrite.

## What happened

A housekeeping cron ran every five minutes. Its job: refresh a check-in timestamp in the frontmatter of each agent's HEARTBEAT.md. Version one did that by rewriting the entire file — fresh frontmatter, empty body. The quiet rules lived in the body. The cron deleted them, on every agent, every five minutes.

Here's the part I didn't know until that night: OpenClaw's heartbeat is default-ON. If a config has no heartbeat key at all, the code's last-resort answer is enabled. The poll had been firing the whole time on the stock ~30-minute cadence, landing in each agent's main session. Harmless, because the note told the agent what to do with a poll: nothing.

With the note wiped, agents fell back to the stock guidance in the default AGENTS.md they boot with. Be proactive. Check in. Report status. So they did. Polite little status updates, one per agent per half hour, each one a full model run to compose and send.

I came back to forty of them. Across the fleet it worked out to roughly eight hundred wasted model runs a day, almost all of it "still here."

## The fix

Three moves, in order.

**Kill switch first.** `agents.defaults.heartbeat.every: "0m"` into every gateway config. All eighteen. Backup, edit, hot-reload. Every gateway logged `[heartbeat] disabled`. The docs confirm what `0m` buys: heartbeat off, and HEARTBEAT.md drops out of the prompt entirely — zero residual token cost. The config now says what the note used to say, and the config is what survives a rewrite of the note.

**Fix the writer second.** The cron still updates the timestamp — something downstream reads it — but it touches frontmatter only. The body is untouchable. The thing with write access to the note no longer owns the note.

**Restore the policy third.** Every HEARTBEAT.md came back with a fleet-wide body: silence is the healthy state, a real signal routes through the escalation gates every other pipe in the fleet already uses, nothing routes to me as a status DM.

Re-enabling is now deliberate, per agent. The kill switch is what a new agent inherits. A heartbeat runs where someone turned it on, at a cadence someone chose, for a reason written down next to it.

## What I'd do differently

Three rules, earned the expensive way:

1. **A file that documents intended state is not enforcement.** The note said stay quiet, so the fleet stayed quiet — until it didn't. Intent stored in prose evaporates the moment the prose is deleted. If the intended state matters, put it somewhere with a schema, a validator, or a diff alert.

2. **Anything silently rewriteable needs a watchman.** A five-minute cron had write access to the one file enforcing fleet behavior, and nothing checked that the file still said what it was supposed to say. A three-line guard — does the body still contain the quiet rule? alert if not — would have caught this on the first pass. Every writer needs a reader that complains.

3. **Default ON is the wrong default for anything that bills per run.** A poll that spends a model run every 30 minutes, per agent, should require a positive act to enable. Absence of a config key meaning "enabled" is a decision the tool made on my behalf. Everywhere I control the config, the opposite holds: off unless named.

The part that stings: the fleet already had escalation rules, comms gates, routing config. Designed, documented, deployed. The heartbeat was the one pipe that bypassed every gate, because nobody thought of it as a comms channel. It was one. Forty DMs is how I found out.

## Where it stands

Every gateway runs `every: "0m"`. Quiet is the default state of the fleet. Talking is a feature someone has to turn on, per agent, on purpose. The storm cost a night of tokens; the flip costs nothing. Keep the flip.

If you made it this far, I appreciate it. — JN
