"""Generate the full OG card set.

Skips anything that already has a card:
- posts with frontmatter ogImage or hero art keep those (card generated anyway
  as on-disk fallback; layout chain prefers ogImage -> hero -> generated card)
- projects with public/projects/<id>/card.png
- products: all 6 already have ogImage frontmatter — skipped entirely

Prints one line per card + a WARNINGS section for truncated text.
"""

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # Windows cp1252 console safe

from og_card_gen import render

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "src/content/posts"
PROJECTS = ROOT / "src/content/projects"
OUT_POSTS = ROOT / "public/og/posts"
OUT_PROJECTS = ROOT / "public/projects"
OUT_SERIES = ROOT / "public/og/series"


def fm(text: str) -> dict:
    """Minimal frontmatter parser: key: value / key: [a, b] (strings only)."""
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    out = {}
    for line in m.group(1).splitlines():
        kv = re.match(r'^(\w[\w-]*):\s*"?(.*?)"?\s*$', line)
        if kv and not line.startswith((" ", "-")):
            out[kv.group(1)] = kv.group(2).strip('"')
    return out


def tags_of(text: str) -> list[str]:
    m = re.search(r"^tags:\s*\[(.*?)\]", text, re.M)
    return [t.strip().strip('"') for t in m.group(1).split(",")] if m else []


def series_of(text: str) -> list[str]:
    m = re.search(r"^series:\s*\[(.*?)\]", text, re.M)
    return [t.strip().strip('"') for t in m.group(1).split(",")] if m else []


warnings_log = []


def card(out, **kw):
    _, warn = render(out, **kw)
    tag = " (warn)" if warn else ""
    print(f"  {Path(out).name}{tag}")
    for w in warn:
        warnings_log.append(f"{Path(out).name}: {w}")


print("== posts ==")
series_count = {}
for f in sorted(POSTS.glob("*.md")):
    text = f.read_text(encoding="utf-8")
    data = fm(text)
    tags = tags_of(text)
    for s in series_of(text):
        series_count[s] = series_count.get(s, 0) + 1
    kind = data.get("kind")
    footer = [("dot", t.upper()) for t in tags[:2]]
    if kind:
        footer.append(("pill", kind.upper()))
    elif len(tags) > 2:
        footer.append(("pill", tags[2].upper()))
    card(str(OUT_POSTS / f"{f.stem}.png"),
         title=data.get("title", f.stem),
         sub=data.get("description", ""),
         crumb="JORDANNEWELL.COM / POSTS",
         footer=footer)

print("== projects (missing card.png only) ==")
for f in sorted(PROJECTS.glob("*.md")):
    card_path = OUT_PROJECTS / f.stem / "card.png"
    if card_path.exists():
        continue
    text = f.read_text(encoding="utf-8")
    data = fm(text)
    tags = [t for t in tags_of(text) if t != "projects"]
    footer = [("dot", t.upper()) for t in tags[:2]]
    footer.append(("pill", data.get("status", "project").upper()))
    card(str(card_path),
         title=data.get("title", f.stem),
         sub=data.get("description", ""),
         crumb="JORDANNEWELL.COM / PROJECTS",
         footer=footer)

print("== series (with >=1 post) ==")
sys_path = ROOT / "src/content/series.ts"
sys_text = sys_path.read_text(encoding="utf-8")
for m in re.finditer(r"slug:\s*\"(.*?)\".*?name:\s*\"(.*?)\".*?description:\s*\"(.*?)\".*?tool:\s*\"(.*?)\"", sys_text, re.S):
    slug, name, desc, tool = m.groups()
    if slug not in series_count:
        continue
    footer = [("dot", f"{series_count[slug]} POSTS")]
    if tool:
        footer.append(("pill", tool.upper()))
    card(str(OUT_SERIES / f"{slug}.png"),
         title=name, sub=desc,
         crumb="JORDANNEWELL.COM / SERIES", footer=footer)

print("== license ==")
card(str(ROOT / "public/og/license.png"),
     title="License", sub="CC BY-NC 4.0 — share, adapt, attribute.",
     crumb="JORDANNEWELL.COM", footer=[("dot", "CC BY-NC 4.0")])

print(f"\n== {len(warnings_log)} warnings ==")
for w in warnings_log:
    print(" ", w)
