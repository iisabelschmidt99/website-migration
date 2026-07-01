# Cursor-Prompt: Page-Builder Phase A – Fundament (Datenmodell + Renderer + Bausteine)

Wir bauen einen eigenen Page-Builder, mit dem die Redaktion später selbst Seiten anlegt (z. B. „Lagerung" unter „Bestandsmanagement"). **Phase A** ist nur das Fundament: Datenmodell, ein dynamischer Renderer und die Bausteine. Die Admin-Bedienoberfläche kommt in Phase B — diese hier NICHT bauen.

Wichtig: **Bestehende Sektions-Komponenten wiederverwenden**, damit CMS-Seiten exakt wie die handgebauten Seiten aussehen. Nichts am bestehenden Design ändern. Deutsch kommentieren. Am Ende `tsc --noEmit`.

## 1) Supabase-Tabelle `pages` (ans Ende von `supabase/schema.sql` anhängen)
Felder:
- `id` uuid pk default gen_random_uuid()
- `slug` text **unique not null** — voller Pfad ohne führenden Slash, z. B. `bestandsmanagement/lagerung`
- `parent_slug` text null — für den Strukturbaum, z. B. `bestandsmanagement` (null = oberste Ebene)
- `title` text not null
- `nav_label` text null
- `blocks` jsonb not null default '[]' — Array von Bausteinen (siehe Schema unten)
- `meta_title` text, `meta_description` text, `og_image_url` text
- `status` text not null default 'draft' — `'draft'` | `'published'`
- `sort_order` integer not null default 0
- `created_at` / `updated_at` timestamptz default now() + `set_updated_at`-Trigger
- Index auf (`status`), Index auf (`parent_slug`, `sort_order`)
- **RLS** analog zu den anderen Tabellen: öffentlich liest nur `status='published'`; Redaktion (`is_staff()`) liest/schreibt alles.

## 2) Block-Schema (TypeScript, z. B. `lib/pageBlocks.ts`)
Jeder Block: `{ id: string; type: BlockType; ...felder }`. MVP-Typen (Felder an die jeweilige Komponente anlehnen — schau in die bestehenden Komponenten und mappe sinnvoll):

- `hero` → **ServiceHero**: `eyebrow?`, `heading`, `subtext?`, `backgroundImageUrl?`, `ctaLabel?`, `ctaHref?`
- `feature` (Text+Bild) → **FeatureRowSection**: `heading`, `body`, `imageUrl`, `imageLeft` (bool), `ctaLabel?`, `ctaHref?`, `variant?` (hell/dunkel)
- `checklist` → **CheckList**: `heading?`, `intro?`, `items: string[]`
- `stats` → **StatsGrid**: `heading?`, `items: {value, label}[]`
- `faq` → **FaqSection**: `heading?`, `items: {question, answer}[]`
- `cta` → **ServiceContactSection** (oder ein einfacher CTA-Banner, falls ohne Formular gewünscht): `heading`, `text?`, `ctaLabel?`, `ctaHref?`
- „Fertige Sektionen" als einfügbare Bausteine (nehmen vorhandene Datenquellen, kaum Felder):
  - `logos` → **LogoGrid**
  - `references` → **ReferenceProjectsSection**
  - `testimonials` → **TestimonialsSection** (optional Feld `category?`)

Lege einen `BlockRenderer`-Komponententeil an (`components/pagebuilder/BlockRenderer.tsx`), der ein `blocks`-Array bekommt und je `type` die passende bestehende Komponente mit gemappten Props rendert. Unbekannte Typen überspringen (kein Crash).

## 3) Dynamischer Renderer — `app/[...slug]/page.tsx` (Catch-all)
- `params.slug` (Array) mit `/` zu einem Pfad zusammensetzen.
- Seite per `createPublicClient` aus `pages` per `slug` laden.
- Wenn nicht gefunden → `notFound()`.
- **Sichtbarkeit:** Öffentlich nur `status='published'`. Entwürfe (`draft`) nur, wenn `?preview=1` **und** ein eingeloggter Redaktions-User (über `@/lib/supabase/server` `getUser()` + Rolle prüfen) — sonst `notFound()`.
- Blocks über `BlockRenderer` rendern.
- `generateMetadata` aus `meta_title`/`meta_description`/`og_image_url` (Fallback auf `title`).
- `export const revalidate = 60;`
- **Wichtig:** Der Catch-all darf bestehende Routen NICHT stören. Next.js priorisiert spezifische/statische Routen vor `[...slug]` — also bleiben alle gecodeten Seiten (`/referenzen`, `/ueber-uns`, `/bestandsmanagement` …) unverändert; der Catch-all greift nur für Pfade, die es als Code-Route NICHT gibt (z. B. `/bestandsmanagement/lagerung`). Sicherstellen, dass echte 404 weiterhin 404 sind.

## 4) Seed zum Testen
Lege optional 1 Beispiel-Seite per SQL an (z. B. `slug='bestandsmanagement/lagerung'`, `parent_slug='bestandsmanagement'`, `status='published'`, ein paar Blocks: hero + feature + faq), damit man `/bestandsmanagement/lagerung` im Browser sieht. SQL als Kommentar/Datei beilegen, nicht zwingend ausführen.

## Abschluss
- Anfassen: `supabase/schema.sql` (anhängen), neue Dateien `lib/pageBlocks.ts`, `components/pagebuilder/BlockRenderer.tsx`, `app/[...slug]/page.tsx`. Bestehende Sektions-Komponenten nur importieren/wiederverwenden, nicht ändern.
- `tsc --noEmit` muss durchlaufen.
- Test: SQL-Schema im Supabase-Editor einspielen, Beispiel-Seite anlegen, `/<slug>` im Browser prüfen; bestehende Seiten müssen unverändert funktionieren.
- Phase B (Admin-Builder mit Struktur-Baum, „+", Block-Editor, Bild-Upload, Vorschau) folgt separat — hier noch NICHT bauen.
