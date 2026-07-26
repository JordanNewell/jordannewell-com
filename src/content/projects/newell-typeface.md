---
title: "newell-typeface"
description: "Original geometric display typeface built from three primitives — vertical rails, horizontal bars, 45° diagonals. Squared terminals, parametric generation, no curves. OFL-1.1."
status: "shipped"
tags: ["projects", "oss", "typeface"]
shipDate: 2026-07-25
repo: "https://github.com/JordanNewell/newell-typeface"
pkg: "https://jordannewell.github.io/newell-typeface/specimen/"
order: 8
facts:
  - k: "shipped"
    v: "2026-07-25"
  - k: "version"
    v: "v0.1.1-alpha"
  - k: "license"
    v: "OFL-1.1"
  - k: "glyphs"
    v: "71"
  - k: "weight"
    v: "Regular"
highlights:
  - title: "Three primitives, infinite combinations"
    body: "Every glyph assembled from vertical rails, horizontal bars, and 45° diagonals. One visual grammar inherited across the whole alphabet."
  - title: "Parametric, not hand-drawn"
    body: "Glyphs generated from declarative rules. Tighten a rule and the entire typeface updates — no per-glyph pixel-pushing."
  - title: "Squared terminals, decisive geometry"
    body: "No curves, no rounded strokes. Pure rails meet at hard 90° and 45° corners. Built for impact, not warmth."
  - title: "Open source under OFL-1.1"
    body: "Modify, bundle, redistribute. Use it in commercial work. Improvements flow back via the same vocabulary."
stack:
  - "fontTools"
  - "fontmake"
  - "UFO source"
  - "Python"
  - "OpenType"
---

**Newell** is an original geometric display typeface. Every glyph lives on a 1000-unit em with cap height 700, x-height 500. Strokes are 110 units wide with squared terminals. Diagonals are exactly 45° — no exceptions.

The vocabulary is three primitives: **rail**, **diagonal**, and **junction**. The signature `N` diagonal — top of one rail to bottom of another — reappears in `M`, `K`, `R`, `V`, `W`, `X`, `Y`, `Z`, and digits `1`, `2`, `4`, `7`. That recurrence is the family resemblance.

## Status

**v0.1.1-alpha** — uppercase A–Z, digits 0–9, basic punctuation, common symbols (⚡ · → ← — ★ ☆ ✗). 71 glyphs. Single Regular weight. Static build (variable axes planned for v0.2).

Recommended for **display and headline use**, not long-form body text. The v0.1 DNA forbids curves, rounded terminals, and any angle other than 45° — several traditional letterforms are unrenderable as a result. S reads as Z; C/D/G/O are rectilinear approximations; check mark omitted entirely. v0.2 adds a third primitive type to fix these. Full trade-offs documented in the [README](https://github.com/JordanNewell/newell-typeface#known-v01-limitations).

## Live sites

- **[Interactive try page](https://jordannewell.github.io/newell-typeface/try.html)** — type your own text in any glyph
- **[Technical specimen](https://jordannewell.github.io/newell-typeface/specimen/)** — full glyph sheet + measurements
- **[Wordmark site](https://jordannewell.github.io/newell-typeface/)** — single-line brand showcase

Source and OFL-1.1 license on GitHub.
