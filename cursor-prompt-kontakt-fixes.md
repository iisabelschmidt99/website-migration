# Cursor-Prompt: Kontakt-Section – Erfolgsmeldung & Portrait-Crop fixen

Zwei kleine Fehler in der Kontakt-Section (Homepage `ContactSection` und Leistungsseiten `ServiceContactSection`):

## 1) HubSpot-Erfolgsmeldung sichtbar machen
Nach dem Absenden zeigt HubSpot bereits seine Inline-Dankesnachricht („Danke! Wir haben Ihre Anfrage erhalten …"), aber sie ist **unsichtbar**, weil dunkle Standard-Schrift auf dunklem Hintergrund steht und kein Styling existiert.

In `app/globals.css` ein Styling für die HubSpot-Erfolgsmeldung ergänzen (Container-Klasse `.submitted-message`, je nach HubSpot auch `.hs-form__virtual-submit` / `.hbspt-form .submitted-message`). Optik wie im Wunsch-Screenshot: dezenter Kasten, dunkler Panel-Hintergrund, feine Border, **helle Schrift**, Innenabstand, volle Breite. Konkret z.B.:

```css
.hubspot-form .submitted-message,
.hubspot-form .hs-form__virtual-submit {
  display: block;
  padding: 1.25rem 1.5rem;
  background-color: #132735;            /* abyss */
  border: 1px solid rgba(255,255,255,0.12);
  color: #dceaf5;                        /* mist-soft */
  font-size: 0.95rem;
  line-height: 1.5;
}
.hubspot-form .submitted-message a { color: #c8ff00; }
```

Bitte prüfen, ob die HubSpot-Form-Einstellung auf **„Inline-Dankesnachricht anzeigen"** steht (nicht Weiterleitung) — sonst greift das Styling nicht. Falls die echte Klasse abweicht, im Browser-DOM nach dem Absenden die tatsächliche Container-Klasse der Meldung prüfen und exakt diese stylen.

## 2) Portrait nicht mehr oben anschneiden
Das Bild von Anina wird am oberen Rand (Kopf) abgeschnitten, weil es mit `object-center` zentriert ist, der Container aber höher streckt.

In **beiden** Komponenten (`components/ContactSection.tsx` und `components/ServiceContactSection.tsx`) am Portrait-`<Image>` die Klasse `object-center` auf `object-top` ändern (bzw. `object-position: top`). Das hält Gesicht/Kopf im Bild; die Bildunterschrift sitzt ohnehin unten.

Falls weiterhin zu eng: in `app/globals.css` bei `.service-contact__portrait` (Desktop-Breakpoint, aktuell `aspect-ratio: 2.5 / 3`) testweise etwas höher erlauben oder `object-fit: cover; object-position: center 20%`, sodass der Kopf vollständig sichtbar ist.

## Abschluss
- Nur `app/globals.css`, `components/ContactSection.tsx`, `components/ServiceContactSection.tsx` anfassen.
- `tsc --noEmit` muss durchlaufen. Nach dem Build einmal Formular absenden und prüfen, dass die Dankesmeldung sichtbar ist und das Portrait nicht mehr angeschnitten wirkt.
