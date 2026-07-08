#!/usr/bin/env python3
"""Extrahiert den stadt-spezifischen Inhalt der 21 grossen Bueroeinrichtungs-
Standortseiten aus dem Webflow-Export -> bueroeinrichtung-standorte.data.json.

Ausfuehren:  python3 scripts/extract_bueroeinrichtung_standorte.py
Nutzt BeautifulSoup (bs4)."""
import json
import os
import re
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Webflow-Export liegt im Repo-Root (eine Ebene ueber fenyx-next).
_export_candidates = [
    os.path.join(ROOT, "_reference/webflow-export/bueroeinrichtung-standort"),
    os.path.join(os.path.dirname(ROOT), "_reference/webflow-export/bueroeinrichtung-standort"),
]
EXPORT_DIR = next((p for p in _export_candidates if os.path.isdir(p)), _export_candidates[0])
OUT = os.path.join(ROOT, "scripts/bueroeinrichtung-standorte.data.json")

KEEP = {"h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "em", "b", "i", "a", "br"}


def clean_html(el):
    """Behalte nur semantische Tags, ersetze Webflow-Wrapper durch ihren Inhalt."""
    if el is None:
        return ""
    soup = BeautifulSoup(str(el), "lxml")
    root = soup.body or soup
    # unwrap: von innen nach aussen alle nicht erlaubten Tags aufloesen
    for tag in root.find_all(True):
        if tag.name not in KEEP:
            tag.unwrap()
        else:
            attrs = {}
            if tag.name == "a" and tag.get("href"):
                attrs["href"] = tag["href"]
            tag.attrs = attrs
    html = root.decode_contents() if hasattr(root, "decode_contents") else str(root)
    html = re.sub(r"<p>\s*</p>", "", html)
    html = re.sub(r"[ \t]{2,}", " ", html)
    html = re.sub(r"\n{3,}", "\n\n", html)
    return html.strip()


def text_of(el):
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def strip_scripts(el):
    if el:
        for t in el.select("script,style,noscript"):
            t.decompose()


cities = []
for file in sorted(f for f in os.listdir(EXPORT_DIR) if f.endswith(".html")):
    slug = file[:-5]
    with open(os.path.join(EXPORT_DIR, file), encoding="utf-8", errors="ignore") as fh:
        soup = BeautifulSoup(fh, "lxml")

    hero = soup.select_one(".section_hero")
    parallax = soup.select_one(".section_parallax")
    headers = soup.select(".section_header")
    for s in (hero, parallax, *headers):
        strip_scripts(s)

    h1 = text_of(hero.select_one("h1")) if hero else ""
    hero_sub = ""
    if hero:
        for sel in ("h2", ".text-size-medium", "p"):
            e = hero.select_one(sel)
            if e and text_of(e) and text_of(e) != h1:
                hero_sub = text_of(e)
                break

    title_el = soup.select_one("title")
    meta_title = text_of(title_el)
    md = soup.select_one('meta[name="description"]') or soup.select_one('meta[property="og:description"]')
    meta_desc = md.get("content", "").strip() if md else ""

    intro_content = (parallax.select_one(".parallax_content") if parallax else None) or parallax
    intro_html = clean_html(intro_content)
    block1 = clean_html(headers[0]) if len(headers) > 0 else ""
    block2 = clean_html(headers[1]) if len(headers) > 1 else ""

    section1 = "\n".join(x for x in (intro_html, block1) if x)
    section2 = block2

    hero_img = ""
    if hero:
        img = hero.select_one("img[src]")
        if img:
            hero_img = img.get("src", "")
        if not hero_img:
            vid = hero.select_one("video[poster]")
            if vid:
                hero_img = vid.get("poster", "")

    ld = soup.select_one('script[type="application/ld+json"]')
    schema = ld.get_text().strip() if ld else ""

    name = re.sub(r"(?i)^bueroeinrichtung\s*", "", h1.split(":")[0]).strip() or slug
    name = re.sub(r"(?i)^b.roeinrichtung\s*", "", name).strip() or slug

    cities.append({
        "slug": slug,
        "name": name,
        "h1": h1,
        "hero_subline": hero_sub,
        "meta_title": meta_title,
        "meta_description": meta_desc,
        "section1_html": section1,
        "section2_html": section2,
        "hero_image_url": hero_img,
        "schema_markup": schema,
    })
    print(f"{slug:14} h1={'Y' if h1 else 'N'} s1={len(section1):5} s2={len(section2):5} "
          f"meta={'Y' if meta_desc else 'N'} schema={'Y' if schema else 'N'} img={'Y' if hero_img else 'N'}")

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(cities, fh, ensure_ascii=False, indent=2)
print(f"\n{len(cities)} Staedte -> {os.path.relpath(OUT, ROOT)}")
