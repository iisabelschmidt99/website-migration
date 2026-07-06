-- ============================================================================
-- Standort-Verzeichnisse (3 Collections aus dem CMS):
--   'an-und-verkauf'   -> Ankauf-Standorte
--   'bueroeinrichtung' -> Büroeinrichtungs-Standorte
--   'standorte'        -> allgemeine Standorte (Miete)
-- Einfache Verzeichnis-Einträge (Name, Slug, Adresse, Map-Pin, Link).
-- Eigene Datei, damit sie nicht mit schema.sql kollidiert. Einmal im
-- Supabase SQL-Editor ausführen.
-- ============================================================================
create table if not exists public.locations (
  id                 uuid primary key default gen_random_uuid(),
  collection         text not null,
  name               text not null,
  slug               text not null,
  address            text,
  pin_location       text,
  page_link          text,          -- Original-Link aus dem CMS (SEO-Namensgebung)
  page_link_resolved text,          -- auf unsere Live-Route aufgelöst
  published          boolean not null default false,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (collection, slug)
);

create index if not exists locations_pub_idx
  on public.locations (collection, published, sort_order);

drop trigger if exists locations_set_updated_at on public.locations;
create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

alter table public.locations enable row level security;

drop policy if exists "Standorte: öffentlich lesen (published)" on public.locations;
create policy "Standorte: öffentlich lesen (published)" on public.locations
  for select using (published = true or public.is_staff());

drop policy if exists "Standorte: Redaktion schreibt" on public.locations;
create policy "Standorte: Redaktion schreibt" on public.locations
  for all using (public.is_staff()) with check (public.is_staff());
