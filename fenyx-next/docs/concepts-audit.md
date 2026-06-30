# Fenyx /concepts — Audit & Empfehlung

3 Homepage-Konzepte als Vorschau-Routen `/c`, `/d`, `/e`. Alle ruhig & reduziert, unterschiedlich stark in Emotion vs. „techy". Vergleich inkl. Live-Seite `/` und V3-Vorschau `/b` als Baseline.

Branch: `feat/homepage-v3-preview-b`. Alle Routen `noindex`.

---

## Baseline: `/` (Live) und `/b` (V3-Vorschau)

### `/` — Live-Startseite
- **Stack:** `HomeHeroVideo` (Video-Hintergrund, warmtoniger Overlay) → `LogoGrid` (14-Spalten, dicht) → `LifecycleSection` (grüne SVG-Scroll-Linie, 3 Karten, Mitte-Box „Optimierte Flächennutzung") → `PressMarquee` → `ReferenceProjectsSection` (weiß, dunkle Karten, scroll-Fade-Skala) → `ContactSection`.
- **Wirkung:** Bewährt, funktional, aber visuell viel auf einmal. Mitte-Box bricht die Timeline-Story. 14-Spalten-Logo-Raster wirkt „Social-Proof-Mauer" statt kuratiert. Keine deutliche Marken-Entwicklung.
- **AI-slop-Risiko:** Niedrig (echte Fotos, eigene Markenfarben). Aber: generische SaaS-Card-Soup bei Referenzen, keine starke Typo-POV.

### `/b` — V3 „Signal" ( Duplicate-Repo, wiederhergestellt)
- **Stack:** `DesignV3HeroCanvas` (~600 Zeilen Canvas-Wireframe, Drag-to-Rotate) → `DesignV3KpiSwitcher` (Tabs, Count-up) → `LogoGrid` → 3× `DesignV3ServiceSection` (Vollbild-Split, SpaceX-Spec-Table, Scroll-Reveal) → `DesignV3PressRow` → `DesignV3ImpactStrip` (Endlos-Scroll, hardcoded Array) → `ContactSection`.
- **Wirkung:** Techy & mutig, aber laut. Canvas-Hero ist ein Effekt-Spiel, Referenzen sind hardcoded statt datengetrieben.Entspricht nicht dem Briefing „ruhig & reduziert".
- **AI-slop-Risiko:** Mittel (Techy-Effekte könnten als „zu viel" gelesen werden).

---

## Konzepte im Vergleich

| Dimension | `/c` Editorial Quiet | `/d` Architectural Quiet | `/e` Signal Quiet |
|---|---|---|---|
| **Position** | am emotionalsten, am wenigsten techy | balanciert | am techy, trotzdem ruhig |
| **Inspiration** | Patina Berlin × Nornorm × Augustus | Nornorm × SpaceX | SpaceX × Augustus |
| **Hintergrund** | Warmes Papier (`#f3ede2`) | `mist-soft` + abyss-Panel | `abyss-deep` (dark-first) |
| **Hero** | Oversized Telegraf 3-Zeiler, Papier-Stillleben subtil | Split: Axonometrie-Bild links, Text rechts, `01 / 03` Eyebrow | Dark, Signal-Grid-Overlay, 3-Zeilen-Stagger, Scroll-Progress-Balken |
| **Logo-Grid** | 5-6 Logos groß, kuratiert, „Ausgewählte Partnerschaften" | 7-Spalten mit dünnen Trennlinien, Hover = warmer Hauch | Outline-Logos, 7-Spalten, Hover = Signal-Punkt |
| **Timeline** | 3 Kapitel, römische Zahlen (I, II, III), dezente Trennlinie, Single-Column | Behält grüne SVG-Linie (Fenyx-DNA), 1px, quadratische Punkte, spec-table | Kein SVG — numerischer Progress-Indikator links, Outline-Index `01/02/03` |
| **Referenzen** | Editorial-Stack: 16:9-Bild + 1 KPI groß, single-column | Bento-Grid mit variierenden Kacheln, 1 KPI prominent | Horizontale Scroll-Rail mit Snap, keine Endlos-Schleife |
| **Motion** | CSS `animation-timeline: view()`, IntersectionObserver-Fallback, 600ms sanfte Fade-Ins | Scroll-getriebene SVG-Linie, Parallax 8%, IO-Fallback | Scroll-driven + Scroll-Listener, Progress-Fill, parallax |
| **Easter Egg** | – | – | Konami-Code öffnet „FENYX DEBUG"-Overlay (Scroll %, aktive Section, Token-Swatches, ESC) |
| **Typo-POV** | Stärkste — oversized Display + 62ch Body, römische Zahlen | Absicht da, Ausführung lose — h2-Skala wackelt, Tabular-nums nur partiell | Sauber — mono-feel Eyebrows (0.16em), Tabular-nums, outline-Index |
| **Kontrast** | 6–13:1 auf warmem Papier (beste) | 2 FAILs vor Fix (3.6:1, 2.7:1) → nach Fix 5.7:1 | 7–15:1 auf dark, 1 Borderline vor Fix (4.19:1) → nach Fix 7:1 |
| **A11y** | Vor Fix: keine Focus-Styles → nach Fix: dc-link focus-visible + min-h-44 | Vor Fix: 3 Touch-Targets <44px, 1 Layout-Shift-Hover → nach Fix behoben | Beste Coverage — signal focus-rings überall, Easter-egg fully accessible |
| **AI-slop-Score** | Sehr niedrig — komplett abseits jeglicher Template | Niedrig — Nornorm × SpaceX trifft es | Niedrig, aber „Trusted by"-Phrase war SaaS-Tell (→ „Vertraut von") |

---

## Audit-Ergebnisse (alle 4 Pass Bars)

| Bar | `/c` | `/d` | `/e` |
|---|---|---|---|
| **1. Nicht AI-made** | PASS | PASS | PASS (mit Brand-Fix) |
| **2. Detail & Craft** | PASS (nach Spacing-Fix) | PASS (nach Kontrast + Hover + Touch-Fixes) | PASS (nach Border + Hint-Fixes) |
| **3. Typo-POV** | PASS — stärkste | PASS — nach font-bold + tabular-nums + h2-Scale-Fix | PASS — sauberste |
| **4. Responsive + A11y** | PASS — nach focus-visible + min-h-44 | PASS — nach Touch-Targets + overflow-clip | PASS — bereits stark, Touch-Target-Fix für 1 Link |

**Alle 3 Routen clear alle 4 Bars nach Merge-Phase.** Build erfolgreich, dev-Server rendert alle Routen HTTP 200.

---

## applying Fixes (Commit `40b3ccb` + `a72d8f2`)

### Priority 1 — A11y + Kontrast (kritisch)
- `CtaButton` shared: `focus-visible:ring-2 ring-signal ring-offset-abyss-deep` (alle 3 Hero-CTAs)
- `/c` `.dc-link`: `:focus-visible` Outline + `min-height: 44px`
- `/d` LogoGrid: `text-abyss/55,/45` → `/70` (WCAG 3.6:1, 2.7:1 → 5.7:1)
- `/d` „Mehr erfahren": `hover:gap-3` (Layout-Shift) → Arrow `translate-x-1`
- `/d` References: `text-[10px]` → `text-[11px]`
- `/d` 3 Standalone-Links: `min-h-[44px] py-2`
- `/e` Timeline-Link: `min-h-[44px] py-2`
- `/e` Debug-Hint: `color-mix mist 70%` → full `mist` (4.19:1 → 7:1)
- `/e` Borders: `white/[0.08]` → `white/10`, `0.06` → `0.1`
- `/d` `dd-tl-track`: `overflow-x: clip` (100vw-Horizontal-Scroll-Gefahr)

### Priority 2 — Typografie
- `/d` References: `font-bold` auf Tile-Title + KPI (Telegraf 400 → 700)
- `/d` + `/e`: `tabular-nums` auf Spec-Values + KPIs
- `/c` References: `h3` `dc-ref-title` → `dc-chapter-title` + Clamp-Max 3.4rem → 2.6rem (h2/h3-Hierarchie)
- `/c` KPI: `tabular-nums`

### Priority 3 — Brand
- `/e` LogoGrid: „Trusted by" → „Vertraut von"
- `/e` Debug: „Press ESC to close" → „ESC zum Schließen"

### Priority 4 — Spacing-Rhythmus
- `/c` gap 0.55rem → 0.5rem, padding 0.6rem → 0.5rem
- `/d` padding 0.625rem → 0.5rem
- `/e` padding 0.875rem → 1rem, 0.35/0.55 → 0.5/0.5, 0.625 → 0.5, gap 0.375 → 0.5

### Zusatz
- `/e` `concept.css`: `:global(img)` Syntaxfehler entfernt (ungültig in globalen CSS-Dateien)

---

## Empfehlung

### Wenn ihr eine Richtung ausbaut, unsere Reihenfolge:

1. **`/c` Editorial Quiet** — Beste Balance aus Briefing-Treue („ruhig, reduziert, introvertiert, dezente Animationen") und eigenständigem Marken-Charakter. Stärkste Typo-POV, beste Kontrast-Werte, keine Techy-Effekte die stören. Skaliert am besten auf Unterseiten, weil das Editoriale-Prinzip auf jede Section anwendbar ist. Patina-Berlin-Inspiration passt zur Fenyx-Marke (Bestand, Aufbereitung, Wertschätzung).

2. **`/d` Architectural Quiet** — „Safe but elevated". Behält die grüne Lifecycle-Linie als Marken-DNA bei (Switch von rund → quadratisch, 1px). Nornorm × SpaceX gibt Struktur ohne Lautstärke. Gut für B2B-Trust-Signal. Wenn ihr euch nicht sicher seid, ist `/d` die risikoärmste Wahl.

3. **`/e` Signal Quiet** — Mutigste, techy-ste Variante. Easter-egg (Konami → Debug-Overlay) ist ein echtes Brand-Detail, kein Gimmick. Aber: dark-first ist ein starker Schritt weg von der aktuellen warmen Live-Seite. Passt wenn Fenyx sich als „Tech-Plattform" positionieren will, weniger wenn „Bestand & Aufbereitung" im Fokus steht.

### Nächste Schritte nach Richtungswahl
- Gewählte Richtung → Produktion `/` (nicht Preview-Route)
- Wiederverwendbare Module (Hero, Logo, Timeline, References) → `components/` (ohne `concepts/{richtung}/` Prefix)
- Bestandsmanagement-Detailseite in gewählter Richtung bauen
- Visuelle Produktion: Die generierten Konzept-Visuals sind Platzhalter — für Produktion echte Fotos der Fenyx-Teams/Möbel/Bestandsaufnahme verwenden (Briefing: „we do not have internal visuals right now")
- `/b` und `/c`–`/e` können nach Produktion entfernt werden

---

## Stack & Konventionen (alle 3 Routen)
- Tailwind-Tokens: `abyss`, `abyss-deep`, `signal`, `mist`, `mist-soft`, `black-gradient`
- Fonts: Roobert (Body), Telegraf (Display) via `var(--font-roobert)` / `var(--font-telegraf)`
- Eckige Ecken (kein `rounded`)
- CSS-Namespaces: `.dc-*` (`/c`), `.dd-*` (`/d`), `.de-*` (`/e`) in jeweils eigener `app/{route}/concept.css`
- Motion: CSS `animation-timeline: view()` mit `@supports`-Gate, IntersectionObserver-Fallback, `prefers-reduced-motion` überall respektiert
- Shared Chrome unangetastet: `Header`, `Footer`, `ClientTrackers`, `layout.tsx`, Analytics, Admin, Auth
- Daten: `getHomepageReferenceProjects()` (kein hardcoded Array)
- Build: `npm run build` grün für `/b /c /d /e`
