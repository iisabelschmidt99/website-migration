# Cursor-Prompt: CMS-Collections Team, Kundenstimmen, Events ins Backend

Bitte richte drei neue CMS-Collections nach demselben Muster wie `references` und `blog_posts` ein:
Supabase-Tabelle + RLS + Import-Skript (Bilder in Bucket `media`) + Admin-Tab zum Pflegen.
**Nur Backend** (Schema, Import, Admin). Öffentliche Seiten (Über-Uns-Team, Testimonials-Section, Events-Seite) machen wir in einem späteren Schritt.

Halte dich strikt an die bestehenden Konventionen in `supabase/schema.sql`, `scripts/import-references.mjs` und den Admin-Komponenten unter `components/admin/`. Idempotenter `upsert` auf `slug`. `published = !Draft && !Archived`. Bilder von der Webflow-CDN herunterladen und in den Bucket `media` legen, danach die Storage-URL speichern. RLS: öffentlich nur `published` lesen, Redaktion (`is_staff()`) schreibt. Trigger `set_updated_at`, Index auf `(published, sort_order)` bzw. Datum.

CSV-Dateien liegen in `../_reference/webflow-export/cms download/`.

---

## 1) Tabelle `team_members`
CSV: `FENYX LIVE - Team - 6988d9ea184c3a10bc10d811.csv`

Spalten-Mapping (CSV → DB):
- `Slug` → `slug` (unique, not null)
- `Name` → `name` (not null)
- `Position` → `position`
- `Personen-Beschreibung` → `bio` (text)
- `Bild` → `image_url` (in Storage), plus `image_alt`
- `LinkedIn` → `linkedin_url`
- `E-Mail` → `email`
- `Zitat` → `quote`
- `Legenden Position` → `legend_position`
- `Reihenfolge auf der Über Uns Seite` → `sort_order` (integer, default 0)
- `published` = `!Draft && !Archived`

(39 Einträge, einige archiviert → die werden `published = false`.)

## 2) Tabelle `testimonials`
CSV: `FENYX LIVE - Kundenstimmen - 6988d9ea184c3a10bc10d896.csv`

- `Slug` → `slug` (unique, not null)
- `Name` → `name` (not null)
- `Position und Firma` → `role_company`
- `Testimonial` → `quote` (enthält HTML `<p>…</p>` — als Text/HTML speichern)
- `Kategorie` → `categories` (jsonb string[]; CSV ist `;`-getrennt, z.B. `aufbereitung; mitarbeiterverkauf` → splitten und trimmen)
- `Kundenbild` → `image_url` (in Storage) + `image_alt`
- `Firmen-Logo` → `logo_url` (in Storage)
- `sort_order` integer default 0
- `published` = `!Draft && !Archived`

(15 Einträge.)

## 3) Tabelle `events`
CSV: `FENYX LIVE - Events - 6a0ed28bae979f3a566d117a.csv`

- `Slug` → `slug` (unique, not null)
- `Name` → `title` (not null)
- `Hero Image` → `hero_image_url` (in Storage) + `hero_image_alt`
- `Paragraph` → `intro` (text)
- `Paragraph Info Text` → `intro_info` (text)
- `Tags` → `tags` (jsonb string[], `;`-getrennt falls mehrere)
- `Datum` → `event_date` (timestamptz)
- `Uhrzeit` → `time_label` (text, z.B. „09:00–17:00 Uhr")
- `Ort` → `location`
- `Ort Link` → `location_link`
- `€ Teilnahmegebühr` → `fee`
- `Plätze` → `seats`
- `Sprache` → `language`
- `Format` → `format`
- `Verpflegung` → `catering`
- `H2 Text` → `h2_text`
- `H2 Paragraph` → `h2_paragraph`
- `H2 Rich Text` → `h2_rich_text` (HTML)
- `Programm` → `program_html` (HTML, `<ul><li>…`)
- `Gastgeber` → `host_slugs` (jsonb string[]; `;`-getrennt; verweist auf `team_members.slug`)
- `Programm Image` → `program_image_url` (in Storage) + alt
- `Mitnehmen 1`..`Mitnehmen 4` → `takeaways` (jsonb string[]; leere überspringen)
- `Category` → `category`
- `ICS` → `ics_url`
- `Hubspot Form Code` → `hubspot_form` (text/HTML)
- `published` = `!Draft && !Archived`
- `Published On` → `published_at` (timestamptz, wie bei blog_posts)

Index: `events (published, event_date desc)`.

(9 Einträge.)

---

## Import-Skripte
Lege analog zu `scripts/import-references.mjs` an:
- `scripts/import-team.mjs`
- `scripts/import-testimonials.mjs`
- `scripts/import-events.mjs`

Gleiche Bausteine wiederverwenden: `loadEnv()`, RFC4180-`parseCSV`, Bild-Download + Upload in Bucket `media` (mit 403-Handling der Webflow-CDN wie gehabt), `upsert` auf `slug`. Am Ende Konsolen-Report ausgeben (`X/Y geschrieben, Bilder ok/fehlgeschlagen`).
**Wichtig:** Skripte laufe ich lokal (`cd fenyx-next && node scripts/import-team.mjs`), sie brauchen `.env.local` (Service-Role-Key) und Netzwerk — nicht im Build ausführen.

## Admin
Füge je einen Tab in der Admin-Sidebar hinzu (`components/admin/AdminNav.tsx`) und die Seiten unter `app/admin/(panel)/`:
- `team` → Liste + Formular (`TeamForm`) mit Bild-Upload über `MediaUploader`
- `kundenstimmen` → Liste + `TestimonialForm`
- `events` → Liste + `EventForm` (inkl. Repeater für `takeaways` und `host_slugs`, analog zu den Repeatern in `ReferenceForm`)

Formulare: Create + Edit, gleiche Struktur/Styles wie `ReferenceForm`/`BlogForm`. Kein neues Design erfinden.

## Abschluss
- `tsc --noEmit` muss durchlaufen.
- Schema-Ergänzungen ans Ende von `supabase/schema.sql` hängen (nicht Bestehendes umschreiben), damit ich sie im Supabase SQL-Editor nachziehen kann.
- Bitte **keine** anderen Dateien in `fenyx-next/` anfassen.
