---
title: "The fact-checker worked. That's why nothing deployed for four days."
description: "A CI guard that verifies docs claims against the live npm registry did its job on real drift, then silently blocked every site deploy for four days while commits stacked up behind it. The gate worked. The alarm didn't exist."
pubDate: 2026-11-06
tags: ["infra", "tooling"]
mode: "hobart"
series: []
kind: "postmortem"
project: "dot-curt"
draft: true
---

For four days, every deploy of the .curt docs site failed CI. Sixteen commits stacked up behind the failure. Not one of them reached production. And nothing about the pipeline looked broken, because nothing about the pipeline was broken: a required check was doing exactly what it was built to do, and nobody had wired a sound to it.

The window was 2026-11-02 to 2026-11-06. I found it while shipping something else.

## The guard

The .curt docs are generated against live state: package versions on npm, implementation counts, extension statuses. Docs written against a moving registry drift within hours, so the deploy pipeline runs a fact-checker — a script that pulls the registry's actual state and compares it against every claim the docs make. Versions, counts, statuses, the format's magic string. Any mismatch fails the build.

It earns its keep. On day one it caught three real drifts: stale version pins, a converter version that had bumped past what the docs said, a trailing-slash link bug. This is the check that stops "the docs say 1.0.2" from being true only in the docs.

On 2026-11-02 it caught a fourth: the paper's listening page said "v2" twice — a kicker ("The listening copy — v2, filed 2026-11-02") and the read-by credit — and the checker had no rule tying those strings to anything verifiable. Unverifiable claim, so: fail. Arguably strict. Definitely correct per its own contract. And then it kept rejecting, on every subsequent deploy, for four days.

## The failure that wasn't loud

Here's the sequence that made four days possible:

- The drift was real, so the gate failed. Correct behavior.
- The failure surfaced only as a red required check on the deploy workflow. Nothing else. No notification, no incident, nothing in any channel a human reads.
- Work continued normally. Commits landed on main — sitemap fixes, navigation updates, three new ecosystem pages. CI stayed green for the checks anyone watches. Only the deploy job went red.
- Deploys quietly stopped happening.

Each of those lines is defensible on its own. Together they produce a site frozen in time with a fully green-looking pipeline. The gate did its job; the job didn't include telling anyone.

I found it on 11-06 the honest way: merging a new ecosystem page, waiting for the site to update, and noticing it didn't. Not an alert. Not a dashboard. A human expectation failing.

## The fix, in two parts

**PR #19** dropped the two unverifiable claims and verified the backlog: after merge, all sixteen stranded commits went live and the site state matched main. The page that broke the pipeline didn't reach production until the fix for breaking it. The guard runs consistently now — the backlog landing clean was itself the test that the pipeline is healthy end to end.

**PR #20** is the part that matters more: a notify job. Deploy failure on main now fires a high-priority push notification. The failure path is finally audible.

One honest caveat, because the caveat is the lesson: the notify path has fired a test ping, not a real failure. The most dangerous job in the pipeline is now the one whose own failure mode is unexercised. A notification job that silently fails is 2026-11-02 all over again, one layer down. Exercising it for real is on the list, deliberately, soon, while I'm still thinking about it.

## The pattern

This is the second time this shape has bitten me. In October, [the Gitea migration](/posts/gitea-off-a-dying-disk/) surfaced a backup timer that had been dead for three months because every health signal in the stack reports claims and nobody pointed one at recovery. Same disease, different organ. The fact-checker verified the docs. Nothing verified the pipeline that runs the fact-checker.

The rule I'm carrying out of this one:

**Every gate you add to a pipeline needs its own alarm, wired at the same time as the gate.** A required check is not an alarm. A red X in a UI is not an alarm. An alarm is a thing that interrupts a human. If the only witness to your gate failing is the same person who has to be already looking, the gate is a silent off-switch with good intentions.

And the corollary for anyone shipping verification tooling: a guard that blocks deploys on real drift is a success story right up until it succeeds without anyone noticing. Build the loud path the same day you build the strict path.

The site is current again. The backlog shipped. The guard is still strict, and now, when it says no, I'll actually hear it.
