---
title: "Walk-back ships faster than build-out: the Pro tier my README invented"
description: "When documentation promises a product that doesn't exist, walking the docs back ships faster than building the product — and the walk-back is the honest ordering, not the shortcut."
pubDate: 2026-07-29
tags: ["ai", "tooling"]
mode: "hobart"
tool: "claude-code"
kind: "decision"
draft: false
---

For five days, the curtis-compliance README promised a product that didn't exist.

curtis-compliance is an open-source compliance CLI. v1.3.0 shipped with open-core positioning: an MIT core, free, plus a paid Pro tier coming separately. The positioning was fine. The claims were not. The README told users to run `npm install @jordannewell/curtis-compliance-pro`. No such package existed. It linked to `curtiscompliance.com/pro` — a domain I don't own. The landing page carried a Pro call-to-action. The CLI's `license` subcommand printed install instructions for software that isn't on npm.

Four false claims, published, in the document people read before they decide whether to trust the tool.

## How a README ships a lie

Not through dishonesty. Through aspiration. I wrote the open-core section the way I wanted the product to look: Pro exists, here's how to get it. Marketing copy describes the future. A README describes the present. I wrote the future and published it as the present. Review missed it because every line read exactly like the plan.

The tell sat in my task list the whole time. The item read "build the Pro tier." It was flagged the most important open item for five days while not getting built.

For the record, this was a repeat offense. An earlier Curtis project had already shipped links to a domain I didn't own. The pattern survives corrections unless you add checks for it — the list at the end of this post exists because of that.

## The fork

An item like that has two exits. One of them is a build.

Exit one: make the docs true. Ship Pro — a hosted GitHub App, license handling, multi-repo audit rollup, PDF export. Real work. Days to weeks for one operator, and the README keeps lying through every day of it.

Exit two: make the docs honest. Thirty minutes. Five file changes.

I took exit two. v1.3.1 shipped the day I read the item correctly. The README now describes Pro as "in development, not yet available" and points at the public stub repo. The landing-page CTA is gone. `printProAbsent()`, the function behind the `license` subcommand, no longer prints an install command for a package that doesn't exist or a URL I don't control. Version bumped, changelog written, published to npm. Run `license status` and it tells the truth.

Five file changes closed a five-day integrity bleed. The bleed was the bug, not the missing tier.

## Why walk-back wins

Docs and reality diverged. Two repair directions exist. Move reality toward the docs: build the thing. Move the docs toward reality: delete the claim. One takes editing time. The other takes shipping time. That asymmetry sets the order on its own.

Speed isn't the strongest argument, though. This is: you can re-add a claim. You can't unlie one. The day Pro ships for real, the README gets its line back and the claim lands true, and nobody remembers the gap. Until then, every day the false claim stands is a day someone can paste the install command, watch it fail, and discount everything else the README says, including the parts that are true. The lie runs around the clock. Only the walk-back stops it today.

The compounding runs in opposite directions too. Walk-backs compound trust: a changelog entry admitting the claim was premature reads as an operator who corrects the record. Build-outs mounted to rescue a claim compound deadlines: the tier ships late and rushed, and everyone who tried the install command in the meantime already left.

This is not the shortcut, either. That framing has the direction backwards. The claim was false. The fastest path to a true README is removing the false claim, not building the product the claim described. Pro stays on the roadmap. The walk-back doesn't cancel the build; it separates the two problems so each gets honest work. Docs true now. Tier real later.

## The checks

If you ship docs, steal these:

- Any URL in a README you haven't personally registered and deployed is a claim, not a link. Verify it or cut it.
- Any install command is a promise. Run it before publish. If it fails, the README is wrong, not the registry.
- Test the runtime message, not the source. Reading `printProAbsent()` showed me the URL. Running the command showed me what users see. Source review and runtime review are different checks, and the second one is the one that catches published lies.
- When a list item sits for days, re-read it before you work it. "Build the Pro tier" was build-framing on a truth problem. The item was never "build the thing." It was "stop claiming the thing."

That last reframe is the portable one. The longest-running item on your list is often there because you framed a claim you should delete as a product you should build. Deleting ships in minutes. Building ships when it ships. Delete first, then decide whether the build is still worth it — with a clean record and no clock running.

## The point

Pro still ships. Hosted app, audit rollup, the whole tier — on its own schedule, not the README's. The day it lands, the claim comes back one line long and true.

The divergence took thirty minutes to fix. The product takes as long as it takes. In that order, every time.

If you made it this far, I appreciate it. — JN
