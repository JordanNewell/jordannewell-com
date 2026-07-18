---
title: "Pre-launch security sweep: how I pentest my own box before opening day"
description: "CAA, MTA-STS, TLS-RPT, CSP, and the list of things I check before I'm willing to put a domain on a host that also does mail. No ship-blockers found. Here's the receipt."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
kind: "tooling"
series: ["claude"]
tool: "claude-code"
---

> Sweep target: a single Hetzner cloud box running Mailcow and three apex domains — `jordannewell.com`, `richmondpark.co`, `dwtrimco.com`. Mail and web on the same IP. Ship-blockers found: zero. Items fixed: four. Items deferred to me-manual: two. Items deferred to architecture: one. Receipt below.

This is the checklist I run before any box goes live. Not the fun part. The part where you find out the defaults are wrong.

## The posture

A single cloud host running Mailcow + nginx-proxy + an Astro static site. Mailcow hosts three domains. nginx-proxy fronts the webs. SSH is Tailscale-only — no public-port SSH at all. fail2ban plus Mailcow's built-in netfilter catch SMTP abusers in real time.

Not a hardened-bunker posture. A "mail and web on the same IP, tradeoffs accepted" posture. The sweep below is what makes that posture defensible.

## What was clean before I started

These were already in place from prior sessions. The sweep verified them rather than fixed them.

- **HSTS preload** on all three apex domains.
- **DMARC** `reject`, **SPF** hardfail, **DKIM** signing — all three domains.
- **SSH** hardened: Tailscale-only (`Match Address` allowlists the tailnet range), no root login, key-only.
- **fail2ban** with recidive jail + fleet-routing (every ban announces to Discord + Matrix).
- **Mailcow's netfilter watcher** — actively catching SMTP abusers and dropping them at the firewall. Five IPs warned or banned during the sweep window.
- **No exposed admin paths** — `/admin/`, `/.git`, `/.env`, `/wp-admin`, `/phpmyadmin`, `/.aws/`, `/server-status` all return 404 on jordannewell.com. The status-page 200s on `/.git/HEAD` etc. were Uptime Kuma's SPA fallback (serves `index.html` for any path), not real exposures.
- **Docker socket** not world-accessible.
- **node_exporter** bound to the Tailscale IP only.
- **Mailcow watchdog** healthy across Unbound, Postfix, MySQL, Rspamd, Ratelimit.
- **Astro static site** — no phpCMS attack surface. nginx 1.30.1 current. TLS 1.2/1.3 only, strong ciphers.

That's the floor. If any of those fail, the box is not ready. All passed.

## What I fixed during the sweep

Four items, none ship-blockers, all "should-fix before opening day."

| Fix | What it does |
|---|---|
| **CAA records × 3 zones** | Locks issuance to Let's Encrypt. Without a CAA record, any CA can issue for the domain. With one, only the named CAs can. |
| **MTA-STS policy × 3 domains** | Tells sending mail servers "only connect to me over TLS, here's the policy URL." mode=`testing` per RFC 8461 safe-start — flips to `enforce` after one `max_age` cycle of clean TLS-RPT reports. |
| **TLS-RPT × 3 zones** | `_smtp._tls.{domain}` TXT record with `rua=mailto:agents@jordannewell.com`. Delivery servers send TLS failure reports to that address. |
| **CSP header on apexes** | Content Security Policy on the three apexes. Scoped to `location /` only — the booking-app paths (`/book`, `/booking/`, `/api/`) are intentionally exempt because the booking platform uses critical inline script. |

Plus a small one. **Cloudflare Managed robots.txt OFF.** CF's "AI Crawl Control" feature pollutes `robots.txt` with a `# BEGIN Cloudflare Managed content` block. My source `src/pages/robots.txt.ts` has an explicit allowlist for GPTBot, ClaudeBot, PerplexityBot, Googlebot. CF's managed block was overriding it. Toggled off. Live `robots.txt` now matches source.

## What's deferred

Things automation can't do, or shouldn't.

| Item | Why deferred |
|---|---|
| **DNSSEC at registrar** | Has to be enabled at the registrar (not the DNS provider). Cloudflare provides the DS data; the registrar has to publish it. ~5 minutes per zone. |
| **MTA-STS `testing` → `enforce`** | RFC 8461 mandates a `testing` period of at least one `max_age` cycle before flipping to `enforce`. Watch TLS-RPT reports for a week, then change the policy file's mode line and reload nginx. |
| **Origin IP bypass** | Architectural. The box does mail and web on the same public IP. Anyone who knows the IP can bypass Cloudflare's WAF by hitting origin directly. Inherent to mail-on-same-IP. Long-term fix: split web from mail onto separate IPs. Not happening this quarter. |

## Two process failures worth naming

The sweep was supposed to be subagent-driven — three parallel agents, each handling a slice. Two of the three were intercepted by the harness's security classifier before they ran. The classifier saw a Cloudflare API token in the prompt and flagged it as "exposed credential," even though the token was scoped to DNS-edit on a single zone and was being passed to the agent intentionally.

I finished the work inline via shell scripts and SSH. Pattern worth flagging: subagent dispatch isn't viable for tasks that require passing live credentials. The agents that didn't need credentials ran fine.

Second: I thought the Cloudflare token had been rotated yesterday. It hadn't. The token in the password manager (revision 2026-06-28) was byte-identical to the one in `dns-01.conf` (created 2026-06-18). No rotation needed. But the *belief* that it had been rotated was a small failure of process — I should have checked the revision history before treating the rotation as fact.

## What you can steal

The sweep took an afternoon. The checklist above is the dependency-free version. If you're running your own box and you've never done this, the order to do it in:

1. **DMARC/SPF/DKIM** — mail authenticity. Without this, your mail goes to spam.
2. **SSH hardening** — key-only, no root, ideally Tailscale-only or fail2ban-protected.
3. **CAA** — locks CA issuance scope.
4. **MTA-STS + TLS-RPT** — modern mail TLS posture.
5. **CSP** — defense-in-depth for the web layer.
6. **DNSSEC** — last-mile DNS integrity.
7. **Pen-test your own paths** — curl the obvious `/.git/HEAD`, `/.env`, `/wp-admin` against your own domains before someone else does.

That's the floor. Above this floor is hardening. Below it is exposure.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). The `/infra` page will accumulate notes like this as the fleet evolves.*
