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

## Drafting protocol

1. Read both canonical posts in full. Internalize cadence.
2. Draft the hook first — 1-3 sentences, stakes-first.
3. Quote real artifacts inline (SQL, log lines, config).
4. Write short. Target 800-1200 words typical. Push past 1500 only when material demands.
5. Cut every hedge. Search draft for: maybe, perhaps, might, could possibly, I think, I believe, in my opinion, just (as hedge), simply, basically, essentially, actually. Delete or rewrite.
6. Run voice lint before handoff: `bash scripts/voice-lint.sh <draft-path>`.
7. Hand off with explicit note: "sounds like Jordan when..." / "still feels Claude when..."

## Voice lint spec

Implemented in `scripts/voice-lint.sh`. Runs as pre-commit hook on all staged `.md` files. Exits non-zero on anti-pattern match or hedge word found.
