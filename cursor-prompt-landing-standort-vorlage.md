# Cursor-Prompt: SEO-Landingpages – Vorlage „Standort" (Einrichtung LPs)

Wir bauen die erste von zwei Landingpage-Vorlagen: die **Standort-Seiten**. Muster wie Referenzen/Blog (Supabase-Tabelle + dynamische `[slug]`-Route + Import-Skript). Tabelle bewusst generisch, damit **Ankauf LPs** sie später mitnutzen kann. Design: bestehende Tokens/Sektions-Styles verwenden, nichts Neues erfinden. Deutsch kommentieren. Am Ende `tsc --noEmit`.

CSV: `_reference/webflow-export/cms download/SEO Seiten und FAQs/FENYX LIVE - Einrichtung LPs - 6988d9ea184c3a10bc10d9bb.csv` (59 Einträge). Ziel-URL: **`/einrichtung-standorte/<slug>`** (aus dem Schema-Markup der Seiten abgeleitet).

## 1) Tabelle `landing_locations` (ans Ende von `supabase/schema.sql`)
- `id` uuid pk default gen_random_uuid()
- `collection` text not null — z. B. `'einrichtung-standorte'` (später `'ankauf'`)
- `slug` text not null
- **unique (`collection`, `slug`)** — Slugs wie „aachen" gibt es in mehreren Collections
- `title` text (CSV `Name`)
- `h1` text (CSV `H1 Titel`)
- `hero_image_url` text, `hero_image_alt` text
- `meta_title` text (CSV `Meta Titel`), `meta_description` text (CSV `Meta Beschreibung`)
- `section1_html` text (CSV `Sektion 1 RTE`)
- `section2_html` text (CSV `Sektion 2 RTE`)
- `map_embed` text (CSV `Map Google Maps Location Embed Code` — roher iFrame-Einbettcode, kann leer sein)
- `schema_markup` text (CSV `Schema Markup` — JSON-LD)
- `published` boolean default false, `published_at` timestamptz, `sort_order` integer default 0
- `created_at`/`updated_at` + `set_updated_at`-Trigger
- Index (`collection`, `published`, `sort_order`)
- **RLS** wie die anderen Tabellen: öffentlich liest nur `published=true`; `is_staff()` alles.

## 2) Import-Skript `scripts/import-landing-locations.mjs`
- Nimmt eine **Collection als Argument** (Default `einrichtung-standorte` → passende CSV + `collection`-Wert), damit Ankauf später mit demselben Skript läuft.
- Wiederverwendung der bestehenden Bausteine aus `scripts/_import-shared.mjs` (Env laden, RFC4180-CSV-Parser, Bild-Download → Storage-Bucket `media`).
- Mapping wie oben. `published = !Draft && !Archived`. `published_at` = `Published On`.
- Nur das **Hero-Bild** in den Storage laden; Bilder INNERHALB der RTE-Felder vorerst als Webflow-CDN-Links belassen (Migration später).
- `upsert` auf (`collection`, `slug`), idempotent. Am Ende Konsolen-Report (`X/Y geschrieben, Bilder ok/fehlgeschlagen`).
- Kommentar-Hinweis: lokal ausführen (`cd fenyx-next && node scripts/import-landing-locations.mjs einrichtung-standorte`), braucht `.env.local` + Netz.

## 3) Öffentliche Route `app/einrichtung-standorte/[slug]/page.tsx`
- Lädt per `createPublicClient` aus `landing_locations` wo `collection='einrichtung-standorte'` und `slug=param` und `published=true`; sonst `notFound()`.
- `generateMetadata` aus `meta_title`/`meta_description` (Fallback `h1`/`title`).
- `export const revalidate = 60;`
- **Rendering** (neue Komponente `components/LocationLandingContent.tsx`):
  - Hero: `hero_image_url` als Bild + `h1` als Überschrift (`wf-heading-h1`/`h2`, dunkler Look wie die anderen Hero-Sektionen; `wf-padding-section-large`, `wf-container-large`).
  - `section1_html` in einem gestylten Rich-Text-Container rendern (`dangerouslySetInnerHTML`) — mit einer `.rte`-Prose-Klasse (Headings/Absätze/Listen/Links im Fenyx-Stil; Links `text-signal`).
  - `map_embed` nur rendern, wenn nicht leer (roher iFrame in einem responsiven Wrapper).
  - `section2_html` genauso wie Sektion 1.
  - `schema_markup`: falls vorhanden, als `<script type="application/ld+json">` in die Seite ausgeben (unverändert, da bereits valides JSON-LD).
  - Optional darunter die bestehende `ServiceContactSection` (Kontakt-CTA) einbinden — konsistent mit den Leistungsseiten.
- Header/Footer kommen automatisch (öffentliche Route, kein `/admin`).

## Hinweis zur URL
Schema-Markup sagt `/einrichtung-standorte/…`, der SEO-Redirect-Export nennt teils `/bueroeinrichtung-standort`. Wir bauen nach Schema (`/einrichtung-standorte`); die finale Pfad-Bestätigung läuft separat mit dem SEO-Mann — die Route lässt sich später leicht umbenennen.

## Abschluss
- Anfassen: `supabase/schema.sql` (anhängen), `scripts/import-landing-locations.mjs`, `app/einrichtung-standorte/[slug]/page.tsx`, `components/LocationLandingContent.tsx`. Vorhandene Komponenten/Styles wiederverwenden.
- `tsc --noEmit` muss durchlaufen.
- Test: Schema im Supabase-Editor einspielen → Import lokal laufen lassen → z. B. `/einrichtung-standorte/aachen` im Browser prüfen (Hero, RTE-Sektionen, Schema im Quelltext).
- Wenn die Vorlage sitzt, ziehen wir Ankauf LPs (gleiches Skript/Tabelle, `collection='ankauf'`, Route `/ankauf/[slug]`) und danach die Themen-Vorlage nach.
