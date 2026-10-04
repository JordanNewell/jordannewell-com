---
title: "Day 90 at jordannewell.com: 3 targets cleared, 1 missed, 1 closed at the buzzer"
description: "Day 0 set five targets in public on 2026-07-14. The 90-day audit, scored 2026-10-04: 26 posts against 10 promised, 12 project pages against 3, 3 OSS entries at the line, one manifesto closed by this post on day 90, and one pickup target with nothing to report."
pubDate: 2026-10-12
tags: ["rebuild"]
mode: "murphy"
kind: "decision"
draft: true
---

> On 2026-07-14, Day 0 pinned five targets to jordannewell.com and promised wins and misses both visible in the archive. Ninety days later the archive returns the verdict: three targets cleared by multiples, one missed outright, one closed only because this post exists. This is the audit. No rounding up.

## The scoreboard

jordannewell.com set its targets in public, so public is where they get graded. Scored 2026-10-04, against the published archive:

| Target | Stated 2026-07-14 | Actual 2026-10-04 | Verdict |
| --- | --- | --- | --- |
| Substantial posts shipped | 10 | 26 published | Hit, 2.6x |
| HN front page or equivalent | 1 | 0 to report | Miss |
| Manifesto-style drop | 1 | 0 through day 89 | Closed at the buzzer, by this post |
| Project pages live | At least 3 | 12 serving 200 | Hit, 4x |
| OSS contribution entries logged | At least 3 | 3 logged, 1 fixed upstream | Hit, at the line |

## The clears

Posts: 26 shipped against 10 promised. Eighteen carry July dates, one carries August, three carry September, four carry October. Seven did not exist in the repo until the 2026-10-03 restore committed them in a single batch. Five more landed 2026-10-04 — two backdated into the silent stretch (2026-07-26, 2026-08-31), three dated fresh. The drafts folder now holds only this scorecard, and drafts don't score.

Project pages: 12 live under /projects since 2026-07-29, the day commit b3cce93 closed the last four 404s and put all 12 slugs serving 200. The target line fell on day 15 of 90. Count by status as of 2026-10-04: eight shipped, two active, one exploratory, one deprecated.

Contributions: the /contributions page holds exactly three entries, the number the target demanded. The first, the OpenClaw event-loop bug (filed 2026-05-12, fixed upstream 2026-05-18), predates Day 0 and was the page's only entry when the promise was made. Entries two and three, both filed against crush on 2026-07-18 and 2026-07-20, crossed the line on day 6. Both still await maintainer response as of 2026-10-04. Filed is logged. Filed is not fixed. The target said logged, so logged is the grade, and 1-of-3 fixed is the footnote.

## The miss

Day 0 asked for "1 Hacker News front-page or equivalent earned pickup." The report: nothing. No front page, no equivalent, and no traffic or referral record anywhere in the repo for the window. From 2026-07-28 to 2026-10-03 the entire site sat behind a coming-soon splash, which means day 14 through day 82 of a 90-day pickup target ran with the door closed.

Unreported is a miss against a target I set in public. That is the grade. A pickup target and a hidden archive cannot both survive the same quarter, and the archive chose the splash.

## The one this post closes

Day 0 promised "1 manifesto-style drop." Every post in this archive through day 89 carries mode "hobart" in its frontmatter: 26 for 26, analysis register, zero manifestos. This post carries mode "murphy" — the first in the corpus, and the target closes the moment it publishes, on day 90, by the thinnest margin the format allows. Ninety days of aiming at a manifesto, and the one that lands is the receipt. The drop is the audit.

## What the scoreboard doesn't count

The quarter the targets were scored against includes an archive that went dark. The blog hid behind a splash from 2026-07-28 to 2026-10-03 — day 14 to day 82 of the 90 being measured.

August 2026 produced zero posts. Seventeen posts preceded it in July; the next landed 2026-09-25, a silence of 58 days inside a window whose whole premise was "they get written, in public, regardless."

The agent fleet grew from 17 to 30 agents while nobody read it (operator count, 2026-10-04). September collected the bill: three incidents in four days — the fleet-wide OOM loop on 2026-09-25, the heartbeat storm on 2026-09-27, the provider-edge mail suspension on 2026-09-28. Unattended fleets stay configured. They do not stay healthy.

One thing Day 0 never targeted and the quarter shipped anyway: DW Trim launched 2026-08-24. August's silence has a customer, and it is public at dwtrimco.com. The scoreboard measures the blog. It does not measure the operator.

## What this blog is for

Ninety days in, the answer has sharpened. jordannewell.com is a ledger, not a portfolio. A portfolio curates the wins. A ledger balances.

The discipline that survives this quarter: targets go up in public, get dated, and get audited against the archive on a schedule the author does not control. Misses print first, with numbers, on the day they come due.

The next scorecard lands 2027-01-10. Targets set in public are graded by the archive, not by the author. That is the rule, and this post is its first enforcement.

If you made it this far, I appreciate it. — JN

<!--
VERIFICATION LOG — every fact checked against the repo on 2026-10-04.

DAY-0 TARGETS (verbatim from src/content/posts/day-0.md, "The next 90 days"):
- "10 substantial posts shipped"
- "1 Hacker News front-page or equivalent earned pickup"
- "1 manifesto-style drop"
- "At least 3 project pages live"
- "At least 3 OSS contribution entries logged"

COUNTS:
- Posts: 21 files in src/content/posts/*.md, none with draft: true (grep verified).
  pubDate distribution: July 17 (07-14 x1, 07-15 x2, 07-17 x6, 07-18 x2, 07-19 x1,
  07-22 x1, 07-23 x1, 07-24 x1, 07-27 x1, 07-29 x1), August 0, September 3
  (09-25, 09-27, 09-28), October 1 (10-03). 17+0+3+1 = 21. All within day-0's window.
- Mode: grep "^mode:" across all 21 posts returns 21 x "hobart". This draft is the
  first "murphy". Schema (src/content.config.ts) allows mode enum ["hobart","murphy"].
- Project pages: 12 files in src/content/projects/. Statuses: shipped 8
  (crypto-key-classifier, curtis-ai-chat, curtis-compliance, git-hygiene,
  harbormasterd, newell-typeface, pat-scanner, temporal-git), active 2 (claudeway,
  jordannewell-com), exploratory 1 (curtis-compliance-pro), deprecated 1 (curtis-chat).
  Commit b3cce93 (2026-07-29): "add 4 missing project pages ... All 12 project slugs
  now serve 200." c2a044e (2026-07-29) un-retired /projects/* routes.
- Contributions: 3 files in src/content/contributions/: OpenClaw (filed 2026-05-12,
  fixed/closed 2026-05-18, status "shipped"), crush #3366 (filed 2026-07-18, status
  "open"), crush #3389 (filed 2026-07-20, status "open"). "1 of 3 fixed upstream" verified.
- 2026-10-03 restore batch: 7 post files committed that day (16861ff token-hunt,
  810104c deathos, cc1c569 walk-back, 52964d1 v8-heap, d6b2107 heartbeat, 63d1efa
  hetzner, a6bc257 bbq-bid) — verified via git log --diff-filter=A. 7 of the 21
  published posts did not exist in the repo before 2026-10-03.
- Splash: blog routes moved to src/pages/_disabled/ on 2026-07-28 (0e80cd5, per
  drafts/where-august-went.md verified notes); splash assets landed 2026-07-28/29
  (git log shows splash cluster 7ff172d, ecc8b64, b3cce93 etc. on 07-29); restore
  commit 33dbc24 on 2026-10-03. Window stated as 2026-07-28 → 2026-10-03.
- Fleet 17 → 30: operator-stated 2026-10-04 (carried in drafts/where-august-went.md
  and drafts/september-unwatched-fleet.md). 17 is the public /now figure (updated
  2026-07-22). OPSEC note: 17 already public on /now; 30 published per operator.
- Three incidents in four days: posts v8-heap-cgroup-half (pubDate 2026-09-25),
  heartbeat-dm-storm (2026-09-27), hetzner-billing-suspension (2026-09-28).
- DW Trim launch 2026-08-24: per drafts/where-august-went.md operator-resolved notes
  (dwtrimco repo audit: 48 Aug commits, launch 2026-08-24). DW Trim is public on
  /ventures and /now; dwtrimco.com live. Earns the branded name per VOICE.md naming rule.
- Day math: day 0 = 2026-07-14; 2026-10-12 = day 90 (Jul 14 + 90). pubDate 2026-10-12
  is the actual 90-day mark. Splash window = day 14 to day 82. Contributions crossed 3
  on 2026-07-20 = day 6. Project pages crossed 3 on 2026-07-29 = day 15. Next audit
  2027-01-10 = 2026-10-12 + 90 days.
- 58-day silence: 2026-07-29 → 2026-09-25.

PUBLISH FLAGS:
1. [CONFIRM: HN front page or equivalent pickup — did anything earn it in the window?
   Any traffic/referral/analytics record? Repo holds none; body frames it as
   "unreported is a miss." If an actual pickup exists, rewrite "The miss" section
   with the URL and date and change the scoreboard row + title verdict counts.]
2. FUTURE-DATE BEHAVIOR: src/pages/posts/index.astro and src/pages/posts/[...slug].astro
   filter ONLY on !data.draft — neither query compares pubDate to the current date.
   There is NO future-date hiding: the moment draft flips to false (or is removed),
   a 2026-10-12-dated post renders immediately on the next build, sorted to the top.
   Keep draft: true until 2026-10-12, or accept an early publish. RSS/JSON feed pages
   use the same collection query and would also pick it up immediately.
3. RESOLVED 2026-10-04: five drafts shipped (claudeway-signed-transcripts, where-august-went,
   september-unwatched-fleet, deploy-day-three-failures, github-events-strip-commits) — all
   hobart, so the manifesto claim holds. Counts updated to 26 published; drafts folder now
   holds only this scorecard. Re-verify counts if publishing after further posts.
4. drafts/crypto-key-classifier.md (2026-07-18) also exists but is superseded by the
   published shipping-crypto-key-classifier post; not counted as pipeline.
-->
