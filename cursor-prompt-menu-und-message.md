# Cursor-Prompt: „Über uns"-Menü-Position + HubSpot-Meldung Schriftgröße

Zwei kleine UI-Fixes.

## 1) HubSpot-Erfolgsmeldung: Schrift etwas größer
Die Dankesmeldung erscheint jetzt korrekt (Text ist identisch zum Original), nur die Schrift ist zu klein.

In `app/globals.css` beim bestehenden Styling der Meldung (`.hubspot-form .submitted-message` / `.hs-form__virtual-submit`) die `font-size` von `0.95rem` auf **`1.0625rem`** (17px) erhöhen und `line-height: 1.55`. Sonst nichts ändern — Kasten, Farben und Text bleiben wie sie sind.

## 2) „Über uns"-Mega-Menü: rechts unter dem Trigger statt links
Das „Über uns"-Panel (`config.layout === "simple"`, `alignEnd: true`) ist aktuell ein **100vw-breites** `position: fixed`-Panel; die schmale Inhaltsbox (18rem) klebt deshalb am **linken** Bildschirmrand. Es soll als **kompaktes Dropdown rechtsbündig direkt unter dem „Über uns"-Eintrag** erscheinen — so wie die anderen sauberen Dropdowns.

Die einfachen Panels werden in `components/Header.tsx` ohnehin **innerhalb** des jeweiligen `.mega-item` (das ist `position: relative`) gerendert, d.h. wir können das Simple-Panel absolut am Trigger ausrichten.

Umsetzung in `app/site-nav.css` — nur für das **simple** Panel (die großen Voll-Panels bleiben unverändert full-bleed):

```css
/* Simple-Dropdown: kompakt, rechtsbündig unter dem Trigger */
.mega-panel.mega-panel--simple {
  position: absolute;
  left: auto;
  right: 0;
  top: 100%;            /* direkt unter dem Menüpunkt */
  width: auto;
}

.mega-panel--simple .mega-panel-full--one {
  width: 17rem;
  margin-left: 0;       /* nicht mehr nötig */
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
}
```

**Wichtig – Inline-`top` überschreiben:** In `components/Header.tsx` wird dem Panel `panelStyle={{ top: panelTop }}` (Pixelwert für das fixed-Panel) inline mitgegeben. Für das Simple-Panel würde das die `top: 100%`-Regel kaputt machen. Bitte so lösen:
- In `Header.tsx` den Inline-`top` **nur für Voll-Panels** setzen, beim simplen Menü (`menu.layout === "simple"`) **kein** `top` übergeben (z.B. `panelStyle={menu.layout === "simple" ? undefined : { top: panelTop }}`).
- Falls die mobile-/Scroll-Logik dadurch stört: alternativ in der CSS-Regel `top: 100% !important;` setzen, damit der Inline-Wert überschrieben wird.

Ergebnis: Das „Über uns"-Dropdown (Team / Ratgeber / News & Medien) öffnet als schmale weiße Box bündig unter dem „Über uns"-Punkt, rechtsseitig, nicht mehr über die ganze Breite links.

## Abschluss
- Nur `app/globals.css`, `app/site-nav.css`, `components/Header.tsx` anfassen.
- Am Desktop prüfen: „Über uns" öffnet sauber rechts unter dem Trigger; die großen Menüs (Bestandsmanagement etc.) sehen unverändert aus; das Dropdown verschwindet sauber beim Verlassen.
- `tsc --noEmit` muss durchlaufen.
