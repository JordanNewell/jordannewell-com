---
title: "The repo was never the leak surface"
description: "TokenHunt v0.1.0 shipped: 48 rules, 53 provider families, six hook surfaces, on PyPI. What shipping it settled: git-time scanning watches the wrong layer. The leak surface is chat time — the paste, the read, the tool return."
pubDate: 2026-10-16
tags: ["security", "oss"]
project: "token-hunt"
mode: "hobart"
tool: "claude-code"
era: "2026-fleet"
kind: "win"
draft: false
---

[The origin story is on this site](/posts/token-hunt/): eight credentials in nine days, every one a paste or an unsupervised agent read, and a scanner built out of the embarrassment. That post ended with pat-scanner guarding the fleet and a rotation list with a 72-hour deadline.

On October 15 the scanner underneath it shipped as its own thing. [TokenHunt](https://tokenhunt.dev) v0.1.0 is on [PyPI](https://pypi.org/project/token-hunt/) — 48 credential rules across 53 provider families, six hook surfaces, fail-closed by default, BUSL-1.1, zero cloud, zero telemetry. `pip install token-hunt` is the whole install.

## What shipping it settled

Building it confirmed the thesis. Shipping it made the thesis boring, which is the better outcome.

The category I was raised on — gitleaks, trufflehog, the git-time tools — scans history. The commits, the diffs, the push. That made sense when the leak surface was the repository. It stopped making sense the day your terminal became an agent runtime, because the leak moved one layer up and the scanners stayed where they were.

Watch the actual timeline of a modern leak. An agent reads a config file at full resolution. The key lands in a transcript. The transcript syncs to another machine. A later tool call re-emits the key as context. Thirty minutes pass — sometimes days. *Then* a paste carries it into a commit, and the git-time scanner catches it, proud of itself, at the last step of a chain it never watched.

The repo was never the leak surface. Chat time is: the paste, the read, the tool return. That's where TokenHunt lives. Six hooks on Claude Code out of the box; the standalone CLI watches any agent's transcript directory directly, so Cursor, OpenClaw, CI pipelines — anything that keeps a transcript — is covered by the same engine. It is not a feature of any one assistant, because the leak class isn't.

There's also the part regex can't see, which is where this whole thing started: the runtime classes — the bash parameter-expansion escape hatch, env vars whose contents ride into command lines, subprocess environments. Text matching has no answer for a secret that doesn't exist as text until bash runs it. Shape detection does.

## The commercial part, stated plainly

TokenHunt is freemium and I'm not going to pretend otherwise. The scanner is free and stays free — it does the guarding, locally, forever, no account. [Pro](https://tokenhunt.dev) is the paid tier on top: silent redaction, so your agent never sees the secret at all, plus live key verification against providers, so you know within seconds whether a finding is a live credential or a rotted one.

I have opinions about why this splits the way it does. Redaction isn't a nicer alert — it's a different guarantee, the kind teams with real agent fleets and real vendor obligations need, and building it well costs money. Charging the teams whose incident response depends on it is how the free scanner keeps existing without becoming someone's growth metric.

But the reason the project exists isn't the revenue. It's that leaked keys are the most preventable class of security incident in software right now, and the industry is scanning the wrong layer while everyone's typing speed gets faster. I leaked eight credentials in nine days being careful. I want the number of keys sitting in agent transcripts on someone else's machine to go down, and I'm willing to build the infrastructure for that and figure out the business second.

## Where it goes

Rotation workflow is in — scan, list, close, watch, until the key is turned over. Next is widening provider verification coverage and watching more runtimes, guided by whatever the fleet leaks next. There is always a next. The irony is the feature, and the feature keeps working.
