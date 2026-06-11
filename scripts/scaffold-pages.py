#!/usr/bin/env python3
"""Lege Platzhalter-Seiten für alle Nav-/Footer-Links an."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = [
    ("bestandsmanagement.html", "Digitales Bestandsmanagement", "Transparenz über Ihren Bürobestand – die Basis für nachhaltige Weiternutzung und höhere Erlöse."),
    ("digitale-inventarisierung.html", "Digitale Inventarisierung", "Erfassen und bewerten Sie Ihren Bestand strukturiert und nachvollziehbar."),
    ("projektmanagement.html", "Projektmanagement", "Strukturierte Begleitung Ihrer Bürotransformation von der Analyse bis zur Umsetzung."),
    ("bueroaufloesung.html", "Büroauflösung", "Ganzheitliche Verwertung bei Standortauflösung – kostenlose Vor-Ort-Besichtigung inklusive."),
    ("mitarbeiterverkauf.html", "Mitarbeiterverkauf", "Geben Sie Möbel strukturiert an Mitarbeitende weiter und maximieren Sie interne Nutzung."),
    ("spende.html", "Spende", "Sozial und nachhaltig: nicht mehr benötigte Ausstattung sinnvoll weitergeben."),
    ("aufbereitung.html", "Aufbereitung", "Professionelle Aufbereitung für interne Weiternutzung oder den Weiterverkauf."),
    ("bueroeinrichtung.html", "Büroeinrichtung", "Schlüsselfertige Einrichtung mit Hybrid aus Bestand, refurbished und neuen Möbeln."),
    ("workspace-analytics.html", "Workspace Analytics & Bürokonzept", "Datenbasierte Arbeitsplatzanalyse als Fundament für Ihr neues Bürokonzept."),
    ("bueromoebel-mieten.html", "Mietoptionen", "Flexible Büromöbel im Mietmodell – wirtschaftlich und ressourcenschonend."),
    ("grossunternehmen.html", "Großunternehmen", "Skalierbare Lösungen für komplexe Standort- und Transformationsprojekte."),
    ("mittelstand.html", "Mittelstand", "Pragmatische Bürolösungen mit messbarem wirtschaftlichen Nutzen."),
    ("start-up-scale-up.html", "Scale-Ups", "Schnell wachsen mit flexibler, nachhaltiger Büroausstattung."),
    ("co-working-space.html", "Co-Working Space", "Ressourcenschonende Ausstattung für moderne Co-Working-Konzepte."),
    ("events.html", "Events", "Fenyx Roadshow und Veranstaltungen – Fortbildung und Impulse vor Ort."),
    ("ueber-uns.html", "Über uns", "Lernen Sie das Team hinter Fenyx kennen."),
    ("ratgeber.html", "Ratgeber", "Wissen und Impulse zu Circular Office und nachhaltiger Bürotransformation."),
    ("presse-medien.html", "News & Medien", "Pressemitteilungen und Medienresonanz rund um Fenyx."),
    ("impressum.html", "Impressum", "Rechtliche Angaben gemäß § 5 TMG."),
    ("datenschutz.html", "Datenschutz", "Informationen zur Verarbeitung personenbezogener Daten."),
    ("agb.html", "AGB", "Allgemeine Geschäftsbedingungen der Fenyx GmbH."),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{meta}">
  <title>{title} – Fenyx GmbH</title>
  <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/143687456.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            abyss: {{ DEFAULT: '#0b171f', deep: '#0b171f', mid: '#132735' }},
            signal: {{ DEFAULT: '#c8ff00' }},
            mist: {{ DEFAULT: '#8da4ba' }},
          }},
          fontFamily: {{ sans: ['Inter', 'system-ui', 'sans-serif'] }},
          borderRadius: {{ DEFAULT: '0', none: '0' }},
        }},
      }},
    }};
  </script>
  <link rel="stylesheet" href="css/site-nav.css">
</head>
<body class="font-sans text-black bg-white antialiased flex flex-col min-h-screen">
{header}
<main class="flex-1">
  <section class="bg-abyss-deep text-white py-20 sm:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] mb-5">{h1}</h1>
        <p class="text-mist text-base sm:text-lg leading-relaxed mb-8">{subline}</p>
        <a href="index.html#kontakt" class="inline-flex items-center px-8 py-4 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition-all">Kontakt aufnehmen</a>
      </div>
    </div>
  </section>
  <section class="py-16 sm:py-20 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-black/80 text-base sm:text-lg leading-relaxed">Diese Seite wird im Rahmen der Website-Migration noch mit Inhalten aus der Live-Seite befüllt.</p>
    </div>
  </section>
  <section class="py-16 sm:py-20 bg-abyss-deep text-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl sm:text-3xl font-black tracking-[-0.02em] mb-6">Buchen Sie eine kostenlose Erstberatung.</h2>
      <a href="index.html#kontakt" class="inline-flex items-center px-8 py-4 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition-all">Kontakt aufnehmen</a>
    </div>
  </section>
</main>
{footer}
<script src="js/mega-menu.js" defer></script>
<script src="js/site-shell.js" defer></script>
</body>
</html>
"""


def main() -> None:
    header = (ROOT / "partials/site-header.html").read_text()
    footer = (ROOT / "partials/site-footer.html").read_text()
    css_src = ROOT / "index.html"
    # extract mega menu css block to site-nav.css if not exists
    nav_css = ROOT / "css/site-nav.css"
    if not nav_css.exists():
        text = css_src.read_text()
        start = text.find("/* ── Mega-Menü ── */")
        end = text.find(".form-input {", start)
        nav_css.parent.mkdir(exist_ok=True)
        nav_css.write_text(text[start:end])

    for filename, h1, subline in PAGES:
        path = ROOT / filename
        if path.name == "bestandsmanagement.html" and path.exists():
            continue
        html = TEMPLATE.format(
            title=h1,
            meta=subline,
            h1=h1,
            subline=subline,
            header=header,
            footer=footer,
        )
        path.write_text(html)
        print("created", filename)


if __name__ == "__main__":
    main()
