# Cursor-Prompt: Kundenstimmen öffentlich anbinden (wie im Original)

Im Webflow-Original ist „Kundenstimmen" eine wiederverwendbare **Slider-Sektion** mit der Überschrift **„Erfahrungen mit Fenyx."**, die auf mehreren Leistungs-/Landingpages eingebunden ist und je Seite **nach Kategorie gefiltert** wird (Feld `Kategorie` der Kundenstimme). Baue das nach demselben Muster wie die anderen Supabase-Anbindungen (`lib/references.ts`/`lib/blog.ts`), Tabelle `testimonials` ist befüllt.

## 1) `lib/testimonials.ts` (neu)
- Liest `testimonials` mit `published = true`, sortiert nach `sort_order`.
- Row → Typ `Testimonial`:
  - `slug`, `name`
  - `roleCompany` ← `role_company`
  - `quote` ← `quote` (enthält HTML `<p>…</p>` → beim Rendern als HTML behandeln, wie bei Blog-Inhalten)
  - `categories` ← `categories` (string[])
  - `imageSrc` ← `image_url`, `imageAlt` ← `image_alt` ?? `name`
  - `logoSrc` ← `logo_url`
- Export `getTestimonials(category?: string)`:
  - ohne `category`: alle veröffentlichten.
  - mit `category`: nur die, deren `categories` den Wert enthalten. **Fallback:** wenn dabei < 1 Treffer, alle veröffentlichten zurückgeben (Sektion bleibt nie leer).
- **Ohne Supabase-Config** (`hasSupabaseConfig()` false): leeres Array zurückgeben (Sektion wird dann nicht gerendert — siehe unten). Es gibt keinen statischen Fallback-Datensatz.

## 2) `components/TestimonialsSection.tsx` (neu)
- Props: `{ testimonials: Testimonial[]; heading?: string }`, Default-Heading **„Erfahrungen mit Fenyx."**
- **Wenn `testimonials.length === 0` → `null` rendern** (Sektion komplett weglassen).
- Layout wie im Original: horizontaler **Slider/Karussell** (Swiper ist im Original; falls nicht installiert, ein CSS-`scroll-snap`-Karussell mit Nav-Pfeilen genügt — kein neues Lib nötig). Pro Karte: Zitat (HTML), darunter Kundenbild (rund), Name, `roleCompany`, optional Firmen-Logo.
- Styling über die bestehenden Design-Tokens/Klassen (abyss/mist/signal, border-radius 0 außer Avatar). An den Look der bestehenden Sektionen anlehnen, nichts Neues erfinden.

## 3) Sektion auf den bestehenden Leistungsseiten einbinden
Jeweils **vor** der Kontakt-/CTA-Sektion am Seitenende, Server-seitig `getTestimonials("<kategorie>")` laden, `export const revalidate = 60;` ergänzen. Mapping Seite → Kategorie:

| Route | Kategorie |
|---|---|
| `app/verwertung/mitarbeiterverkauf/page.tsx` | `mitarbeiterverkauf` |
| `app/verwertung/aufbereitung/page.tsx` | `aufbereitung` |
| `app/bestandsmanagement/page.tsx` | `bestandsmanagement` |
| `app/bueroplanung/page.tsx` | `bueroplanung` |
| `app/einrichtung/bueroeinrichtung/page.tsx` | `bueroeinrichtung` |
| `app/einrichtung/bueromoebel-mieten/page.tsx` | `bueroeinrichtung` |
| `app/einrichtung/workspace-analytics/page.tsx` | `workspace-analytics` |
| `app/ankauf/page.tsx` | `auktionsplattform` |
| `app/ankauf-designermoebel/page.tsx` | `auktionsplattform` |

(Die noch nicht gebauten Landingpage-Collections — kauf, ankauf-Details usw. — bekommen die Sektion automatisch, wenn sie später entstehen. Diesen Schritt hier nicht darauf ausweiten.)

## Abschluss
- Nur die oben genannten Dateien anfassen.
- `tsc --noEmit` muss durchlaufen.
- Wenn eine der Seiten ihre Inhalte aus einer `data/*.ts` bezieht und bereits eine eigene „Stimmen/Referenzen"-Sektion hat, NICHT doppeln — dann diese Seite überspringen und mir im Ergebnis melden.
