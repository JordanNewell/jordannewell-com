---
title: "Agent Orchestration"
description: "Task queue + audit log + dashboard for the OpenClaw fleet. Pokémon-sprite office scene UI, live activity ticker."
status: "active"
tags: ["infra"]
startDate: 2026-06-01
order: 2
---

A Go binary + SQLite + Python dashboard running on a Tailscale-networked host. Manages task assignment, audit logging, and tool-level Prometheus counters across the agent fleet.

Shipped Phase 2 (audit logging, parent/child task lineage, Prometheus counters) on 2026-07-13. 23 commits in that phase, 27 total at last sync.

Dashboard is tailnet-only (not public).
