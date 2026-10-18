---
title: "newell.ink — the typeface gets its own address"
description: "Newell, the geometric display face built from three primitives and zero curves, shipped as an alpha in July. Now it has a proper specimen site: newell.ink. Live, on its own domain, because a typeface without a specimen page is a font file with no front door."
pubDate: 2026-10-18
tags: ["typeface", "design"]
mode: "hobart"
kind: "win"
project: "newell-typeface"
draft: false
---

Every glyph in [Newell](https://newell.ink) is built from three primitives: a vertical rail, a horizontal rail, and a 45° diagonal. Squared terminals. No curves anywhere — not because curves are hard, but because the constraint is the identity. Take the rails away and there's no typeface; there's just a font.

The alpha shipped in July: 61 glyphs, OFL-1.1, WOFF2 at 1.8KB — the entire face weighs less than most favicons. The build is declarative JSON glyph definitions → parametric Python → UFO → fontmake. Draw a letter by stating what it is, not by sketching it.

This week it got the thing every type release eventually needs and every side project puts off: **a real specimen page at its own domain — [newell.ink](https://newell.ink)**.

## What the site is

A specimen, in the typefoundry sense: the face shown large, shown in context, shown at its weights, with the construction visible instead of hidden. The point of a specimen is to let someone decide in thirty seconds whether your face belongs in their project — which means showing the character, not just the alphabet. Newell's character is architectural: display-only, uppercase-forward, happiest at sizes where the rails read as rails.

## The honest limitations, still on display

v0.1 documents its edges rather than fixing them quietly: no lowercase, no kerning, S reads as Z (a direct consequence of the pure rails-plus-45° vocabulary — there is no primitive that makes an S), and several letters are rectilinear by necessity. These are in the changelog, not swept under it. A v0.2 weights backlog exists as fourteen open issues and will get worked when it gets worked.

The typeface now sits in the stack the way it always should have: [Newell for display](https://newell.ink), monospace for structure, prose serif for reading. Three jobs, three faces, no overlap.
