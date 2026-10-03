---
title: "I leaked 8 credentials in 9 days. Built a scanner. Number nine got through."
description: "Eight paste-error leaks into AI chat in nine days, zero exploits. pat-scanner is the OSS guard I shipped; a Windows blind spot still let leak number nine through. It guards the fleet now."
pubDate: 2026-07-27
tags: ["security", "oss"]
mode: "hobart"
tool: "claude-code"
kind: "win"
draft: false
---

I leaked 8 credentials in 9 days.

An Anthropic key. A Figma token. GitHub PATs. PyPI publish tokens. A pile of provider keys that glue AI assistants to services those assistants were never designed to touch. No attacker, no malware, no zero-day. Every leak was me — pasting faster than I was thinking, or an agent reading a config file it had no business opening at full resolution.

Nine days, eight credentials, zero exploits. All of it while shipping fast with AI assistants, which is to say: all of it normal. That's the part that should scare you.

## The one that stung

Leak number seven landed in the session where I sat down to fix the problem. An agent opened my assistant's local config file for context and printed an auth token straight into the transcript. I was building the scanner that exists to prevent exactly that. By evening the rotation list held eight credentials across nine days.

## The bug class that started it

One leak deserves its own section because it's a class, not a typo:

```bash
echo "token is ${TOKEN:+SET}${TOKEN:-UNSET}"
```

The intent: print SET when the variable is set, UNSET when it isn't. Presence, never value. That's how I used it — proof of existence, never the secret.

Bash reads it differently. Both expansions run. `${TOKEN:+SET}` contributes the word SET when the variable is set. `${TOKEN:-UNSET}` expands to the variable's value when it's set; the fallback only fires when it's unset. A set variable prints `SET` followed by the secret. That's how an API key ended up in a transcript while I was proving it wouldn't.

Static scanners miss this class. gitleaks, trufflehog, the git-time tools — they match text. The secret isn't text here; it's a runtime expansion. The file contains a variable name. The value arrives when bash runs.

## What I shipped

Two layers, one day, July 27.

The first is [pat-scanner](https://github.com/JordanNewell/pat-scanner), a Claude Code plugin. One hook, thirteen credential classes: GitHub classic and fine-grained, Anthropic, OpenAI, Stripe, Slack, AWS, Figma, PyPI, Linear, plus vendor-specific ones I caused personally. Your prompt gets scanned before it reaches the model. A match means the prompt is blocked, the class is named, and the hit lands in an audit log. MIT, public, two commands.

The second is a scanner core underneath it, built for the class pattern matching can't see: the escape hatch above, and the quiet variants — env vars whose values ride into command lines, subprocess environments, log output. It probes for the shape of the leak, not the string.

Ship-day friction, for the record:

- GitHub's secret scanning rejected my first push. The synthetic test fixtures looked too real to the provider verifiers. Fix: construct fixtures at test time from obviously fake parts, so no real-shaped token ever exists in the repo.
- v0.1.1, same evening: the scanner scripts shipped without the executable bit. Windows doesn't surface that — NTFS doesn't enforce it. Linux installs died on launch with `Permission denied`. Lesson: a Windows dev environment lies to you about Unix.

## Number nine

Nineteen days later, August 15: leak number nine. The guard let it through.

Every path pattern in the hook used forward slashes. Windows hands tools backslash paths. Nothing matched — the hook had matched nothing its entire life. An agent read my assistant's config file to check some wiring and printed a token raw. The same test pass surfaced a second hole: a pattern that caught env files one directory deep missed the nested ones, and the nested ones held live chat tokens.

Both fixes are the same idea: normalize path separators before matching, then match at any depth. Test matrix green. The rotation queue grew by one.

## What I'd tell you

1. Your typing speed is the threat model. Every leak was a paste or an unsupervised read. The harness has to catch what you won't.
2. Static scanners are table stakes, not the game. They watch files. The leaks happen at chat time, in command lines, in subprocess envs — a layer up.
3. A guard you haven't tested on your platform is a decoration. Mine ran for weeks and blocked zero prompts, because every path it saw was shaped wrong for its patterns.

pat-scanner guards the fleet now, on every host I run. What it catches goes on a rotation list with a 72-hour deadline. Install is two commands:

```
/plugin marketplace add JordanNewell/pat-scanner
/plugin install pat-scanner
```

It caught a GitHub PAT the day I shipped it. Mine. The irony is the feature.

If you made it this far, I appreciate it. — JN
