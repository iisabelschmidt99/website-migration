# Cursor-Prompt: Über-Uns-Team & Events öffentlich an Supabase anbinden

Die Tabellen `team_members` und `events` sind in Supabase befüllt. Binde jetzt die **öffentlichen** Seiten an Supabase an — exakt nach dem bestehenden Muster von `lib/references.ts` / `lib/blog.ts`: Supabase über `createPublicClient` lesen, bei fehlender Konfiguration (`hasSupabaseConfig()`) auf die vorhandenen statischen Daten zurückfallen. Bestehendes Design/Komponenten **nicht** umbauen, nur die Datenquelle wechseln. Am Ende `tsc --noEmit` grün.

## 1) `lib/team.ts` (neu)
- Liest `team_members` mit `published = true`, sortiert nach `sort_order` (aufsteigend).
- Mapping Row → `TeamMember` (Typ aus `components/TeamGridSection.tsx`):
  - `name` ← `name`
  - `role` ← `position`
  - `quote` ← `quote` (optional)
  - `imageSrc` ← `image_url`
  - `imageAlt` ← `image_alt` (Fallback: `name`)
  - `email` ← `email` (optional)
- **Gruppierung** (wie auf der jetzigen Über-Uns-Seite):
  - `experts` = Mitglieder mit **gefülltem** `legend_position` (das sind die mit Zitat).
  - `dach` (allgemeines Team-Grid) = Mitglieder mit **leerem** `legend_position`.
  - beide nach `sort_order`.
- Exportiere z.B. `getTeamSections()` → `{ experts: TeamMember[]; dach: TeamMember[] }`.
- **Fallback:** ohne Supabase-Config die bestehenden `expertsContent.members` / `dachTeamContent.members` aus `data/ueber-uns.ts` zurückgeben.

## 2) `app/ueber-uns/page.tsx`
- Server-Komponente async machen, Team über `getTeamSections()` laden.
- Die beiden `<TeamGridSection … variant="experts" />` und `variant="dach"` mit den Supabase-Mitgliedern füttern.
- **Überschriften/Intro-Texte** der beiden Sektionen aus `data/ueber-uns.ts` (`expertsContent.heading` etc.) **beibehalten** — nur die `members` kommen aus Supabase.
- `export const revalidate = 60;` wie bei den anderen Supabase-Seiten.

## 3) `lib/events.ts` (neu)
- Liest `events` mit `published = true`, sortiert nach `event_date` **absteigend**.
- Mapping Row → `EventItem` (Typ aus `data/events.ts`):
  - `slug` ← `slug`
  - `href` ← `/events/${slug}`
  - `title` ← `title`
  - `dateLabel` ← `event_date` deutsch formatiert (z.B. „18. Juni 2026"); wenn `time_label` vorhanden, anhängen.
  - `description` ← `intro`
  - `location` ← `location`
  - `tag` ← erstes Element aus `tags` (sonst `category`, sonst "")
  - `imageSrc` ← `hero_image_url`
  - `meta` ← `{ title: meta_title ?? title, description: meta_description ?? intro }` (falls keine meta-Spalten existieren, `title`/`intro` nehmen)
  - `paragraphs` ← sinnvoll befüllen aus `intro` + `h2_paragraph` (als String-Array)
- Exportiere `getAllEvents()`, `getEvent(slug)`, `getAllEventSlugs()` analog zu `data/events.ts`.
- **Fallback:** ohne Supabase-Config die Funktionen aus `data/events.ts` verwenden.

## 4) `app/events/page.tsx` und `app/events/[slug]/page.tsx`
- Statt aus `data/events` jetzt aus `lib/events.ts` lesen (`getAllEvents`/`getEvent`/`getAllEventSlugs`).
- `eventsHero` / `eventsMeta` für Hero & Seiten-Meta weiterhin aus `data/events.ts` nehmen (das ist Seiten-Rahmen, kein CMS-Item).
- Layout/Komponenten (`ArticleListingSection`, `ArticleDetailSection`) unverändert lassen.
- `export const revalidate = 60;`
- Hinweis: Die reichen Event-Felder (Programm, Gastgeber, Mitnehmen, Hubspot-Formular) lassen wir vorerst weg — Detailseite bleibt wie jetzt. Enrichment kommt in einem späteren Schritt.

## Abschluss
- Nichts anderes in `fenyx-next/` anfassen.
- `tsc --noEmit` muss durchlaufen.
- Kundenstimmen/Testimonials NICHT in diesem Schritt — die haben noch keine öffentliche Sektion (kommt separat).
