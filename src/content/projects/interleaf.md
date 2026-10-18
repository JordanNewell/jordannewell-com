---
title: "Interleaf"
description: "Encrypted mail for Obsidian vaults. Every message sealed to the recipient's key before it leaves; every signature checked against a pinned identity. Only the two vaults ever hold the key."
status: "active"
promotedTo: "/products/interleaf/"
tags: ["projects", "oss", "obsidian", "privacy"]
startDate: 2026-10-12
shipDate: 2026-10-14
repo: "https://github.com/JordanNewell/interleaf"
liveUrl: "https://interleaf.dev"
order: 19
facts:
  - k: "form"
    v: "Obsidian plugin (beta)"
  - k: "crypto"
    v: "sealed to recipient key"
  - k: "identity"
    v: "pinned signatures"
  - k: "license"
    v: "open source"
highlights:
  - title: "Vault to vault, sealed end to end"
    body: "A message is encrypted to the recipient's key before it leaves the sender's vault and decrypted nowhere else. The server — any server — is a dumb pipe."
  - title: "Pinned identities"
    body: "Signatures verify against a pinned key, not a fetched one. A swapped key at the transport layer shows up as a failed check, not a silent success."
  - title: "Mail as files"
    body: "Messages land in the vault as notes — searchable, linkable, backed up with everything else. Correspondence becomes part of the record instead of a separate silo."
stack:
  - "TypeScript"
  - "Obsidian plugin API"
  - "OpenPGP"
---

Interleaf turns any vault into a mail endpoint. Every message sealed to the recipient's key before it leaves, every signature checked against a pinned identity — only the two vaults ever hold the key. Now an Obsidian plugin in public beta, with the spec and docs at [interleaf.dev](https://interleaf.dev).
