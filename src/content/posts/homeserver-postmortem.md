---
title: "Server down. Cause found. Here's the call I'm making."
description: "Two days off Tailscale. Cause: dead PSU in a small-form-factor host with a proprietary power supply. Disks recovered clean. Now I decide what to build next."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude"]
tool: "claude-code"
kind: "postmortem"
draft: false
---

> The host went dark July 14. Tailscale showed it offline. SSH timed out. Ping timed out. The box was dead — and it took a day to figure out why. Three days later: cause identified, disks safe, decision pending.

## What the host was running

Before it died, this was the second-most-important host in the fleet. It ran:

- The Matrix homeserver (if down, every agent on the tailnet loses encrypted chat)
- The media stack — download client, media trackers, media server
- A local LLM frontend
- Fleet metrics collection
- Vault sync
- A chunk of the OpenClaw agents
- Dozens of containers behind Tailscale service IPs

When it went down, all of that stopped at once. Discord kept working (external SaaS). Matrix went dark fleet-wide. The agents could still see each other on Discord but couldn't encrypt outbound on Matrix.

## What I thought it was

First hour: network glitch. Reboot. Wait.

Six hours in: not a reboot. SSH timeout isn't DNS. Ping timeout isn't Tailscale. The box itself is unreachable.

Twelve hours in: I started auditing what I'd changed in recent sessions. A new container, a config edit, a pending service. Suspicious timing.

None of it was destructive. None of that kills a box.

Twenty-four hours in: I accepted it wasn't something I did. Hardware.

## The diagnosis

Cause: **dead PSU in a small-form-factor host with a proprietary power supply.**

This is a recurring failure mode on this class of hardware. Small-form-factor business desktops use non-standard PSU form factors — you can't drop in a standard ATX PSU, you have to buy the vendor-specific replacement. And they die on a predictable schedule.

Symptoms that match: complete power loss, no POST, no fans, no lights. Drives spin up if you hotwire them but the board is bricked.

## The recovery

Drives were fine. ext4 journals replay on mount. I pulled the drives, put them in a USB dock, and mounted them read-only on another host in the fleet.

I tried mounting them on Windows via WSL for easier access. Failed. The USB dock's bridge chip isn't supported by WSL2's disk passthrough. Worked fine on Linux directly.

State captured. Nothing lost.

## What's still broken

The services that ran on the dead host are all down. Most can be rebuilt elsewhere — configs are in the recovered disks. Some are painful:

- **The Matrix homeserver** — can be rebuilt from Postgres backups. But every agent on the tailnet will need to re-authenticate, which means the OTK-exhaustion dance across the fleet.
- **The media library** — safe on the recovered RAID disk. Mountable on a new host.
- **Metrics history** — safe on the recovered disk. Spin up on a new host with the old data.
- **The agents** — each has its own state dir. Recovered. Each needs to be re-homed on whatever new host I pick.

## The decision

Four options on the table:

| Option | Cost | Time | Long-term |
|---|---|---|---|
| **A.** Replace the PSU with another vendor-specific unit | ~$80 | 1 week (parts) | Recurring failure mode — this happens again |
| **B.** PSU + UPS | ~$190 | 1 week | Same hardware, slightly more protected |
| **C1.** Refurbished tower (standard ATX, replaceable parts) | ~$300 | 3-5 days | Standard parts, last-replacement-for-a-while |
| **C3.** New Mini-ITX build (low-power, SSD-only) | ~$500+ | 1-2 weeks | Purpose-built, future-proofed |

A and B are the cheap options. Same hardware. The PSU died at 18 months last time. It dies at 18 months again.

C1 breaks the proprietary-PSU loop. Standard ATX means I can swap a dead PSU in 20 minutes for $40, not 7 days for $80.

C3 is the over-engineered answer. Lower power draw, smaller footprint, harder to justify on a personal-fleet budget.

C1 is the right answer technically. Cash flow is the constraint. A refurb tower is ~$300 — not nothing on a personal-fleet budget, especially with the blog and the agent stack both pre-revenue. So I'm sitting with the options open. Buying A buys time. Buying C1 buys out of the loop. Either is honest; I just haven't picked yet.

## What I'd do differently

Three things:

1. **Monitor hardware age.** The dead PSU had ~18 months on it. That's the death window for this class of hardware. Calendar reminder at the 12-month mark for any proprietary-PSU host.
2. **Distribute services earlier.** Single-host homeserver is the real pain. Should have run the primary on host A with host B as a standby. The orchestration work was supposed to get there; it didn't.
3. **Test disk recovery before you need it.** I assumed WSL2 could mount ext4 via USB dock. It can't. That cost me half a day. Verify the recovery path before the failure.

## What happens next

The dead host's disks stay mounted read-only on a recovery host until I commit to hardware. Services stay down until then. It's not the cleanest place to be, but it's where the rebuild actually is.

Server's down. Next post is whatever ships next.
