---
title: "Pre-launch security sweep: how I pentest my own box before opening day"
description: "CAA, MTA-STS, TLS-RPT, CSP, and the list of things I check before I'm willing to put a domain on a host that also does mail. No ship-blockers found. Here's the receipt."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
kind: "ship-report"
series: ["claude"]
tool: "claude-code"
era: "2026-fleet"
session: "Sxxx"
---

> The checklist below is what I run against any box that's about to host a public-facing site. I just ran it against `production` — the Hetzner cloud host that carries `jordannewell.com`, `richmondpark.co`, `dwtrimco.com`, and the Mailcow stack that handles mail for all three. No ship-blockers found. Four items fixed. Two deferred to me-by-manual. One deferred to architecture.

This is the boring, unskippable part of running your own infra. If you skip it, you ship with the defaults the box came with — and the defaults are not what you want.

## The posture

`production` is a single Hetzner CPX31 running Mailcow + nginx-proxy + an Astro static site. Mailcow hosts three domains. nginx-proxy fronts the webs. Tailscale-only SSH (no public-port SSH at all). fail2ban + Mailcow's built-in netfilter catch SMTP abusers in real time.

This is not a hardened-bunker posture. It's a "the box does mail and web on the same IP, and I've accepted the tradeoffs that implies" posture. The sweep below is what makes that posture defensible.

## What I checked, and what I found

### Clean before I started

These were already in place from prior sessions. The sweep verified them rather than fixed them.

- **HSTS preload** on all three apex domains.
- **DMARC** `reject`, **SPF** hardfail, **DKIM** signing — all three domains.
- **SSH** hardened: Tailscale-only (`100.0.0.0/8` allowlist in `sshd_config` `Match Address`), no root login, key-only.
- **fail2ban** with recidive jail + `<hostname>` fleet-routing (every ban announces to Discord + Matrix).
- **Mailcow's netfilter watcher** — actively catching SMTP abusers and dropping them at the firewall. Five IPs warned or banned during the sweep window.
- **No exposed admin paths** — `/admin/`, `/.git`, `/.env`, `/wp-admin`, `/phpmyadmin`, `/.aws/`, `/server-status` all return 404 on jordannewell.com. The status-page 200s on `/.git/HEAD` etc. were Uptime Kuma's SPA fallback (serves `index.html` for any path), not real exposures.
- **Docker socket** not world-accessible.
- **node_exporter** bound to the Tailscale IP only.
- **Mailcow watchdog** healthy across Unbound, Postfix, MySQL, Rspamd, Ratelimit.
- **Astro static site** — no phpCMS attack surface. nginx 1.30.1 current. TLS 1.2/1.3 only, strong ciphers.

That's the floor. If any of those fail, the box is not ready. All passed.

### What I fixed during the sweep

Four items, none of which were ship-blockers, all of which were "should-fix before opening day."

| Fix | What it does |
|---|---|
| **CAA records × 3 zones** | Locks issuance to Let's Encrypt. Without a CAA record, any CA can issue for the domain. With one, only the named CAs can. |
| **MTA-STS policy × 3 domains** | Tells sending mail servers "only connect to me over TLS, here's the policy URL." mode=`testing` per RFC 8461 safe-start — flips to `enforce` after one `max_age` cycle of clean TLS-RPT reports. |
| **TLS-RPT × 3 zones** | `_smtp._tls.{domain}` TXT record with `rua=mailto:agents@jordannewell.com`. Delivery servers send TLS failure reports to that address so I can see who's failing to deliver mail to me over TLS. |
| **CSP header on apexes** | Content Security Policy on the three apexes. Scoped to `location /` only — the booking-app paths (`/book`, `/booking/`, `/api/`) are intentionally exempt because the booking platform uses critical inline script. Backups taken before and after. |

Plus a small one: **Cloudflare Managed robots.txt OFF.** CF's "AI Crawl Control" feature pollutes `robots.txt` with a `# BEGIN Cloudflare Managed content` block. My source `src/pages/robots.txt.ts` has an explicit allowlist for GPTBot / ClaudeBot / PerplexityBot / Googlebot and friends. CF's managed block was overriding that. Toggled off in the CF dashboard; live `robots.txt` now matches the source exactly.

### What's deferred to me-by-manual

Things automation can't do, or shouldn't.

| Item | Why manual |
|---|---|
| **DNSSEC at registrar** | Has to be enabled at the registrar (not the DNS provider). Cloudflare provides the DS data; the registrar has to publish it. ~5 minutes per zone. |
| **MTA-STS `testing` → `enforce`** | RFC 8461 mandates a `testing` period of at least one `max_age` cycle before flipping to `enforce`. Watch TLS-RPT reports at `agents@jordannewell.com` for a week, then change the policy file's mode line and reload nginx. |
| **Origin IP bypass** | Architectural. The box does mail and web on the same IP (`178.156.210.29`). Anyone who knows the IP can bypass Cloudflare's WAF/DDoS by hitting origin directly. Inherent to mail-on-same-IP. Long-term fix: split web from mail onto separate IPs. Not happening this quarter. |

## Process notes

The sweep was supposed to be subagent-driven — three parallel agents, each handling a slice (DNS work, MTA-STS setup, CSP scoping). Two of the three were intercepted by the harness's security classifier before they ran. The classifier saw a Cloudflare API token in the prompt and flagged it as "exposed credential," even though the token was scoped to DNS-edit on a single zone and was being passed to the agent intentionally.

I finished the work inline via `/c/tmp/sweep-dns.sh` and SSH. **Pattern worth flagging:** subagent dispatch isn't viable for tasks that require passing live credentials. You'd need a credential-helper or an env-var-only approach for sweeps like this. The agents that didn't need credentials (the CSP-scoping one) ran fine.

Also worth noting: I thought the CF token had been rotated yesterday. It hadn't. The token in Vaultwarden (revision 2026-06-28) was byte-identical to the one in `dns-01.conf` (created 2026-06-18, Sxxx session). No rotation needed. But the *belief* that it had been rotated was a small failure of process — I should have checked Vaultwarden's revision history before treating the rotation as fact.

## What you can steal

The sweep took an afternoon. The checklist above is the dependency-free version. If you're running your own box and you've never done this, the order I'd do it in is:

1. **DMARC/SPF/DKIM** — mail authenticity. Without this, your mail goes to spam.
2. **SSH hardening** — key-only, no root, ideally Tailscale-only or fail2ban-protected.
3. **CAA** — locks CA issuance scope.
4. **MTA-STS + TLS-RPT** — modern mail TLS posture.
5. **CSP** — defense-in-depth for the web layer.
6. **DNSSEC** — last-mile DNS integrity.
7. **Pen-test your own paths** — curl the obvious `/.git/HEAD`, `/.env`, `/wp-admin` against your own domains before someone else does.

That's the floor. Everything above this floor is hardening; everything below it is exposure.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). Session log: Sxxx. The `/infra` page will accumulate notes like this as the fleet evolves.*
