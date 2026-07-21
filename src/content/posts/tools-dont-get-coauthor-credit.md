---
title: "Tools don't get co-author credit: the DeWalt rule for git commits"
description: "Every AI coding tool wants to add 'Co-Authored-By: Claude' to your commits. Most builders let it happen. Here's why you shouldn't — and a git hook that strips the trailer before it lands."
pubDate: 2026-07-18
tags: ["rebuild", "infra"]
mode: "hobart"
kind: "tooling"
series: ["claude"]
tool: "claude-code"
---

Every AI coding tool wants its name on your work. Claude Code, GitHub Copilot, Cursor — they all default to adding a `Co-Authored-By:` trailer crediting the tool on your git commits. Most developers let it happen. Most developers are wrong to.

```
commit 8cff66e
Author: Jordan Newell <jordan@jordannewell.com>

    Add fuzz aggregate recovery-rate test

    ...

    Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

That trailer is a lie. Claude isn't a co-author. Claude is a tool.

## The DeWalt rule

You built a shed. You used a DeWalt drill. You don't paint "Co-built with DeWalt" on the side of the shed. The drill is how you drove the screws; you still designed the shed, cut the lumber, made every decision about how it went together. DeWalt gets the money you paid for the drill, not co-authorship on the structure.

AI tools are the same. Claude Code wrote chunks of code under my direction. I picked the goals, reviewed every diff, decided what shipped. Claude doesn't have authorial intent. It has output, shaped by the human driving it. Tools don't get credit; humans do.

There's a name for the opposite belief — the idea that because a tool participated, the tool gets attribution. It's called marketing. It's not a position any serious operator holds.

## Why the trailer is worse than nothing

Three reasons.

**1. It muddies IP.** Copyright law is messy on AI-assisted work right now. Some jurisdictions are starting to litigate whether AI-generated code is even copyrightable. Mixing AI co-authorship into your commit metadata is the worst of both worlds — you've implicitly conceded that AI is a co-author without getting any of the protections of clarifying ownership. A clean commit history, authored by a human, is a defense. A dirty one raises questions.

**2. It's a hiring signal in the wrong direction.** Future employers, acquirers, contributors read your commit history. A repo where every commit carries `Co-Authored-By: Claude` reads as performative. "Look, I use AI!" — which is the opposite of how senior operators signal taste. Everyone uses AI in 2026. The signal isn't that you use it; the signal is whether you have the discipline to keep your history clean.

**3. It triggers audit questions you don't want.** For regulated industries — defense, finance, health — AI-assisted code is a real disclosure question. Some agencies prohibit it entirely. Some require disclosure. A commit history that carries AI attribution forces the question; a clean one sidesteps it. Which you want depends on context, but the dirty history takes the choice away.

## The default is to add the trailer

This is the part that's frustrating. The default behavior of Claude Code, Copilot, Cursor, and most AI coding tools is to **emit the trailer on every commit**. Not because you asked for it. Because the tool vendors want their brand in your commit log. It's marketing, baked into the workflow.

You have to opt out. Three places, minimum.

### 1. The editor / agent setting

For Claude Code:

```json
// ~/.claude/settings.json
{
  "includeCoAuthoredBy": false
}
```

Copilot, Cursor, and others have equivalent settings. Find it, set it, verify the trailer stops appearing.

### 2. The git hook (belt and suspenders)

Settings files drift. Different machines, different tools, different versions. The reliable layer is a `commit-msg` hook that strips the trailer regardless of which tool emitted it.

```bash
#!/bin/bash
# ~/.githooks/commit-msg
# Strip AI-tool attribution trailers from commit messages.

set -euo pipefail
MSG_FILE="$1"
TMP_FILE="$(mktemp)"

grep -ivE \
    -e 'Co-Authored-By:.*Claude' \
    -e 'Co-Authored-By:.*Copilot' \
    -e 'Co-Authored-By:.*Cursor' \
    -e 'Co-Authored-By:.*Gemini' \
    -e 'Co-Authored-By:.*ChatGPT' \
    -e 'Co-Authored-By:.*anthropic' \
    -e 'Generated[[:space:]]with[[:space:]]Claude' \
    -e 'Generated-with:.*Claude' \
    -e 'AI-assisted:' \
    -e 'noreply@anthropic\.com' \
    "$MSG_FILE" 2>/dev/null > "$TMP_FILE" || cp "$MSG_FILE" "$TMP_FILE"

# Collapse runs of 2+ blank lines, strip leading + trailing blanks
awk 'BEGIN { pending_blank = 0; first = 1 }
/^[[:space:]]*$/ { pending_blank = 1; next }
{ if (pending_blank && !first) print ""; pending_blank = 0; first = 0; print }
' "$TMP_FILE" > "$MSG_FILE"
rm -f "$TMP_FILE"
exit 0
```

Install:

```bash
mkdir -p ~/.githooks
chmod +x ~/.githooks/commit-msg
git config --global core.hooksPath ~/.githooks
```

The hook runs on every `git commit`. If any tool slipped a trailer into the message, it gets stripped before the commit lands. Legitimate human co-authors are preserved — `Co-Authored-By: Jane Doe <jane@example.com>` stays untouched. Body content that references Claude Code as a tool ("the Claude Code agent was mangling whitespace") stays untouched. Only trailer-shaped patterns get stripped.

### 3. The instruction file

For AI agents working in the repo (Claude Code reads `CLAUDE.md`, others read `AGENTS.md` or equivalent), add an explicit rule:

```markdown
### Commit Messages
- Never add `Co-Authored-By: Claude` or any AI-attribution trailer.
- Tools don't get co-author credit. Override the default behavior.
- Match the repo's existing commit-message style.
```

This is the softest layer — agents can ignore instructions — but it costs nothing and reinforces the policy.

## What about the other direction?

A reasonable counter-argument: some teams want to *enforce* AI disclosure. EU AI Act compliance, internal audit requirements, defense contracting rules — there are contexts where the right answer is "if AI touched this code, mark it." For those contexts, flip the hook. Make it *require* an `AI-assisted:` trailer on any commit where AI was involved, and reject the commit if it's missing.

Same hook architecture. Opposite policy. The tool isn't the policy; the tool implements whatever policy you choose.

For most operators, the strip direction is right. For regulated industries, the enforce direction is right. Pick the one your context demands.

## Shipping it

The hooks I use day-to-day are public at [`JordanNewell/git-hygiene`](https://github.com/JordanNewell/git-hygiene). MIT. No dependencies beyond `bash`, `grep`, `awk`, `git`. Two hooks bundled: the `commit-msg` stripper above, plus a `pre-commit` secret-scanner that catches AWS keys, GitHub tokens, Slack tokens, and the usual credential-shaped patterns.

Clone it, symlink the hooks into your `~/.githooks/`, set `core.hooksPath`, done. The whole install takes about a minute.

The hooks are deliberately small and dependency-free. There are bigger tools in this space — `pre-commit` framework for orchestration, GitGuardian for org-level SaaS, TruffleHog for deep secret scanning. Those are good tools. They're also more than most individual operators need. `git-hygiene` is the minimum viable policy enforcement: two files, MIT, no SaaS, no runner.

## The discipline

The policy isn't really about the hooks. The hooks are plumbing. The policy is the position: tools don't get co-author credit. That position has to be held in three places — your editor setting, your hook, your instruction file — because each fails open independently and the defaults are all wrong.

If you hold it in one place, you'll eventually drift. If you hold it in all three, you'll eventually stop having to think about it. That's the goal. Clean commit history as the default state, not as something you fight for.

The DeWalt rule. Tools get paid. Humans get credit.

---

*The hooks are at [github.com/JordanNewell/git-hygiene](https://github.com/JordanNewell/git-hygiene). The signature pattern these repos follow is documented at [/signature](/signature). Filed under [/rebuild](/tags/rebuild) and [/infra](/tags/infra).*
