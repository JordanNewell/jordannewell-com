---
title: "curtis-compliance"
description: "Open-source compliance checks for fintech code. Pre-commit hook, PR review, hash-chained audit trail. HIPAA / SOC2 / PCI-DSS citations — no telemetry, no SaaS."
status: "shipped"
tags: ["projects", "oss", "fintech"]
shipDate: 2026-07-20
repo: "https://github.com/JordanNewell/curtis-compliance"
pkg: "https://www.npmjs.com/package/@jordannewell/curtis-compliance"
order: 7
facts:
  - k: "shipped"
    v: "2026-07-20"
  - k: "version"
    v: "v1.1.2"
  - k: "license"
    v: "MIT"
  - k: "frameworks"
    v: "HIPAA · SOC2 · PCI-DSS"
highlights:
  - title: "Catches violations before merge"
    body: "Pre-commit hook + PR review for fintech patterns: PII in logs, unencrypted storage at rest, missing audit fields."
  - title: "Hash-chained audit trail"
    body: "Every check appends to a tamper-evident log. Court-defensible — built for regulated industries that get sued."
  - title: "Citations, not magic"
    body: "Every violation links to the specific HIPAA / SOC2 / PCI-DSS clause. Compliance officers can verify in seconds."
  - title: "Local-only, no telemetry"
    body: "Runs on your machine. No cloud calls, no third-party scans, no usage tracking. Source is auditable."
stack:
  - "TypeScript"
  - "Node.js"
  - "pre-commit framework"
  - "GitHub Actions"
---

Compliance checks that actually understand fintech code. Catches the patterns auditors flag — PII leaking into logs, plaintext secrets, missing audit trails — and cites the specific HIPAA / SOC2 / PCI-DSS clause each one violates.

## Install

```bash
npm install -D @jordannewell/curtis-compliance
```

Pre-commit hook for local checks, GitHub Action for PR review. Hash-chained log for audit defense.

## Why

Most compliance tooling is enterprise SaaS that scans your repo and ships the findings to someone else's cloud. This is the opposite — local-first, open-source, no telemetry. Built so a small fintech can run the same checks a Big-Four auditor would, without the five-figure contract.
