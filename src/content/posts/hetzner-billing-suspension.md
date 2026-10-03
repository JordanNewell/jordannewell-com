---
title: "Every liveness check said alive. The mail was dead."
description: "A Hetzner billing suspension left the VM answering pings while every real port was dark, and the first-ever mailcow restore drill that followed turned cleanup into proof the backups work."
pubDate: 2026-09-28
tags: ["infra", "rebuild"]
mode: "hobart"
tool: "claude-code"
kind: "postmortem"
draft: false
---

> The mail server went dark on September 28. Every liveness check said it was alive: pongs arrived over DERP relays, the VM was up, nothing had crashed. Alive the way a mannequin is alive. Hetzner had suspended the account over a billing issue and IP-blocked inbound traffic at the provider edge. One overdue invoice brought it back. The first-ever mailcow restore drill afterward was the part that mattered.

## The symptom

The first report was a question, not an alert: is something wrong with the mail server?

Yes. The production host, the one running mailcow, was dark on every port I probed. SMTP, IMAP over TLS, SSH. Dead from the public internet. Dead from inside the tailnet.

That shape ruled out mail trouble immediately. A mail problem is one service misbehaving — a refused delivery, a dropped session. This was every port on the box refusing inbound, from two vantage points, at once.

## The red herring

The part that cost me time: every liveness check I had said yes.

`tailscale ping` returned pongs. They arrived via DERP, Tailscale's relay fallback, because the direct path was blocked — but they arrived. The coordination plane told a different story: node offline, zero inbound. I had pongs in one window contradicting the dashboard in another. The VM was up. Outbound worked. Every check built to answer "is the production host alive" answered yes, and the host was down.

A pong proves the VM can send packets. It says nothing about packets getting in. My monitoring was accurate. It was monitoring the wrong thing.

## The cause

The answer was sitting in an email thread I hadn't read.

Hetzner suspends an account over unpaid invoices in a specific way: the VM keeps running, outbound stays up, and inbound traffic gets IP-blocked at the provider edge. No shutdown, no crash, no kernel noise. The machine keeps breathing while the world loses its route in. The account was three warnings deep when I finally read the thread.

Read that failure mode twice, because it is engineered to defeat liveness checks. Anything probing from inside the box — a local healthcheck, a process monitor, a ping — comes back green. Only a client attempting a real inbound connection notices. The outage wasn't a disk fire or a bad deploy. It was an invoice. The irony of a mail outage caused by unread mail is not lost on me.

## The fix

Embarrassingly small. I paid the overdue invoice. Auto-reactivation took about thirty minutes. Ports went green, the postfix queue came up empty — nothing stuck, nothing lost — and the DNS healthchecks that had flagged unhealthy during the block window were stale echoes that healed on their own.

Thirty minutes of downtime. Root cause: a billing thread.

## The drill

Paying the invoice bought the server back. It did not answer the question every outage eventually asks: if the VM itself had died, how long until mail worked again? The backups existed. Nobody had ever restored one under pressure. A backup that has never been restored is a hope with a schedule attached.

So the post-incident tightening batch included the first-ever full mailcow restore drill. Pull the latest backup off the Storage Box — 7.8 seconds. Load the database dump into a scratch MariaDB. Verify: tables load clean, the mailbox list matches production, the domain list matches. The drill passed, first run. Estimated full-rebuild RTO: 45 to 60 minutes.

It earned its keep twice over. Two gaps surfaced that a runbook review would never have caught. No TLS certificates in the backup — a restore comes up with mail flowing and TLS broken. No `rclone` remote config in the backup — the restore path depended on a file that lived only on the box being restored. Both fixed. A third find: `rclone` was not pinning the Storage Box host key, so a man-in-the-middle could hand me a fake backup target and the tool would not blink. Pinned now.

## What I'd do differently

**Probe the service path, not the VM.** A liveness check has to answer the question a real client asks: can something off-box reach the service and complete a transaction? For mail, that's an SMTP handshake from outside, not a pong. A pong is a heartbeat. A heartbeat is not a service.

**Treat billing as an outage vector.** A disk fire takes down a host. An unread vendor email thread took down production just as dead, with a delay timer measured in dunning cycles. Invoice reminders now run from cron into the alert channel well before the account reaches suspension territory, with a calendar entry as the backup to the backup.

**The only restore drill that counts is one you run before you need it.** An RTO estimate is fiction until a drill stamps it. This one cost about an hour and found three holes. The next restore runs on muscle memory instead of archaeology.

## What happens next

The server answered pings the entire time it was down. That's the sentence I keep coming back to. Monitoring that agrees with a suspended VM will agree with any failure that leaves the kernel running. The checks now ask what a client asks. The backups carry a measured RTO. The invoice thread gets read.

If you made it this far, I appreciate it. — JN
