# jordannewell.com

Source for https://jordannewell.com — Astro SSG, deployed to production via rsync.

## Develop

    npm install
    npm run dev

## Build

    npm run build

## Deploy

    ./scripts/deploy.sh

## Pre-commit hook

This repo uses a local pre-commit hook (`core.hooksPath = .git/hooks`) that chains:
1. Global secret scanner at `~/.githooks/pre-commit`
2. Voice lint at `scripts/voice-lint.sh` (catches Claude-isms + hedge words per `VOICE.md`)

**First checkout setup** (git hooks aren't version-controlled):

    git config core.hooksPath .git/hooks

The local `.git/hooks/pre-commit` already exists in this checkout — the config just tells git to use the local path instead of the global default.

## Deploy

Deploy is `tar-over-ssh` (no rsync dependency). Configure target via env vars:

    REMOTE_HOST=user@<host> REMOTE_PATH=/opt/www/<site> ./scripts/deploy.sh

Or edit the defaults in `scripts/deploy.sh` to match your SSH alias + web root.

See `docs/IDENTITY.md` for voice rules. See spec at `<local-vault>/docs/superpowers/specs/2026-07-15-jordannewell-blog-design.md`.
