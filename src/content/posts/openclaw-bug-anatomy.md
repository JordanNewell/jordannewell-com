---
title: "Anatomy of a bug report that actually got fixed: my OpenClaw submission"
description: "What a good bug report looks like, demonstrated via a real one I filed against OpenClaw — confirmed by other users, then fixed upstream."
pubDate: 2026-07-15
tags: ["rebuild", "contributions"]
mode: "hobart"
project: "openclaw"
---

A few weeks ago I filed a bug against [OpenClaw](https://github.com/openclaw/openclaw). Other users chimed in confirming the repro. The maintainer shipped a fix. The issue is closed.

That sequence — filed, confirmed, fixed — is unremarkable on its own. Bugs get filed and fixed every day. What's worth writing about is *why this one moved* when most bug reports die in the queue. The answer is mostly craft, not luck.

This post is the anatomy. If you file bugs against OSS projects, the structure below will increase your hit rate. If you maintain OSS projects, the same structure is what makes a report actionable.

<!-- TODO(jordan): Replace this section with the actual bug details. What was the symptom? What was the expected behavior? What was the actual behavior? Include versions, OS, exact repro steps. -->

## The bug

**Symptom:** [one-line description of what was wrong]

**Expected:** [what should have happened]

**Actual:** [what actually happened]

**Versions:** OpenClaw vX.Y.Z, [other relevant versions]

**Repro:** I could trigger it deterministically by [exact steps]. Couldn't trigger it via [alternate path that should also trigger it], which was the clue.

## Why it landed

A bug report is a request for someone else's time. The maintainer has more bug reports than hours. Reports that respect that fact get triaged first.

What this one did right:

### 1. Minimal repro

I trimmed the repro to the smallest sequence that triggered the issue. Original draft had seven steps. After cutting everything that wasn't load-bearing, it was three.

A seven-step repro says "I haven't isolated this." A three-step repro says "I have."

### 2. Versions pinned

I included the exact OpenClaw version, the agent profile in use, the host OS, and the relevant config snippets. Maintainers can't reproduce without these. A report without versions is asking them to guess.

### 3. What I'd already tried

I listed the four things I'd tried that *didn't* fix it. This saves the maintainer from suggesting things you've already ruled out. It also signals competence: you're not asking them to do your debugging for you.

### 4. The clue that mattered

There was one specific thing about the behavior that didn't match my initial hypothesis. I called it out explicitly: "I expected X to also trigger this, but it doesn't, which suggests the issue is in Y path, not Z path."

That single observation is probably what made the fix fast. The maintainer didn't have to find the clue — I'd already pointed at it.

### 5. I didn't propose a fix

Beginner mistake: filing a bug *and* proposing a code change in the same report. Reviewers have to context-switch between "is the bug real?" and "is the proposed fix correct?" Keep them separate. File the bug. Let the maintainer diagnose. Open a PR only if they ask, or after the bug is confirmed and they're open to a fix.

<!-- TODO(jordan): Replace with the actual sequence — when did others chime in? When did the maintainer respond? When did the fix ship? -->

## What happened next

Within [timeframe], other users confirmed they were seeing the same thing. Within [timeframe], the maintainer responded with a diagnosis that matched what the clue suggested. Within [timeframe], a fix shipped in [version].

## What you can steal

If you file bugs against OSS projects, the template below will improve your hit rate. Steal it.

```markdown
## Symptom
[one line]

## Expected
[one line]

## Actual
[one line]

#***REMOVED***
- OSS project: [exact version]
- Host OS: [exact version]
- Other relevant: [...]

## Repro
1. [step]
2. [step]
3. [step]

## What I've already tried
- [thing 1] — didn't fix
- [thing 2] — didn't fix
- [thing 3] — didn't fix

## Clue
[the one observation that doesn't match the obvious hypothesis]
```

If you can't fill in every section, that itself is information: it tells you what you haven't yet isolated. Don't file until you can at least fill in Symptom, Expected, Actual, Versions, and Repro. The other two can be in-progress.

## The point

Most "builders" in the AI era are pure consumers of OSS. Filing bugs that get fixed is one of the ways you stop being a consumer and start being a participant. It's also one of the few credibility markers that's verifiable: the issue URL is a public artifact, the merge commit is permanent, anyone can check.

I'm keeping a [/contributions](/contributions) page on this blog for exactly this reason. The OpenClaw bug is the first entry. More to come.

---

<!-- TODO(jordan): Replace XXXX with real issue number -->

[Canonical artifact: the original issue](https://github.com/openclaw/openclaw/issues/XXXX)

*Filed under [/rebuild](/tags/rebuild) and [/contributions](/tags/contributions). Logged on the [/contributions](/contributions) page.*
