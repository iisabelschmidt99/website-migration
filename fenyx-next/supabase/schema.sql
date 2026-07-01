-- ============================================================================
-- Fenyx Website – Supabase Datenmodell
-- ----------------------------------------------------------------------------
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und ausführen.
-- Deckt ab: Referenzen, Blog, User-Management mit Rollen, Bilder-Storage.
-- Security/2FA übernimmt Supabase Auth selbst (kein SQL nötig).
-- Kommentare auf Deutsch.
-- ============================================================================

-- Benötigte Extension für UUIDs (in Supabase i.d.R. schon aktiv)
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1) ROLLEN + USER-PROFILE
-- ----------------------------------------------------------------------------
-- Supabase verwaltet Logins in auth.users. Wir hängen ein Profil mit Rolle dran.
-- ============================================================================

-- Rollen-Typ: admin = alles, editor = Inhalte pflegen, viewer = nur lesen
do $$ begin
  create type public.user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        public.user_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Benutzerprofile inkl. Rolle, 1:1 zu auth.users';

-- Hilfsfunktion: Ist der aktuell eingeloggte User Redaktion (admin/editor)?
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Hilfsfunktion: Ist der aktuell eingeloggte User Admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Neuer Auth-User -> automatisch Profil anlegen (Standardrolle viewer)
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2) updated_at automatisch pflegen (für alle Tabellen)
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 3) REFERENZEN (Case Studies)
-- ----------------------------------------------------------------------------
-- Felder 1:1 passend zur Frontend-Struktur (data/referenz-case-studies.ts).
-- Verschachtelte Daten (intro, stats, highlights ...) als JSONB.
-- ============================================================================
create table if not exists public.references (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  company           text not null,
  title             text not null,
  category_label    text,
  city              text,
  year              text,
  meta_title        text,
  meta_description  text,
  hero_image_url    text,
  hero_image_alt    text,
  intro             jsonb not null default '[]'::jsonb,   -- string[]
  hero_stats        jsonb not null default '[]'::jsonb,   -- {value,label}[]
  meta_rows         jsonb not null default '[]'::jsonb,   -- {label,value}[]
  highlights        jsonb not null default '[]'::jsonb,   -- {heading,body}[]
  related_slugs     jsonb not null default '[]'::jsonb,   -- string[]
  published         boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists references_published_idx on public.references (published, sort_order);

drop trigger if exists references_set_updated_at on public.references;
create trigger references_set_updated_at
  before update on public.references
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 4) BLOG
-- ============================================================================
create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  excerpt           text,
  body_md           text,                                  -- Inhalt als Markdown
  cover_image_url   text,
  cover_image_alt   text,
  author            text,
  category          text,
  tags              jsonb not null default '[]'::jsonb,    -- string[]
  meta_title        text,
  meta_description  text,
  published         boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 5) ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
-- Grundprinzip:
--   - Öffentlich (anonym): darf nur VERÖFFENTLICHTE Referenzen/Blogs LESEN.
--   - Redaktion (admin/editor): darf alles lesen und schreiben.
--   - Profile: jeder sieht sein eigenes; Admins sehen/verwalten alle.
-- ============================================================================
alter table public.profiles    enable row level security;
alter table public.references  enable row level security;
alter table public.blog_posts  enable row level security;

-- ---- PROFILES ----
drop policy if exists "Profil: selbst lesen" on public.profiles;
create policy "Profil: selbst lesen" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "Profil: selbst aktualisieren" on public.profiles;
create policy "Profil: selbst aktualisieren" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists "Profil: Admin verwaltet alle" on public.profiles;
create policy "Profil: Admin verwaltet alle" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- REFERENCES ----
drop policy if exists "Referenzen: öffentlich lesen (published)" on public.references;
create policy "Referenzen: öffentlich lesen (published)" on public.references
  for select using (published = true or public.is_staff());

drop policy if exists "Referenzen: Redaktion schreibt" on public.references;
create policy "Referenzen: Redaktion schreibt" on public.references
  for all using (public.is_staff()) with check (public.is_staff());

-- ---- BLOG ----
drop policy if exists "Blog: öffentlich lesen (published)" on public.blog_posts;
create policy "Blog: öffentlich lesen (published)" on public.blog_posts
  for select using (published = true or public.is_staff());

drop policy if exists "Blog: Redaktion schreibt" on public.blog_posts;
create policy "Blog: Redaktion schreibt" on public.blog_posts
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 6) STORAGE: Bilder-Upload
-- ----------------------------------------------------------------------------
-- Öffentlicher Bucket "media": jeder darf Bilder LESEN, nur Redaktion hochladen.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Media: öffentlich lesen" on storage.objects;
create policy "Media: öffentlich lesen" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Media: Redaktion lädt hoch" on storage.objects;
create policy "Media: Redaktion lädt hoch" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "Media: Redaktion ändert/löscht" on storage.objects;
create policy "Media: Redaktion ändert/löscht" on storage.objects
  for all using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

-- ============================================================================
-- FERTIG. Nächster Schritt: ersten Admin setzen (siehe README.md):
--   update public.profiles set role = 'admin' where email = 'isabel@fenyx-office.com';
-- ============================================================================

-- ============================================================================
-- 7) TEAM (Über-uns-Seite)
-- ============================================================================
create table if not exists public.team_members (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  position          text,
  bio               text,
  image_url         text,
  image_alt         text,
  linkedin_url      text,
  email             text,
  quote             text,
  legend_position   text,
  sort_order        integer not null default 0,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists team_members_published_idx on public.team_members (published, sort_order);

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 8) KUNDENSTIMMEN (Testimonials)
-- ============================================================================
create table if not exists public.testimonials (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  role_company      text,
  quote             text,
  categories        jsonb not null default '[]'::jsonb,
  image_url         text,
  image_alt         text,
  logo_url          text,
  sort_order        integer not null default 0,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists testimonials_published_idx on public.testimonials (published, sort_order);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 9) EVENTS
-- ============================================================================
create table if not exists public.events (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  hero_image_url      text,
  hero_image_alt      text,
  intro               text,
  intro_info          text,
  tags                jsonb not null default '[]'::jsonb,
  event_date          timestamptz,
  time_label          text,
  location            text,
  location_link       text,
  fee                 text,
  seats               text,
  language            text,
  format              text,
  catering            text,
  h2_text             text,
  h2_paragraph        text,
  h2_rich_text        text,
  program_html        text,
  host_slugs          jsonb not null default '[]'::jsonb,
  program_image_url   text,
  program_image_alt   text,
  takeaways           jsonb not null default '[]'::jsonb,
  category            text,
  ics_url             text,
  hubspot_form        text,
  published           boolean not null default false,
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists events_published_idx on public.events (published, event_date desc);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 10) RLS für Team, Kundenstimmen, Events
-- ============================================================================
alter table public.team_members  enable row level security;
alter table public.testimonials  enable row level security;
alter table public.events        enable row level security;

drop policy if exists "Team: öffentlich lesen (published)" on public.team_members;
create policy "Team: öffentlich lesen (published)" on public.team_members
  for select using (published = true or public.is_staff());

drop policy if exists "Team: Redaktion schreibt" on public.team_members;
create policy "Team: Redaktion schreibt" on public.team_members
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Kundenstimmen: öffentlich lesen (published)" on public.testimonials;
create policy "Kundenstimmen: öffentlich lesen (published)" on public.testimonials
  for select using (published = true or public.is_staff());

drop policy if exists "Kundenstimmen: Redaktion schreibt" on public.testimonials;
create policy "Kundenstimmen: Redaktion schreibt" on public.testimonials
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Events: öffentlich lesen (published)" on public.events;
create policy "Events: öffentlich lesen (published)" on public.events
  for select using (published = true or public.is_staff());

drop policy if exists "Events: Redaktion schreibt" on public.events;
create policy "Events: Redaktion schreibt" on public.events
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 11) LANDING PAGES – Standort/Location (Einrichtung LPs, Ankauf LPs)
-- Eine generische Tabelle für beide Collections (Spalte `collection`).
-- ============================================================================
create table if not exists public.landing_locations (
  id                uuid primary key default gen_random_uuid(),
  collection        text not null,                 -- z.B. 'einrichtung-standorte' | 'ankauf'
  slug              text not null,
  title             text,
  h1                text,
  hero_image_url    text,
  hero_image_alt    text,
  meta_title        text,
  meta_description  text,
  section1_html     text,                           -- Sektion 1 RTE (HTML aus Webflow)
  section2_html     text,                           -- Sektion 2 RTE (HTML)
  map_embed         text,                           -- Google-Maps-iFrame (roh, optional)
  schema_markup     text,                           -- JSON-LD
  published         boolean not null default false,
  published_at      timestamptz,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (collection, slug)                         -- Slug „aachen" existiert je Collection
);

create index if not exists landing_locations_pub_idx
  on public.landing_locations (collection, published, sort_order);

drop trigger if exists landing_locations_set_updated_at on public.landing_locations;
create trigger landing_locations_set_updated_at
  before update on public.landing_locations
  for each row execute function public.set_updated_at();

alter table public.landing_locations enable row level security;

drop policy if exists "Landing-Standorte: öffentlich lesen (published)" on public.landing_locations;
create policy "Landing-Standorte: öffentlich lesen (published)" on public.landing_locations
  for select using (published = true or public.is_staff());

drop policy if exists "Landing-Standorte: Redaktion schreibt" on public.landing_locations;
create policy "Landing-Standorte: Redaktion schreibt" on public.landing_locations
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 12) LANDING PAGES – Themen (Büroauflösungen, Büroeinrichtungen, Büromöbel kaufen, Büroplanung)
-- Artikelartige SEO-Seiten mit Rich-Text + inline-FAQ. Generische Tabelle.
-- ============================================================================
create table if not exists public.landing_topics (
  id                uuid primary key default gen_random_uuid(),
  collection        text not null,        -- 'bueroaufloesung' | 'bueroeinrichtung' | 'kauf' | 'bueroplanung'
  slug              text not null,
  title             text,
  meta_title        text,
  meta_description  text,
  main_image_url    text,
  main_image_alt    text,
  post_summary      text,
  author            text,
  body_html         text,                  -- kombinierte rte-Felder (HTML)
  faq_title         text,
  faq_description   text,
  faq               jsonb not null default '[]'::jsonb,  -- {question, answer}[]
  schema_markup     text,
  published         boolean not null default false,
  published_at      timestamptz,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (collection, slug)
);

create index if not exists landing_topics_pub_idx
  on public.landing_topics (collection, published, sort_order);

drop trigger if exists landing_topics_set_updated_at on public.landing_topics;
create trigger landing_topics_set_updated_at
  before update on public.landing_topics
  for each row execute function public.set_updated_at();

alter table public.landing_topics enable row level security;

drop policy if exists "Landing-Themen: öffentlich lesen (published)" on public.landing_topics;
create policy "Landing-Themen: öffentlich lesen (published)" on public.landing_topics
  for select using (published = true or public.is_staff());

drop policy if exists "Landing-Themen: Redaktion schreibt" on public.landing_topics;
create policy "Landing-Themen: Redaktion schreibt" on public.landing_topics
  for all using (public.is_staff()) with check (public.is_staff());
