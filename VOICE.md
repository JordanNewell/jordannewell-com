# VOICE.md — Voice Profile for Sessions from the Vault

> Required reading before drafting any post. Drafts that don't sound like Jordan get rejected at edit.

## Canonical samples

Read both before drafting:

- `src/content/posts/day-0.md` — manifesto voice.
- `src/content/posts/openclaw-bug-anatomy.md` — instructional postmortem voice.

## Jordan's voice traits (emulate)

| Trait | Example |
|---|---|
| Open with stakes or fact, never setup | "Server down, no shipped, no flipped." |
| Specific dates, versions, exact quotes | "2026-05-12", "2026.5.7", "63 seconds" |
| "I" statements of action | "I filed", "I listed", "I'm keeping..." |
| Direct reader address when teaching | "Steal it.", "If you file bugs..." |
| Punchy aphoristic lines | "A bug report is a request for someone else's time." |
| Tables for comparisons; prose for narrative | (see OpenClaw post) |
| Code/SQL/logs quoted inline as evidence | real `memory_search` log lines, real SQL |
| Imperative mood when instructing | "Keep them separate.", "Don't file until..." |
| Dry humor via understatement | "The fact that I'm writing this instead of getting the server back up is the brand." |
| Close on implication or next action | "Server's still down. Next post is the post-mortem." |

## Anti-patterns (Claude-isms — flag + purge)

| Anti-pattern | Why wrong | Fix |
|---|---|---|
| "It's worth noting that..." | Filler | Delete preamble |
| "Let me explain..." / "Let's dive in" | Blogger cliché | Delete. Start with the thing. |
| "In this comprehensive guide..." | Marketing voice | Never use "comprehensive" |
| "Here's the thing..." | Filler | Delete |
| "We'll explore..." | No "we", no exploring | State what follows |
| "Delve into", "navigate", "leverage" | Corporate-speak | Use plain verbs: read, use, build |
| "Robust", "seamless", "comprehensive" | Marketing adjectives | Concrete description instead |
| "Perhaps", "maybe", "might be worth" | Hedging | State the claim or omit |
| Em-dash overuse | Jordan uses some, not every sentence | Cap at 2 per paragraph |
| Long compound sentences | Jordan mixes short + long | Break into 2-3 short |
| "I think X" preamble | Jordan states X directly | "X." not "I think X." |
| Concluding summary paragraph | Jordan implies | Cut, or convert to forward-looking line |
| Headers like "Conclusion" | Corporate | Use punchy: "The point", "What happened next" |
| Apologizing for opinions | "This is just my view..." | Cut the apology |

## OPSEC (Operational Security)

**Two hard rules — never violate, no exceptions:**

1. **No actual machine names.** No hostnames (`<host>`, `<host>`, `<host>`, etc.), no tailnet names (`<tailnet>.ts.net`), no internal project codenames (`<codename>`, `<codename>`, etc.), no agent names that map to Matrix handles (<agent-name>, <agent-name>, <agent-name>, etc.). Generalize: "the host", "the homeserver", "a Tailscale-networked host", "the orchestration layer", "a bridge agent".
2. **No real paths.** No `/usr/local/bin/<your-script>.sh`, no `/mnt/<your-mount>`, no `/opt/<your-project>/`, no `~/.claude/<internal>`. Standard Linux paths (`/etc/nginx/`, `/var/log/`) are fine; paths containing your internal dir names are not. Generalize: "a watchdog script", "the recovered disks", "the local config".

Jordan has a defense / federal IT track (Richmond Park Group). Public writing is subject to a stricter threat model than typical dev bloggers. Before publishing any post, scan for the following and strip or generalize.

### Never disclose publicly

| Category | Example | Why |
|---|---|---|
| Internal IPs (Tailscale or otherwise) | `100.x.x.x` | Fingerprint material for targeted attackers |
| Exact service counts | "9 OpenClaw agents", "32 TailVIPs", "~70 containers" | Reveals fleet scope + attack surface |
| Internal paths | `/mnt/<host>-root`, `/opt/<service>/`, `/usr/local/bin/...` | Shows filesystem layout, useful for post-exploit |
| Specific error strings from internal systems | `mau.crypto: No one-time keys...` | Useful for fingerprinting stack + version |
| Exact host hardware models + failure modes | "<desktop-model> PSU" | Identifies your gear, attacker shopping list |
| Fleet topology details | which agents run where, transport splits (Discord vs Matrix) | Reveals coordination patterns |
| Recovery procedures | "vgrename to avoid collision", specific mount strategies | Could be reverse-engineered |
| Internal session/handoff numbering | "Sxxx", "<codename>", "<codename>" | Exposes internal ops vocabulary |
| Exact tool versions where exploitable | "Synapse <version>", "tailscaled <version>" | Vulnerability matching |
| Specific chip-level details | "<usb-bridge-model>" | Useful for hardware attackers |
| Hostnames tied to specific roles | naming the host that runs Synapse | Target identification |

### Safe to disclose

| Category | Example |
|---|---|
| General tech categories | "Matrix homeserver", "Tailscale", "Jellyfin", "OpenClaw agents" (already public via homepage) |
| Vendor names if already public | Tailscale, Cloudflare, Hetzner (already named in existing posts) |
| Story arc + stakes | What broke, when, what I did, what I learned |
| Costs + decision framing | $80 vs $300, time tradeoffs |
| General lessons | "Monitor hardware age", "test recovery before you need it" |
| OSS contributions | The bug + repro (not your internal infra) |
| Conceptual architecture | "Single-host homeserver is fragile" without naming specifics |
| Personal reflection | Frustration, learning, decisions |
| **Project names with public artifacts** | OSS repos, released products, public-facing services. Earn a branded name. Internal-only tools get functional descriptions, not branded names. |

### Naming rule (formalized)

A project gets a branded name on the public site iff it has a public artifact (OSS repo, released product, public-facing service). Otherwise it gets a functional description.

| Public name | Has public artifact? | Reasoning |
|---|---|---|
| Crypto Key Classifier | Yes (GitHub repo shipping) | Real artifact, earns the name |
| Agent Orchestration | No (internal tool) | Renamed from prior internal codename — described by function |
| Agent Fleet | N/A (the agents themselves, not a project) | Generic description, not branded |
| PCP | No (venture-track, unannounced) | Functional only until public launch |

When in doubt: functional description. Reserve brand names for actual branded releases.

### OPSEC pre-publish pass

Before any post goes live, run this checklist. **All scans include frontmatter, not just body prose.**

1. **IP scan.** Search the draft for `100.` (Tailscale CGNAT range) and any RFC1918 addresses. Remove or generalize to "another host" / "the homeserver".
2. **Path scan.** Search for `/mnt/`, `/opt/`, `/usr/local/`, `~/.` followed by internal dir names. Generalize.
3. **Count scan.** Search for specific numbers of agents/containers/services. Generalize to "dozens of", "a fleet of", or omit.
4. **Model scan.** Search for specific hardware models (Dell, HP, Lenovo model numbers). Generalize to "small-form-factor desktop", "1U server", etc.
5. **Error string scan.** Search for backtick-quoted error text from internal services. Generalize to "the homeserver refused connections" or omit.
6. **Internal-name scan.** Search for hostnames, project names (<codename>, <codename>, etc.), session IDs (`S\d{3}`). Strip — including the `session:` frontmatter field. Session IDs in frontmatter are an OPSEC violation; the body makes the era/topic clear without them.
7. **Version scan.** Strip exact version strings unless disclosing for OSS contribution context.

### Frontmatter-specific rules

| Field | Rule |
|---|---|
| `session:` | **Never include.** Internal numbering leaks your operating cadence + cross-references the internal session-tracking system. |
| `era:` | Optional. Include **only** on Heritage posts where the EraBadge adds reader value. Current-era posts don't need it — body + pubDate make era obvious. |
| `tool:` | Keep. `claude-code` / `grok` / `gpt` / `gemini` is content metadata, not OPSEC-sensitive. |
| `series:` | Keep. `claude` / `grok` / `heritage` / etc. is public-facing series taxonomy. |
| `kind:` | Keep. `postmortem` / `win` / `decision` / etc. is content metadata. |

### Operational files vs content files

The OPSEC rules above apply to **content** — `.md` posts and prose that renders to public HTML. **Operational files** (`.sh` scripts, `astro.config.mjs`, `.github/workflows/*.yml`, `.githooks/*`, `package.json`) need different treatment: a `<placeholder>` literal here breaks things at build/runtime.

**The 2026-07-18 incident (cautionary tale):** an OPSEC scrub replaced a real internal codename in `astro.config.mjs` redirects with `<codename>`. Astro tried to mkdir a path containing literal `<>` — Windows refused — every build broke silently. Same scrub pass replaced real values in deploy script defaults (`user@<host>`, `/opt/www/<site>`) with placeholders, breaking deploys until env vars were passed explicitly. Both went undetected for hours because no build verification existed.

**Three categories, three rules:**

| File type | Placeholder rule | Example |
|---|---|---|
| Content (`.md`, `.astro` prose) | `<placeholder>` is the desired end state | "the `<host>` homeserver" in a post |
| Operational (`.sh`, configs, workflows) | Real values must come from env vars or gitignored config — never literal `<placeholder>` | `REMOTE_HOST="${REMOTE_HOST:-user@host}"` + `.env` for real value |
| Cosmetic (HTML comments, doc strings) | Acceptable, but consider whether the placeholder itself draws attention | `<!-- Kuma degraded (<host> outage, July 2026) -->` — last user-visible hint that scrubbing happened |

**The pattern for operational files** (codified in `scripts/deploy.sh`):

```bash
# Load .env if present (gitignored — see .env.example for required vars)
[ -f .env ] && set -a && . .env && set +a

# Required env vars — fail loud if missing. See .env.example.
: "${REMOTE_HOST:?REMOTE_HOST required — copy .env.example to .env and fill in real values}"
```

Real values live in gitignored `.env`. The contract is documented in tracked `.env.example`. Scripts fail loud if env is missing — no silent bad defaults.

**Verification (run after every OPSEC-motivated commit):**

```bash
bash scripts/verify-scrub.sh
```

Three checks: build still passes, voice lint still passes on all content, no unresolved `<placeholder>` tokens in operational files. CI runs the same checks on push via `.github/workflows/ci.yml`.

**Known limitation (TODO):** `scripts/voice-lint.sh` currently contains placeholder tokens in its own `opsec_patterns` regex — the patterns themselves were scrubbed to avoid leaking tailnet name + codenames + agent handle names in the public repo. This means the lint can't catch those specific tokens today. Refactor TODO: source real patterns from a gitignored `scripts/opsec-patterns.local` file at runtime; CI runs the lint without the local file (still catches machine names, IPs, paths, session codes — just not the scrubbed-out tokens).




1. Read both canonical posts in full. Internalize cadence.
2. Draft the hook first — 1-3 sentences, stakes-first.
3. Quote real artifacts inline (SQL, log lines, config).
4. Write short. Target 800-1200 words typical. Push past 1500 only when material demands.
5. Cut every hedge. Search draft for: maybe, perhaps, might, could possibly, I think, I believe, in my opinion, just (as hedge), simply, basically, essentially, actually. Delete or rewrite.
6. Run voice lint before handoff: `bash scripts/voice-lint.sh <draft-path>`.
7. Hand off with explicit note: "sounds like Jordan when..." / "still feels Claude when..."

## Voice lint spec

Implemented in `scripts/voice-lint.sh`. Runs as pre-commit hook on all staged `.md` files. Exits non-zero on anti-pattern match or hedge word found.

