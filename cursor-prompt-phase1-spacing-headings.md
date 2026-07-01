# Cursor-Prompt: Phase 1 – Heading-Skala & Sektions-Spacing aufs Original bringen

Ziel: Typo-Skala und Sektions-Rhythmus exakt an die Webflow-Vorlage angleichen. Alle Werte unten stammen 1:1 aus dem Original-CSS (`heading-style-*`, `padding-section-*`). **Keine** Komponenten-Logik oder -Struktur ändern, nur Größen/Abstände. Danach `tsc --noEmit`.

## A) Heading-Skala korrigieren — `app/webflow-layout.css`
Die `wf-heading-*`-Klassen sind aktuell zu klein. Auf diese Werte setzen (font-family/font-weight bleiben):

| Klasse | font-size | line-height | Hinweis |
|---|---|---|---|
| `.wf-heading-h1` | 4rem | 1.1 | unverändert |
| `.wf-heading-h2` | **3.2rem** | 1.2 | **`letter-spacing` entfernen** (das -0.01em raus) |
| `.wf-heading-h3` | **2.4rem** | 1.2 | |
| `.wf-heading-h4` | **2.2rem** | 1.4 | |
| `.wf-heading-h5` | **1.3rem** | 1.5 | |
| `.wf-heading-h6` | **1.125rem** | 1.5 | |

Responsive Overrides an das Original anpassen (bestehende `@media`-Blöcke in der Datei korrigieren):

- `@media (max-width: 767px)`: `h1 → 2.5rem`, `h3 → 1.5rem`, `h4 → 1rem`. **`h2` NICHT** auf 2rem setzen — h2 bleibt hier 3.2rem.
- Neuen Block `@media (max-width: 479px)`: `.wf-heading-h2 { font-size: 1.8rem; }`.
- (h5/h6 haben keine responsiven Overrides im Original.)

## B) Fehlende Spacing-Klassen ergänzen — `app/webflow-layout.css`
Es gibt bisher nur `wf-padding-section-large`. Ergänze (Original-Werte inkl. Breakpoints):

```css
.wf-padding-section-medium {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
.wf-padding-section-small {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

@media (max-width: 991px) {
  .wf-padding-section-medium { padding-top: 4rem; padding-bottom: 4rem; }
}
@media (max-width: 767px) {
  .wf-padding-section-medium { padding-top: 3rem; padding-bottom: 3rem; }
  .wf-padding-section-small  { padding-top: 2rem; padding-bottom: 2rem; }
}
```

(`wf-padding-section-large` = 10/8 → 6/6 → 4/4 ist bereits korrekt, nicht anfassen.)

## C) Tailwind-Tokens angleichen — `tailwind.config.ts`
Die `fontSize`-Tokens spiegeln die alten zu kleinen Werte (eine Seite nutzt `text-h2`). Auf dieselben Werte bringen: `h2: 3.2rem/1.2` (**ohne** letterSpacing -0.01em), `h3: 2.4rem/1.2`, `h4: 2.2rem/1.4`, `h5: 1.3rem/1.5`, `h6: 1.125rem/1.5`. `h1: 4rem/1.1` bleibt.

## D) Sektions-Padding vereinheitlichen (Homepage)
Im Original nutzt jede Sektion das `padding-section`-System. Diese drei Komponenten nutzen aktuell willkürliche `py-*`-Werte → auf die zur Original-Sektion passende Klasse umstellen (die horizontale `wf-padding-global` / Container-Struktur bleibt unverändert):

| Komponente | aktuell | → ersetzen durch | (Original-Sektion) |
|---|---|---|---|
| `components/LogoGrid.tsx` | `py-20 sm:py-28` | `wf-padding-section-large` | section_logo |
| `components/LifecycleSection.tsx` | `py-20 sm:py-28` | `wf-padding-section-medium` | section_timeline |
| `components/PressMarquee.tsx` | `py-16 sm:py-20` | `wf-padding-section-small` | section_banner |

(`ReferenceProjectsSection` und `ContactSection` nutzen bereits `wf-padding-section-large` — korrekt, nicht ändern.)

Wichtig: Beim Ersetzen die vertikalen `py-/pt-/pb-`-Utilities entfernen und durch die `wf-padding-section-*`-Klasse ersetzen; vorhandene horizontale/Flex-/Grid-Klassen unangetastet lassen.

## Abschluss
- Nur anfassen: `app/webflow-layout.css`, `tailwind.config.ts`, `components/LogoGrid.tsx`, `components/LifecycleSection.tsx`, `components/PressMarquee.tsx`.
- `tsc --noEmit` muss durchlaufen.
- Danach Homepage am Desktop ansehen: Überschriften deutlich größer (h2 = 3,2rem), und die Sektionen folgen dem gleichmäßigen Rhythmus (Logo groß, Timeline mittel, „Bekannt aus" schmal, Cases/Kontakt groß).
