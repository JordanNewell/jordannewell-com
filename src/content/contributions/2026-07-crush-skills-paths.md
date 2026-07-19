---
title: "crush CLI — skills_paths config silently ignored on Windows"
description: "crush v0.85.0's `skills_paths` config option and two of four documented default paths are silently never scanned on Windows. Only `~/.claude/skills/` and `~/.agents/skills/` get walked. Filed with 6-test repro, source-code trace, and DevSec framing."
project: "charmbracelet/crush"
date: 2026-07-18
type: "bug-report"
url: "https://github.com/charmbracelet/crush/issues/3366"
outcome: "Filed under dev23xyz-oss. Awaiting maintainer response."
status: "open"
order: 2
---

Surfaced while configuring [crush](https://github.com/charmbracelet/crush) (charmbracelet's terminal AI coding agent) as a sister agent to Claude Code, both running on Z.ai's GLM Coding Plan. The `skills_paths` config option in `crush.json` is documented (schema + README) but never reaches the filesystem walker on Windows — only the two hardcoded defaults get scanned, regardless of what you configure.

**Verified via six isolated tests:** tilde path, Unix-absolute, Windows-absolute, project-relative, custom temp dir, and a documented Windows default path — all silently ignored. No log line, no error, no warning. The skill just doesn't exist as far as crush knows.

**Source trace included** pointing at `internal/skills/manager.go:DiscoverFromConfig` → `DiscoveryConfig.ResolvePaths` → `internal/home/home.go:Long`, plus two hypotheses for where the resolved paths get dropped.

**Security consideration surfaced:** the silent-failure mode means defenders can't tell their critical skills aren't loading, and the forced use of `~/.claude/skills/` (shared with Claude Code) eliminates per-tool trust boundaries — a crush-only skill ends up in CC's system prompt too.

Issue filed under `dev23xyz-oss` (consolidating OSS bug filings there going forward). Will update this entry when shipped or closed.
