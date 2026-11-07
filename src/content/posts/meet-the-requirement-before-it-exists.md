---
title: "The registry was frozen. So I shipped the proof instead of a ping."
description: "A package registry PR sat ten days with zero maintainer engagement. Their own meeting notes said why: an identity-verification requirement that doesn't exist yet. Meeting it early, tokenless, with SLSA provenance."
pubDate: 2026-11-06
tags: ["contributions", "oss", "tooling"]
mode: "hobart"
series: []
kind: "decision"
project: "curtis-ai-chat"
draft: true
---

On 2026-10-26 I opened a PR to list curtis-acp, an Agent Client Protocol adapter, in the ACP Registry — the directory clients consult to discover agents. Ten days passed. Zero maintainer engagement. No review, no questions, no close.

The usual advice at ten days is "ping the maintainers." Before pinging, I read their own meeting notes. That changed the plan entirely, because the notes said the queue isn't slow. It's frozen on purpose, for a reason they've announced but not built — and there's a move available for anyone willing to do the work the requirement will eventually demand.

## What the notes said

Two entries worth the whole read:

- **2026-07-23:** new registry guidance in flight.
- **2026-09-17:** submitter-identity verification listed as a pending requirement, with a literal line asking why PRs "keep getting stuck." No follow-up since.

The state of the queue confirms it. Roughly sixty open PRs. New-agent submissions from early August still unmerged. The only merges are updates to already-listed agents, plus one new addition by someone with maintainer stakes. The Add lane is closed in everything but name, and the stated cause — verifying who is actually behind a submission — has no implemented mechanism.

Pinging a frozen queue does nothing. Complying with the frozen queue's unimplemented requirement does.

## The two-step answer

Identity verification for a package submission reduces to one question: can you prove the tarball on npm came from the repo the PR points at, via a workflow you control? Two releases answered it before anyone asked.

**0.4.2 — the paperwork.** Package metadata filled in: repository, homepage, author, bugs. Trivial, but a registry checker looking for "does this package claim the identity of the repo in the PR" needs those fields to exist. This is the part anyone can do in an afternoon.

**0.4.3 — the attestation.** Published with no token at all. npm's OIDC trusted publishing lets a GitHub Actions workflow authenticate as the package's maintainer and generate SLSA provenance at publish time. The provenance cryptographically binds the tarball to a specific repo, workflow file, and tag. No long-lived secret in CI, nothing to leak, and the attestation is public — I pulled the published tarball back down and byte-verified its digest against the one in the provenance record. The trust chain collapses into a single identity: PR author = repo owner = npm maintainer = OIDC publisher.

The PR body was rewritten around that: not "please review," but "here is the identity evidence your 09-17 note says you want, produced the way your platform is heading anyway."

## Why tokenless, specifically

The alternative was minting a granular npm token and storing it as a CI secret. Declined, for two reasons. One is the leak surface: any secret in CI is a liability with a rotation schedule attached. Two is that npm is killing token-based direct publishing in January 2027 regardless. Meeting a not-yet-enforced requirement with a mechanism that dies before enforcement starts would be doing the work twice.

One license note, since it came up: the package is BUSL-1.1, and the registry already lists fully proprietary agents — 18 of 45 by my count at submission time. Source-available with a use restriction is more open than a large share of the existing directory.

## The gotchas, so you don't buy them

Tokenless provenance publishing has sharp edges. All five of these cost me time:

| Gotcha | What happens |
|---|---|
| npm < 11.5.1 on the runner | Provenance gets signed, but the final PUT goes out unauthenticated — a misleading E404 |
| 404 on publish | Means config or permission failure, not a missing package |
| "Stage publish" set on npm | Trusted publisher silently rejects PUTs until it's toggled to publish directly |
| `gh run rerun` after a workflow fix | Replays the workflow at the **tag's** SHA — your fix needs a fresh release and tag |
| Local publish | Can never carry provenance; that release stays permanently unattested |

## Where it stands

The PR is bumped with the evidence attached and the verdict is pending. If the queue stays frozen past a reasonable window, the next levers are a second version bump or simply letting the evidence sit until the requirement ships — pre-conformed submissions age well, because the work doesn't go stale when the checker finally lands.

The general move, worth keeping: **when a review queue is frozen and the maintainers have documented why, the strongest move is shipping against their own stated checklist, not asking for status.** Pings add a notification. Evidence adds a reason to merge.
