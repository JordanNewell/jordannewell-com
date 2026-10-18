"""OG card generator — replicates the existing share-card style exactly
(ruler ticks, sticker N, Newsreader display title, italic serif sub,
green pill / dot row, character on hatched ground, sparkles).

Only title / sub / breadcrumb / footer change per card.

Usage:
  python scripts/og-card-gen.py                # renders test cards to C:/tmp/og-samples/
  from scripts.og_card_gen import render
  render(out="public/og-x.png", title="Posts", sub="...",
         crumb="JORDANNEWELL.COM / POSTS", footer=[("dot","NOW"),("dot","PRODUCTS")])
"""

from pathlib import Path

from fontTools import varLib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(__file__).parent / "og-assets"
JBM = ROOT / "node_modules/@fontsource/jetbrains-mono/files"
NWR = ROOT / "node_modules/@fontsource-variable/newsreader/files"

# The Ledger card palette (sampled from og-posts.png / og-card.png)
BG = (246, 243, 234)
INK = (23, 25, 23)
CRUMB = (41, 43, 40)
SUB = (105, 102, 96)
GREEN = (119, 212, 44)
GREEN_DARK = (69, 117, 29)
BORDER = INK

W, H = 1200, 630
FX0, FY0, FX1, FY1 = 27, 27, 1172, 602  # frame
CHAR = str(ASSETS / "character.png")
NSTICKER = str(ASSETS / "n-sticker.png")

_ttf_cache = {}


def _woff2ttf(path: Path, axes: dict | None = None) -> str:
    key = (str(path), tuple((axes or {}).items()))
    if key in _ttf_cache:
        return _ttf_cache[key]
    out = Path("C:/tmp/fonts") / f"{path.stem}-{abs(hash(key)) % 99999}.ttf"
    out.parent.mkdir(parents=True, exist_ok=True)
    f = TTFont(path)
    if axes:
        instantiateVariableFont(f, axes, inplace=True)
    f.flavor = None
    f.save(out)
    _ttf_cache[key] = str(out)
    return str(out)


def _mono(size, weight=700):
    p = JBM / f"jetbrains-mono-latin-{weight}-normal.woff2"
    return ImageFont.truetype(_woff2ttf(p), size)


def _serif(size, wght=400, opsz=72, italic=False):
    p = NWR / f"newsreader-latin-standard-{'italic' if italic else 'normal'}.woff2"
    return ImageFont.truetype(_woff2ttf(p, {"wght": wght, "opsz": opsz}), size)


def _tracked(d, xy, text, font, fill, tracking=4):
    """Draw letterspaced text; returns end x."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking
    return x


def _tracked_len(d, text, font, tracking=4):
    return sum(d.textlength(ch, font=font) + tracking for ch in text) - tracking


def _sparkle(d, cx, cy, r, fill=GREEN, outline=INK, lw=3):
    """4-point star (concave diamond), like the card sparkles."""
    k = r * 0.22  # waist
    pts = [(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k),
           (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)]
    d.polygon(pts, fill=fill, outline=outline, width=lw)


def render(out, title, sub, crumb="JORDANNEWELL.COM", footer=None, big_logo=False):
    """footer: list of ("dot", LABEL) pairs and/or ("pill", LABEL)."""
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    warnings = []

    # frame
    d.rectangle([FX0, FY0, FX1, FY1], outline=BORDER, width=3)

    # ruler ticks below the top edge: minor every 20px (h4), major every 100 (h8)
    x = 47
    while x < FX1 - 10:
        major = (x - 47) % 100 == 0
        y0, y1 = (FY0 + 3, FY0 + 11) if major else (FY0 + 3, FY0 + 7)
        d.line([(x, y0), (x, y1)], fill=INK, width=2)
        x += 20

    # header: sticker N + tracked breadcrumb
    logo_h = 96 if big_logo else 42
    sticker = Image.open(NSTICKER)
    lw = int(sticker.width * logo_h / sticker.height)
    sticker = sticker.resize((lw, logo_h), Image.LANCZOS)
    hx, hy = 55, 52 if big_logo else 62
    im.paste(sticker, (hx, hy), sticker)
    if not big_logo:
        # RULE: crumb starts after the logo, must end before x=700 (character
        # zone starts ~760). Tries tracking 5 -> 3, then truncates with "…".
        cf = _mono(21, 700)
        text = " / ".join(p.strip().upper() for p in crumb.split("/"))
        for tracking in (5, 3):
            if hx + lw + 18 + _tracked_len(d, text, cf, tracking) <= 700:
                break
        else:
            while text and hx + lw + 18 + _tracked_len(d, text + "…", cf, 3) > 700:
                text = text[:-1].rstrip()
            text += "…"
            warnings.append(f"crumb truncated: {crumb!r}")
        _tracked(d, (hx + lw + 18, hy + 12), text, cf, CRUMB, tracking)

    # title — Newsreader display
    # RULE: max 3 lines, max width 700px (clear of the character), auto-size
    # 190 -> 44; if it still doesn't fit at 44, truncate with "…" and warn.
    size = 190
    lines = None
    while size >= 44:
        tf = _serif(size)
        lines = _wrap(d, title, tf, 700)
        if len(lines) <= 3 and max(d.textlength(l, font=tf) for l in lines) <= 700:
            break
        size -= 6
    if size < 44:
        assert tf is not None and lines is not None
        tf = _serif(44)
        # greedy-fill three lines, then hard-truncate with an ellipsis
        words, lines, cur = title.split(), [], ""
        for w in words:
            t = f"{cur} {w}".strip()
            if d.textlength(t, font=tf) <= 700:
                cur = t
            else:
                lines.append(cur)
                if len(lines) == 3:
                    break
                cur = w
        if len(lines) < 3 and cur:
            lines.append(cur)
        lines = lines[:3]
        while d.textlength(lines[-1] + "…", font=tf) > 700:
            lines[-1] = lines[-1][:-1].rstrip()
        lines[-1] += "…"
        warnings.append(f"title truncated at 3 lines/44px: {title!r}")
        size = 44
    assert lines is not None and size is not None
    # bottom-anchored at y=385 so the sub never moves — N-line blocks stack up
    lh = int(size * 0.95)
    ty = 385 - len(lines) * lh
    for line in lines:
        d.text((62, ty), line, font=tf, fill=INK)
        ty += lh

    # sub — italic serif
    # RULE: max width 660px (clear of the character), max 2 lines, must end
    # above y=505 (footer row). Shrinks 36 -> 30 -> 26 before truncating.
    for ssize in (36, 30, 26):
        sf = _serif(ssize, wght=400, opsz=14, italic=True)
        slines = _wrap(d, sub, sf, 660)
        if len(slines) <= 2:
            break
    else:
        while sub and len(_wrap(d, sub + "…", sf, 660)) > 2:
            sub = sub[:-1].rstrip()
        sub += "…"
        slines = _wrap(d, sub, sf, 660)
        warnings.append(f"sub truncated: {sub!r}")
    sy = 385 + 14
    for line in slines:
        d.text((65, sy), line, font=sf, fill=SUB)
        sy += ssize + 10

    # footer row (bottom-left): dots+labels and/or pill, all on one line
    # RULE: row must end before x=760 (ground/character zone). If it doesn't
    # fit, dots are dropped first, then the pill is flagged.
    fy = 558
    fx = 62
    pill = next((lbl for kind, lbl in footer or [] if kind == "pill"), None)
    dots = [lbl for kind, lbl in footer or [] if kind == "dot"]
    if pill:
        pf = _mono(27, 700)
        pw = int(_tracked_len(d, pill, pf, 3)) + 56
        # measure dots row; drop dots if the combined row would overflow
        df = _mono(19, 700)
        dots_w = 0
        for lbl in dots:
            dots_w += 18 + _tracked_len(d, lbl, df, 4) + 26
        if dots and 62 + dots_w + 6 + pw > 760:
            warnings.append(f"footer dots dropped (overflow): {dots}")
            dots = []
        px0 = 71
        if dots:
            for lbl in dots:
                d.ellipse([fx, 533, fx + 10, 543], fill=GREEN_DARK)
                fx = _tracked(d, (fx + 18, 531), lbl, df, CRUMB, 4) + 26
            px0 = fx + 6
        if px0 + pw > 760:
            warnings.append(f"pill overflows character zone: {pill!r}")
        d.rounded_rectangle([px0, 513, px0 + pw, 573], radius=30, fill=GREEN, outline=INK, width=3)
        _tracked(d, (px0 + (pw - _tracked_len(d, pill, pf, 3)) // 2, 528), pill, pf, INK, 3)
    elif dots:
        df = _mono(19, 700)
        for lbl in dots:
            d.ellipse([fx, fy - 2, fx + 10, fy + 8], fill=GREEN_DARK)
            fx = _tracked(d, (fx + 18, fy - 4), lbl, df, CRUMB, 4) + 26
        if fx > 760:
            warnings.append(f"footer dots overflow: {dots}")

    # ground line + hatches, character standing on it (bottom-right)
    d.line([(790, 556), (1150, 556)], fill=INK, width=2)
    hx2 = 800
    while hx2 < 1145:
        d.line([(hx2, 557), (hx2 - 7, 568)], fill=INK, width=2)
        hx2 += 13
    ch = Image.open(CHAR)
    ch_h = 397  # native extraction size == og-posts scale
    ch_w = int(ch.width * ch_h / ch.height)
    ch = ch.resize((ch_w, ch_h), Image.LANCZOS)
    # feet (sprite bottom) on the ground line, centered ~x975
    im.paste(ch, (975 - ch_w // 2, 556 - ch_h), ch)
    # sprite carries baked-in sparkles; add one more mid-right for balance
    _sparkle(d, 1125, 290, 15)

    Path(out).parent.mkdir(parents=True, exist_ok=True)
    im.save(out)
    return out, warnings


def _wrap(d, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = f"{cur} {w}".strip()
        if d.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


if __name__ == "__main__":
    # test: replicate the Synapse mockup + a long-title case
    render("C:/tmp/og-samples/gen-synapse.png", title="Synapse", sub="Restart broke encrypted replies.",
           crumb="JORDANNEWELL.COM / POSTS", footer=[("dot", "NOW"), ("pill", "E2EE")])
    render("C:/tmp/og-samples/gen-long.png", title="Testing agents like they're employees",
           sub="What a year of dogfooding taught me about evals.",
           crumb="JORDANNEWELL.COM / POSTS", footer=[("dot", "ESSAY")])
    print("done")
