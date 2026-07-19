# Blog IDENTITY — Voice Rules

> Canonical reference for how jordannewell.com posts sound.
> Apply before publishing any post. Self-review against this list.

## Brand thesis

Field notes from an operator shipping in public across sectors.
Sectors are tags. Jordan is the brand.

## Voice target

- **75% Byrne Hobart** (The Diff): rigorous, sourced, opinionated-with-evidence, sentence-level care.
- **25% Justin Murphy** (Other Life): manifesto/punk drop for claims worth stopping the room.

Default is Hobart. Escalate to Murphy only when warranted (~1 in 4 posts max).

## Hard rules

1. **Lead with the answer.** No throat-clearing. The opener must contain the thesis.
2. **One claim per paragraph.** Paragraphs that make two claims can't be quoted cleanly.
3. **Named entity in H1 and first sentence.** LLM extraction requires named entities.
4. **Dates next to time-sensitive facts.** Always. Format: "2026-07-15".
5. **No hedging language.** Strike: "maybe", "perhaps", "could possibly", "might", "I think", "arguably". Replace with: state the claim.
6. **Numbers in the open.** If you have a number, share it. MRR, post count, traffic, fail count.
7. **Frustration allowed; defeat isn't.** "Server down, here's what I learned" not "woe is me."
8. **Sourced opinions.** If you claim X is true, link or quote the source.
9. **No filler transitions.** Strike: "Let me explain.", "Here's the thing.", "So,", "Now,".
10. **Permalinks are permanent.** Refresh content in place; never rename a slug.

## Mode decision

Before writing, pre-commit: **is this Hobart or Murphy?**

- **Hobart mode (default):** analysis, technical depth, post-mortems, lessons-learned, explainers. ~1000-3500 words. Sourced. Tight.
- **Murphy mode (escalation):** manifestos, project launches, claims that drop. Variable length. Bigger type, accent color (red), full-bleed quotes. ~1 in 4 posts max.

If you can't articulate *why* this post deserves Murphy mode, it doesn't.

## Distribution-native structure

Every post should support being excerpted:

- **Opener** must work as a tweet (1-2 sentences, hook).
- **At least one pull-quote-worthy line** per ~500 words.
- **One quotable statistic or claim** that's the "if you remember nothing else" payload.
- **Closing line** that works standalone (for the newsletter CTA).

## Tags

- `/rebuild` — BP meta. Weekly notes, post-mortems, what shipped.
- `/infra` — Technical depth.
- `/ventures` — Strategy, acquisitions, market theses.

Secondary tags (`/ai`, `/crypto`, `/contributions`) cross-cut. Avoid top-level tags until 5+ posts warrant one.

## Pre-publish checklist

- [ ] Mode committed (Hobart or Murphy)
- [ ] Opener contains thesis
- [ ] Named entity in H1 and first sentence
- [ ] Dates explicit for time-sensitive facts
- [ ] No hedging language (search for: maybe, perhaps, might, I think)
- [ ] Numbers in the open where relevant
- [ ] Pull-quote-worthy line exists
- [ ] Closing line works standalone
- [ ] Tag pills applied (primary + cross-cut)
- [ ] Schema/OG/RSS auto-generated (Astro handles — verify in build output)
- [ ] Distribution checklist run (see README)
