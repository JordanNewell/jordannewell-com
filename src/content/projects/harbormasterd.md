---
title: "harbormasterd"
description: "Zero-thinking port management with automatic HTTPS and DNS for local development. Three CLIs (pa, pa-platform, pad), local resolver for *.pa.local, mkcert-backed certs."
status: "shipped"
tags: ["projects", "tools", "oss"]
startDate: 2026-07-18
shipDate: 2026-07-19
repo: "https://github.com/JordanNewell/harbormasterd"
order: 5
facts:
  - k: "shipped"
    v: "2026-07-19"
  - k: "language"
    v: "Python 3.9+"
  - k: "license"
    v: "MIT"
  - k: "clis"
    v: "pa · pa-platform · pad"
highlights:
  - title: "Zero-config HTTPS"
    body: "mkcert, Caddy CA, or self-signed fallback. Trust once, forget it."
  - title: "*.pa.local DNS"
    body: "Local resolver — no more /etc/hosts edits per project."
  - title: "Port-conflict healing"
    body: "Detect collisions, auto-relocate, preserve preferred ranges."
  - title: "Cross-platform"
    body: "Windows, macOS, Linux. Native UAC / sudo / systemd integration."
stack:
  - "Python 3.9+"
  - "mkcert"
  - "Caddy CA"
  - "SQLite"
  - "CLI"
  - "daemon"
---

Picked `harbormasterd` as the ship name after the `port-authority` proposal hit a PyPI collision — American spelling plus Unix `d` suffix to land cleanly on the registry.

Three CLIs ship in the box:

- **`pa`** — daily dev. `pa run`, `pa reserve`, `pa release`, `pa who`, `pa scan`, `pa doctor`, `pa events`.
- **`pa-platform`** — HTTPS + DNS setup, team-shared contexts.
- **`pad`** — long-running daemon.

Most users only need `pa`. Use `pa-platform` for one-time setup and team configurations.

## Quick start

```bash
pip install -r requirements.txt
pad &
pa selftest
pa tls trust
pa dns install
pa run --name=myapp --prefer=3000 python app.py
# → https://myapp.pa.local (automatic HTTPS)
```

Source and install instructions on GitHub. MIT, pip-installable. 12 test categories across 9 platform combinations.
