---
title: "Five days after launch, a stranger filed a bug. It shipped the same day."
description: "The first external issue on a .curt converter: duplicate export files from a collision check that over-corrected. Repro, TDD fix, merge, and 1.0.1 on npm inside one day."
pubDate: 2026-11-06
tags: ["contributions", "oss", "rebuild"]
mode: "hobart"
series: []
kind: "tooling"
project: "dot-curt"
draft: true
---

On 2026-11-01 I published the .curt converter suite: npm packages, public repos, a format spec with a conformance artifact. Five days later, on 2026-11-06, someone who isn't me filed the first external issue against one of them.

That sentence is the whole point of shipping. Software with no users produces no bug reports. A bug report from a stranger is the first measurable evidence the thing works well enough to be worth breaking.

## The bug

The report came from [mattabate](https://github.com/mattabate), a GitHub account about ten years old, against [curt-hermes](https://github.com/JordanNewell/curt-hermes) — the converter that moves agent-session archives in and out of the .curt format. Runtime usage was evident from the report itself, which is how I know it was real usage and not a drive-by.

The symptom: re-running an export after the session store grew produced endless duplicate files. `foo-2` and `foo-3`, byte-identical, appending forever.

The cause was one line of logic. The collision check behind `resolveCurtWritePath` compared only the base filename against existing files. If `foo.curt` existed, the next export wrote `foo-2.curt` without ever checking whether `foo-2.curt` already existed too. Every re-run grew the suffix instead of matching content.

Here's the part I appreciate: that collision check exists because of an earlier bug I shipped myself. The WildChat converter initially keyed filenames on conversation identity, and the real corpus contained duplicate conversation hashes — 5 of the first 1,000 real conversations silently overwrote each other, last write wins. The fix was a shared convention across the whole suite: identical content overwrites idempotently, differing content gets a `-N` suffix and a count on stderr. mattabate's bug was that fix over-correcting. The first external contributor found the flaw in the fix for the first internal one.

## The fix

Same day. The sequence:

1. **Verify before touching code.** Reproduced the report's claim exactly: `foo-2` == `foo-3`. A bug report is a claim until it reproduces.
2. **Tests first.** Two new tests covering the collision case, watched failing.
3. **The fix.** When a `-N` candidate exists, compare content. Identical content reuses the existing file instead of appending a new suffix. Differing content still gets a fresh suffix.
4. **README updated** to state the idempotency guarantee explicitly, so the next person doesn't have to read the source to learn it.
5. **PR #2 merged**, issue auto-closed, thank-you posted.
6. **1.0.1 on npm.** The publish step requires an interactive two-factor code, so that one ran from my keyboard. Everything before it was committed and reviewed.

One fix, one version bump, live. The lag between report and release was the publish ceremony, not the code.

## Receiving a bug is a different skill from filing one

I've written before about [filing bugs that get fixed](/posts/openclaw-bug-anatomy/) — what makes a report actionable from the maintainer's side. Getting one is the mirror image, and the checklist is shorter than I expected:

- **Reproduce before you respond.** The report was one paragraph plus a filename pattern. The repro confirmed it in minutes. Without that, the right move is a question, not a patch.
- **Fix the claim, not the reporter's theory.** The report described duplicate files. The defect was a missing comparison in the suffix probe. Those overlap but aren't identical; the tests encode the defect, not the prose.
- **Thank people specifically.** "Fixed in #2, shipping in 1.0.1, here's what your report changed" beats a thumbs-up emoji. mattabate spent time on software I wrote; the reply should cost me at least a paragraph.

What made the report itself good: a one-sentence symptom and an exact artifact (the duplicate filename pattern). No environment dump, no theory about converters in general. Easy to verify, easy to fix.

## What I'm watching

Two things. First, whether mattabate comes back — a runtime user who files a clean first issue is exactly who a second one comes from, and this project's contribution rules are already written. Second, whether the other converters carry the same flaw. The collision convention is shared across the suite, and the fix that landed here should be audited against the rest before someone else files it one repo at a time.

The count of external bug reports on my software went from zero to one this week. The next interesting number is two.
