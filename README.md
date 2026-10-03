# jordannewell.com

Source for [jordannewell.com](https://jordannewell.com). Astro 7 SSG (static output) with Tailwind v4.

**Current state: the site is in a "coming-soon" splash phase.** The homepage is a
splash desk (status terminal, interactive keyboard, emoji dock). The former
blog/portfolio routes (`/posts`, `/tags`, `/about`, `/now`, RSS/JSON feeds,
`llms.txt`, `robots.txt`) are parked under `src/pages/_disabled/` — content
collections are still maintained so the blog can come back. Meanwhile the splash
has taken over the domain (the standalone splash repo is
[`jordannewell-live`](https://github.com/JordanNewell/jordannewell-live)).

Live routes: `/` (splash), `/projects/*`, `/products/*`, `/legal`, `404`.

## Quick start

    npm install
    npm run dev        # local dev server (default port 4321)
    npm run build      # outputs to dist/
    npm run preview    # build + wrangler dev (local Cloudflare Workers preview)

## Deploy

Two paths exist in the repo:

1. **tar-over-ssh (used by `npm run publish`)** — the documented production path:

       cp .env.example .env
       # fill in REMOTE_HOST, REMOTE_PATH, BACKUP_DIR
       bash scripts/deploy.sh

   `deploy.sh` sources `.env`, SSH-preflight-checks, builds, copies
   `src/content/posts/*.md` to `dist/posts/<slug>.md` (markdown mirrors for LLMs),
   snapshots current production to `${BACKUP_DIR}/<UTC-timestamp>/`, then ships
   via `tar -C dist -czf - . | ssh …`. It captures `PIPESTATUS` and fails loud;
   roll back by copying a timestamped backup over `REMOTE_PATH`.

   `npm run publish -- <slug>` wraps: voice lint on the post → build → deploy.sh
   → curl-verify the live URL.

2. **Cloudflare Workers tooling** — `wrangler.jsonc` + `@astrojs/cloudflare` +
   `npm run deploy` (`astro build && wrangler deploy`) and
   `npm run generate-types` (`wrangler types`). Added to support SSR-on-Workers
   experiments and the `activity-proxy` worker below.

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run build` on push/PR to
`main`.

## Project structure

    src/
    ├── content/               # 4 collections (zod schemas in src/content.config.ts)
    │   ├── posts/             # 14 markdown posts (hobart/murphy voice modes)
    │   ├── projects/          # 12 project deep-dive pages
    │   ├── products/          # 2 product pages (curtis-ai-chat, git-hygiene)
    │   └── contributions/     # OSS contributions log
    ├── components/            # Splash, StatusTerminal, KeyboardBase, EmojiDock,
    │                          # Header, Footer, PostCard, SchemaOrg, badges, …
    ├── layouts/               # BaseLayout, PostLayout, ProjectLayout
    ├── lib/                   # site.ts (SITE, NAV_LINKS, TAG_COLORS), schema.ts
    ├── pages/                 # index (splash), legal, projects/*, products/*, 404
    └── pages/_disabled/       # retired blog routes (posts, tags, feeds, llms.txt, …)
    workers/activity-proxy/    # Cloudflare Worker: proxies GitHub events API for
                               # the splash terminal (CSP + rate-limit fix, 60s edge cache)
    scripts/                   # deploy.sh, publish.sh, backup-existing-site.sh,
                               # generate-md-mirrors.sh, voice-lint.sh,
                               # check-llm-crawlers.sh, verify-scrub.sh,
                               # rasterize-monogram.mjs
    public/                    # fonts (Newell-Regular.woff2), images, js,
                               # .well-known/openpgpkey (PGP Web Key Directory)
    drafts/                    # unpublished post drafts
    docs/                      # IDENTITY.md (voice rules) + superpowers specs/plans

## Content authoring

Posts live in `src/content/posts/<slug>.md`. Frontmatter: `title`,
`description`, `pubDate`, optional `updatedDate`, `tags`, `mode: hobart|murphy`,
`draft`, plus optional Vault-session fields (`series`, `tool`, `era`,
`session`, `kind`) — see `src/content.config.ts`. Voice rules (Hobart default,
Murphy ~1 in 4) are in `docs/IDENTITY.md`.

## Git hooks

Tracked under `.githooks/`. First checkout:

    bash .githooks/setup.sh     # sets core.hooksPath to .githooks/

`pre-commit` chains the global secret scanner (`~/.githooks/pre-commit`) with
voice lint on staged `.md`/`.astro`; `pre-push` also runs.

## License

© 2026 Jordan Newell. Source code under MIT, content under CC BY-NC 4.0, brand
elements All Rights Reserved. Full breakdown in `LICENSE` and at `/legal`.
