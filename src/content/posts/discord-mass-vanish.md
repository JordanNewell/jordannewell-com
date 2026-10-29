---
title: "Every agent left Discord on the same morning"
description: "A fleet-wide Discord outage with two root causes, both planted by a rebuild days earlier, and a sanctioned repair tool that hangs — so the fix that worked was moving one file aside."
pubDate: 2026-10-29
tags: ["ai", "infra", "openclaw"]
series: ["claude"]
tool: "openclaw"
mode: "hobart"
kind: "debug-story"
draft: true
---

Every agent in the fleet dropped off Discord at once. Not degraded — gone. No responses in any channel, presence lists empty, and the failure was identical across agents that share no config, no state, and no processes. Identical symptoms across independent systems is the most useful signal an outage gives you: stop debugging agents, start debugging what they share.

What they shared was the rebuild — the [swap-then-build from earlier this week](/posts/smart-said-the-drive-was-fine/). Both root causes were planted by it and both took days to detonate.

## Two causes, stacked

**The plugin skew.** The rebuild upgraded the agent core. Plugins install per-profile and did not come along. Months-stale plugin builds against the new core produce a channel that reports stopped with a health-blocked status, and the log says exactly why: the plugin can't import the SDK runtime it was built against, and the fix it names is the fix. Update the plugin per profile, restart, connected. The only hard part is remembering that "the core" and "the plugins" are separately versioned — an upgrade path that updates one and implies the other is how the skew gets planted.

**The session-store gate.** The new version moved session state into sqlite. A legacy index file left on disk — which the restore recreated, naturally — arms a migration gate: if the legacy file exists without a completed-import receipt, the gateway runs, Discord connects, agents chat — and every cron job errors once a minute and the session store is unavailable. This is the devious one, because the visible surface (Discord messages flowing) says healthy while the actual subject (scheduled work, session access) is broken. An agent mid-wedge sent messages the whole time it was wedged. Don't grade channel traffic as a health check for anything but the channel.

## The repair tool hangs

The sanctioned path for the gate is the project's repair tool. On this box, in every mode — check-only, fix, fix-with-confirmation-flag, interactive in tmux with keys sent — it draws a title frame, burns a couple seconds of CPU, and hangs forever. No network traffic, no log progress, deaf to SIGTERM. It hangs on a wedged profile, and it hangs on a *pristine* profile with nothing to repair, which converts "my state is confusing it" into "the tool is broken here" — a much better bug shape.

Controls: the same binary version ran fine on the workstation days earlier, so this is environmental. Something about the rebuilt box disagrees with it. Snapshot the pristine repro, strip anything identifying, and [file it upstream](https://github.com/openclaw/openclaw/issues/187900).

## The fix that worked

With the repair tool unusable, the gate gets bypassed by hand: back up the legacy index file, move it aside under a name the legacy scanner doesn't match, restart the gateway. The gate never fires — its trigger condition is the file's presence, and the file is gone. The sqlite store already exists. The jsonl transcripts are untouched. Verified across every wedged agent over multiple cron cycles: clean.

Two things make the bypass safe rather than lucky. The gate is a pure existence check — no database consulted — so absent-file means absent-trigger, mechanically. And the backups live in a dedicated directory with the original names, so the sanctioned migration can still run later if a release makes it usable. A bypass you can't reverse isn't a fix, it's a bet.

## The diagnostics that lied

Three probes gave false reads during this one, all worth naming:

| Probe | Lie | Truth |
|---|---|---|
| Discord message traffic | Agents healthy | Cron broken, sessions unavailable — channel is a separate organ |
| Error counts over a short log window | "Fixed" mid-restart | Restart resets the window; verify file state on disk, over multiple cycles |
| Load average at 50 | CPU pegged | Every CPU process under 10% — I/O wait, D-state; remedy is stop churning and wait |

The load one deserves its own line: on a small box, a load number that dwarfs the core count with low CPU is the disk saying it's drowning. The remedy is patience, which feels wrong for about ten minutes and then the queue drains. One gateway took eleven minutes to come up. Watching it not come up faster doesn't help it.

## Standing after

Fleet back on Discord, crons firing, plugin updates folded into the upgrade runbook next to the core so the skew can't replant. The repair-tool hang is upstream with a clean repro and pristine snapshots held on the box for the maintainers. The bypass stays documented — because the next "sanctioned tool won't run" outage shouldn't start from zero, and because a documented bypass is a standing request for the real fix.
