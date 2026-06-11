#!/usr/bin/env python3
"""Presse-Logos aus assets/presse-logos/ in index.html einfügen (Marquee, doppelt für Loop)."""

import os
import re
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGOS_DIR = os.path.join(ROOT, "assets", "presse-logos")
INDEX = os.path.join(ROOT, "index.html")


def alt_from_filename(name: str) -> str:
    base = re.sub(r"\.(avif|webp|png|svg|jpe?g)$", "", name, flags=re.I)
    if "_" in base:
        base = base.split("_", 1)[1]
    base = re.sub(r"\s+1$", "", base)
    base = base.replace("%23", "#")
    return base.strip() or "Presse-Logo"


def cell(filename: str, alt: str) -> str:
    src = "assets/presse-logos/" + quote(filename)
    return (
        f'            <div class="presse-logo-cell" role="listitem">'
        f'<img src="{src}" alt="{alt}" loading="lazy"></div>'
    )


def main() -> None:
    files = sorted(
        f
        for f in os.listdir(LOGOS_DIR)
        if not f.startswith(".") and re.search(r"\.(avif|webp|png|svg|jpe?g)$", f, re.I)
    )
    if not files:
        print("Keine Logos in assets/presse-logos/ gefunden.")
        return

    cells = [cell(f, alt_from_filename(f)) for f in files]
    group_a = "\n".join(cells)
    group_b = "\n".join(cells)
    track = (
        '          <div class="presse-marquee__group" aria-hidden="false">\n'
        f"{group_a}\n"
        "          </div>\n"
        '          <div class="presse-marquee__group" aria-hidden="true">\n'
        f"{group_b}\n"
        "          </div>"
    )

    with open(INDEX, encoding="utf-8") as f:
        html = f.read()

    pattern = (
        r'(<div id="presse-logo-track" class="presse-marquee__track"[^>]*>).*?'
        r"(</div>\s*</div>\s*</div>\s*</section>)"
    )
    new_html, n = re.subn(pattern, r"\1\n" + track + r"\n          \2", html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit("presse-logo-track in index.html nicht gefunden.")

    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"{len(files)} Presse-Logos eingefügt.")


if __name__ == "__main__":
    main()
