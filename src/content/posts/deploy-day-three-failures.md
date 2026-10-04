---
title: "Three failures in 82 minutes: dev.jordannewell.com broke on the PATH, the umask, and the secret scanner"
description: "Standing up dev.jordannewell.com on 2026-10-03 produced three deploy failures in 82 minutes — a PATH-shadowed .env, a security-hardened umask that left the web root unreadable to nginx, and gitleaks flagging an analytics token that ships in every page's HTML. Each failure came from something built to be on my side."
pubDate: 2026-10-04
tags: ["tooling", "infra"]
mode: "hobart"
kind: "postmortem"
draft: false
---

> Standing up dev.jordannewell.com on 2026-10-03 broke three times in 82 minutes. A PATH-shadowed .env killed the first deploy, a security-hardened umask 403'd the second, and gitleaks flagged the third over a secret that isn't. None of the failures were in the new site. All three came from things that are supposed to help: the environment, the hardening, the guard.

dev.jordannewell.com is a second deploy target on the same host as production — same box, different web root — staged so the revamped site has somewhere to live before it touches the real domain. The production tree's own restore from behind the splash page happened the same morning; that story is a separate post.

## The 82 minutes

All times 2026-10-03, EDT, from the site-v2 worktree's log:

| Time | Commit | What |
|---|---|---|
| 11:16:27 | `0e1fe51` | `deploy.sh` gains `ENV_FILE` override; `.env.dev.example` scaffold |
| 11:26:04 | `6fd6e1b` | Fix 1: slash-prefix the env file path |
| 11:28:54 | `b9254e2` | Fix 2: `chmod -R a+rX` after extract |
| 12:38:42 | `6dc2b62` | Fix 3: `.gitleaksignore` + beacon hostname guard |

The first two fixes landed 2 minutes 50 seconds apart, twelve and a half minutes after the scaffold commit. The third took another 70 minutes. Main branch carries duplicates of the first two (`f8737a1`, `dc13291`, same timestamps); the gitleaks fix lives on site-v2 only.

## 11:26 — bash read the wrong .env

**Symptom:** the deploy died at its own env guard:

```
REMOTE_HOST required — copy .env.example to .env and fill in real values
```

The message points at the obvious suspect: a missing or half-filled config. The suspect was innocent. `.env` existed in the project root and was complete.

**Root cause:** the script's guard and its loader resolved two different files.

```bash
[ -f "$ENV_FILE" ] && set -a && . "$ENV_FILE" && set +a
```

`[ -f .env ]` checks the working directory. Bash's `source` does not: for a filename with no slash, it searches `PATH` first and only falls back to the current directory on a miss. An agent tool's env directory earlier in `PATH` carried its own `.env`, so the test passed against the project file while the dot command read the shadow. The shadow had no `REMOTE_HOST`, and the fail-loud guard did exactly what it was built to do — on the wrong evidence.

**Fix:** `ENV_FILE="${ENV_FILE:-.env}"` became `ENV_FILE="${ENV_FILE:-./.env}"`. One character, committed as `6fd6e1b` at 11:26:04 with the full mechanics in the message.

**The rule:** a slash-free filename means one file to your `-f` test and another to your `source`. Slash-prefix everything you dot into.

## 11:28 — the hardening was the outage

**Symptom:** the deploy pipe exited clean — build, backup, tar over ssh, extract — and the containerized nginx worker could not read a single file in the fresh web root.

**Wrong first suspects:** the vhost config, the web root path, the `rm -rf ./*` having eaten something it shouldn't. All exonerated in one `ls -l`.

**Root cause:** umask 027. The hardened shell that built the site built it owner-and-group-only — files `rw-r-----`, directories `rwxr-x---`. Tar carried those bits across the wire faithfully, and the nginx worker inside the container runs as its own user: not the deploy user, not in the deploy group. The permission hardening that keeps other accounts off those files kept the web server off them too. The protection and the outage were the same setting.

**Fix:** commit `b9254e2` at 11:28:54 appends `chmod -R a+rX .` to both extract branches in `scripts/deploy.sh` — world-read for everything, world-execute for directories only (capital `X` never makes a data file executable). A web root is public static content by definition; permissions get normalized at the deploy boundary, every deploy, unconditionally.

**The rule:** your umask ships with your artifacts. Hardened shells build hardened tarballs.

## 12:38 — a secret that isn't

**Symptom:** gitleaks' `generic-api-key` rule fired on the Cloudflare Web Analytics token in `src/layouts/BaseLayout.astro`.

**The wrong response was the reflexive one:** rotate the token, treat it like the eighth credential on the rotation list. The token has been in the tree since 2026-07-15 (`28c3b00`) and ships in the HTML head of every served page — public by design, identifies the analytics property, carries no write access. Rotation here would have been downtime for a design decision.

**Fix, two halves in `6dc2b62` at 12:38:42.** First, a `.gitleaksignore` entry pinned to the exact line:

```
src/layouts/BaseLayout.astro:generic-api-key:63
```

The six-line file states why it's a verified false positive and carries a maintenance note: the fingerprint is line-pinned, so move the pin if the meta tag moves. Second, the beacon itself got restructured — the token moved from a static script tag into a `<meta name="cf-beacon">` tag, and a new external loader, `public/js/cf-beacon.js`, reads it at runtime. The loader guards on hostname: any host starting with `dev.` gets no beacon, so mirror traffic stays out of production analytics. It's an external file because the production CSP forbids inline JavaScript.

**The rule:** never mute a scanner finding you can't explain in one written comment. The comment is the mute's expiry date.

## The seams

Three failures, three systems that were each correct in isolation. Bash's dot command and the `test` builtin disagreed about what a bare filename means. A hardened shell and a containerized worker disagreed about who counts as a user. A scanner's pattern match and a CSP's design disagreed about what a secret is. Every failure lived at a joint between two systems I had no reason to distrust — because the deploy script is the only place where all of them touch at once.

The scoreboard from the log: 82 minutes, three failures, three fixes that fit in a slash, a `chmod`, and an ignore pin. The next deploy's failure gets to be new.

If you made it this far, I appreciate it. — JN
