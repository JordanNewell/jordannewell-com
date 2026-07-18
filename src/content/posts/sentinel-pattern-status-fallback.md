---
title: "The sentinel-file pattern: instant fallback when an upstream disappears"
description: "When status.jordannewell.com's upstream went down, my first two fixes cut latency from 60 seconds to 1.2 seconds. The third cut it to 170 milliseconds. I should have started with the third one."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
kind: "tooling"
series: ["claude"]
tool: "claude-code"
---

> `status.jordannewell.com` is supposed to be the page that's up when everything else is down. Last week its upstream monitor went dark and the status page went dark with it. Three iterations of fix in a day. Each one faster. Only the last one right.

## The setup

Status page is nginx proxying to an upstream monitor on another host in the fleet. Page is public via Cloudflare. The monitor itself is tailnet-only.

When that upstream host went down (dead PSU, separate postmortem), the status page started returning 502. Cloudflare's edge would retry, hit the bad upstream, retry, return 502 to the visitor. The page that's supposed to be up when everything else is down was itself down.

Goal: serve a static "we know, we're on it" page when Kuma is unreachable, and serve it fast.

## Iteration 1 — `proxy_connect_timeout` (felt terrible)

The default `proxy_connect_timeout` in nginx is 60 seconds. When the upstream is gone, nginx waits a full minute before giving up. That's the floor of the bad experience.

```nginx
location / {
    proxy_connect_timeout 3s;
    proxy_read_timeout 3s;
    proxy_pass http://kuma-upstream;
}
```

Three-second connect, three-second read. Better. Still terrible. A visitor hits the page, waits three seconds of nothing, gets the fallback. A slow 502 is still a 502.

## Iteration 2 — `max_fails=1` on the upstream (1.2s)

```nginx
upstream kuma-upstream {
    server <kuma-host>:3001 max_fails=1 fail_timeout=10s;
}

proxy_connect_timeout 1s;
```

Tell nginx the upstream has failed after a single connect error, mark it down for ten seconds, route to a named `@kuma_down` fallback location in the meantime. One-second connect, fail-fast.

Page load dropped to about 1.2 seconds. Workable. But per-worker upstream state in nginx is notoriously unreliable. Each worker tracks its own failure counters. A request that lands on a worker that hasn't yet seen a failure still pays the full second. Under any load at all, you get inconsistent latencies.

Also, the one-second connect was still a noticeable hitch on every request during the outage. The page that's supposed to be up when everything else is down was still visibly sluggish.

## Iteration 3 — sentinel file (170ms)

```nginx
location / {
    if (-f /path/to/DOWNTIME) {
        return 503;
    }
    proxy_pass http://kuma-upstream;
}

error_page 502 503 504 = @kuma_down;

location @kuma_down {
    root /path/to/status;
    try_files /incident.html =503;
}
```

When I know Kuma is down, I `touch` the sentinel file on the box. nginx sees the file and returns 503 immediately — no upstream lookup, no connect timeout, no per-worker state. The 503 hits the `error_page` handler which serves static `incident.html` from disk. Total latency: 170ms end-to-end via Cloudflare.

```bash
ssh your-host "sudo touch /path/to/DOWNTIME"   # engage
ssh your-host "sudo rm /path/to/DOWNTIME"      # disengage
```

One file's existence is the outage signal. nginx's filesystem check is near-zero cost. No proxy layer involved at all.

## Why I should have started here

The three iterations took a day. The third one alone would have taken twenty minutes.

I didn't start with the sentinel because the sentinel is *manual*. The proxy timeout approach is automatic — nginx detects the upstream's failure and routes around it. The sentinel requires a human to `touch DOWNTIME`. That feels worse.

But when the upstream is a known-down long-horizon outage (PSU replacement on order, day-plus of downtime), the cost of automatic detection (latency on every request) vastly exceeds the cost of manual engagement (one `ssh` call). The proxy timeout approach is paying for capability you don't need — fast automatic detection — at the cost of capability you do need — fast fallback serving.

The rule:

> For "known outage, need instant fallback" scenarios where manual engagement is an option and speed is critical, skip the proxy timeout whack-a-mole. Sentinel file from the start.

Skip the timeout tuning when all three are true:

1. The outage is hours-to-days, not seconds-to-minutes.
2. A human or a script can `touch` the sentinel when the outage is confirmed.
3. Page-load speed during the outage matters more than automatic recovery.

For the status page, all three were true. I should have started with the sentinel.

## The fallback is part of the product

The static `incident.html` was themed to match the main site's palette. Same fonts, same dot-grid background, same status colors. A visitor hitting the fallback doesn't see "this is broken." They see a deliberate, branded status page that happens to be saying there's an incident.

The fallback is part of the product, not an apology for the product.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). The engage/disengage one-liners above are the full recipe.*
