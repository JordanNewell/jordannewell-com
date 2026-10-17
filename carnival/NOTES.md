# dev-carnival — redesign sketch notes

Sketch only. Not deployed, not committed. Single self-contained file: `index.html`
(HTML/CSS/vanilla JS inline, all art hand-drawn SVG; only external refs are the
Google Fonts links for JetBrains Mono + Newsreader).

## Thesis

> A hand-inked ledger-paper carnival diorama, and the thing you remember is the
> drive-in screen running dawn→night while the flat midway tilts under your cursor.

The conceit: the page is a *map* of a midway drawn in a ledger book. The paper
background is ruled (hairline rows + the classic blue margin line at 48px), the
sky only exists *on the drive-in screen* — outside the screen the world is paper
and ink. That single constraint keeps an illustration from turning into a glossy
game UI.

## Attraction mapping (project → ride)

| Project | Ride | Signage ink | One-liner angle |
|---|---|---|---|
| tractum | Roller coaster (headline ride, biggest sweep) | amber `#FFB000` | N of M keys board before the train leaves — quorum rides the hairpins, no single key starts the run |
| curtis | Ferris wheel (slow, sees everything) | teal `#0E7490` | conversational attendant with a view of every booth on the midway |
| newell-typeface | Carousel, "N" rides the lead horse | pink `#BE185D` | letters cut like carousel horses, carved for headlines |
| tokenhunt | High striker (ring the bell) | green `#0E8A4A` | every secret weighed in one clean hit across 53 providers; bell rings for the real thing |
| wranglebot | Balloon-dart game stall, "3 BOTTLES = 5¢" | amber `#A16207` | wrangle the mess into order; chaos plays for free and loses |
| interleaf | Fortune-teller tent, "SHE SEES THE SEALED" | violet `#6D28D9` | letters travel sealed between tents, unread until the right vault opens them |

The six signage inks are the brief's semantic inks; they appear only as ride
livery/plaques/card headings, never as UI chrome. NEWELL green `#00FF41` appears
exactly once: the blinking **OPEN** chip on the drive-in marquee.

## Motion inventory

- Drive-in screen: 26s master loop — dawn → day → dusk → night → dawn. Four
  crossfading gradient layers + sun arc + moon + twinkling stars; at night a
  flickering "film" (tiny white cars on a road) plays on the screen.
- Ferris wheel: spokes rotate 16s; cabins counter-rotate so they stay upright
  (`transform-box: fill-box` trick).
- Coaster: two cars ride the actual track via CSS `offset-path` (`offset-rotate:
  auto` so they bank with the curve).
- Carousel: canopy sways, horses prance (staggered).
- Balloons bob, tent flag waves, fortune-teller lamp flickers.
- Striker puck launches to the bell on hover/open (spring cubic-bezier).
- Scene tilt: `perspective: 1700px`, `rotateX ~7deg` + mouse parallax
  (`rotateY ±2.5deg`), rAF-throttled with easing; disabled below 861px and under
  `prefers-reduced-motion` (which freezes the screen on a legible "day" frame).
- Entrance: one staggered 40–80ms reveal, ride order.
- Review hooks: `?sky=dawn|day|dusk|night` freezes the screen on a phase;
  `#claudeway` (etc.) deep-links a ride's card open. Both were used for QC.

## Movie sequence (lights down, choreographed)

The marquee's **▸ Play movie** button runs a ~8s rAF-driven sequence — dusk
falls like real sundown, no snap:

| t | Beat |
|---|---|
| 0 | `body.duskfall` — 4.6s eased dim (`brightness .24`, asymmetric: 2.4s back out). Sun freezes out of its CSS arc and is JS-driven from here. |
| 3.6s | Parade slows and idles; 3 ushers dispatched toward blanket spots |
| 5.0s | Screen sky crosses to night (stars + moon fade in) as the sun finishes its set |
| 7.2s | Blankets roll out (scaleX unfold); sitters arrive, swap to sit pose |
| 7.9s | `body.movie` — git-log reel fades in (1.6s), popcorn on its ~9s cadence |

LIGHTS UP reverses everything on a shorter timeline (sun sinks/rises through
dusk, blankets packed, sitters rejoin the stroll; `endReverse` resets the sun's
`animation-delay` to 0 so the 26s CSS loop resumes cleanly at dawn).

- **People:** 7 hand-inked strollers (hat / plain / dress / kid, same linework
  as the rides — no hooded figure) walk left→right at varied speeds/sizes with
  a two-leg walk cycle + bobble; they pause (idle) when slow. `.parade` is
  hidden on mobile. Blankets render before figures so sitters read as ink
  silhouettes *on* the lit blankets at night.
- **Screen handoff:** on play, `freezeScreen()` snapshots the CSS-loop layers
  (computed opacity/transform → inline + `animation:none`) and the sequence
  drives them; on lights-up everything inline is cleared and the loop restarts.
- **Reduced motion:** choreography is skipped — play jumps straight to the end
  frame (night, blankets out, 3 sitters seated, everything static); lights-up
  jumps straight back to dawn. Below 861px the blanket/sit beat is skipped
  (parade lane is hidden there anyway).
- Review hooks: `?movie=1&at=<ms>` fast-forwards the sequence to a beat;
  `?rm=0` forces the animated path on an RM machine. Both used for QC.

## Decisions worth defending

- **Depth = two rows.** Back row (coaster / drive-in / wheel) is big and holds
  its plaques mid-field; front row (carousel / striker / stall / tent) stays
  short so the rows never collide. Overlaps that remain (tent over wheel legs,
  stall tucked behind the drive-in) read as intentional diorama depth.
- **Plaques, not tooltips.** Every ride has a permanent little white plaque
  (hard 2px offset shadow — print, not glow). The ticket-stub cards with punched
  notches pop on hover/focus/click; keyboard + Esc + click-outside all handled.
- **Ferris plaque flies above the wheel** — the only ride signed on top; it
  keeps the front-right boardwalk clean for the tent.
- **Mobile is a restack, not a shrink:** tilt off, scene becomes a column —
  drive-in first, then each ride as a bordered card with art right, name, and
  the info printed inline (no pop interaction needed on touch).
- Treeline (pines + two flagpoles at 50% opacity) sits on the horizon purely to
  make the paper feel like a *place*.

## With more time

1. Real parallax *layers* — split sky/rides/foreground onto separate translateZ
   planes so the tilt has true depth parallax, not one rigid plane.
2. The screen's "film" deserves an actual micro-movie (a 3-frame ink chase)
   instead of flickering cars.
3. Ride-specific hover rewards: coaster car speeds up, wheel pauses at the top
   cabin, striker puck already jumps — push each ride to respond.
4. Day/night should tint the *whole* map very slightly (paper warm at dusk,
   cool at night) while staying ledger-white — 2% shifts only.
5. Replace link stubs with real repo URLs + per-ride "credits" line in the card
   (last commit as "last inspection").
6. View Transitions between the map view and a full-page ride detail.

## QC evidence (in `shots/`)

- `desktop-1440.png` — default load (day phase, sun high), 1440×900; full map +
  ink strollers on the midway + plaque row above the fold
- `desktop-sunset.png` — staged mid-sequence still: sun half-set, day→dusk
  crossfade on the screen, midway half-dimmed (the sunset sits *between* the
  day frame and the blanket/film beats, so it can't share one live frame with
  them — see `desktop-movie-mode.png` for the next beat)
- `desktop-movie-mode.png` — film rolling: dimmed midway, git-log reel,
  blankets out with 3 seated silhouettes (shot at scroll 102 so the blanket
  lane is above the fold)
- `desktop-movie-night.png` — night end-state at scroll 0
- `mobile-390.png` — full mobile stack at true 390px (CDP viewport override):
  screen-dominant header with PLAY MOVIE, rides restacked, parade lane hidden

Test-env notes: this machine's headless Chrome matches
`prefers-reduced-motion: reduce`, so animated-path captures (sunset crossfade,
reel position, kernel arcs) were staged with QC-only injected styles; the
shipped paths were verified via computed styles (RM end-state: blankets `.out`,
3 sitters `.sit`, night sky 1 / sun 0, all static; lights-up: clean day,
blankets packed, label restored). A staged frame is QC staging only — no QC
code ships in `index.html`. Also: an occluded MCP Chrome window throttles rAF
to ~1.25fps and starves the sequence's dt clamp — relaunch the MCP Chrome
before driving timed captures.
