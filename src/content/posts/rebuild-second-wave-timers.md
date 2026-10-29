---
title: "The rebuild looked done. Every timer was off."
description: "A swap-then-build rebuild that ended green, a fleet that ran on crons for a day because nobody checked enablement state, and the dependency cascade that surfaced the moment the timers came back."
pubDate: 2026-10-29
tags: ["infra", "rebuild", "systemd"]
mode: "hobart"
kind: "postmortem"
draft: true
---

The rebuild ended green. Every agent up, every container running, dashboards quiet. And every scheduled job on the box was disabled. All of them. Not failed — disabled, which is the state systemd considers perfectly healthy and reports to no one.

The fleet ran on leftover crons for about a day before anyone noticed, because nothing that checks health checks enablement. A service that's down screams. A timer that never got enabled is silent by design: systemd isn't running something it was never asked to run, so there's no error to log, no unit to fail, no alert to fire. The absence of a scheduled job looks exactly like a schedule with nothing due.

## The mechanism

The rebuild was swap-then-build — [documented here](/posts/smart-said-the-drive-was-fine/) — and the runbook's copy step included the timer unit files. So the `.timer` files came across. What didn't come across was `timers.target.wants/`, the directory of symlinks that says "this timer is enabled."

rsync copies files. A symlink into a `wants/` directory is enablement state, and enablement state lives one directory over from the files it points at. Copy the unit files without the wants symlinks and you've recreated the paperwork of a scheduled system with none of the schedule. Every restore recipe that transfers units by filename makes this mistake available; mine made it.

The fix reads one line: copy the old box's `wants/` directories wholesale, minus the entries you've deliberately ruled out. On this fleet that meant dropping timers for a decommissioned phone, a dead project, and a backup lane that moved hosts — which is the honest version of the story, because "minus the ruled-out" requires a ruling per timer, and that ruling only exists in the operator's head.

## Enabling them broke four other things

The timers coming back didn't surface problems with the timers. They surfaced problems with everything the timers were the first customer of. Enablement was the exposure event.

**Directories that aren't config.** The fleet's custom dirs under `/etc` and `/var/lib` — token stores, a state database, a gnupg keyring, a few dozen agent state directories — never transferred. The runbook covered named config files; these were whole directories that happen to live in standard locations. The diff that found them: list the old filesystem's `/etc` and `/var/lib`, filter out distro noise, test each remaining path against the new box. Cheap to run, should have been part of the runbook from day one.

**Groups.** Unix groups don't transfer with files. A state database owned by a group that no longer exists fails in ways that look like permissions, because they are — the principal is gone, not the mode bits. Recreate the group, re-establish membership, and half the "permission denied" noise vanishes.

**`ProtectSystem=strict` vs. sqlite.** Two units run with a hardened sandbox that makes the filesystem read-only except for declared write paths. Their databases lived outside the declared set — fine on the old box, where the paths were different, broken on the new one. Symptom is a sqlite "attempt to write a readonly database" that has nothing to do with file modes. The fix is a drop-in adding the real database path to the sandbox's write list. Sandboxes are honest; they just enforce what you said instead of what you meant.

**Source trees some tools import.** One utility directory was deliberately skipped in the restore — it looked like dormant source. Two fleet services import from it as editable installs and died on their next run. "Looks like dead source" is not a restore decision you get to make once and keep; it's a decision the dependency graph reliticates every time something imports.

## The boot wave

Enabling everything at once means everything starting at once. A cold start of every agent on a small box peaks around a gigabyte of RAM per agent against memory the box doesn't have, and the result is swap thrash on a spinner — the exact failure mode [the dying drive taught](/posts/smart-said-the-drive-was-fine/) me to stop creating. Waves of four, minutes apart, turned a load spike into a non-event. zram on top makes the tail forgiving. Neither is clever; both are the difference between a restore and a second outage.

## Standing after

Every timer green, dependencies restored, dispatcher ticking. The runbook grew a section: after any rebuild, diff `systemctl list-timers` against the old box, diff the custom dirs under `/etc` and `/var/lib`, and treat enablement state as part of the system rather than a property files happen to carry.

The general lesson is one sentence long: **a file copy preserves content, not configuration.** Enablement, membership, sandbox write-paths, import resolution — all of it is state that lives adjacent to the files, and adjacent is where restore recipes don't look. The box stayed green the whole time nothing was scheduled. That's the part that should worry you.
