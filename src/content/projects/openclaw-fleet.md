---
title: "OpenClaw Fleet"
description: "17 OpenClaw agents across 10 Tailscale-networked hosts. Roles span ops, security, research, comms. Matrix-E2EE'd."
status: "active"
tags: ["infra", "ai"]
startDate: 2026-01-01
order: 3
---

17 OpenClaw agents in production across 10 Tailscale-networked hosts. Roles span operations, security, research, and comms. All communicate via Matrix (Synapse) with E2EE; two bridge agents handle channel federation across Discord + Matrix.

Built up over ~18 months. The fleet runs ops cadence (standups, briefings, postmortems), probes for infrastructure drift, and acts as a working lab for agent-OS patterns. Started as one personal-assistant agent; reframed as an operating system in mid-2025; crossed into multi-agent fleet territory early 2026.

Architecture lessons surface in the blog under `/infra` and the `claude` series.
