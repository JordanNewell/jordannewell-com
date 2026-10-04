---
title: "Zero posts in August: jordannewell.com moved, it didn't die"
description: "August 2026 produced zero posts on jordannewell.com because the site was reshuffled behind a splash and the operator went heads-down at DW Trim. The receipts: six commits (three mine, three robots'), a fleet that ran unwatched, and a full restore on 2026-10-03."
pubDate: 2026-08-31
tags: ["ventures", "rebuild", "construction"]
mode: "hobart"
kind: "decision"
draft: false
---

> August 2026 is the first silent month in this blog's history: zero posts. jordannewell.com wasn't deleted and I didn't quit. The tree moved behind a splash on 2026-07-28, the work moved to a carpentry company in Tampa Bay, and the blog-era tree came back on 2026-10-03 with the archive intact. This post is the receipt.

## The reshuffle, in commits

On 2026-07-28, commit 0e80cd5 did one thing: moved the blog routes, the portfolio pages, /now, and /ventures into `src/pages/_disabled/`. Nothing was deleted. The same day shipped the coming-soon splash (bc610b0) and the Astro Cloudflare adapter plus wrangler tooling (a08b3bf) — build plumbing for what the splash was scaffolding.

The next day proved the reshuffle was selective, not a wipe. On 2026-07-29, c2a044e un-retired the /projects/* routes and b3cce93 added 4 project pages. The diary went dark; the artifact shelf stayed lit.

`_disabled/` is a parking lot, not a graveyard. Anyone who read "coming soon" as "gone" wasn't reading the commit log.

## What August actually holds

The honest count from `git log`: six commits touched this repo in August 2026. Three are mine. Three are dependabot's.

| Date | Commit | What |
|---|---|---|
| 2026-08-06 | 40cccdc | `.gitattributes` — line-ending normalization |
| 2026-08-08 | a36c3f0 | SECURITY.md — GPG fingerprint, 72-hour acknowledgment SLA (NEW-159, PR #8) |
| 2026-08-10 | 8eb8ddb | dependabot auto-merge workflow |
| 2026-08-10 | 78df5d3, cfc6b89, 0c204eb | three dependabot bumps |

That's the whole month. The last human commit on main landed 2026-08-10; the next one is dated 2026-10-03. September's only activity before that was dependabot merges. A gap this clean isn't neglect — it's attention priced somewhere else.

August wasn't uncatalogued. The catalogue lives in another repo: 48 commits in the DW Trim build against six here. The ledger exists — this blog just isn't where August wrote it.

## Where the attention went

DW Trim. The /now page — updated 2026-07-22, six days before the reshuffle — announced it: joining as Managing Partner of a carpentry company scaling past greater Tampa Bay. [/ventures](/ventures) carries the deal shape in public: real equity, P&L ownership, operating responsibility, "not advisory, not passive." Dante Woodson owns the trade as principal craftsman; I own the backend — operations, tech stack, the scaling playbook.

NewellsWork, the prior contractor-services business, is described on /ventures in plain words: "Half-dead now, but the playbook (and the scars) carried forward." DW Trim is where that playbook gets spent.

The backend I own shipped in August. The build repo reopened 2026-07-20 from the May site backup — one Next.js app for marketing, booking, and back office — and August put 48 commits on it, 22 on 2026-08-15 alone. Launch day was 2026-08-24, eighteen commits: marketing live, booking and the visualizer gated behind feature flags until they earn exposure.

The booking system underneath: a four-step flow with timezone-correct availability generated from staff schedules, CalDAV sync of confirmed bookings, a manage/cancel page keyed by booking UUID, and a single-admin back office — eight Postgres tables behind Drizzle and Auth.js. An AI chat widget on every public page answers from the same business data the site renders and degrades to scripted intent-matching when the provider is down. Production runs on the mailcow edge: the same nginx that terminates mail TLS proxies dwtrimco.com to the app container.

August carried a second thread: researching where an operator with a fleet is most viable in a market this early. That work lives in notes and conversations, not commits — no dates to cite, and none invented.

The agent fleet followed the work. /now put the fleet at 17 OpenClaw agents and 2 Hermes across 10 hosts when the reshuffle started. The count runs 30 now — the fleet grew while nobody was cataloguing it. The newest hire was construction-side: Gail, the head-of-construction agent, running bid work.

## What ran unwatched

The fleet ran through August without an operator reading it. Three receipts, dated.

2026-08-15: credential leak number nine. pat-scanner — the guard shipped 2026-07-27 — let it through because every path pattern used forward slashes and Windows hands tools backslash paths. The hook had matched nothing its entire life.

The heartbeat default ran longer and cost more. OpenClaw's heartbeat is default-ON, and a housekeeping cron was wiping the HEARTBEAT.md note that kept the agents quiet, every five minutes. The bill: roughly 800 wasted model runs a day across the fleet, composed mostly of "still here." Found 2026-09-27, in forty DMs — undetected through all of August.

The mail died of unread mail. Hetzner's dunning thread sat "three warnings deep" before the 2026-09-28 suspension IP-blocked inbound traffic at the provider edge while every liveness check reported the host alive.

The same edge carried dwtrimco.com. The suspension darkened a launch five weeks old along with the mailbox — thirty minutes from paid invoice to green.

Everything was running. Nothing was being read. Autonomy scales the work and the silence at the same rate, and the August lesson is that an unattended fleet still bills like an attended one.

## The tree comes back

On 2026-10-03, commit 33dbc24 restored the blog-era tree — the pre-splash snapshot from 9445898 — and carried the posts written during the dark stretch. Seven posts landed that day: the billing suspension, the heartbeat storm, the v8 heap fight, the mid-bid takeover, and the rest. The archive came back whole — every post, nothing lost, nothing renamed.

The revamp the splash was scaffolding for lives on the site-v2 branch, bound for dev.jordannewell.com — commit 711ee05 is the emoji dock and social-emoji work. The deploy script grew an ENV_FILE override for a second target (0ebac44) with a `.env.dev.example` scaffold: same box, different web root, one command. Production carries the blog; the dev mirror carries the experiment. Two deploy targets, on purpose — the next loud redesign doesn't get to take the main site down with it.

Silent month, itemized: the site moved, the work moved to where the stake was, and both came back on 2026-10-03.

If you made it this far, I appreciate it. — JN
