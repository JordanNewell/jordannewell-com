---
title: "WezTerm bug report — Redirection Guard regression on Windows nightlies"
description: "wezterm-gui enables EnforceRedirectionTrust on Windows; child shells inherit it and can't traverse user-created junctions. Filed the regression report against wezterm with a pinpointed window and root-cause evidence."
project: "WezTerm"
date: 2026-07-10
type: "bug-report"
url: "https://github.com/wezterm/wezterm/issues/7914"
outcome: "Open, maintainer response pending"
order: 2
---

Filed against WezTerm: starting with nightly `20260707`, `wezterm-gui.exe` runs with the Windows **Redirection Guard** mitigation enabled (`ProcessRedirectionTrustPolicy` → `EnforceRedirectionTrust = 1`). Because process-mitigation state is inherited by child processes, every shell or tool launched inside a wezterm pane fails to traverse any junction or symlink created by a non-elevated process. The Win32 error is `0x800701C0` ("untrusted mount point").

Pinpointed regression window: `20260117` did not enable the policy, `20260707` does. Real-world breakage: scoop shims, pytest temp symlinks, anything downstream of a scoop-installed tool (gitleaks pre-commit hooks, etc.). The same commands succeed when launched from any other terminal.

Root-cause evidence attached: `GetProcessMitigationPolicy(ProcessRedirectionTrustPolicy)` shows enforcement only on wezterm descendants — every other process tree on the machine reads `0`. The trust rule is creator-integrity based: a junction created by an elevated token is trusted; a normal-user-created one is not.

The ask: if enabling Redirection Guard was intentional, expose a config opt-out (`enable_redirection_trust = false`). As shipped, it silently breaks common junction-based tooling for every process launched from wezterm, and the resulting error doesn't point back at the terminal as the cause.

Issue is open as of filing. Two maintainer comments in-thread. Workaround in the meantime: pin to stable `20240203-110809-5046fc22` (pre-nightly, pre-regression).
