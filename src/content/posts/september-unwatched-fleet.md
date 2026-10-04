---
title: "Three incidents, four days, one root cause: the unattended fleet's September bill"
description: "The fleet ran unattended for two months while the site sat on a splash page. Between 2026-09-25 and 2026-09-28 the deferred maintenance billed all at once — OOM loops at half the memory cap, ~800 wasted model runs a day from a default-ON heartbeat, and a billing suspension every liveness check called alive. One shared root cause: defaults and alerts that assumed someone was watching."
pubDate: 2026-10-04
tags: ["infra", "ai"]
mode: "hobart"
kind: "postmortem"
series: ["claude"]
draft: false
---

> Three incident posts landed here in four days — 2026-09-25, 2026-09-27, 2026-09-28. A fleet-wide OOM loop, a heartbeat burning model runs nobody asked for, a mail outage every liveness check missed. Different systems, different failure modes, one shared root cause: the fleet ran unattended, and September is when the bill arrived.

## The invoices

The agent fleet billed me three times in one week. [On 2026-09-25, Node sized its heap to half a new memory cap](/posts/v8-heap-cgroup-half) and the busy agents OOM-looped all day — one unit killed eleven times, another twenty-plus. [On 2026-09-27, a default-ON heartbeat](/posts/heartbeat-dm-storm) met a cron that had wiped the note keeping agents quiet; forty "still here" DMs later, the arithmetic worked out to roughly 800 wasted model runs a day across the fleet. [On 2026-09-28, a Hetzner billing suspension](/posts/hetzner-billing-suspension) blocked every inbound port on the mail host while every liveness check said alive — three unread warnings deep, thirty minutes from paid invoice to green. The blast radius wasn't just mail: dwtrimco.com, five weeks past its 2026-08-24 launch, proxies through the same mailcow edge and went dark with it.

Each of those posts dug out its own incident. This one is about what they share.

## The gap

The repo holds the receipts for the setup. The last human commit before the storm: 2026-08-10. Between that date and 2026-10-03, every change merged to this repository came from dependabot — a batch of dependency bumps on 2026-09-19 and nothing else. The site had sat on a splash page since 2026-07-28 while I was heads-down on other work; [that reshuffle gets its own post](/posts/where-august-went). What matters here is what kept running through the gap: the entire fleet — 17 gateways when the gap opened, 30 agents now — on its defaults, with nobody reading the output.

## Nothing errored

All three incidents were invisible for the same reason: nothing errored.

The mail host answered pings for the whole outage. Hetzner engineers the suspension that way — the VM keeps running, outbound stays up, inbound gets blocked at the provider edge. My checks answered "is the VM alive," and the VM was alive. The failure lived in the question no check asked: can a client complete a real connection? In the words of [the suspension post](/posts/hetzner-billing-suspension): "A pong is a heartbeat. A heartbeat is not a service."

The heartbeat waste never generated an alert because it never generated a failure. Every poll succeeded, every DM composed and delivered, every model run billed. No error, no downtime, no signal — a meter running in a room nobody was in.

The OOM loop printed clean logs on every cycle. Allocate, kernel kill, systemd restart, healthy-looking logs, repeat. From [the heap post](/posts/v8-heap-cgroup-half): "The unit was doing exactly what its configuration said. The configuration was the bug." That sentence generalizes to the whole week.

My monitoring watched for red. These failures were printed in silence.

## Defaults assume a witness

Three defaults, three assumptions, all falsified by the same absence.

OpenClaw's heartbeat is default-ON: no config key means enabled. That default presumes an operator who notices a new channel spending money per run. There wasn't one. The fix — `every: "0m"` in every gateway config — flips the presumption: talking is a feature someone enables per agent, on purpose, with a reason written down.

Node's heap sizing is default-derived: the runtime reads the cgroup limit and sizes the heap on its own, measured at half the cap, twice. That default presumes an operator who knows a cap change silently re-sizes every heap on the box. The fix pins `--max-old-space-size` explicitly and sets `MemorySwapMax=0` alongside, so the runtime stops making memory decisions on my behalf.

Hetzner's dunning runs on mail and patience: warnings to an inbox, suspension after the third. That process presumes an operator who reads vendor email through an unwatched quarter. The fix routes invoice reminders from cron into the alert channel, with a calendar entry as the backup to the backup — billing treated as an outage vector, monitored like one.

A fleet left unattended doesn't stay healthy. It stays configured. Every default kept executing faithfully while I was gone — the heartbeat polled, the cap held, the checks pinged, the cron rewrote. Configuration never escalates. It just runs.

## What changed

The regime the three posts shipped, in one list:

- **Spend defaults to off.** Heartbeat is `0m` fleet-wide. Anything that bills per run requires a positive act to enable, at a cadence someone chose, for a reason written next to it.
- **The runtime doesn't get to derive.** Heap caps are explicit, sized from the workload, about a gig below the memory cap. Override drop-ins sort last. Verification reads `/proc/PID/environ`, because systemd won't say when it dropped a flag.
- **Checks ask client questions.** An SMTP handshake from outside, not a pong from inside. Invoice reminders land in the alert channel before the thread goes three deep.
- **Restores are drilled, not assumed.** The first full mailcow restore drill pulled the latest backup in 7.8 seconds, stamped the rebuild RTO at 45 to 60 minutes, and found three gaps a runbook review never would have — missing TLS certificates, missing rclone remote config, an unpinned Storage Box host key. All three fixed.

## The other bookend

The repo holds the end of the story too. On 2026-10-03, eighteen commits in seven hours: the blog-era tree restored from before the splash, the apex moved to the Hetzner origin, the live status badge back in the footer. The operator returned. The fleet has a witness again, and the defaults decide nothing alone.

If you made it this far, I appreciate it. — JN
