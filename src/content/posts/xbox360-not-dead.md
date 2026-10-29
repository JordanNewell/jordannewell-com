---
title: "The red ring was a loose plug"
description: "Four red rings, a presumed-dead Xbox 360, and the plug that wasn't seated. Then the actual project: host-only USB, a 100 Mbps Ethernet lane, and the JTAG-vs-RGH3 fork."
pubDate: 2026-10-29
tags: ["hardware", "tinkering"]
mode: "hobart"
kind: "decision"
draft: true
---

Four red rings. The diagnosis writes itself — the red ring of death is console shorthand for dead, twenty years of forum lore. The console booted clean thirty seconds later, because the four-ring pattern doesn't mean hardware failure at all. It means "no video cable detected." The AV plug on a fat 360 seats deep and stiff, reads as seated when it isn't, and the console announces the resulting no-signal as a ring pattern everyone has been trained to read as a funeral.

Context that raises the stakes: this console was days from a donation box. It had been living at a family member's house, surplus to requirements, one errand from gone. The four rings were the last thing it ever had to say for itself.

Reseat the plug, lose the rings. The console is fine. The scariest error message in console history is, in this case, a cable check.

Worth knowing before anyone parts out a "dead" 360: the ring quadrants encode different faults, and four rings is the benign one. General hardware failure is three. The one everyone remembers is the one that isn't fatal.

## USB is a dead end, permanently

The goal was to park the 360 next to the workstation and treat it like any other lab device. USB first, obviously. Dead end, and not a "try harder" dead end: the 360's USB ports are host-only. They talk to controllers and drives; they never enumerate as a device to a PC. No driver, no cable, no adapter changes that — the controller on the other end of that conversation doesn't exist in the protocol. Verified empirically: zero device arrivals at the OS level with the console plugged in and booted.

Fine. Everything old has Ethernet.

## The Ethernet lane

Direct cable from console to the workstation's spare built-in port. Link up at 100 Mbps — which is a feature, not a problem: the fat 360 tops out at 100 Mbps, so gigabit at the other end would mean I'd cabled into the wrong device. The link speed is a fingerprint.

The workstation's main port stays on the LAN; the spare port runs Windows Internet Connection Sharing, which hands out its fixed, well-known address block and turns the workstation into the console's router. The 360 hasn't joined yet — the stock dashboard won't pass its splash screen without a controller signal, and USB keyboards navigate inside the dash but generally can't get past the splash. An original 360 controller fixes the gate; the newer wireless pads don't speak the protocol.

## The actual project: old kernel or nothing

The point was never to play games on it. Honest accounting: gaming is under one percent of how I spend time on a machine. The household is the gaming wing — my family unwinds on the thing and loves it, and I'm glad it exists for that. It's just never been my forte. What the 360 offers me specifically isn't the games. It's that a fat 360 is a Hackable Machine with a documented fork in the road, and the fork is time-sensitive:

| Path | Requirement | Cost | Notes |
|---|---|---|---|
| JTAG | Dashboard kernel at or below 7371 | Resistors, no chip | The original exploit; needs a never-updated console |
| RGH3 | Any kernel | A Pi Pico (~$5) doubles as NAND flasher and glitch chip | Glitch-based, works broadly, more moving parts |

The decision rule that matters: **never accept a dashboard update.** Every update pushes the kernel past the JTAG line permanently, and Microsoft stopped caring about this platform's security years ago — the only person an update helps is nobody. The first act after the controller arrives is checking the kernel version in system info, because that single number picks the branch.

## Why this is on an infra blog

Because the shape is identical to the fleet work. A "dead" system that's one reseated connection from healthy. A link speed that fingerprints the device. A decision that gets worse every day it's deferred — kernel 7371 eligibility only shrinks, the way backup gaps only grow. And the same first instinct: before replacing, verify the claim. Four rings was a self-reported claim about a cable. The console was vouching for itself, badly.

Controller's on the list. Kernel check next. If it's old enough, this ends with resistors and a flash dump; if not, a five-dollar microcontroller board earns a second job. Either way, the console that nearly went to the donation box with a four-ring eulogy keeps the shelf for another twenty years.
