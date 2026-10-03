---
title: "Node sized its heap to half the memory cap. The fleet OOM-looped all day."
description: "Node 22 derives its V8 heap from the cgroup limit — heap ≈ MemoryHigh/2, measured twice. A lower cap silently shrank every heap on the fleet, and the busy agents OOM-looped."
pubDate: 2026-09-25
tags: ["infra", "ai"]
mode: "hobart"
tool: "claude-code"
kind: "debug-story"
draft: false
---

> A memory cap landed on the fleet at 06:46. By 08:16 the busy agents were OOM-killing in a loop. Root cause: Node 22 sizes its V8 heap from the cgroup limit — heap ≈ MemoryHigh/2, verified empirically. Lower the cap and the runtime shrinks every heap without asking.

## What changed

One systemd knob: `MemoryHigh=512M` on the fleet's agent units. Intentional containment for runaway memory. It landed that morning, the units restarted at 08:16, and the crash reports started within the hour.

One agent OOM-killed eleven times. Another twenty-plus, restarting every 20 to 25 minutes. Two more died a handful of times each. The quiet units looked healthy.

They weren't healthy. They were small. Hold that thought.

## The loop

The failure had a clean shape: process allocates, the kernel kills the cgroup, systemd restarts it, process allocates, kill, restart. Every restart looked clean in the logs. Nothing pointed at a leak, a bad deploy, or anything the app could see. The unit was doing exactly what its configuration said. The configuration was the bug.

The tell was who survived. Units whose working sets fit under ~259MB never met the killer. The busy ones — long embedded runs, big contexts — crossed the line over and over. The number 259MB was the clue. Nothing in my config said 259.

## The measurement

Node 22 sizes its V8 heap from the cgroup memory limit. Not a fixed default — a fraction of whatever the kernel reports. On this fleet, measured twice, the fraction is one half:

| cgroup memory cap | V8 heap Node chose |
|---|---|
| 512M | ~259MB |
| 2560M | ~1328MB |
| no cap | ~4144MB |

Cap at 512M and Node gives itself ~259MB. Cap at 2560M and it takes ~1328MB. Uncapped, ~4144MB. Heap ≈ MemoryHigh/2. That rule applied silently to every unit.

So the morning the 512M cap landed, every heap that would have been ~4GB uncapped became a 259MB heap. Node believed it had less address space to play with, and its GC behavior changed to match. Busy processes crossed the 512M line anyway — heap plus everything else a Node process carries — and the kernel killed them. systemd brought them straight back into the same trap.

## The fix

One flag, set explicitly in a drop-in:

```ini
[Service]
Environment=NODE_OPTIONS=--max-old-space-size=1280
```

`--max-old-space-size` overrides the derived default. The flag is a ceiling, not a reservation: the heap grows toward 1280M when the workload demands it instead of thrashing at 259M, and the cgroup cap still contains real RSS. On the worst unit, anon memory plateaued at ~355–360M after the fix — comfortably under the cap.

Verification, same night: 7 heap-kills in the twelve hours before the flag, zero after. The restart-every-25-minutes unit went quiet. The override rolled out fleet-wide the following night.

One measurement note worth stealing: judge by anon, not `memory.current`. Page cache pins `memory.current` at the cap, by design. It reads 512M forever and tells you nothing.

## The mirror image

Days later, the same lesson from the other direction. A unit with a fat cap: MemoryHigh 2.5G against V8's uncapped default of ~4G. A large run blew past 2.5G, cgroup reclaim swapped anon pages to zram, and the event loop stalled in D-state on swap-in — 200-second stalls. systemd SIGKILL'd the unit at the 90-second mark, twice in one night, 21:24 and 22:33 UTC.

Fix: cap the heap a full gig below MemoryHigh (`--max-old-space-size=1536`) and set `MemorySwapMax=0`. An over-cap process now dies a clean OOM-kill and restarts in 17 seconds instead of wedging the event loop in swap-in.

Both directions, one lesson. The runtime's default sizing and your cgroup limit are independent decisions. When they disagree, the kernel settles it.

## Two drop-in gotchas

Both silent, both found in the same RCA:

1. **Sort order.** systemd concatenates a unit's drop-ins in lexical order, and a later `Environment=` for the same variable replaces the earlier one. No merge, no warning. A file named `80-heap.conf` sorts before other overrides and its cap gets clobbered by whichever file loads last. Name override drop-ins with a `zz-` prefix so they sort last and win.
2. **Quoting.** Unquoted, `Environment=NODE_OPTIONS=--max-old-space-size=1536 --heapsnapshot-signal=SIGUSR2` drops everything after the first space. systemd reads the space as a separator and the second flag vanishes. Quote the whole value: `Environment="NODE_OPTIONS=--max-old-space-size=1536 --heapsnapshot-signal=SIGUSR2"`.

Neither bug shows up in `systemctl status`. Verify with `/proc/PID/environ` after every restart.

## Set the flag

If you run Node in containers, the runtime reads your limits and makes sizing decisions you didn't ask for. Node 22 derives the V8 heap from the cgroup memory limit — measured at half, twice. Every cap change silently re-sizes every heap on the box, and the failure mode looks like a leak or a bad deploy until you check the derivation.

Set `--max-old-space-size` explicitly. Derive it from the workload, keep it about a gig below MemoryHigh, quote your multi-flag `Environment=` lines, prefix override drop-ins `zz-`, and set `MemorySwapMax=0` so failure means a fast restart. Then verify via `/proc/PID/environ`, because a drop-in that lost the sort-order coin flip will not tell you.

Fleet's been clean since the flag landed. Zero heap-kills where there were 7 in a twelve-hour window. The cap does its job. The heap does mine.

If you made it this far, I appreciate it. — JN
