---
title: "Newell"
tagline: "A geometric display face built from three primitives and zero curves."
description: "Newell is a parametric display typeface where every glyph is built from three primitives — vertical rail, horizontal rail, 45° diagonal. Squared terminals, no curves anywhere. 61 glyphs, OFL-1.1, WOFF2 at 1.8KB. Specimen at newell.ink."
status: "released"
shipDate: 2026-07-25
homepage: "https://newell.ink"
logo: "/products/newell-typeface/newell-typeface-logo.svg"
pricing: "free-oss"
license: "OFL-1.1"
order: 7
ogImage: "/products/newell-typeface/og.png"
stats:
  - k: "form"
    v: "Display typeface"
  - k: "glyphs"
    v: "61 (A–Z, 0–9, punctuation)"
  - k: "weight"
    v: "1.8KB WOFF2"
  - k: "license"
    v: "OFL-1.1"
features:
  - title: "Three primitives, no exceptions"
    body: "Every glyph is vertical rail, horizontal rail, 45° diagonal — nothing else. No curves anywhere, not because curves are hard but because the constraint is the identity. The junction where a diagonal meets a rail is new; it is not a fourth primitive."
  - title: "Parametric, not drawn"
    body: "Glyphs are declarative JSON definitions passed through parametric Python, then UFO, then fontmake. Draw a letter by stating what it is. The entire face compiles to a WOFF2 smaller than most favicons."
  - title: "Honest edges"
    body: "v0.1 documents its limits in the changelog instead of hiding them: no lowercase, no kerning, S reads as Z (there is no primitive that makes an S), and several letters are rectilinear by necessity. The v0.2 weights backlog is public — fourteen open issues."
faq:
  - q: "Where can I use it?"
    a: "Anywhere a display face fits — wordmarks, headers, splash screens. It's display-only by design: uppercase-forward, happiest at sizes where the rails read as rails."
  - q: "Why does S look like Z?"
    a: "The pure rails-plus-45° vocabulary has no primitive that makes an S. That's a consequence of the constraint, not a bug — it's documented in the changelog with the rest of the v0.1 edges."
  - q: "What's coming in v0.2?"
    a: "The weights backlog — fourteen open issues on the public repo. It gets worked when it gets worked; nothing is promised before it ships."
privacy: "Static font files. No telemetry, no web fonts served from a tracker, no phone-home — the specimen is a static page and the binaries are just files."
---

A typeface with a construction grammar, not a drawing.

[Newell](https://newell.ink) builds every glyph from three primitives — vertical rail, horizontal rail, 45° diagonal — with squared terminals and no curves anywhere. Defined as declarative JSON, compiled parametrically through fontmake. 61 glyphs, OFL-1.1, 1.8KB as WOFF2.

The [specimen at newell.ink](https://newell.ink) shows the face large, in context, and at its weights — with the construction visible instead of hidden. The specimen is the product tour; the [repo](https://github.com/JordanNewell/newell-typeface) is the source of truth.

It already runs on this site: Newell is the display face for the wordmark and brand surfaces. Mono for structure, prose serif for reading, Newell for display — three jobs, three faces, no overlap.
