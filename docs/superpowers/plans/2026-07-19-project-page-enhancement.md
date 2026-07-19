# Project Page Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 structured, opt-in sections (quick-facts grid, highlights cards, stack pills, related posts) to per-project pages on jordannewell.com. Ship 2 new pages (harbormasterd, git-hygiene) and retrofit 3 existing pages with public repos (crypto-key-classifier, jordannewell-com, temporal-git).

**Architecture:** Backward-compatible schema additions to the existing `projects` collection. `ProjectLayout.astro` renders each new section conditionally on its data being present — pages that don't use the new fields render identically to today. No new components, no new design tokens, no images/icons/animation.

**Tech Stack:** Astro 7, Tailwind 4, TypeScript, Zod (content schema). No test framework — verification is `npm run build` + dev-server visual smoke check.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/content.config.ts` | Zod schema for content collections | Add 3 optional fields |
| `src/layouts/ProjectLayout.astro` | Wraps every `/projects/[slug]` page | Render 4 conditional sections + accent line |
| `src/content/projects/harbormasterd.md` | New project page | Create |
| `src/content/projects/git-hygiene.md` | New project page | Create |
| `src/content/projects/crypto-key-classifier.md` | Existing project page | Add facts/highlights/stack to frontmatter |
| `src/content/projects/jordannewell-com.md` | Existing project page | Add facts/highlights/stack to frontmatter |
| `src/content/projects/temporal-git.md` | Existing project page | Add facts/highlights/stack to frontmatter (lighter) |
| `src/content/posts/openclaw-bug-anatomy.md` | Existing post | Fix `project:` value from `openclaw` to `openclaw-fleet` |

The `projects` collection schema lives entirely in `content.config.ts` — no scattered type definitions. The layout file owns all rendering for project pages. Each content file owns its own structured data. No new files outside `src/content/projects/`.

---

## Task 1: Add 3 optional fields to projects schema

**Files:**
- Modify: `src/content.config.ts:24-37`

- [ ] **Step 1: Read the current schema**

Run: `cat src/content.config.ts`

Confirm the `projects` collection is at lines 24-37 and looks like:

```ts
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "shipped", "exploratory", "venture-track"]).default("active"),
    startDate: z.coerce.date().optional(),
    shipDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    order: z.number().default(99),
  }),
});
```

- [ ] **Step 2: Add the 3 new optional fields**

Edit `src/content.config.ts` — replace the `projects` collection block (lines 24-37) with:

```ts
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "shipped", "exploratory", "venture-track"]).default("active"),
    startDate: z.coerce.date().optional(),
    shipDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    order: z.number().default(99),
    facts: z
      .array(z.object({ k: z.string(), v: z.string() }))
      .optional(),
    highlights: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .optional(),
    stack: z.array(z.string()).optional(),
  }),
});
```

- [ ] **Step 3: Verify build still passes (no existing entry uses the new fields yet)**

Run: `npm run build`

Expected: build succeeds with no errors. New fields are all `.optional()` so existing markdown files are unaffected.

- [ ] **Step 4: Verify TypeScript types regenerated**

Run: `npx astro sync`

Expected: completes without error. This regenerates `src/content/config.types.ts` (or equivalent) so `project.data.facts` is typed as `{ k: string; v: string }[] | undefined`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts
git commit -m "projects: schema additions — facts, highlights, stack (optional)"
```

---

## Task 2: Add accent line + section scaffolding to ProjectLayout

This task adds the visual divider between header and body, and the section-label styling used by all 4 new sections. It does NOT add any conditional rendering yet — that's tasks 3-6.

**Files:**
- Modify: `src/layouts/ProjectLayout.astro:30-48`

- [ ] **Step 1: Re-read the current layout**

Run: `cat src/layouts/ProjectLayout.astro`

Confirm current structure: header with status/tags/title/description/links, then `<slot />`. No sections between header and slot.

- [ ] **Step 2: Add the accent line below the header**

Edit `src/layouts/ProjectLayout.astro` — find this block at the end of the `<header>`:

```astro
      {(repo || liveUrl) && (
        <div class="flex gap-4 mt-4 text-sm font-mono">
          {repo && <a href={repo} class="text-green hover:underline">source ↗</a>}
          {liveUrl && <a href={liveUrl} class="text-green hover:underline">live ↗</a>}
        </div>
      )}
    </header>
    <slot />
```

Replace with:

```astro
      {(repo || liveUrl) && (
        <div class="flex gap-4 mt-4 text-sm font-mono">
          {repo && <a href={repo} class="text-green hover:underline">source ↗</a>}
          {liveUrl && <a href={liveUrl} class="text-green hover:underline">live ↗</a>}
        </div>
      )}
    </header>
    <div
      class="h-px mb-8"
      style="background: linear-gradient(90deg, color-mix(in srgb, var(--color-green) 60%, transparent), color-mix(in srgb, var(--color-green) 20%, transparent) 30%, transparent 70%);"
    >
    </div>
    <slot />
```

- [ ] **Step 3: Verify build + dev server**

Run: `npm run build`

Expected: build succeeds.

Run (separate terminal, leave running): `npm run dev`

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: page renders normally with a thin green-fading horizontal line below the source/live links and above the markdown body. Existing pages that don't yet have new fields should look identical to before EXCEPT for this accent line.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "layout: project-page accent line below header"
```

---

## Task 3: Quick-facts grid section

Renders `project.data.facts` as a responsive grid of stat tiles. Each tile = uppercase mono micro label + bold display value.

**Files:**
- Modify: `src/layouts/ProjectLayout.astro`

- [ ] **Step 1: Add scratch content to verify rendering**

Create `src/content/projects/_scratch-facts-test.md` with this content (will be deleted before commit):

```markdown
---
title: "Scratch Facts Test"
description: "Temporary entry to verify the facts section renders."
status: "exploratory"
tags: ["projects"]
order: 999
facts:
  - k: "shipped"
    v: "2026-07-19"
  - k: "language"
    v: "Python 3.9+"
  - k: "license"
    v: "MIT"
  - k: "clis"
    v: "pa · pad"
---

Scratch body — delete this file before committing.
```

- [ ] **Step 2: Add the conditional facts section to ProjectLayout**

Edit `src/layouts/ProjectLayout.astro`. The current layout (after task 2) ends with:

```astro
    <div
      class="h-px mb-8"
      style="background: linear-gradient(90deg, color-mix(in srgb, var(--color-green) 60%, transparent), color-mix(in srgb, var(--color-green) 20%, transparent) 30%, transparent 70%);"
    >
    </div>
    <slot />
```

Replace with:

```astro
    <div
      class="h-px mb-8"
      style="background: linear-gradient(90deg, color-mix(in srgb, var(--color-green) 60%, transparent), color-mix(in srgb, var(--color-green) 20%, transparent) 30%, transparent 70%);"
    >
    </div>
    {project.data.facts && project.data.facts.length > 0 && (
      <section class="mb-8">
        <h2 class="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">At a glance</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {project.data.facts.map((fact) => (
            <div class="border border-border rounded-md px-3 py-2 hover:border-border-light transition-colors">
              <div class="font-mono text-xs uppercase tracking-wider text-fg-muted">{fact.k}</div>
              <div class="font-display font-semibold text-sm">{fact.v}</div>
            </div>
          ))}
        </div>
      </section>
    )}
    <slot />
```

- [ ] **Step 3: Verify rendering on the scratch page**

Run (if not already running): `npm run dev`

Open: `http://localhost:4321/projects/_scratch-facts-test/`

Expected: between the accent line and the body prose, a labeled "AT A GLANCE" section with 4 tiles in a row (or 2x2 on narrow viewport). Each tile shows the label small/uppercase/muted and value larger/bold.

- [ ] **Step 4: Verify non-facts pages render unchanged**

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: page renders normally with accent line, NO "At a glance" section. Body prose follows directly.

- [ ] **Step 5: Delete the scratch file**

Run: `rm src/content/projects/_scratch-facts-test.md`

- [ ] **Step 6: Verify build passes without scratch file**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "layout: project-page quick-facts grid section"
```

---

## Task 4: Highlights cards section

Renders `project.data.highlights` as a 2-col grid of cards. Each card = display semibold title + secondary body.

**Files:**
- Modify: `src/layouts/ProjectLayout.astro`

- [ ] **Step 1: Add scratch content**

Create `src/content/projects/_scratch-highlights-test.md`:

```markdown
---
title: "Scratch Highlights Test"
description: "Temporary entry to verify the highlights section renders."
status: "exploratory"
tags: ["projects"]
order: 999
highlights:
  - title: "Zero-config HTTPS"
    body: "mkcert, Caddy CA, or self-signed fallback. Trust once, forget it."
  - title: "*.pa.local DNS"
    body: "Local resolver — no more /etc/hosts edits per project."
---

Scratch body — delete this file before committing.
```

- [ ] **Step 2: Add the conditional highlights section to ProjectLayout**

Edit `src/layouts/ProjectLayout.astro`. Find the end of the facts section (just before `<slot />`):

```astro
    )}
    <slot />
```

Replace the `<slot />` line with:

```astro
    )}
    {project.data.highlights && project.data.highlights.length > 0 && (
      <section class="mb-8">
        <h2 class="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">Highlights</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {project.data.highlights.map((h) => (
            <div class="border border-border rounded-md px-4 py-3 hover:border-border-light hover:bg-bg-card-hover transition-colors">
              <div class="font-display font-semibold text-base mb-1">{h.title}</div>
              <div class="text-sm text-fg-secondary leading-relaxed">{h.body}</div>
            </div>
          ))}
        </div>
      </section>
    )}
    <slot />
```

- [ ] **Step 3: Verify rendering on the scratch page**

Open: `http://localhost:4321/projects/_scratch-highlights-test/`

Expected: "HIGHLIGHTS" label followed by a 2-col grid (1-col on narrow viewport) of two cards. Each card shows title bold + body in secondary color. Hovering a card lightens its border and shifts background subtly.

- [ ] **Step 4: Verify non-highlights pages render unchanged**

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: no Highlights section.

- [ ] **Step 5: Delete the scratch file**

Run: `rm src/content/projects/_scratch-highlights-test.md`

- [ ] **Step 6: Build verify**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "layout: project-page highlights cards section"
```

---

## Task 5: Stack pills section

Renders `project.data.stack` as a wrapping row of small outline pills. Visually distinct from `TagPill` (which is for taxonomy tags) — these are flat mono outline pills.

**Files:**
- Modify: `src/layouts/ProjectLayout.astro`

- [ ] **Step 1: Add scratch content**

Create `src/content/projects/_scratch-stack-test.md`:

```markdown
---
title: "Scratch Stack Test"
description: "Temporary entry to verify the stack section renders."
status: "exploratory"
tags: ["projects"]
order: 999
stack:
  - "Python 3.9+"
  - "mkcert"
  - "Caddy CA"
  - "SQLite"
  - "CLI"
  - "daemon"
---

Scratch body — delete this file before committing.
```

- [ ] **Step 2: Add the conditional stack section to ProjectLayout**

Edit `src/layouts/ProjectLayout.astro`. Find the end of the highlights section (just before `<slot />`):

```astro
    )}
    <slot />
```

Replace the `<slot />` line with:

```astro
    )}
    {project.data.stack && project.data.stack.length > 0 && (
      <section class="mb-8">
        <h2 class="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">Stack</h2>
        <div class="flex flex-wrap gap-1.5">
          {project.data.stack.map((s) => (
            <span class="font-mono text-xs px-2.5 py-0.5 rounded-full border border-border-light text-fg-secondary">
              {s}
            </span>
          ))}
        </div>
      </section>
    )}
    <slot />
```

- [ ] **Step 3: Verify rendering on the scratch page**

Open: `http://localhost:4321/projects/_scratch-stack-test/`

Expected: "STACK" label followed by a wrapping row of mono pills with thin outline borders. Pills should reflow on narrow viewport.

- [ ] **Step 4: Verify non-stack pages render unchanged**

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: no Stack section.

- [ ] **Step 5: Delete the scratch file**

Run: `rm src/content/projects/_scratch-stack-test.md`

- [ ] **Step 6: Build verify**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "layout: project-page stack pills section"
```

---

## Task 6: Related posts section

Queries the `posts` collection for entries where `post.data.project === project.id`, sorts by pubDate desc, renders as a list.

**Files:**
- Modify: `src/layouts/ProjectLayout.astro`

- [ ] **Step 1: Add scratch post for verification**

Create `src/content/posts/_scratch-related-test.md`:

```markdown
---
title: "Scratch Related Post"
description: "Temporary post to verify the related-posts query."
pubDate: 2026-07-19
tags: ["post"]
project: "_scratch-related-test"
---

Scratch body — delete this file before committing.
```

Create `src/content/projects/_scratch-related-test.md`:

```markdown
---
title: "Scratch Related Project"
description: "Temporary entry to verify the related-posts section renders."
status: "exploratory"
tags: ["projects"]
order: 999
---

Scratch body — delete this file before committing.
```

- [ ] **Step 2: Add the related-posts query + section to ProjectLayout**

Edit `src/layouts/ProjectLayout.astro`. The frontmatter section currently imports `getCollection` indirectly via `astro:content` types only. We need to call it directly.

Find this frontmatter block at the top:

```astro
---
import BaseLayout from "./BaseLayout.astro";
import TagPill from "../components/TagPill.astro";
import { creativeWorkSchema } from "../lib/schema";
import type { CollectionEntry } from "astro:content";

const { project } = Astro.props as { project: CollectionEntry<"projects"> };
const { title, description, status, repo, liveUrl, tags } = project.data;
```

Replace with:

```astro
---
import BaseLayout from "./BaseLayout.astro";
import TagPill from "../components/TagPill.astro";
import { creativeWorkSchema } from "../lib/schema";
import { getCollection, type CollectionEntry } from "astro:content";

const { project } = Astro.props as { project: CollectionEntry<"projects"> };
const { title, description, status, repo, liveUrl, tags } = project.data;

const allPosts = await getCollection("posts");
const relatedPosts = allPosts
  .filter((p) => p.data.project === project.id)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

- [ ] **Step 3: Add the conditional related-posts section to the template**

Find the end of the stack section (just before `<slot />`):

```astro
    )}
    <slot />
```

Replace the `<slot />` line with:

```astro
    )}
    <slot />
    {relatedPosts.length > 0 && (
      <section class="mt-12">
        <h2 class="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">Related</h2>
        <ul class="divide-y divide-border">
          {relatedPosts.map((p) => (
            <li>
              <a
                href={`/posts/${p.id}/`}
                class="flex items-baseline justify-between gap-4 py-2 hover:text-green transition-colors"
              >
                <span class="text-sm">{p.data.title}</span>
                <span class="font-mono text-xs text-fg-muted whitespace-nowrap">
                  {p.data.pubDate.toISOString().slice(0, 10)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}
```

Note: the related-posts section renders AFTER `<slot />` (it's a footer-of-page section, not a pre-body section).

- [ ] **Step 4: Verify rendering on the scratch page**

Open: `http://localhost:4321/projects/_scratch-related-test/`

Expected: below the body prose, a "RELATED" label followed by a single row linking to "Scratch Related Post" with the date 2026-07-19. Clicking the row navigates to the scratch post.

- [ ] **Step 5: Verify non-related pages render unchanged**

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: no Related section (the `openclaw` → `openclaw-fleet` fix is task 12, not yet applied).

- [ ] **Step 6: Delete the scratch files**

Run: `rm src/content/posts/_scratch-related-test.md src/content/projects/_scratch-related-test.md`

- [ ] **Step 7: Build verify**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "layout: project-page related-posts section"
```

---

## Task 7: New page — harbormasterd

**Files:**
- Create: `src/content/projects/harbormasterd.md`

- [ ] **Step 1: Create the page**

Create `src/content/projects/harbormasterd.md`:

```markdown
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
    v: "pa · pad"
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

Source and install instructions on GitHub. MIT, pip-installable, comprehensive test suite across 12 categories and 9 platform combinations.
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

Expected: succeeds. Voice lint passes (project has a pre-commit hook that lints markdown).

- [ ] **Step 3: Verify rendering**

Run (if not running): `npm run dev`

Open: `http://localhost:4321/projects/harbormasterd/`

Expected: header shows SHIPPED status + tags + title + description + source link. Accent line below. "AT A GLANCE" with 4 tiles (shipped/language/license/clis). "HIGHLIGHTS" with 4 cards in 2x2 grid. "STACK" with 6 pills. Body prose renders correctly including the code block. No "Related" section yet (no posts reference this project).

- [ ] **Step 4: Verify index page links to it**

Open: `http://localhost:4321/projects/`

Expected: harbormasterd appears in the list with status SHIPPED. Clicking navigates to the page.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/harbormasterd.md
git commit -m "projects: harbormasterd page"
```

---

## Task 8: New page — git-hygiene

**Files:**
- Create: `src/content/projects/git-hygiene.md`

- [ ] **Step 1: Create the page**

Create `src/content/projects/git-hygiene.md`:

```markdown
---
title: "git-hygiene"
description: "Two git hooks that keep AI-tool attribution out of commit messages and secrets out of staged files. No dependencies beyond bash, grep, awk, and git itself."
status: "shipped"
tags: ["projects", "tools", "oss"]
shipDate: 2026-07-18
repo: "https://github.com/JordanNewell/git-hygiene"
order: 6
facts:
  - k: "shipped"
    v: "2026-07-18"
  - k: "license"
    v: "MIT"
  - k: "deps"
    v: "bash · grep · awk"
  - k: "hooks"
    v: "commit-msg · pre-commit"
highlights:
  - title: "Tools don't get co-author credit"
    body: "commit-msg strips Co-Authored-By / Generated with / Written by trailers naming Claude, Copilot, Cursor, Gemini, ChatGPT. Human co-authors preserved."
  - title: "Secrets stay out of git"
    body: "pre-commit scans for AWS / OpenAI / GitHub / Slack / Bearer / generic API key patterns. Skips node_modules and minified files."
  - title: "Local enforcement, no SaaS"
    body: "Hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans. Optional TruffleHog when available."
stack:
  - "Bash"
  - "grep"
  - "awk"
  - "git"
  - "TruffleHog (optional)"
---

Three positions, held firmly.

1. **AI tools are tools.** Claude, Copilot, Cursor, Gemini, ChatGPT — they're how the work gets done, not who did the work. The author is the human; the tool is the tool. You don't credit DeWalt on the shed you built with their drill.
2. **Secrets stay out of git.** API keys, tokens, passwords — pre-commit catches the high-precision patterns before they land in your object store.
3. **Local enforcement, no SaaS dependency.** The hooks run on your machine against your staged files. No telemetry, no cloud calls, no third-party scans.

## Install

Per-user (recommended — applies to every repo you own):

```bash
git clone https://github.com/JordanNewell/git-hygiene.git ~/git-hygiene
mkdir -p ~/.githooks
ln -s ~/git-hygiene/hooks/commit-msg ~/.githooks/commit-msg
ln -s ~/git-hygiene/hooks/pre-commit  ~/.githooks/pre-commit
chmod +x ~/.githooks/*
git config --global core.hooksPath ~/.githooks
```

Deployed across the fleet — every machine I develop on runs these hooks globally. The position became policy on 2026-07-18.
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 3: Verify rendering**

Open: `http://localhost:4321/projects/git-hygiene/`

Expected: SHIPPED status, 4 facts tiles, 3 highlights cards (3-col would be 2+1 on desktop — accept this; alternative is 2-col which leaves whitespace). Stack pills row. Prose renders.

- [ ] **Step 4: Verify index**

Open: `http://localhost:4321/projects/`

Expected: git-hygiene appears in the list. Clicking navigates.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/git-hygiene.md
git commit -m "projects: git-hygiene page"
```

---

## Task 9: Retrofit — crypto-key-classifier

**Files:**
- Modify: `src/content/projects/crypto-key-classifier.md`

- [ ] **Step 1: Re-read current content**

Run: `cat src/content/projects/crypto-key-classifier.md`

Note current frontmatter (title, description, status, tags, startDate, shipDate, repo, order) and body. Body stays as-is.

- [ ] **Step 2: Add facts/highlights/stack to frontmatter**

Edit `src/content/projects/crypto-key-classifier.md`. Replace the frontmatter block (between the `---` fences at the top) with:

```markdown
---
title: "Crypto Key Classifier"
description: "17 validators covering ~50 chains + BIP-39/Electrum mnemonics. Cosmos HRP swap: one decode → 20 re-encodings. 229 tests."
status: "shipped"
tags: ["projects", "crypto", "oss"]
startDate: 2026-07-09
shipDate: 2026-07-12
repo: "https://github.com/JordanNewell/crypto-key-classifier"
order: 4
facts:
  - k: "shipped"
    v: "2026-07-12"
  - k: "validators"
    v: "17"
  - k: "tests"
    v: "229"
  - k: "license"
    v: "MIT"
highlights:
  - title: "Cosmos HRP swap"
    body: "One decode → 20 re-encodings across Cosmos chains. HRP (human-readable part) is the only thing that changes."
  - title: "BIP-39 + Electrum mnemonics"
    body: "Word-list validation, checksum verification, seed derivation. Corruption-tolerant recovery."
  - title: "229 tests + hypothesis fuzz"
    body: "Property-based fuzzing on top of explicit cases. Argparse % bug regression caught post-ship."
  - title: "4 version tags"
    body: "v0.1.0-mvp → v0.4.0-hardened. Full brainstorm → spec → plan → subagent-execute cycle ×4."
stack:
  - "Python"
  - "pytest"
  - "hypothesis"
  - "MIT"
---
```

Leave the body (everything below the second `---`) unchanged.

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 4: Verify rendering**

Open: `http://localhost:4321/projects/crypto-key-classifier/`

Expected: existing prose body intact. New "AT A GLANCE" (shipped/validators/tests/license), "HIGHLIGHTS" (4 cards), "STACK" (4 pills). "RELATED" section should show "Shipping crypto-key-classifier" post (post already references this project id).

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/crypto-key-classifier.md
git commit -m "crypto-key-classifier: retrofit facts/highlights/stack"
```

---

## Task 10: Retrofit — jordannewell-com

**Files:**
- Modify: `src/content/projects/jordannewell-com.md`

- [ ] **Step 1: Re-read current content**

Run: `cat src/content/projects/jordannewell-com.md`

- [ ] **Step 2: Add facts/highlights/stack to frontmatter**

Edit `src/content/projects/jordannewell-com.md`. Replace the frontmatter block with:

```markdown
---
title: "jordannewell.com"
description: "Source for the site you're reading. Astro SSG, deployed via tar-over-ssh to a Hetzner host behind Cloudflare."
status: "active"
tags: ["projects", "web", "oss"]
repo: "https://github.com/JordanNewell/jordannewell"
order: 7
facts:
  - k: "framework"
    v: "Astro 7"
  - k: "styling"
    v: "Tailwind 4"
  - k: "hosting"
    v: "Hetzner + CF"
  - k: "deploy"
    v: "tar-over-ssh"
highlights:
  - title: "Astro 7 + Tailwind 4"
    body: "Static site generation. Zero client JS except where strictly necessary. Inter Tight display, JetBrains Mono metadata."
  - title: "Tar-over-ssh deploy"
    body: "Build locally, push a tarball over ssh, expand on the host. No CI middleman, no Docker layer cache."
  - title: "Cloudflare in front of Hetzner"
    body: "Origin hidden behind CF. MTA-STS + TLS-RPT + CAA + CSP layered hardening as of 2026-07-16."
stack:
  - "Astro 7"
  - "Tailwind 4"
  - "TypeScript"
  - "Cloudflare"
  - "Hetzner"
---
```

Leave the body unchanged.

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 4: Verify rendering**

Open: `http://localhost:4321/projects/jordannewell-com/`

Expected: existing body intact, new sections (facts 4, highlights 3, stack 5) render.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/jordannewell-com.md
git commit -m "jordannewell-com: retrofit facts/highlights/stack"
```

---

## Task 11: Retrofit — temporal-git (lighter)

Exploratory status — facts/highlights are smaller than shipped projects.

**Files:**
- Modify: `src/content/projects/temporal-git.md`

- [ ] **Step 1: Re-read current content**

Run: `cat src/content/projects/temporal-git.md`

Current state is a 1-paragraph exploratory stub. Body stays.

- [ ] **Step 2: Add smaller facts/highlights/stack to frontmatter**

Edit `src/content/projects/temporal-git.md`. Replace the frontmatter block with:

```markdown
---
title: "Temporal Git"
description: "Git blame on steroids. Travel through time to find when bugs were introduced."
status: "exploratory"
tags: ["projects", "tools", "oss"]
repo: "https://github.com/JordanNewell/temporal-git"
order: 21
facts:
  - k: "status"
    v: "exploratory"
  - k: "form"
    v: "CLI + VS Code"
highlights:
  - title: "Timeline visualization"
    body: "Code history rendered as a navigable timeline. Click any point, see what changed."
  - title: "Bug-introduction tracing"
    body: "Pick a line, walk backwards to the commit that introduced the pattern. Automated bisect adjacent."
stack:
  - "TypeScript"
  - "VS Code Extension API"
---
```

Leave the body unchanged.

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 4: Verify rendering**

Open: `http://localhost:4321/projects/temporal-git/`

Expected: existing prose intact. "AT A GLANCE" with 2 tiles (status/form). "HIGHLIGHTS" with 2 cards. "STACK" with 2 pills.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/temporal-git.md
git commit -m "temporal-git: retrofit facts/highlights/stack (lighter)"
```

---

## Task 12: Fix openclaw-bug-anatomy post.project

**Files:**
- Modify: `src/content/posts/openclaw-bug-anatomy.md`

- [ ] **Step 1: Confirm current value**

Run: `grep "^project:" src/content/posts/openclaw-bug-anatomy.md`

Expected output: `project: "openclaw"`

- [ ] **Step 2: Fix the value**

Edit `src/content/posts/openclaw-bug-anatomy.md`. Change:

```markdown
project: "openclaw"
```

to:

```markdown
project: "openclaw-fleet"
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: succeeds.

- [ ] **Step 4: Verify the relation resolves**

Open: `http://localhost:4321/projects/openclaw-fleet/`

Expected: "RELATED" section now appears at the bottom of the page with one entry — "Openclaw bug anatomy" (or whatever the post's title is) and its pubDate.

- [ ] **Step 5: Verify the post itself still renders**

Open: `http://localhost:4321/posts/openclaw-bug-anatomy/`

Expected: post renders normally. Body unchanged.

- [ ] **Step 6: Commit**

```bash
git add src/content/posts/openclaw-bug-anatomy.md
git commit -m "posts: openclaw-bug-anatomy — fix project ref to openclaw-fleet"
```

---

## Task 13: Final verification

**Files:**
- None modified — verification only.

- [ ] **Step 1: Clean build from scratch**

Run:

```bash
rm -rf dist
npm run build
```

Expected: succeeds with no warnings about the projects collection. All 17 project pages render (15 existing + 2 new).

- [ ] **Step 2: Visual smoke check at desktop width**

Run: `npm run dev`

Visit each of these URLs at default desktop width and confirm expected sections:

| URL | Expected sections |
|---|---|
| `/projects/harbormasterd/` | accent + facts(4) + highlights(4) + stack(6) + prose + (no related) |
| `/projects/git-hygiene/` | accent + facts(4) + highlights(3) + stack(5) + prose + (no related) |
| `/projects/crypto-key-classifier/` | accent + facts(4) + highlights(4) + stack(4) + prose + related(1: "Shipping crypto-key-classifier") |
| `/projects/jordannewell-com/` | accent + facts(4) + highlights(3) + stack(5) + prose + (no related) |
| `/projects/temporal-git/` | accent + facts(2) + highlights(2) + stack(2) + prose + (no related) |
| `/projects/openclaw-fleet/` | accent + prose + related(1: "Openclaw bug anatomy") |
| `/projects/agent-orchestration/` | accent + prose (no new sections — no facts/highlights/stack) |
| `/projects/temporal-git/` | (already checked) |

For the "no new sections" page (`agent-orchestration`): confirms backward compatibility. The accent line is the only visual change.

- [ ] **Step 3: Mobile width verification**

Open Chrome DevTools → Toggle device toolbar → set to iPhone SE (375px width).

Visit `/projects/harbormasterd/`. Confirm:

- Facts grid collapses to 2-col
- Highlights grid collapses to 1-col
- Stack pills wrap to multiple lines
- Header title scales down (already handled by existing `text-4xl md:text-5xl`)
- No horizontal scroll

- [ ] **Step 4: Verify /projects index page**

Open: `http://localhost:4321/projects/`

Confirm: 17 projects listed (was 15 before this work). Harbormasterd and git-hygiene appear in the list with correct status indicators (shipped = blue).

- [ ] **Step 5: Stop dev server**

In the terminal running `npm run dev`, press Ctrl+C.

- [ ] **Step 6: Final commit (if any uncommitted changes)**

Run: `git status`

If clean, nothing to commit. If anything is uncommitted (e.g. dist/), do not commit dist — confirm `.gitignore` already excludes it.

- [ ] **Step 7: Verify final state**

Run:

```bash
git log --oneline -15
```

Expected: ~12 new commits on top of the spec commit (5a3663d), one per task.

---

## Self-Review Notes

**Spec coverage:** All 5 page changes (2 new + 3 retrofit) covered. All 4 new template sections covered (tasks 3-6). Schema changes covered (task 1). Post fix covered (task 12). Mobile responsive verification covered (task 13). Acceptance criteria from spec all addressed.

**Voice lint gotcha:** Project has a pre-commit voice lint hook on `.md` and `.astro` files (seen running during the spec commit). If any commit fails the voice lint, fix the markdown rather than bypassing. The harbormasterd and git-hygiene bodies above are drafted in Jordan's voice — short declarative sentences, no marketing copy.

**Scratch files discipline:** Tasks 3-6 each create scratch markdown files for verification. They MUST be deleted before commit (steps explicitly call this out). If a scratch file is committed by accident, the build will still work but the project listing will show "_scratch-*" entries — ugly. The leading underscore in scratch filenames makes them easy to spot in `git status`.

**Astro port:** Default Astro 7 dev port is 4321. If 4321 is taken, Astro picks another — check the dev server startup output.
