---
title: "Curtis Compliance Pro"
description: "Hosted pro tier for Curtis Compliance — GitHub App, multi-repo audit rollup, PDF export, custom frameworks. Source-available (BSL/FSL/SSPL — license class TBD)."
status: "exploratory"
tags: ["projects", "fintech", "compliance", "venture-track"]
shipDate: 2026-07-27
repo: "https://github.com/JordanNewell/curtis-compliance-pro"
liveUrl: "https://github.com/JordanNewell/curtis-compliance"
order: 9
facts:
  - k: "status"
    v: "In development"
  - k: "model"
    v: "Source-available"
  - k: "license"
    v: "BSL / FFL / SSPL (TBD)"
  - k: "tier"
    v: "Hosted pro"
  - k: "base"
    v: "curtis-compliance (MIT)"
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

Pro tier for [Curtis Compliance](/projects/curtis-compliance/). Hosted GitHub App for organizations that want multi-repo audit rollup, PDF export, and custom frameworks without running the action themselves.

## Licensing model

**Not closed-source.** Source-available following the Sentry / MongoDB / SSPL playbook — public repo, restrictive license, auditable source, commercial use restricted. The MIT-licensed OSS tier stays MIT; the pro tier adds the hosted surface and enterprise features on top.

License class (BSL vs FSL vs SSPL) is the open decision — landing before the package goes live. The stub repo at [github.com/JordanNewell/curtis-compliance-pro](https://github.com/JordanNewell/curtis-compliance-pro) already has 7 inbound links from the curtis-compliance README.

## Status

Exploratory — the engine is proven (curtis-compliance has been shipping since 2026-07-20), the packaging is the work in progress.
