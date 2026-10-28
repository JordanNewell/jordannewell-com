---
title: "Moving Gitea off a dying disk: verify all four doors"
description: "Mid-degradation is a bad time to learn how your failover actually works. A Gitea migration executed under disk-failure pressure, the four-door verification that proved it, and the backup gap the migration surfaced that three months of green dashboards never mentioned."
pubDate: 2026-10-28
tags: ["infra", "tooling"]
mode: "hobart"
kind: "postmortem"
draft: false
---

Gitea had to move because the disk under it was dying. Not at a convenient time — the host was in the middle of the I/O wedge spiral that ends in [a full rebuild](/posts/smart-said-the-drive-was-fine/). The choice was migrate under pressure or ride a failing drive and let it choose the cutover date.

Mid-degradation is a bad time to learn how your failover actually works. Everything below was learned then, which is the point of writing it down.

## The move itself was the easy part

Gitea runs as one container with a data directory and a sqlite database inside it. No separate database server, no replication topology — one directory to rsync and the service is 90% migrated. A decade of homelab consensus says sqlite is a toy and every service deserves a real database. A decade of migrating homelabs says the toy is the one you can move with `rsync` at 2 a.m. while the source disk audibly struggles.

The interesting parts were everything around the directory.

**Service identity doesn't move itself.** The instance answers on a Tailscale service address — a stable name clients point at, so the underlying host can change without anyone editing configs. Moving ownership of that name requires releasing it on the old host and claiming it on the new one. Two traps: drain is not release (the old host holds ownership through a drain, politely serving while doing so), and the claim needs console approval from a human, because tagged devices can't self-approve service moves. That second one is deliberate security design and it is exactly as annoying as it should be during an incident. Worth knowing before the incident.

**Firewalls have opinions about container traffic.** The webhook chain runs from the Gitea container to a shim on the host. Two separate defaults broke it silently: Gitea's webhook egress allowlist excludes private ranges out of the box (the shim lives on a private bridge IP), and the host firewall drops container-sourced input by default. Both are correct defaults. Both produced a webhook that fired and vanished, no error surfaced anywhere a human reads.

That last clause is the gotcha worth keeping: **the shim doesn't log deliveries.** The journal is silent whether the chain works or not. The only truthful witness is Gitea's own `hook_task` table — one row per webhook delivery, `is_delivered` flag per row. Verified from inside the database, the chain works. Verified from the logs, the chain is a shrug.

## Four doors

A migration isn't done when the container starts. It's done when every door into the service opens from outside:

| Door | Proves | How |
|---|---|---|
| SSH push/pull | git transport + auth + host keys | push a real commit from a client |
| Web UI | frontend serving, session store | log in, browse a repo |
| Webhooks | the delivery chain end to end | trigger a push, check `hook_task` |
| API | programmatic clients + tokens | authenticated call from a script |

Start the container and all four doors can still be closed. Each door has its own failure modes that share no code with the others. The ssh alias repoint, the DNS claim, the bridge firewall, the egress allowlist — four independent single points of failure wearing one service's name.

## What the migration found that the dashboards didn't

Verifying the new host meant asking what was actually being backed up. Answer: the Gitea backup timer had been dead since July. Three-plus months. Known, in the sense that a ticket existed; unknown, in the sense that nothing red ever appeared anywhere a human looks. Repo content survived via GitHub mirrors. Issues, releases, LFS objects — not covered by anything.

The uncomfortable part is the shape of it: the service was verified four ways and the backup zero ways, for the same reason the SMART disk fooled me — every health signal in the stack reports claims, and the backup's claim to exist lived in a timer file nobody executed against. Health checks verify the thing they're pointed at. Nobody pointed one at recovery.

Backups get rebuilt on the new host before the old data directory is deleted. That ordering is now a rule, not a preference.

## The takeaway stack

- Move toward boring datastores when the migration path matters more than the scale.
- A stable service name is worth its setup cost exactly once: the cutover.
- Verify migrations door-by-door from outside, never from the container's perspective.
- If a component logs nothing, find the structural witness — a table, a queue depth, a state file. Absence of errors is not evidence of function.
- Audit the backup by restoring from it, on a schedule, or it's a rumor with a timer.
