# Project Page Enhancement — Design

**Date:** 2026-07-19
**Status:** Approved (brainstorming complete)
**Next step:** writing-plans skill creates the implementation plan

## Goal

Add rich, structured content sections to per-project pages on jordannewell.com, keeping the existing dark / mono / minimal aesthetic. "Alive" comes from content density and hover affordances — not motion, icons, or images.

## Trigger

Two new public repos (`harbormasterd`, `git-hygiene`) need project pages. The current `ProjectLayout` is a header + prose slot — no surface area for the kind of scannable feature content those repos deserve. Rather than only writing two new markdown files into the existing minimal layout, we extend the layout with opt-in structured sections and retrofit it onto the three existing projects that have public GitHub repos.

## Scope

**5 pages touched:**

- **NEW:** `harbormasterd.md`, `git-hygiene.md`
- **RETROFIT:** `crypto-key-classifier.md`, `jordannewell-com.md`, `temporal-git.md`

**Retrofit rule:** every project page whose frontmatter `repo:` points at a public `JordanNewell/*` repo. Pages without public repos (`openclaw-fleet`, `agent-orchestration`, `fleet-infrastructure`, etc.) stay markdown-only — no public surface to drive highlights/stats from.

All new schema fields are optional. Pages that don't use them render identically to today.

## Schema additions

`src/content.config.ts` — three new optional fields on the `projects` collection:

```ts
facts: z.array(z.object({ k: z.string(), v: z.string() })).optional(),
highlights: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
stack: z.array(z.string()).optional(),
```

All default to `undefined` → section not rendered. No change to existing entries required.

**Related posts** — derived at build time from the existing `post.data.project` field on the posts collection. No new schema. Fix one inconsistency as part of this work: `src/content/posts/openclaw-bug-anatomy.md` uses `project: "openclaw"` but the project id is `openclaw-fleet`. Rename the post's field value to `openclaw-fleet` so the relation resolves. (`shipping-crypto-key-classifier.md` already matches correctly.)

## Template changes

`src/layouts/ProjectLayout.astro` — render four new sections, each gated on its data being present:

```
┌──────────────────────────────────────────────┐
│  HEADER (existing)                           │
│  status · tags · title · description         │
│  source ↗ · live ↗                           │
├──────────────────────────────────────────────┤
│  accent line (NEW)                           │  1px, green→transparent, 60% opacity
├──────────────────────────────────────────────┤
│  AT A GLANCE  (NEW, if facts)                │  2-4 tiles, grid auto-fits count
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  │ k   │ │ k   │ │ k   │ │ k   │             │  label = uppercase mono micro
│  │ V   │ │ V   │ │ V   │ │ V   │             │  value = bold display
│  └─────┘ └─────┘ └─────┘ └─────┘             │
├──────────────────────────────────────────────┤
│  HIGHLIGHTS  (NEW, if highlights)            │  2-col grid
│  ┌─────────────┐  ┌─────────────┐            │
│  │ Title       │  │ Title       │            │  title = display semibold
│  │ body…       │  │ body…       │            │  body = secondary, 1.5 line-height
│  └─────────────┘  └─────────────┘            │  hover = border-light + bg-card-hover
├──────────────────────────────────────────────┤
│  STACK  (NEW, if stack)                      │  pill row, wraps
│  [pill] [pill] [pill] [pill]                 │  mono, outline only
├──────────────────────────────────────────────┤
│  PROSE (existing slot)                       │  unchanged
│  markdown body…                              │
├──────────────────────────────────────────────┤
│  RELATED  (NEW, if related posts exist)      │  list, each row = title + date
│  • Post title                       date     │  auto-derived from posts where
│  • Post title                       date     │  post.data.project === project.id
└──────────────────────────────────────────────┘
```

Facts grid behavior: 2 tiles → 2-col; 3 tiles → 3-col; 4 tiles → 4-col; ≥5 wraps to a 4-col layout with overflow on row 2. Below `md` breakpoint, collapse to 2-col; below `sm`, 1-col. Highlights grid is always 2-col on `md+`, 1-col below.

Styling approach: use Tailwind utilities inline in `ProjectLayout.astro` rather than adding a new component layer to `global.css`. The grids map cleanly to `grid grid-cols-2 md:grid-cols-4 gap-2` and similar. Existing design tokens (`bg-card`, `border`, `border-light`, `fg-secondary`, `fg-muted`, `green`) cover everything. If utility soup gets unreadable, extract small CSS classes to `global.css` `@layer components` — decision deferable to plan stage.

"Lighter" retrofit for `temporal-git` means: exploratory status, so its highlights describe the validated concept rather than shipped features, and the facts grid is 2 tiles (status + repo link) rather than 4. No reductions to schema or template — just realistic content for an exploratory project.

## Files touched

| File | Change |
|---|---|
| `src/content.config.ts` | Add 3 optional fields to projects schema |
| `src/layouts/ProjectLayout.astro` | Render 4 new conditional sections + accent line |
| `src/content/projects/harbormasterd.md` | New — full content from README |
| `src/content/projects/git-hygiene.md` | New — full content from README |
| `src/content/projects/crypto-key-classifier.md` | Add `facts`, `highlights`, `stack` |
| `src/content/projects/jordannewell-com.md` | Add `facts`, `highlights`, `stack` |
| `src/content/projects/temporal-git.md` | Add `facts`, `highlights`, `stack` (lighter — exploratory) |
| `src/content/posts/openclaw-bug-anatomy.md` | `project: "openclaw"` → `"openclaw-fleet"` |

## Visual rules

- **Palette:** unchanged. Reuse `bg`, `bg-card`, `bg-card-hover`, `border`, `border-light`, `fg`, `fg-secondary`, `fg-muted`, `green`.
- **Fonts:** unchanged. `font-display` for titles/values, `font-mono` for labels/pills, body sans for descriptions.
- **Spacing:** match existing card rhythm — `gap-2` for grids, `py-3 px-4` for card padding.
- **Hover:** 150ms transition. Border lightens (`border` → `border-light`), background shifts (`bg-card` → `bg-card-hover`). No scale, no shadow, no glow.
- **Accent line:** 1px tall, full content-width, gradient from `--color-green` at 60% opacity to transparent at 70% width. Sits between header and first optional section.
- **No icons, no images, no animation, no shadow, no scale.**

## Out of scope

- No new components (sections inline in ProjectLayout)
- No icon system or imagery
- No `/projects` index page redesign (listing page unchanged)
- No retrofit of pages without public repos
- No timeline / metrics-with-sparklines / code-snippet-hero (those were option C — deferred)
- No new fonts or design tokens

## Risks

- **Astro Content schema migration:** adding optional fields is non-breaking, but Astro types regenerate. Build must pass before commit.
- **Mobile responsiveness:** 4-col facts grid needs to collapse to 2 then 1; 2-col highlights needs to collapse to 1. Standard Tailwind responsive prefixes handle this.
- **Retrofitted content quality:** highlights/stats are only as good as what we pull from each repo's README. Plan stage will draft per-page content for review.
- **Related posts matcher:** exact `project.id` match only. If more posts use shorthand values in the future, they won't link. Acceptable — fix at write time.

## Acceptance criteria

- [ ] `npm run build` passes
- [ ] New `harbormasterd` and `git-hygiene` pages render with full structured content
- [ ] 3 retrofitted pages render with new sections; old sections (header, prose) unchanged
- [ ] All 10 untouched pages render identically to pre-change (visual smoke check)
- [ ] Mobile layout verified at 375px width
- [ ] `openclaw-bug-anatomy.md` shows up in `openclaw-fleet` page's Related section
