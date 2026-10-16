---
title: "The signal was public for six months"
description: "MedRecall ingested 17.4M adverse-event reports the FDA publishes and ranks a manufacturer's device portfolio for post-market review, daily, with a ~6-month horizon. Why I built it: the drift that precedes a recall is public data — ranked nowhere, read by no one in time."
pubDate: 2026-10-16
tags: ["medtech", "venture"]
project: "medrecall"
mode: "hobart"
tool: "claude-code"
era: "2026-fleet"
kind: "decision"
draft: false
---

A recall announcement always reads like it came from nowhere. It never does.

Before the announcement there are the reports — thousands of them, filed by providers, manufacturers, and patients into the FDA's public MAUDE database, each one a data point about a device drifting somewhere between "working" and "recalled." The FDA publishes all of it through openFDA, free, no gate. [MedRecall](https://getmedrecall.com) exists because that signal is public for months and, as far as I can tell, nobody ranks it while it can still change what a manufacturer does first.

## The window nobody works

The commercial tools in this category are monitors. They match FDA recall notices to a customer's inventory after the agency acts, so compliance can file the paperwork. That's a real job and they do it fine — but by notice time the decision window is closed. The recall already happened.

The window I care about is the one before it: device performance drifting, adverse-event volume shifting, severity language changing, months before anything is official. That window is where a QA/RA team with the right priorities can act — investigate, remediate, pull inventory, brief leadership — while it's still a decision instead of a response. Nobody works it because working it means reading 17.4 million adverse-event reports, most of them noise, in a database the FDA's own documentation warns against naive use.

That's the whole reason the product is the methodology and not the data access. MAUDE underreports. Causation is unverified. You cannot compare rates across devices. High report volume is not high danger — sometimes it's a reporting-regime change, sometimes it's one notorious case generating duplicates. So MedRecall ingests everything — 17.4M+ reports and counting, MAUDE plus recall enforcement records — links and deduplicates, treats the pre- and post-2019 reporting regimes as structurally different, and then computes what actually means something: 30/60/90/180/365-day velocity and acceleration, severity language scoring, manufacturer recall history. Trajectory, not counts. It re-ranks daily and carries a roughly six-month review horizon per device family, because the point is lead time, not a dashboard.

## Decision support, not determinations

I want to be precise here, because the precision is the product. MedRecall ranks. It scores, flags, prioritizes. It does not predict recalls, and I won't let it claim to — the output is a ranked queue of which devices in a manufacturer's portfolio deserve post-market review first, with the features that drove each score exposed so a QA lead can argue with it. A flag should mean something, so the model is tuned for high specificity, not volume.

The judgment stays with the manufacturer's people, always. This is decision support for QA/RA teams: not a prediction of regulatory action, not medical advice, not clinical decision support, and not a substitute for any regulatory obligation. It's built entirely on public openFDA data. No patient data is collected. MedRecall is not affiliated with, endorsed by, or sponsored by the FDA — it's a company that read the public record more carefully than the public record's size permits most people to.

## The commercial part, stated plainly

MedRecall is in beta. Pilots are by application — email info@getmedrecall.com with your device families and portfolio size — at $499/month, and I'm keeping onboarding application-only on purpose: while the customer count fits in my head, every one of them gets walked through the method, what the scores mean, and where the data's limits are. That discipline is easier to keep than to restore.

Yes, it's a business. It has to be, to keep ingesting and re-ranking 17.4 million reports every day. But the intent came first: most device harm that leads to a recall announced itself in public data months earlier. Somewhere in those millions of rows is a drift a team could be working right now instead of a deadline later. Ranking it in time is the difference I built this to make.
