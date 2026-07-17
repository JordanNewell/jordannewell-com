---
title: "Zero peers, dead DNS, and a pipeline I rebuilt from scratch"
description: "My Servarr stack silently died when a Mullvad exit node dropped off the tailnet. Six cascading root causes hid under each other. Five hours to find the first one. Seven hours to fix them all."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude"]
tool: "claude-code"
era: "2026-fleet"
session: "Sxxx"
kind: "postmortem"
draft: false
---

> qBittorrent showed 0 peers across 124 torrents. Every tracker returned "Host not found." The media pipeline had been silently dead for twelve hours. It took five hours to find the first root cause — and there were five more waiting under it.

## What the pipeline was supposed to do

Standard Servarr stack. qBittorrent pulls torrents through a Mullvad exit node on the tailnet. Radarr, Sonarr, and Lidarr track releases, talk to indexers via Prowlarr, and hand downloads to qBittorrent with a category. On completion, Completed Download Handling imports the file into the library, Jellyfin's filesystem watcher picks it up within sixty seconds. Hardlinks all the way down, so one copy on disk.

I'd migrated the media pool to a new disk a week earlier. The pipeline had been flaky since. I hadn't audited it. That's the setup.

## What broke

I sat down to trigger a Jellyfin scan and discovered the pipeline wasn't flaky. It was dead. Every layer had failed, and each failure was hiding the next.

**Layer one — the Mullvad exit node had dropped out of the tailnet.** The exit is authorized via an ACL group. Sometime during the week, the node had fallen out of that group. The tailnet forgot it existed. Inside the qBittorrent container, DNS queries to trackers went nowhere — Mullvad blocks UDP 53 to public resolvers through its exit, and MagicDNS only resolves once the exit is back. Symptom: every tracker hostname unresolvable. Twelve hours of accumulated downloads had made zero progress. Zero peers, zero bytes transferred, zero alerts.

**Layer two — when the exit came back, containerboot crash-looped.** The Tailscale sidecar had a stale `ExitNodeID` baked into its prefs from before the drop. `tailscale up` refused with "changing settings requires mentioning all non-default flags." Standard Tailscale behavior, infuriating inside a container that reboots on crash.

**Layer three — one of the agents had bypassed Radarr entirely.** A hundred-plus torrents had been pushed direct to qBittorrent. Radarr had no record of them, so Completed Download Handling couldn't import any of them on completion. Files sat on disk, invisible to the library.

**Layer four — stale queue paths.** Radarr's queue was full of entries pointing at `/downloads/...`, the pre-migration root. Radarr permanently records whatever path qBittorrent returns at add time. Every import attempt hit a path that didn't exist.

**Layer five — the agent wrapper script had wrong root paths.** `/movies/Movies` instead of `/data/media/Movies`. Radarr accepted the POST because the path was syntactically valid, then couldn't import anything from it. Silent failure.

**Layer six — Jellyfin metadata fetches were silently failing for half the library.** `SaveLocalMetadata=true` was set. Jellyfin tried to write poster images next to the media files, hit IOExceptions on a read-only mount, and treated the whole metadata fetch as failed. A hundred and twenty-two of two hundred fifty-five movies had no overview, no genres, no cover. The library looked half-empty.

Six root causes. Each one looked like the obvious answer while I was standing on it.

## The dig

Five hours to layer one. That's the headline.

The first hour was spent diagnosing the symptom I could see: stalled downloads, dead trackers. Tracker problem, I thought. Indexer problem. Prowlarr. Each of those got checked and cleared. Nothing wrong with any of them.

Two hours in, I was looking at qBittorrent's connection state. Every torrent, zero peers. Across every tracker. That's not a tracker problem. That's a network problem.

Three hours in, the diagnostic that mattered: `tailscale exit-node list` inside the container returned "no exit nodes found." The exit node wasn't on the tailnet. The ACL group had lost it. Every DNS query from the container was dying in a black hole, and the error that surfaced — "Host not found" — looked identical to a dead tracker.

The lesson on layer one: when DNS fails, every upstream error looks the same. "Host not found" from a tracker and "host not found" from a dead resolver are the same string. The difference is whether your resolver is alive, and I didn't check that first.

Layer two surfaced immediately after the fix. I re-added the exit node to the ACL, restarted the sidecar, and watched it crash-loop on stale prefs. Twenty minutes of reading Tailscale CLI errors to understand that the Mullvad FQDN format is rejected by `--exit-node` — you have to pass the CGNAT IP. Baking the exit IP into `TS_EXTRA_ARGS` made the prefs survive restarts without `--reset`.

Layers three and four surfaced together. Once downloads resumed, the imports didn't. I went looking at Radarr's queue and saw paths from the old filesystem layout. The agent-bypass was visible in the same view: torrents Radarr had never tracked, sitting in the download client with no corresponding library entry.

Layer five surfaced when I tried to add a new movie to test the pipeline end-to-end. The POST succeeded, the search ran, the torrent landed — and nothing imported. Root folder mismatch.

Layer six was the one that almost escaped. The library looked fine on the surface. Movies were there. Posters were missing on some, which I attributed to bad metadata sources. It wasn't until I checked the Jellyfin logs that I saw the IOException pattern — `SaveLocalMetadata` writing to read-only paths, failing, and the metadata fetch aborting as a unit. Flip one setting, restart, metadata flooded in. A hundred and twenty-two movies got their posters back in under a minute.

## The fix

Concrete changes shipped:

| Layer | Fix |
|---|---|
| Mullvad exit drop | Re-added node to the tailnet ACL group. Added monitoring so it can't drop silently again. |
| Containerboot pref corruption | Baked `--exit-node=<CGNAT-IP> --exit-node-allow-lan-access` into the compose env. Prefs now survive restarts. |
| Agent bypass of Radarr | Bulk TMDB lookup script to retroactively register the orphaned torrents in Radarr's DB. Workflow doc updated. |
| Stale queue paths | Purged the Radarr queue. Re-detection picked up correct paths on next cycle. |
| Wrapper script root paths | Fixed `/data/media/...` roots. Redistributed v2 to every agent on the fleet. |
| `SaveLocalMetadata` IOExceptions | Set `SaveLocalMetadata=false`. Metadata fetches stopped trying to write to the read-only media mount. |

Plus the hardening that fell out: four new monitors (the exit node, plus three apps in the stack), a daily cron to clean up stopped torrents, a Radarr quality profile that disallows BluRay-disc and raw-HD qualities so fifty-gig ghost grabs stop landing in the queue, and the library itself — two hundred fifty-five movies, ninety-seven percent with full metadata, up from forty-seven percent missing.

End-to-end verified: add a movie through the wrapper → torrent downloads → Radarr imports via hardlink → Jellyfin scans inside sixty seconds.

## The lesson

Silent failures stack. Each one masks the next, and the symptom you see is always the top of the stack — never the bottom. A dead exit node looks like a dead tracker. A pref corruption looks like a container that won't start. A read-only mount looks like missing metadata. You fix the top layer, the next one shows its face, and the whole dig takes five times as long as the root cause warrants.

The only defense is monitoring on the primitives. Peer count, resolver health, exit-node presence. The apps at the top of the stack will always tell you they're failing. The infrastructure underneath won't.

## What I'd do differently

Three things.

**Monitor the exit node.** The Mullvad drop was silent for twelve hours because nothing was polling. Peer count at zero across all torrents for more than ten minutes is an alert, not a Tuesday. That monitor shipped as part of the fix. It should have shipped the day the exit node went in.

**Check DNS first.** "Host not found" is ambiguous. Resolver health is a five-second check. I spent two hours on tracker and indexer diagnosis before I ran it. That's the order backwards. When every hostname fails to resolve, the resolver is the first thing to verify, not the last.

**Audit after migrations, not before outages.** The disk migration broke four of the six root causes. I knew the pipeline was flaky afterward and didn't dig in. "Flaky" is a word for "I haven't found the root cause yet." The five-hour dig would have been a thirty-minute dig a week earlier, before the failures compounded.

Pipeline's back. Library's clean. Next post is whatever breaks next.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra).*
