---
title: "Nothing is healthy because it says so"
description: "Twenty-six posts of postmortems, one thesis underneath all of them, never stated in one place. Stated: health is a claim, the check runs from outside, and provenance is born signed or it's hearsay."
pubDate: 2026-10-05
tags: ["rebuild"]
mode: "hobart"
kind: "decision"
draft: true
---

> On September 28 the mail host answered pings for the entire time it was down. Pongs arrived over DERP relays, the VM stayed up, outbound worked — and every inbound port was blocked at the provider edge. Alive the way a mannequin is alive. Twenty-six posts in, that outage is just the loudest example of an argument this blog has been making since July without ever stating it in one place. This is the statement.

## The mannequin

[The mail outage](/posts/hetzner-billing-suspension) is the cleanest image in the archive because nothing was wrong with the checks. `tailscale ping` returned pongs. The VM was up. Outbound worked. Every check built to answer "is the host alive" answered yes, and the host was unreachable from the public internet and from inside the tailnet. The monitoring was accurate. It was monitoring the wrong thing.

A pong is a heartbeat. A heartbeat is not a service. That sentence generalizes across everything this blog has posted. systemd says `active (running)` while the fleet can't talk. HTTP says 200 while the terminal renders nothing. A README says Pro exists while the package doesn't. The claim and the condition are different objects, and the claim is always cheap, always available, and wrong at the worst moment.

Which gives this blog its spine, stated once:

**Trust is a check that runs outside the thing being trusted.**

Nothing is healthy because it says so. It's healthy when something outside it — a client, a drill, a signature, a witness — says so, in a form the thing being checked cannot produce on demand. Everything below is that rule, earned one outage at a time.

## The apps tell you. The plumbing doesn't.

Week one of this blog, a media pipeline [came back from twelve hours of silent death](/posts/arr-pipeline-rebuild) with six root causes stacked under the symptom. Five hours to find layer one, because when DNS fails, every upstream error looks the same — "Host not found" from a dead tracker and "host not found" from a dead resolver are the same string. The apps at the top of the stack will always tell you they're failing. The infrastructure underneath won't. Monitor the primitives: resolver health, exit-node presence, peer count.

Two days later, the same shape in different clothes. [A routine Synapse restart](/posts/synapse-restart-broke-e2ee) silently broke encrypted replies across the whole tailnet. systemd green on every agent, 200 OK on every `/sync`, fleet silent for four and a half hours — and the four and a half hours is time-to-detect, not time-to-fix. The check that would have caught it in twenty minutes alerts on an absence: this agent should have sent an encrypted event by now and hasn't. Who monitors for something not happening? Nobody, by default. That's the point.

The out-of-band check also has to run against the things that work. [The homeserver audit](/posts/synapse-audit) found four P0s — placeholder credentials among them — on a server healthy by every operational metric. None of it would have shown in monitoring, because nothing was failing. Audit the thing that works. That's where the placeholders live.

And it has to run against the degraded paths. When [GitHub's events API stripped the commits field](/posts/github-events-strip-commits), my homepage terminal rendered an empty feed under a green status line. A fallback proves itself by rendering the same data as the primary, not by returning HTTP 200.

## The defaults assumed I was watching

September ran the experiment: what does a fleet do unattended? [The bill arrived in four days](/posts/september-unwatched-fleet) — an OOM loop on 2026-09-25, a heartbeat burning roughly 800 model runs a day on 2026-09-27, the suspended mail host on 2026-09-28. The repo holds the receipt for the gap: last human commit 2026-08-10, and between that date and 2026-10-03 every merge was dependabot. Nothing errored. A fleet left unattended doesn't stay healthy. It stays configured.

The heartbeat incident sharpened the rule. The fleet was quiet because a markdown note told it to be, and a housekeeping cron rewrote that note — fresh frontmatter, empty body, quiet rule deleted — every five minutes. Quiet by document, not by config. A file that documents intended state is not enforcement. The fix was one config line that survives a rewrite, plus a flipped default: anything that bills per run is off unless someone turns it on, at a cadence someone chose, for a reason written down next to it.

Defaults assume a witness. Every default kept executing faithfully while I was gone. Configuration never escalates. It just runs.

## The work lives in files

On 2026-10-03 my construction agent died halfway through a live commercial trim bid. I didn't restart it — restarting into a known death class isn't recovery, it's a coin flip with live money on the table. I took the bid over myself, and the takeover worked for one reason: [the work lived in files and prints](/posts/bbq-bid-takeover), not in the agent's head.

If the work lives in the agent's head, a death is a reset to zero. If it lives in files, a death is a staffing change. Same thesis, different coat. The agent's memory is the thing being trusted, and it is not a check that runs from outside. Files are. Anyone — me, another agent, a successor — can re-run the work in a file. Nobody can re-run what died with the process.

## Born signed, or hearsay

[The Claudeway ship](/posts/claudeway-signed-transcripts) put the principle on the record: the record of how a decision was reached is either born signed or it's hearsay. An unsigned consensus is a rumor with a model name attached. Signing on day one cost one pip extra. Retrofitting costs the whole archive — you end up signing a claim about history instead of history.

When the record is wrong, the ordering is fixed. [A README that promised a Pro tier that didn't exist](/posts/walk-back-ships-faster) bled trust around the clock for five days until the claims came out. You can re-add a claim. You can't unlie one. Provenance and correction are one discipline: the record only counts if it's verifiable and true, from the first commit.

## What the next 90 days owe

[Day 0](/posts/day-0) promised, in public, one manifesto-style drop inside 90 days. This is it, dated 2026-10-05 — a week inside the window. The same post promised ten substantial posts; twenty-six shipped. The scorecard stays public, wins and misses both.

The obligations this manifesto creates: every service gets a check that runs from outside it, asking a client's question. Backups get restore drills — a backup that has never been restored is a hope with a schedule attached, and the first mailcow drill pulled the archive in 7.8 seconds and found three gaps a runbook review never would have. Agent work lands in files by default, memory as cache at most. Anything that decides gets signed when it's made, not when it's asked about. And the fleet keeps a witness, because the defaults haven't changed their assumptions. I just stopped meeting them.

The server answered pings the whole time it was down. Everything in this archive follows from taking that sentence seriously.

If you made it this far, I appreciate it. — JN
