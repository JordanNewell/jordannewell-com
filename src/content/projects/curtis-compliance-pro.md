---
title: "Curtis Compliance Pro"
description: "Pro tier folded into the Curtis AI suite — multi-repo audit rollup and evidence export ride the Curtis cloud console; the standalone hosted GitHub App is retired."
status: "deprecated"
tags: ["projects", "fintech", "compliance"]
shipDate: 2026-07-27
repo: "https://github.com/JordanNewell/curtis-compliance-pro"
liveUrl: "https://github.com/JordanNewell/curtis-compliance"
order: 9
facts:
  - k: "status"
    v: "Folded into Curtis suite"
  - k: "model"
    v: "Curtis Pro gate"
  - k: "license"
    v: "BUSL-1.1 (fleet-wide)"
  - k: "tier"
    v: "Curtis suite feature"
  - k: "base"
    v: "curtis-compliance (BUSL-1.1)"
highlights:
  - title: "Hosted GitHub App"
    body: "Drop-in for organizations that want PR review without running the action themselves. Multi-repo rollup out of the box."
  - title: "PDF audit export"
    body: "Court-defensible export of the hash-chained audit log. Hand it to auditors, regulators, or your CISO."
  - title: "Custom frameworks"
    body: "Beyond HIPAA / SOC2 / PCI-DSS — define your own control citations and map them to code patterns."
  - title: "Source-available, not closed"
    body: "Following Sentry / MongoDB / SSPL model — public repo, restrictive license. Auditable source, commercial use restricted."
stack:
  - "TypeScript"
  - "GitHub App"
  - "Same engine as curtis-compliance"
---

Pro tier for [Curtis Compliance](/projects/curtis-compliance/). The standalone plan — hosted GitHub App, multi-repo audit rollup, PDF export, custom frameworks — has been folded into the Curtis AI suite: the rollup and evidence export ship through the Curtis cloud console, and the license gate built here becomes the Curtis Pro gating primitive.

## Licensing model

**Not closed-source.** Source-available under BUSL-1.1 fleet-wide — auditable source, commercial use restricted, converts to MIT in 2030. The free tier stays free for noncommercial use; Curtis Pro adds the hosted surface and enterprise features on top.

The standalone repo at [github.com/JordanNewell/curtis-compliance-pro](https://github.com/JordanNewell/curtis-compliance-pro) is retired pending salvage of its license-gate code.

## Status

Retired as a standalone product 2026-10-13 — the engine is proven (curtis-compliance has been shipping since 2026-07-20); the packaging now lives in the Curtis suite roadmap.
