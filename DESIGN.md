# jordannewell.com — Design Notes

> Personal publication. Own visual identity ("the Ledger" — warm paper, ink,
> single green accent). Not the NEWELL product palette; this is a personal-site
> brand. Canonical source in code: `src/styles/global.css`.

## Palette (light — default)

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#FAFAF8` | Paper background |
| `--color-border` | `#E4E2DA` | Hairline borders |
| `--color-rule-strong` | `#16161B` | Strong rules |
| `--color-fg` | `#16161B` | Body text |
| `--color-fg-secondary` | `#4A4852` | Secondary text |
| `--color-fg-muted` | `#6E6A73` | Muted text |
| `--color-accent` / `--color-green` | `#0E8A4A` | The only accent — links, marks |
| `--color-amber` | `#B45309` | Warning tones |
| `--color-cyan` | `#0E7490` | Info tones |
| `--color-red` | `#D9453F` | Error tones |

## Dark mode — "the Ledger at night"

- Background: NEWELL soft-black `#0A0A0A`, border `#1F1F1F`, foreground `#F2EFE6`.
  Deliberately reuses NEWELL background/border tokens for the night surface.

## Typography

- Body/voice: Newsreader Variable (serif) — editorial, per VOICE.md.
- Mono/display: JetBrains Mono — code, labels, display.

## Rules

- Green `#0E8A4A` is the only accent. No gradients, no glow.
- Tokens live in `src/styles/global.css` — change there, nowhere else.
