---
title: "Pre-launch security sweep: the categories I check before a box goes live"
description: "Mail-auth, transport posture, web hardening, DNS integrity. The category list — not the receipt. If you're about to open a host that does mail and web on the same IP, this is the floor."
pubDate: 2026-07-17
tags: ["security", "infra"]
mode: "hobart"
kind: "tooling"
series: ["claude"]
tool: "claude-code"
---

> Before any box goes live, I run a sweep. Not the fun part. The part where you find out the defaults are wrong. Below is the category list. No specific configs, no architecture reveal, no gap enumeration. The receipt stays private; the floor is the shareable part.

## The posture

The general shape: a cloud host running mail and web on the same IP. Tradeoffs accepted knowingly. The sweep below is what makes that posture defensible. It's not a hardened-bunker posture. It's a "mail and web coexist, here's what you owe yourself before opening day" posture.

## What's already in place

These are the floor. If any fail, the box is not ready.

- **Mail authenticity:** DMARC, SPF, DKIM. All three. DMARC at `reject` after a `quarantine` shakedown period. SPF hardfail. DKIM signing on.
- **Transport security:** HSTS preload on every apex domain.
- **SSH:** key-only, no root login, allowlist the network you actually trust (mine is tailnet-only).
- **Brute-force protection:** `fail2ban` with recidive jail at minimum. Mail platforms usually have their own SMTP-abuse netfilter layer too — verify it's running.
- **Admin path probing:** curl the obvious `/.git/HEAD`, `/.env`, `/wp-admin`, `/phpmyadmin`, `/.aws/`, `/server-status` against your own domains *before someone else does*. They should all 404. Anything that 200s is a problem.
- **Docker socket:** not world-accessible. This is one of those defaults that bites people.
- **Monitoring exporters:** bound to a private network, not the public interface.
- **TLS:** 1.2/1.3 only. Strong ciphers. Current nginx.

## What I add during the sweep

| Category | What it does |
|---|---|
| **CAA records** | Locks CA issuance scope. Without one, any CA can issue for the domain. With one, only the named CAs can. |
| **MTA-STS policy** | Tells sending mail servers "only connect to me over TLS, here's the policy URL." Start in `testing` mode per RFC 8461, flip to `enforce` after one `max_age` cycle of clean reports. |
| **TLS-RPT** | `_smtp._tls.{domain}` TXT record. Delivery servers send TLS failure reports to the address you specify. Use a generic alias, not a personal address. |
| **CSP header** | Content Security Policy. Scope carefully — apps that need inline script may need scoped exemptions. Don't exempt more than you have to. |

## What gets deferred (always)

Two categories that automation can't finish:

- **DNSSEC** has to be enabled at the registrar (not the DNS provider). Five minutes per zone when you're ready.
- **MTA-STS** `testing` → `enforce` requires a wait cycle per RFC. Don't skip it.

And one architectural item worth thinking about once and then deferring: **if mail and web share an IP, anyone who learns the origin IP can bypass your CDN's WAF.** Long-term fix is splitting mail onto its own IP. Short-term acceptance is knowing the tradeoff exists. Either is honest; pretending it doesn't is not.

## The category list, in order

If you've never done this and you're running your own box:

1. **DMARC/SPF/DKIM** — mail authenticity. Without this, your mail goes to spam.
2. **SSH hardening** — key-only, no root, ideally network-allowlisted or fail2ban-protected.
3. **CAA** — locks CA issuance scope.
4. **MTA-STS + TLS-RPT** — modern mail TLS posture.
5. **CSP** — defense-in-depth for the web layer.
6. **DNSSEC** — last-mile DNS integrity.
7. **Pen-test your own paths** — curl the obvious `/.git/HEAD`, `/.env`, `/wp-admin` against your own domains before someone else does.

That's the floor. Above this floor is hardening. Below it is exposure.

---

*Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra). The specific configs, the audit receipt, and the gap analysis stay private — this is the category list.*
