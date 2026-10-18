---
title: "Interleaf"
tagline: "Sealed mail between Obsidian vaults."
description: "Interleaf turns any vault into a mail endpoint: every message sealed to the recipient's key before it leaves, every signature checked against a pinned identity. Only the two vaults ever hold the key."
status: "beta"
shipDate: 2026-10-14
homepage: "https://interleaf.dev"
logo: "/products/interleaf/interleaf-logo.png"
platform:
  name: "Obsidian"
  url: "https://obsidian.md"
pricing: "free"
license: "BUSL-1.1"
order: 2
ogImage: "/products/interleaf/og.png"
stats:
  - k: "form"
    v: "Obsidian plugin"
  - k: "status"
    v: "beta (in development)"
  - k: "license"
    v: "BUSL-1.1"
features:
  - title: "Verification is native"
    body: "Seals and signatures aren't a plugin away — they're the message format. Every signature is checked against a pinned identity, and key changes are loud, not silent: you find out because the check fails, not because someone quietly rotated their way into your correspondence."
  - title: "The invite is the address"
    body: "No accounts, no directory, no discoverable identity. You exchange an invite with someone and that invite is the whole address book. Strangers don't get a login page to hammer — they knock into a quarantine you review."
  - title: "Relays can't read"
    body: "The relay holds a dumb per-fingerprint mailbox of opaque boxes: routing metadata and ciphertext. There is no plaintext copy on a server, because the architecture doesn't have a place to put one."
faq:
  - q: "Is it out?"
    a: "In development. Watch interleaf.dev — when it ships, it ships here."
  - q: "What's a relay?"
    a: "The dumb pipe between two vaults. It stores opaque, sealed boxes per recipient fingerprint and forwards them. It can route; it can never read."
  - q: "Why not just encrypt email?"
    a: "Email's trust model assumes the server is honest. Interleaf assumes it isn't: the relay sees ciphertext and metadata, nothing else, and the architecture has nowhere to put a plaintext copy."
privacy: "Only the two vaults ever hold the key. Messages are sealed to the recipient's key before they leave the sender's device; the relay stores and forwards opaque boxes it cannot open."
---

Your notes already live on your devices — your mail should too.

[Interleaf](https://interleaf.dev) turns any Obsidian vault into a mail endpoint. Every message is sealed to the recipient's key before it leaves your device, every signature is checked against a pinned identity, and only the two vaults ever hold the key. The relay moves opaque boxes. That's all it ever sees.

Email assumes the server is honest. Interleaf doesn't.
