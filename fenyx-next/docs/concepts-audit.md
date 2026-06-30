# Fenyx /concepts — Audit & Empfehlung v2

4 Homepage-Konzepte als Vorschau-Routen `/c`, `/d`, `/e`, `/f`. Vergleich inkl. Live-Seite `/` und V3-Vorschau `/b` als Baseline.

Branch: `feat/homepage-v3-preview-b`. Alle Routen `noindex`. Build grün für `/b /c /d /e /f`.

---

## Baseline: `/` (Live) und `/b` (V3-Vorschau)

### `/` — Live-Startseite
- **Stack:** Video-Hero → 14-Spalten-LogoGrid → LifecycleSection (grüne SVG-Linie, 3 Karten, Mitte-Box) → PressMarquee → ReferenceProjectsSection → ContactSection
- **Wirkung:** Bewährt, funktional, visuell viel auf einmal. Mitte-Box bricht Timeline-Story. Generische SaaS-Card-Soup bei Referenzen.
- **AI-slop-Risiko:** Niedrig (echte Fotos), aber keine starke Typo-POV.

### `/b` — V3 „Signal" (Duplicate-Repo)
- **Stack:** Canvas-Wireframe-Hero → KPI-Switcher → 3× ServiceSection (SpaceX-spec) → PressRow → ImpactStrip (hardcoded) → ContactSection
- **Wirkung:** Techy & mutig, aber laut. Canvas-Hero ist Effekt-Spiel. Entspricht nicht „ruhig & reduziert".
- **AI-slop-Risiko:** Mittel.

---

## 4 Konzepte im Vergleich

| Dimension | `/c` Editorial Quiet | `/d` Cinematic Sequence | `/e` Editorial Premium | `/f` Architectural POV |
|---|---|---|---|---|
| **Status** | Alt-Entwurf (stehen gelassen) | NEU Rework | NEU Rework | NEU |
| **Inspiration** | Patina × Nornorm | **SpaceX-dominant** | **Patina-dominant** + Nornorm-POV | **Nornorm-dominant** + Augustus + SpaceX-spec |
| **Farbe** | Warmes Papier (off-brand) | `abyss-deep` dark-first, signal accent | `mist-soft` light + `abyss` ink + signal accent | Alternating `abyss` / `mist-soft` / `abyss-deep` |
| **POV-Headline** | „Nachhaltige Bürotransformationen aus einer Hand." (beschreibend) | **„Was schon da ist, ist nicht fertig."** | **„Möbel sind kein Inventar. Sie sind eine Haltung."** | **„Büromöbel sind keine Ausgabe. Sie sind eine Entscheidung."** |
| **Hero** | Oversized Telegraf auf Papier-Textur | Full-viewport cinematic, blur-to-sharp BG, word-by-word headline, scroll-progress line | Magazine-Spread: Typo links, skulpturaler Stuhl als Subjekt rechts | Split: Architektur-Bild links, numbered POV-Typo rechts |
| **Logo-Grid** | 5-6 Logos groß, kuratiert | 6-Cell Museumswand auf abyss, signal-hover-tint | 6-Cell Museumswand auf mist-soft, grayscale→color | 7-Spalten auf abyss, hover-reveal Company-Caption |
| **Timeline** | 3 chapters, römische Zahlen, single-column | **3 full-viewport cineastic chapters mit scroll-driven crossfades** | 3 magazine-spread chapters, 4:5 portrait photography, römische Zahlen | 3 numbered chapters, alternating bg, **scroll-linked spec-fill (signal underline wächst 0→100% pro row, gestaffelt)** |
| **Referenzen** | Editorial-Stack, 1 KPI groß | Cineastic single-column, Pull-Quotes, 1 KPI, 16:11 photography | Editorial stack, 4:5 portrait, Pull-Quotes, signal-outline KPI | **Bento-Grid** mit varying tile sizes (big/wide/tall), 1 KPI pro Kachel |
| **Animation-Craft** | Baseline fade+stagger | **ALL-OUT:** word-by-word mask reveals, blur-to-sharp, scroll-driven section crossfades, scroll-progress | **ALL-OUT:** word-by-word mask reveals, scroll-linked image scale, staggered reveals | **ALL-OUT:** word-by-word mask reveals, scroll-linked spec-fill, staggered reveals, hover scale |
| **Wow-Moment** | Roman numerals (nicht wow) | **Scroll-driven Section-Crossfades** — jede Section ist cineastischer Moment der in den nächsten fade-t | **Mask-reveal Headlines + Fotografie-als-Subjekt** Komposition | **Scroll-linked spec-fill** + POV-Headline + numbered sections |
| **Marken-Treue** | Niedrig (off-brand Papier) | Hoch (abyss+signal) | Hoch (mist-soft+abyss+signal) | Hoch (alternating brand tokens) |
| **Photorealistic Visuals** | Abstract (alt) | **Ja** — cineastic office blue-hour, hands-on-tablet, re-furnished golden hour | **Ja** — skulpturaler Stuhl, Notizbuch-Overhead, Desk-Ensemble | **Ja** — architektonisches Büro, exploded Möbel-System, modulare Wand |
| **AI-slop-Risiko** | Mittel (abstract) | Niedrig (cinematic POV) | Niedrig (editorial POV) | Niedrig (architectural POV) |

---

## Animation-Craft — was ALL-OUT bedeutet (alle 3 neuen)

### Word-by-word Mask-Reveal
Headlines splitten in Wörter. Jedes Wort gewrappt in `<span class="dX-word"><span class="dX-word__inner">wort</span></span>`. Inner translates `translateY(110%) → 0` mit `overflow: hidden` outer. Stagger 55ms pro Wort. Easing `cubic-bezier(0.22, 1, 0.36, 1)` (premium, smooth). Duration 900ms.

### CSS Scroll-Driven (`animation-timeline: view()`)
Alle Reveals nutzen nativ CSS scroll-driven animations wo unterstützt (Chrome 115+, Safari 17.4+). `@supports`-Gate: Browser ohne Support bekommen IntersectionObserver-Fallback mit `.is-visible`-Klasse. Beide Render-Pfade identisch.

### `/d`-spezifisch: Scroll-driven Section-Crossfades
Timeline-Kapitel sind `min-h-screen`. BG + Content haben jeweils `animation-timeline: view()` mit `animation-range: cover 0% cover 100%`. BG faded `0 → 1 → 1 → 0` über scroll range, Content `0 → 1 → 1 → 0` mit translate-y. Resultat: Kapitel crossfaden ineinander wie SpaceX mission sequence.

### `/d`-spezifisch: Blur-to-Sharp
Hero + Timeline-BGs starten mit `filter: blur(14px)` + `scale(1.08)` + `opacity: 0`. Animieren zu `blur(0) scale(1) opacity: 1` über 1.4s. GPU-cost bewusst akzeptiert für cineastisches Premium-Feeling auf wenigen Schlüssel-Images.

### `/d`-spezifisch: Scroll-Progress Line
1px signal-Farb-Linie am Hero-Bottom. `animation-timeline: scroll()` mit `animation-range: root 0% root 100%` lässt sie `scaleX(0) → scaleX(1)` wachsen über gesamten Page-Scroll.

### `/e`-spezifisch: Scroll-linked Image Scale
Bilder starten `scale(1.06) opacity: 0`, animieren zu `scale(1) opacity: 1` über 1.4s via `animation-timeline: view()`. Photography-als-Subjekt bleibt ruhig, kein Blur (bright editorial).

### `/f`-spezifisch: Scroll-linked Spec-Fill (Wow-Moment)
Pro Spec-Value wächst eine 1px signal-Unterline von `width: 0 → 100%` beim Scrollen. `animation-timeline: view()` mit `animation-range: entry 15% entry 85%`. `animation-delay: calc(var(--df-i) * 80ms)` staffelt pro Spec-Row. Resultat: Spec-Table „füllt sich" mit Signal-Underlines beim Scrollen — SpaceX-Engineering-Feel.

### `prefers-reduced-motion`
Alle Animationen haben `@media (prefers-reduced-motion: reduce)` Block der alles auf `animation: none; transition: none; transform: none; opacity: 1` setzt. Inhalte sofort sichtbar.

---

## Marken-Treue

Alle 3 neuen Routen (`/d /e /f`) bleiben in Fenyx-Markenfarben:
- `abyss` #132735, `abyss-deep` #0b171f
- `signal` #c8ff00
- `mist` #8da4ba, `mist-soft` #dceaf5
- `black-gradient` #020405

Keine neuen Hex-Werte, keine off-brand Paletten (Gegensatz zu alt-`/c` mit warmem Papier).

Fonts: Telegraf (`font-heading`) für Display, Roobert (`font-sans`) für Body. Keine Google-CDN-Imports, keine Inter/Roboto/Space Grotesk.

---

## Empfehlung

### Reihenfolge nach Briefing-Treue + Wow-Faktor:

1. **`/d` Cinematic Sequence** — Stärkste Umsetzung des Briefings: dunkel, cineastisch, SpaceX-Narrative mit scroll-driven Crossfades als Wow-Moment. POV-Headline „Was schon da ist, ist nicht fertig." ist marken-trächtig. Premium-Feeling durch Blur-to-Sharp + Word-Reveals. **Empfehlung für Haupt-Richtung.**

2. **`/f` Architectural POV** — Strong POV-Headline + Nornorm-Numbering + SpaceX-spec-fill als Wow-Moment. Alternating abyss/mist-soft gibt Struktur-Rhythmus. Bento-Referenzen sind可信lich mit echten Photos. **Empfehlung für Alternative wenn /d zu dunkel.**

3. **`/e` Editorial Premium** — Patina-Magazine-Spread mit Fotografie-als-Subjekt. Helles mist-soft Kontrast zu /d. Mask-Reveal Headlines elegant. **Empfehlung für dritte Option wenn Licht gewünscht.**

4. **`/c` Editorial Quiet** — Stehen gelassen per Request. Warmes Papier ist off-brand — nur als Referenz-Exploration behalten.

### Was die neuen vs alten Konzepte besser machen
- **POV-Headlines** statt Beschreibung (Nornorm-Lektion umgesetzt)
- **Photorealistic Visuals** statt abstract (Briefing-Weckruf umgesetzt)
- **ALL-OUT Animation-Craft** mit word-by-word mask reveals, scroll-driven crossfades, scroll-linked spec-fill — nicht nur baseline fade+stagger
- **Marken-Treue** — abyss/signal/mist statt off-brand Papier
- **Wow-Momente** pro Richtung identifiziert und umgesetzt (nicht viele kleine Effekte)
- **Echte Reworks** der wiederkehrenden Module (Hero, Logo, Timeline, Referenzen) — nicht Umsortierung wie alt-`/d`

### Nächste Schritte nach Richtungswahl
- Gewählte Richtung → Produktion `/` (nicht Preview-Route)
- Wiederverwendbare Module → `components/` (ohne `concepts/{richtung}/` Prefix)
- Bestandsmanagement-Detailseite in gewählter Richtung bauen
- Visuelle Produktion: photorealistic Generierungen ersetzen durch echte Fenyx-Fotos (Teams, Möbel, Bestandsaufnahme)
- `/b /c /d /e /f` können nach Produktion entfernt werden

---

## Stack & Konventionen (alle 4 Konzepte)
- Tailwind-Tokens: `abyss`, `abyss-deep`, `signal`, `mist`, `mist-soft`, `black-gradient`
- Fonts: Roobert (Body), Telegraf (Display) via `var(--font-roobert)` / `var(--font-telegraf)`
- Eckige Ecken (kein `rounded`)
- CSS-Namespaces: `.dc-*` (`/c`), `.dd-*` (`/d`), `.de-*` (`/e`), `.df-*` (`/f`) in jeweils eigener `app/{route}/concept.css`
- Motion: CSS `animation-timeline: view()` / `scroll()` mit `@supports`-Gate, IntersectionObserver-Fallback, `prefers-reduced-motion` überall respektiert
- Shared Chrome unangetastet: `Header`, `Footer`, `ClientTrackers`, `layout.tsx`, Analytics, Admin, Auth
- Daten: `getHomepageReferenceProjects()` (kein hardcoded Array)
- Build: `npm run build` grün für `/b /c /d /e /f`
- Dev: `npm run dev` → http://localhost:3000/{c,d,e,f}
