---
title: "crush CLI — `~` expansion strips Windows backslashes from hook paths"
description: "On Windows, crush's hook-runner expands `~` to `$HOME`, MSYS converts the Unix-style path back to `C:\\Users\\...`, and the bundled mvdan/sh POSIX emulator then unescapes the backslashes (`\\U`, `\\j`) before bash ever sees them. Hook paths arrive mangled as `C:Usersjrnew/.config/crush/hooks/...` and silently exit 127."
project: "charmbracelet/crush"
date: 2026-07-20
type: "bug-report"
url: "https://github.com/charmbracelet/crush/issues/3389"
outcome: "Filed under dev23xyz-oss. Awaiting maintainer response. Sibling to #3366."
status: "open"
order: 1
---

Filed as a sibling to [#3366](https://github.com/charmbracelet/crush/issues/3366) (the `skills_paths` Windows bug). Same family of failure — crush's shell layer assumes POSIX paths but Windows backslashes break that assumption in a different place.

**Reproduction is exact:** any `crush.json` hook config using `~/` or `$HOME` on Windows hits this. The path gets handed to MSYS for env-var expansion, MSYS hands back a Windows-style path (`HOME=C:\Users\jrnew`), and the bundled mvdan/cc/sh/v3 emulator parses `\U` / `\j` / `\n` etc. as POSIX escape sequences before bash ever receives the string. End result: bash is invoked with `C:Usersjrnew/.config/crush/hooks/...`, exits 127, and crush logs it as a hook failure with no path-mangling diagnostic.

**Source trace included** — three hops: `internal/hooks/runner.go:185` calls `shell.Run`, `internal/shell/shell.go:1-7` docstring explicitly states *"This implementation provides POSIX shell emulation (mvdan.cc/sh/v3) even on Windows. Commands should use forward slashes (/) as path separators to work correctly on all platforms."* (constraint documented, never enforced), and `internal/shell/shell.go:241-253` is where the unescape happens. I wrote a Python simulation of POSIX unescape rules that produced byte-for-byte identical output to the corrupted path in `crush.log`.

**Suggested fixes** (in order of preference): docs warning at the hooks config layer, startup validation that rejects `\` in hook paths, or shell-layer path normalization. Offered to PR the validation approach.

Filed under `dev23xyz-oss` — same handle as #3366, consolidating OSS bug filings there.
