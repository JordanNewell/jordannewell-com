---
title: "Zero peers, dead DNS, and a pipeline I rebuilt from scratch"
description: "My Servarr stack silently died when a Mullvad exit node dropped off the tailnet. Six cascading root causes hid under each other. Five hours to find the first one."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude"]
tool: "claude-code"
kind: "postmortem"
draft: false
---

> qBittorrent showed 0 peers across every torrent. Every tracker returned "Host not found." The media pipeline had been silently dead for twelve hours. It took five hours to find the first root cause — and there were five more waiting under it.

## What the pipeline was supposed to do

Standard Servarr stack. qBittorrent pulls torrents through a Mullvad exit node on the tailnet. Radarr, Sonarr, and Lidarr track releases, talk to indexers via Prowlarr, and hand downloads to qBittorrent with a category. On completion, Completed Download Handling imports the file into the library. Jellyfin's filesystem watcher picks it up within sixty seconds. Hardlinks all the way down, so one copy on disk.

I'd migrated the media pool to a new disk a week earlier. The pipeline had been flaky since. I hadn't audited it. That's the setup.

## What broke

I sat down to trigger a Jellyfin scan and discovered the pipeline wasn't flaky. It was dead. Every layer had failed, and each failure was hiding the next.

Six root causes, stacked. The first — a Mullvad exit node dropping out of the tailnet ACL — was the headline. But fixing it revealed five more: container pref corruption from the drop, an agent that had bypassed Radarr entirely, stale queue paths from a disk migration, wrong root paths in the agent wrapper, and a Jellyfin metadata setting that failed silently against a read-only mount.

Six root causes. Each one looked like the obvious answer while I was standing on it.

## The dig

Five hours to layer one. That's the headline.

The first hour was spent diagnosing the symptom I could see: stalled downloads, dead trackers. Tracker problem, I thought. Indexer problem. Prowlarr. Each of those got checked and cleared. Nothing wrong with any of them.

Two hours in, I was looking at qBittorrent's connection state. Every torrent, zero peers. Across every tracker. That's not a tracker problem. That's a network problem.

Three hours in, the diagnostic that mattered: `tailscale exit-node list` inside the container returned "no exit nodes found." The exit node wasn't on the tailnet. Every DNS query from the container was dying in a black hole, and the error that surfaced — "Host not found" — looked identical to a dead tracker.

The lesson on layer one: when DNS fails, every upstream error looks the same. "Host not found" from a tracker and "host not found" from a dead resolver are the same string. The difference is whether your resolver is alive, and I didn't check that first.

Layers two through six surfaced one at a time as each fix revealed the next. Each one was its own fifteen-minute investigation, followed by a fix, followed by the next layer showing its face. That's the shape of a silent-failure stack — you fix the top, and the next one wasn't hiding. It was waiting.

## The fix

All six layers fixed over an afternoon. The specifics stay internal — paths, configs, agent wrapper details. What shipped alongside the fixes: monitoring on the primitives (exit-node presence, resolver health, peer count), a daily cleanup cron for stopped torrents, and a quality profile that stops fifty-gig ghost grabs from landing in the queue.

End-to-end verified: add a movie → torrent downloads → import via hardlink → Jellyfin scans inside sixty seconds.

## The lesson

Silent failures stack. Each one masks the next, and the symptom you see is always the top of the stack — never the bottom. A dead exit node looks like a dead tracker. A pref corruption looks like a container that won't start. A read-only mount looks like missing metadata. You fix the top layer, the next one shows its face, and the whole dig takes five times as long as the root cause warrants.

The only defense is monitoring on the primitives. Peer count, resolver health, exit-node presence. The apps at the top of the stack will always tell you they're failing. The infrastructure underneath won't.

## What I'd do differently

**Monitor the exit node.** The Mullvad drop was silent for twelve hours because nothing was polling. Peer count at zero across all torrents for more than ten minutes is an alert, not a Tuesday.

**Check DNS first.** "Host not found" is ambiguous. Resolver health is a five-second check. I spent two hours on tracker and indexer diagnosis before I ran it. That's the order backwards.

**Audit after migrations, not before outages.** The disk migration broke four of the six root causes. I knew the pipeline was flaky afterward and didn't dig in. "Flaky" is a word for "I haven't found the root cause yet."

Pipeline's back. Library's clean. Next post is whatever breaks next.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra).*
