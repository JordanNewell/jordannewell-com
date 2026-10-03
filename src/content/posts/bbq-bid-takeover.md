---
title: "Agent down mid-bid. The call: keep it dead and take the work myself."
description: "My construction agent went silent halfway through a live commercial trim bid. Restarting into the same death wasn't a plan. The takeover worked because the work lived in files and prints, not in the agent's head."
pubDate: 2026-10-03
tags: ["ai", "construction"]
mode: "hobart"
tool: "claude-code"
kind: "postmortem"
draft: false
---

> Mid-bid yesterday, my construction agent went silent. Live commercial work on the other side of the silence, and the agent driving it was dead. I didn't restart it. I took the bid over myself and shipped it. The postmortem comes down to one question: when an agent dies mid-work, can you take over?

## What died

Gail is my head-of-construction agent. Discord-connected, runs as a console-bound scheduled task. Console-bound instances have a known death mode in my fleet: the instance dies and doesn't come back clean. Known class, known behavior. It doesn't fix itself between restarts.

The bid was a commercial trim-carpentry package for a BBQ restaurant buildout in Florida. Full-service remodel — dining room, drive-thru, patio. GC-driven, and the drawing set carried at least six addenda. Gail was partway through it when the instance died.

Two options on the table. Restart Gail and hope the instance comes back healthy, or leave it down and take the bid over manually.

The call: Gail stays down. Restarting into the same death isn't recovery, it's a coin flip with live money on the table. I opened the bid in Claude Code and took it over myself.

## What the takeover stood on

No handoff doc. No agent memory worth trusting. The environment was the bid files, the prints, and Claude Code. That's the whole reason a takeover was possible: the work lived in files and prints, not in Gail's head. An agent death cost process time, not work.

The scope is tight by design — a six-line bid sheet for the trim package. The material list carries the scope rulings. Porch out. Doors out. Durock out. Blocking out. Paint out. Cove base out too, because the A-1.4 prints assign tile cove to the tile trade. Not trim. Scope stripping is most of a trim bid, and every ruling traces to a sheet.

Next to the material list sits a quantity-callout reference doc: every number traced to its sheet and page, the math shown, the drawing scale calibrated against known dimensions before anything got measured. Beside that, an 18-entry discrepancy log of everything in the set that disagrees with itself.

## The flips

Every number that moved, moved the same way: a schedule said one thing, the elevations said another, and the elevations won.

The corrugated-metal wainscot was under-counted by roughly six times. The schedule's number wasn't close.

The dining room's tongue-and-groove mostly isn't there. The schedule implied wood; the elevations show drywall. Counting it would have priced scope that doesn't exist.

One window type had been counted off a schedule when the elevations carry more of them than any single sheet displays. Recounted from the elevations, that trim length tripled.

The booth cap lengths had been counted from a seating schedule. Seating schedules list seat-equivalents, not physical structures, and the floor plan shows fewer structures than the seat count implies. Seat-equivalents and booth structures are different units. Only one of them is buildable.

None of that is cleverness. It's reading the drawings against each other — elevations against schedules, plans against details — with the scale calibrated first. Each flip was hiding behind a number that already looked finished.

## Three keynote systems

The set runs three colliding keynote systems, and the keynotes are per-sheet. A keynote legend describes its own sheet and nothing else. Cross-read a callout on one sheet against a legend from another and you get a confident wrong answer.

That's the detail a confident number hides. On a set with six-plus addenda and per-sheet keynotes, "the drawing says" is a claim you earn sheet by sheet.

## The discipline

The bid text stays the client's own six lines. One change: a single line struck, a vendor-package divider with no fabrication detail behind it. No lines added. No rewording. No improvement. KISS, enforced on myself.

Everything the forensics turned up that doesn't belong on a bid sheet goes in an email to the GC instead. The bid is the client's document. My findings are my findings. The moment findings leak into the bid text, the client's words stop being the client's words.

The material list landed below Gail's in-flight estimate once the forensics were done. That's what confident numbers cost.

## The point

Agents die mid-work. That part isn't interesting; the failure class was known. What's interesting is what the death costs. Here it cost time, because the work was in files and the truth was in prints.

Two things fall out of it.

Takeover-ability is a design requirement, not a nice-to-have. If the work lives in the agent's head, a death is a reset to zero. If it lives in files, a death is a staffing change.

Print forensics beat confident numbers. Calibrate the scale. Cross-read the elevations against the schedules. Check the keynote legend per sheet. The number that survives that process is the only one worth shipping.

Gail stays down until the console-bound failure class is fixed. The bid went out on the client's own words.

Agents will die mid-work. Build so it doesn't matter.

If you made it this far, I appreciate it. — JN
