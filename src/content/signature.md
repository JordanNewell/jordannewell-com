---
title: "Code signature — how to verify Jordan Newell's work"
description: "Three layers: style tells, an __signature__ constant, and PGP-signed commits + tags. Anyone reading the code can recognize the pattern; anyone verifying releases can confirm attribution cryptographically."
pubDate: 2026-07-17
updatedDate: 2026-07-17
tags: ["meta", "signature"]
mode: "hobart"
---

> Every line of code I publish carries three signals. The first is structural — you recognize it by reading. The second is declarative — a single string in every package's `__init__.py`. The third is cryptographic — PGP signatures on every commit and tag. Pick the layer you need.

## Layer 1 — Style tells

Structural patterns that survive most refactors and LLM rewrites. Present in every repo.

### Headline-first docstring

Module docstrings open with a single imperative line stating what the module does in 10 words or less. No "This module provides..." preamble.

```python
"""Classify any plausible crypto-key string with aggressive recovery."""
```

Not:

```python
"""This module provides functionality for classifying various crypto key formats..."""
```

### Why-only comments

Comments explain *why*, never *what*. The code already says what.

```python
# Mask private keys by default — terminal scrollback is a real exfil vector.
```

Not:

```python
# Set mask to True
mask = True
```

### Causality test naming

Test files: `test_<unit>.py`. Test functions: `test_<scenario>_<expected_outcome>()`. The name encodes the assertion.

```python
def test_argparse_help_no_bare_percent():
    ...
```

Not:

```python
def test_help():
    ...
```

### Headline function first

In any file, the headline public function appears first. Helpers below. Inverted from the "helpers-first, main-last" convention. Anyone reading top-down hits the file's purpose on line 1.

## Layer 2 — The `__signature__` constant

Every Python package I publish exports a `__signature__` string from its main `__init__.py`:

```python
__signature__ = "jn/<repo-slug>@<version>"
```

Example from `crypto-key-classifier`:

```python
>>> import ckc
>>> ckc.__signature__
'jn/crypto-key-classifier@0.5.0'
```

The format is consistent across the portfolio. If you see a package whose `__signature__` starts with `jn/`, it's mine. The string is structural — it survives most rewrites because it's part of how the package identifies itself, not a comment that can be stripped.

A `SIGNATURE.md` file at the repo root lists the current `__signature__` value and the verification recipe.

## Layer 3 — PGP-signed commits and tags

Every commit and tag is GPG-signed with my signing key.

**Fingerprint:** `67567DC5E7C5353F85F2AF0DAC05D3F3E0EFA32A`
**Key ID:** `AC05D3F3E0EFA32A`
**Type:** Ed25519, 2-year expiry

Retrieval options:

```bash
# Web Key Directory (preferred — once WKD is published)
gpg --auto-key-locate clear,dkd,nodefault --locate-key jordan@jordannewell.com

# Keyservers
gpg --keyserver hkps://keys.openpgp.org      --recv-keys AC05D3F3E0EFA32A
gpg --keyserver hkps://keyserver.ubuntu.com  --recv-keys AC05D3F3E0EFA32A
```

Verify a commit:

```bash
git clone https://github.com/JordanNewell/<repo>.git
cd <repo>
git verify-commit HEAD
```

Verify a tag:

```bash
git verify-tag v<X.Y.Z>
```

Verification fails loudly if the commit was rewritten, rebased onto an unsigned ancestor, or signed by a different key.

## Why three layers

| Threat | Which layer catches it |
|---|---|
| Reader wants to know whose code this is at a glance | Layer 1 + Layer 2 |
| Fork or copy of the code, stripped of comments and README | Layer 1 (style tells in the structure) + Layer 2 (`__signature__` field) |
| Release tarball repackaged by a third party | Layer 3 (tag signature won't verify) |
| LLM-rewritten version that "improves" the code | Layer 1 (structural tells are hard to fully strip), Layer 2 (if `__signature__` is preserved as standard Python) |
| Supply-chain attack republishing under a similar name | Layer 3 (signature won't verify against my published key) |

None of the three layers is sufficient alone. All three together form a recognizable, verifiable pattern.

## What this is not

Not a watermark. Not steganography. Not security through obscurity. The pattern is publicly documented, the signature is verifiable, the key is published. The point is recognition — for humans reading the code, for tooling auditing a dependency tree, for myself when I revisit a project five years from now and want to know it's mine.

---

*See the [SIGNATURE.md](https://github.com/JordanNewell/crypto-key-classifier/blob/main/SIGNATURE.md) at any of my repos for the per-repo verification recipe. PGP key fingerprint and verification walkthrough are there.*
