# jordannewell.com

Source for [jordannewell.com](https://jordannewell.com) — shipping-in-public field notes on AI agents, self-hosted infra, crypto tooling, and venture research. Astro SSG, deployed via `tar-over-ssh` to a Hetzner host behind Cloudflare.

## Quick start

    npm install
    npm run dev        # local dev server (default port 4321)

## Build

    npm run build      # outputs to dist/

## Deploy

    cp .env.example .env
    # edit .env to fill in real values for REMOTE_HOST, REMOTE_PATH, BACKUP_DIR
    bash scripts/deploy.sh

Deploy scripts read env vars from `.env` (gitignored — see `.env.example` for the contract). Required: `REMOTE_HOST`, `REMOTE_PATH`, `BACKUP_DIR`. Scripts fail loud with a pointer to `.env.example` if any are missing.

To override per-invocation without editing `.env`:

    REMOTE_HOST=user@other-host REMOTE_PATH=/custom/path bash scripts/deploy.sh

### What deploy.sh does (in order)

1. **Load env** — sources `.env` if present, then asserts `REMOTE_HOST`, `REMOTE_PATH`, `BACKUP_DIR` are set
2. **Preflight** — `ssh -o ConnectTimeout=5 "$REMOTE_HOST" true`. Fails fast and loud if SSH is broken (alias wrong, host down, Tailscale offline). Exits *before* any destructive step.
3. **Build** — `npm run build` (Astro, ~2-3s)
4. **MD mirrors** — `scripts/generate-md-mirrors.sh` copies `src/content/posts/*.md` to `dist/posts/<slug>.md` so LLMs can fetch clean markdown source at `jordannewell.com/posts/<slug>.md`
5. **Backup** — `scripts/backup-existing-site.sh` snapshots current production to `${BACKUP_DIR}/<UTC-timestamp>/`
6. **Ship** — tar-over-ssh pipe: `tar -C dist -czf - . | ssh "$REMOTE_HOST" 'cd "$REMOTE_PATH" && rm -rf ./* && tar -xzf -'`. Uses `sudo` + `chown` if target dir isn't writable by the SSH user.
7. **Verify** — prints curl commands for spot-checking the live site

### Deploy failure recovery

The script captures `PIPESTATUS` and exits non-zero if either `tar` or `ssh` fails. Production may be in a partially-deployed state. Two recovery paths:

**Roll back to latest backup:**

    ssh "$REMOTE_HOST" 'ls -t "$BACKUP_DIR"/ | head -3'
    # Pick a timestamp from the output, then:
    ssh "$REMOTE_HOST" 'sudo rm -rf "$REMOTE_PATH"/* && sudo cp -a "$BACKUP_DIR"/<TIMESTAMP>/* "$REMOTE_PATH"/'

**Diagnose and re-run:**

    ssh "$REMOTE_HOST" 'ls -la "$REMOTE_PATH"/'
    # Inspect what's there, fix the underlying issue, then:
    bash scripts/deploy.sh

### After deploying

CF edge cache may serve stale content for ~4 hours (default `Cache-Control: max-age=14400` on static assets). To force-refresh immediately:

    bash scripts/purge-cf-cache.sh    # if you have it
    # or via API:
    curl -X POST "https://api.cloudflare.com/client/v4/zones/7b3c18289044e7e9610d55c1b7d1f8a6/purge_cache" \
      -H "Authorization: Bearer $CF_TOKEN" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'

## Project structure

    src/
    ├── content/
    │   ├── posts/           # markdown blog posts (frontmatter + body)
    │   ├── projects/        # project deep-dive pages
    │   └── contributions/   # OSS contributions log
    ├── content.config.ts    # zod schemas for the 3 collections (with glob loaders)
    ├── components/
    │   ├── Header.astro     # nav bar (used by BaseLayout)
    │   ├── Footer.astro     # socials + feeds + status + © (used by BaseLayout)
    │   ├── TagPill.astro    # colored tag chip
    │   ├── PostCard.astro   # post summary card
    │   └── SchemaOrg.astro  # JSON-LD injection
    ├── layouts/
    │   ├── BaseLayout.astro # HTML shell + <head> + Header + Footer
    │   ├── PostLayout.astro # article wrapper with schema.org BlogPosting
    │   └── ProjectLayout.astro
    ├── lib/
    │   ├── site.ts          # SITE constants, NAV_LINKS, TAG_COLORS
    │   └── schema.ts        # personSchema / websiteSchema / articleSchema / graphSchema
    ├── pages/
    │   ├── index.astro          # homepage (hero + Live signals + Core grid + Latest posts)
    │   ├── posts/
    │   │   ├── index.astro      # all-posts index
    │   │   └── [...slug].astro  # dynamic post route
    │   ├── projects/
    │   │   ├── index.astro      # projects grid
    │   │   └── [slug].astro     # dynamic project route
    │   ├── about.astro
    │   ├── now.astro            # nownownow.com-style "current focus"
    │   ├── contributions.astro  # OSS work log
    │   ├── license.astro        # hybrid license page
    │   ├── tags/[tag].astro     # tag index
    │   ├── rss.xml.ts           # RSS 2.0 feed
    │   ├── feed.json.ts         # JSON Feed 1.1
    │   ├── ai-feed.json.ts      # LLM-optimized feed (markdown_url field)
    │   ├── llms.txt.ts          # llmstxt.org spec generator
    │   └── robots.txt.ts        # AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, etc.)
    └── styles/
        └── global.css       # Tailwind v4 @theme tokens + base styles + .prose

    scripts/
    ├── deploy.sh                # build + mirror + backup + ship (see above)
    ├── backup-existing-site.sh  # snapshots current production to timestamped dir
    ├── generate-md-mirrors.sh   # copies src/content/posts/*.md → dist/posts/*.md
    └── check-llm-crawlers.sh    # weekly grep of nginx access logs for AI user-agents

    public/
    ├── favicon.svg              # "JN" monogram (285 bytes, hand-crafted)
    ├── profile-v5.jpg           # OG image + homepage avatar
    └── profile.jpg              # legacy profile (kept for compatibility)

    docs/
    └── IDENTITY.md              # voice rules — Hobart 75% / Murphy 25%

## Content authoring

Posts live in `src/content/posts/<slug>.md`. Frontmatter:

    ---
    title: "..."
    description: "..."                    # used in RSS, OG, schema.org, PostCard
    pubDate: 2026-07-15
    updatedDate: 2026-07-16               # optional
    tags: ["rebuild", "infra"]            # primary tag first
    mode: "hobart"                        # or "murphy" for manifesto-style drops
    draft: false                          # set true to hide from feeds + indexes
    ---

See `docs/IDENTITY.md` for the voice rules — Hobart mode default, Murphy mode for ~1 in 4 posts.

## LLM-discoverability (baked in, not bolted on)

- Static HTML by default (Astro zero-JS output)
- Schema.org JSON-LD: `Person`, `WebSite`, `BlogPosting`, auto-injected per page
- `/llms.txt` at root (llmstxt.org spec)
- `.md` mirrors at `<post-url>.md` for every post
- Full feed stack: `sitemap.xml`, `rss.xml`, `feed.json`, `ai-feed.json`
- `robots.txt` with explicit AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Per-post extraction rules in `docs/IDENTITY.md` (opener = thesis, named entity in H1, no hedging language)

## Pre-commit hook

Local pre-commit hook chains:
1. Global secret scanner at `~/.githooks/pre-commit`
2. Voice lint at `scripts/voice-lint.sh` (catches Claude-isms + hedge words per `docs/IDENTITY.md`)

**First checkout setup** (git hooks aren't version-controlled):

    git config core.hooksPath .git/hooks

The local `.git/hooks/pre-commit` exists in this checkout — the config just tells git to use the local path instead of the global default.

## Documentation pointers

- **Voice rules** → `docs/IDENTITY.md`
- **License** (MIT code + CC BY-NC content + ARR brand) → `LICENSE` file + `/license` page
- **Original design spec** → `<local-vault>/docs/superpowers/specs/2026-07-15-jordannewell-com-design.md`
- **Implementation plan** → `<local-vault>/docs/superpowers/plans/2026-07-15-jordannewell-com.md`

## License

© 2026 Jordan Newell. Source code under MIT, content under CC BY-NC 4.0, brand elements All Rights Reserved. Full breakdown in `LICENSE` and at `/license`.
