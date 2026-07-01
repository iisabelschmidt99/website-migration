# Cursor-Prompt: Redesign in 3 Varianten (Homepage + Bestandsmanagement)

Ziel: Strukturierter Designprozess in Cursor – **erst analysieren & denken, dann gestalten,
dann iterieren**. Ergebnis sind 3 unterschiedliche Designrichtungen für **Homepage** und die
**Leistungs-Detailseite Bestandsmanagement**, die du Artus vorstellst, plus ein abgeleitetes
Design-System.

Technische Umsetzung: jede Variante als **eigene Route** unter `app/design/v1`, `v2`, `v3`
(parallel im selben Branch, einfach per `localhost` vergleichbar). Bestehende Seiten bleiben
unangetastet. `.cursorrules` (Tokens, Fonts, Konventionen) gelten weiter.

---

## TEIL 1 — Master-Prompt (in Cursor Chat, Plan Mode / Ask-Modus)

> Kopiere den folgenden Block in Cursor. Starte ihn im **Plan-/Ask-Modus mit Opus**, nicht im
> Agent-Modus – in dieser Phase soll Cursor **denken und fragen, nicht coden**.

```text
Du bist ein Senior Product Designer mit gutem Auge für moderne, conversion-starke Websites.
Wir arbeiten am Redesign von fenyx-next (Next.js App Router + Tailwind). Lies zuerst
.cursorrules sowie app/page.tsx, app/layout.tsx, app/globals.css und die bestehenden
Komponenten in components/ (insb. HomeHeroVideo, LifecycleSection, LogoGrid,
ReferenceProjectsSection, ContactSection, CtaButton, Header, Footer). Lies außerdem die
Leistungsseite unter app/bestandsmanagement/ inkl. ihrer Komponenten.

WICHTIG ZUM ABLAUF:
- Bleib in dieser ersten Phase im DENK-Modus. Schreibe NOCH KEINEN Code, ändere keine Dateien.
- Arbeite die Schritte 1–2 vollständig ab und WARTE nach jedem Schritt auf meine Antwort,
  bevor du weitergehst. Stelle pro Schritt nur die nötigsten Rückfragen (max. 3–4).

KONTEXT FENYX:
- Fenyx macht nachhaltige Bürotransformationen aus einer Hand: digitales Bestandsmanagement,
  Verwertung (Büroauflösung, Mitarbeiterverkauf, Aufbereitung, Spende) und schlüsselfertige
  Einrichtung. Zielgruppen: Großunternehmen, Mittelstand, Start-ups/Scale-ups, Co-Working.
- Aktuelle Designsprache (.cursorrules): dunkles Theme (abyss #132735 / abyss-deep #0b171f),
  Neongrün-Akzent "signal" #c8ff00, eckige Ecken (border-radius 0), enge Headlines
  (tracking-fenyx), Fonts Roobert (Body) + Telegraf (Headings, font-weight 700).

DESIGN-HALTUNG (leitend für ALLE Schritte):
- Deutlich SIMPLER und RUHIGER als bisher. Weniger Elemente pro Section, mehr Whitespace,
  klare Hierarchie. Nicht aufgewühlt, nicht überladen, kein "voll-gelabert".
- Aber NICHT flach und langweilig. Ruhig UND interessant. Das Leitbild: die introvertierte
  Person, die wenig sagt, aber dafür sehr pointierte, interessante kurze Aussagen trifft –
  nicht der Extrovertierte, der dich zutextet. Wenige, starke Statements statt viel Text.
- Bisher wirkt es classy/professionell – das bleibt die Basis, aber etwas EMOTIONALER und
  interessanter. Ein bisschen mehr "techy" und mutig: ein paar coolere, eigenständige
  Designelemente erlaubt (das DARF die Marke leicht weiterentwickeln), solange es ruhig bleibt.
- Bewegung als Stilmittel statt Deko: dezente, hochwertige Scroll-/Reveal-Animationen
  (Text/Sections blenden beim Scrollen sanft ein, leichter Versatz/Stagger). Genau das macht
  "ruhig, aber lebendig". Keine zappeligen, lauten oder dauerhaften Animationen.
  Technisch sparsam (CSS/IntersectionObserver oder eine schlanke Lib), prefers-reduced-motion
  respektieren, Server-Komponenten-Prinzip aus .cursorrules wahren.

SCHRITT 1 — INSPIRATION AUSWERTEN
Analysiere diese fünf Referenzseiten und unsere bestehende Seite als Ausgangspunkt:
  - https://ailsa.io/
  - https://augustus.com/
  - https://nornorm.com/de
  - https://patinaberlin.de/
  - https://concular.de/
  - Bestehend: unsere aktuelle fenyx-next Homepage + Bestandsmanagement-Seite
Beschreibe je Seite kompakt: Hero-Logik & erstes Versprechen, Layout-Raster & Rhythmus,
Typo-Hierarchie, Farb-/Kontraststrategie, Komponentensprache (Cards, Buttons, Navigation),
Scroll-/Motion-Dramaturgie, Bildsprache, und wie die Seite zur Conversion führt.
Dann: GEMEINSAMKEITEN (welche Muster tauchen mehrfach auf und warum funktionieren sie),
UNTERSCHIEDE (wo divergieren sie und welcher Trade-off steckt dahinter), und 5–7 konkrete
"Klau-würdige" Prinzipien, die zu Fenyx (nachhaltig, B2B, technisch-präzise) passen –
und welche bewusst NICHT.
Hinweis: Falls du eine der URLs nicht laden kannst, sag es klar und arbeite mit den anderen
weiter, statt zu raten.

SCHRITT 2 — RICHTUNG KLÄREN (Fragen an mich)
Bevor du Designrichtungen entwickelst, stelle mir gezielte Fragen, um zu schärfen:
  - Stilrichtung / Markenhaltung (z.B. technisch-nüchtern vs. editorial-warm vs. bold-laut)
  - Branding-Spielraum (bleiben Tokens/Fonts fix, oder darf eine Variante bewusst brechen?)
  - Primäres Conversion-Ziel der Homepage (Kontakt/Lead? Angebot anfragen? Vertrauen aufbauen?)
  - Primäre Zielgruppe, die diese Variante anspricht
  - Erfolgskriterium für die Artus-Präsentation (was muss die Vorstellung leisten?)
  - Prioritäten/No-Gos (was darf auf keinen Fall verloren gehen?)
Fasse meine Antworten danach als kurzes "Design-Brief" zusammen und lass es mich bestätigen.

WARTE hier auf meine Bestätigung des Briefs, bevor du zu Schritt 3 gehst.

SCHRITT 3 — DREI DESIGNRICHTUNGEN (weiterhin als Konzept, noch kein Code)
Entwickle auf Basis von Analyse + Brief DREI klar unterschiedliche Richtungen für Homepage
UND Bestandsmanagement-Seite. Alle drei MÜSSEN der Design-Haltung folgen (simpel, ruhig,
interessant statt laut; introvertiert-pointiert; dezente Reveal-Animationen) – sie
unterscheiden sich im GRAD von emotional/techy-mutig, nicht darin, ob es ruhig ist. Die drei
dürfen nicht "dasselbe in anders" sein, sondern echte strategische Hypothesen mit
unterschiedlichem Schwerpunkt (z.B. A "ruhig & vertrauensbildend, Proof-first",
B "editorial & emotional, Story-first", C "techy & mutig, eigenständige Designelemente").
Pro Richtung liefere:
  - Name + 1-Satz-These (welche Wette geht diese Richtung ein?)
  - Layout & Hierarchie: Section-Reihenfolge der Homepage, Hero-Logik, Raster, Rhythmus
  - Look & Feel: Umgang mit Dark/Light, Akzentfarbe, Typo-Skalierung, Dichte (möglichst luftig)
  - Motion-Konzept: welche Reveal-/Scroll-Animationen, wo und warum – dezent & hochwertig
  - Komponentenlogik: welche bestehenden Komponenten bleiben, was wird neu, was fällt weg
  - Übertragung auf die Bestandsmanagement-Seite (wie wirkt die These auf einer Detailseite)
  - Strategische Begründung: für welches Conversion-Ziel/Zielgruppe ist sie am stärksten,
    plus ehrlicher Trade-off/Risiko
Schließe mit einer Empfehlung, welche Richtung du wofür wählen würdest – und warum.

WARTE auf meine Wahl, bevor du Schritt 4 startest.

SCHRITT 4 — GEWÄHLTE RICHTUNG ITERIEREN
Für die von mir gewählte Richtung:
  - Benenne Stärken und Schwächen schonungslos.
  - Schlage konkrete Verbesserungen vor (Hierarchie, Spacing, Typo-Kontrast, CTA-Platzierung,
    Section-Fluss, Vereinfachungen). Priorisiere nach Wirkung.
  - Erst NACH meinem OK: setze diese Richtung als echte Routen um – app/design/v1, v2, v3 für
    die jeweils ausgewählten/iterierten Versionen, plus die Bestandsmanagement-Variante.
    Halte dich strikt an .cursorrules (Tokens statt Hex, font-heading/font-sans, eckige Ecken,
    Server-Komponenten als Standard, next/image, next/link, deutsche Texte/Kommentare).
    Inhalte/Bilder 1:1 aus bestehender Seite bzw. _reference/ übernehmen, nichts erfinden.
  - Iteriere danach in kleinen Schritten gegen localhost (npm run dev) und vergleiche.

SCHRITT 5 — DESIGN-SYSTEM / STYLE-RULES ABLEITEN
Wenn die Richtung steht, leite ein Dokument design-system.md (im Projekt-Root) ab:
  - Visuelle Prinzipien (3–5 Leitsätze, die jede Designentscheidung begründen)
  - Typografie-Logik: konkrete Skala, Zeilenhöhen, tracking, Einsatz Telegraf vs. Roobert
  - Color-Logik: Rolle jeder Token-Farbe, Kontrast-/Akzentregeln, Dark/Light-Einsatz
  - Spacing-/Layout-Logik: Raster, Section-Rhythmus, Container-Breiten, Whitespace-Regeln
  - Komponentenregeln: Buttons, Cards, Navigation, Hero, CTA – Zustände & Wann-was
  - Motion-Prinzipien (dezent, zweckgebunden)
  - Konsistenz-Guidelines für den weiteren Build + Do/Don't-Beispiele
Formuliere es so, dass es als Ergänzung zu .cursorrules taugt und spätere Seiten konsistent macht.
```

---

## TEIL 2 — Empfohlenes Schritt-für-Schritt-Vorgehen mit Cursor

So gehst du praktisch durch den Prozess – die Phasentrennung ist der Trick, damit Cursor nicht
vorschnell drauflos codet.

**0. Vorbereitung (2 Min).** Neuen Cursor-Chat öffnen, Modell auf **Opus** stellen, **Plan-/
Ask-Modus** wählen (kein Agent/Write). So kann Cursor nur lesen und denken, nicht schreiben.
Stelle sicher, dass `.cursorrules` im Projekt liegt (tut es) – die werden automatisch
mitgelesen.

**1. Analyse anstoßen.** Master-Prompt einfügen. Cursor liest Code + Referenzseiten und liefert
Schritt 1 (Inspirations-Analyse). Lies kritisch gegen: Stimmen die erkannten Muster mit deinem
Bauchgefühl überein? Ergänze, wenn dir an einer Referenz etwas Bestimmtes gefällt, das Cursor
übersehen hat.

**2. Brief schärfen.** Beantworte die Fragen aus Schritt 2 knapp. Tipp für die Artus-Präsi:
sag hier klar, was die Vorstellung leisten soll (z.B. "Artus soll zwischen 3 klar
unterscheidbaren Stoßrichtungen entscheiden können"). Lass dir den Brief bestätigen.

**3. Drei Richtungen bewerten.** Cursor liefert die 3 Konzepte. Bewerte sie noch **ohne Code** –
auf Konzeptebene siehst du Denkfehler schneller. Frag nach, wenn zwei zu ähnlich wirken
("mach B mutiger anders als A"). Wähle dann eine (oder einen Mix) für den Bau aus.

**4. Erst iterieren, dann bauen.** Lass Cursor Stärken/Schwächen + Verbesserungen der gewählten
Richtung formulieren. Erst wenn das Konzept sitzt: **auf Agent-/Write-Modus wechseln** und die
Routen `app/design/v1` (+ ggf. v2/v3) bauen lassen. Für den ersten Strukturaufbau einer Seite
Opus, danach für Feinschliff ein schnelleres Modell (Composer/Sonnet) – wie in deinen
`.cursorrules` empfohlen.

**5. Gegen localhost iterieren.** `npm run dev`, Variante im Browser ansehen, gezielt
nachschärfen ("Hero zu gedrängt – mehr Luft, CTA höher"). Mach kleine Commits pro Variante,
damit du jederzeit zurück kannst.

**6. Für Artus aufbereiten.** Wenn 2–3 Varianten stehen, alle als Routen parallel zeigen
(`/design/v1`, `/v2`, `/v3`) – nebeneinander im Browser durchklicken ist überzeugender als
Screenshots. Optional: kurze 1-Slide-Begründung je Variante (These + Trade-off) aus Schritt 3.

**7. Design-System sichern.** Nach Entscheidung Schritt 5 laufen lassen → `design-system.md`.
Das wird dein Anker, damit alle restlichen Migrations-Seiten konsistent bleiben.

**Faustregeln:** Pro Phase auf Antwort warten lassen. Nie "die ganze Site auf einmal". Wenn
Cursor zu früh codet → "Stopp, bleib im Konzept, kein Code bis ich OK gebe." Immer Tokens statt
Hex-Werte verlangen.

---

## TEIL 3 — Kurzversion (direkt in Cursor einfügbar)

> Wenn du es schlank willst – dieser Block reicht, um den Prozess zu starten.

```text
Rolle: Senior Product Designer, gutes Auge für moderne conversion-starke Websites.
Projekt: fenyx-next (Next.js App Router + Tailwind). Lies zuerst .cursorrules, app/page.tsx,
app/layout.tsx und components/, dazu app/bestandsmanagement/. BLEIB IM DENK-MODUS, kein Code,
bis ich OK gebe. Warte nach jedem Schritt auf meine Antwort.

DESIGN-HALTUNG (gilt überall): deutlich simpler & ruhiger, nicht aufgewühlt/überladen, viel
Whitespace, wenige starke Statements statt viel Text – wie eine introvertierte Person, die
kurz und pointiert spricht, nicht der Extrovertierte, der zutextet. Classy/professionell als
Basis, aber etwas emotionaler und ein bisschen techy/mutig (ein paar coolere, eigenständige
Designelemente erlaubt). Ruhig, aber nicht flach: dezente, hochwertige Reveal-/Scroll-
Animationen (Text/Sections sanft eingeblendet, leichter Stagger), prefers-reduced-motion
respektieren. Bewegung als Stilmittel, nie als laute Deko.

1) Analysiere als Inspiration ailsa.io, augustus.com, nornorm.com/de, patinaberlin.de,
   concular.de + unsere bestehende Seite. Pro Seite: Hero, Layout/Raster, Typo, Farbe,
   Komponenten, Motion, Conversion-Logik. Dann Gemeinsamkeiten, Unterschiede und 5–7
   übertragbare Prinzipien für Fenyx (nachhaltig, B2B, technisch-präzise).
2) Stell mir Fragen zu Stilrichtung, Branding-Spielraum, Conversion-Ziel, Zielgruppe und
   Prioritäten. Fasse als kurzen Design-Brief zusammen, lass ihn bestätigen.
3) Entwickle 3 klar unterschiedliche Designrichtungen für Homepage + Bestandsmanagement,
   je mit These, Layout/Hierarchie, Look&Feel, Motion-Konzept, Komponentenlogik,
   strategischer Begründung und Trade-off. Alle drei folgen der Design-Haltung (ruhig &
   interessant), sie unterscheiden sich nur im Grad von emotional/techy. Gib eine Empfehlung.
4) Für die von mir gewählte Richtung: Stärken/Schwächen + konkrete Verbesserungen. Erst nach
   meinem OK als echte Routen bauen: app/design/v1, v2, v3 (strikt nach .cursorrules: Tokens
   statt Hex, font-heading/font-sans, eckige Ecken, Server-Komponenten, deutsche Texte;
   Inhalte 1:1 aus Bestand/_reference). Dann gegen localhost iterieren.
5) Wenn die Richtung steht: leite design-system.md ab (visuelle Prinzipien inkl. "ruhig &
   interessant", Typo-, Color-, Spacing-Logik, Komponentenregeln, Motion-/Reveal-Regeln,
   Konsistenz-Guidelines) als Ergänzung zu .cursorrules.
```
