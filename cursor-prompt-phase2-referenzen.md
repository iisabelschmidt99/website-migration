# Cursor-Prompt: Phase 2 – Referenzen-Sektion (Homepage) ans Original angleichen

Die Referenz-Sektion (`ReferenceProjectsSection` + `ReferenceScrollStack` + `CaseCard`) weicht stark vom Webflow-Original (`section_cases`) ab. Bitte 1:1 an die Original-Werte angleichen. Werte stammen aus dem Export-CSS.

## 1) Sektion: dunkler Verlauf statt weiß — `components/ReferenceProjectsSection.tsx`
- Sektions-Hintergrund von `bg-white` auf den Original-Verlauf umstellen:
  `background: linear-gradient(180deg, #0b171f, #020405);` (z.B. via inline-style oder Tailwind-Arbitrary `bg-[linear-gradient(180deg,#0b171f,#020405)]`).
- Überschrift (`h2`) und Beschreibung auf **helle** Schrift: `text-white` für die h2, Beschreibung `text-mist` (statt `text-black`).
- `wf-padding-section-large`, `wf-container-large`, `wf-padding-global`, zentrierter `wf-max-width-large`-Kopf bleiben unverändert.

## 2) Sticky-Scroll-Effekt entfernen → schlichter gestapelter Block
Das Original ist KEIN animierter Sticky-Stack, sondern eine einfache vertikale Karten-Liste (`cases_list` = Grid, Abstand 5rem).
- In `ReferenceProjectsSection.tsx` die `<ReferenceScrollStack ... />` ersetzen durch eine simple Liste:
  ```tsx
  <div className="flex flex-col gap-20">
    {projects.map((p) => <CaseCard key={p.href} {...p} />)}
  </div>
  ```
  (`gap-20` = 5rem wie im Original.)
- Die Datei `components/ReferenceScrollStack.tsx` wird damit nicht mehr gebraucht — Import entfernen; die Datei löschen oder ungenutzt lassen.
- In `app/globals.css` die jetzt ungenutzten `.ref-scroll-stack`, `.ref-scroll-item`, `.ref-scroll-card`-Regeln entfernen (Aufräumen). Die `.case-card--image-left .case-card-image { order: -1 }`-Regel für die alternierende Bildseite **behalten**.

## 3) Karten-Details — `components/CaseCard.tsx`
An die `cases_item`-Werte angleichen:
- **Karten-Hintergrund:** statt `bg-abyss-deep` → halbtransparent `rgba(16,34,46,0.4)` (Tailwind-Arbitrary `bg-[#10222e66]`).
- **Padding:** durchgehend `3rem` (Original `padding: 3rem`) → `p-12` (statt `p-8 lg:p-12`); auf Mobil darf es etwas kleiner sein, aber Desktop = 3rem.
- **Gap Content/Bild:** `lg:gap-20` (5rem) bleibt ✓.
- **Box-Shadow:** `0 2px 5rem rgba(2,4,5,0.2)` bleibt ✓ (Original auf dunklem Grund: #02040533).
- **Spalten:** Content-Links `max-width: 50%`, Bild-Wrapper `max-width: 50%` bleibt ✓.
- **Bild-Verhältnis** `aspect-[3/1.8]` bleibt ✓.

### Kennzahlen (`cases_key-metrics`) ans Original:
Original = 3-spaltiges Grid, gleichmäßig, mit **sehr kleinen** Labels (`font-size: .625rem` = 10px), Spaltenabstand 1.5rem, **ohne** Trennstriche und ohne übergroße Zahlen.
- Statt der aktuellen Flex-Lösung mit `border-r`-Trennstrichen und `text-2xl`: ein `grid grid-cols-3 gap-6`.
- Zahl (`stat.value`): moderat, z.B. `text-xl` font-heading, weiß.
- Label (`stat.label`): `text-[0.625rem]` leading-snug, mist.
- Die `border-t`-Linie über dem Kennzahlen-Block darf bleiben (dezent), aber die vertikalen Trennstriche zwischen den Spalten entfernen.

## 4) Eyebrow & Tag
- Eyebrow (`cases_eybrow`): `font-size .875rem`, `font-weight 700` → aktuelles `text-sm font-bold` passt ✓.
- Tag-Pill: dezent lassen; Original nutzt border-radius 0 global — die `rounded-2xl` am Tag entfernen (zu rund), stattdessen eckig oder ganz leicht.

## Abschluss
- Nur anfassen: `components/ReferenceProjectsSection.tsx`, `components/CaseCard.tsx`, `components/ReferenceScrollStack.tsx` (entfernen/aufräumen), `app/globals.css`.
- `tsc --noEmit` muss durchlaufen.
- Ergebnis: dunkle Verlaufs-Sektion mit weißer Überschrift, darunter ruhig gestapelte Karten (5rem Abstand, halbtransparenter Karten-Hintergrund, abwechselnd Bild links/rechts), kleine 3-spaltige Kennzahlen — wie im Original. Danach am Desktop mit der Original-Seite vergleichen.
