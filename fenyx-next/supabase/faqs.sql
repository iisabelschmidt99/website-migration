-- ============================================================================
-- FAQ-Bibliothek (CMS-Collection „FAQs"): globale Frage/Antwort-Sammlung.
-- Eigene Datei (nicht in schema.sql), einmal im Supabase-SQL-Editor ausführen.
-- ============================================================================
create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  question    text not null,
  answer      text,
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists faqs_published_idx on public.faqs (published, sort_order);

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

alter table public.faqs enable row level security;

drop policy if exists "FAQs: öffentlich lesen (published)" on public.faqs;
create policy "FAQs: öffentlich lesen (published)" on public.faqs
  for select using (published = true or public.is_staff());

drop policy if exists "FAQs: Redaktion schreibt" on public.faqs;
create policy "FAQs: Redaktion schreibt" on public.faqs
  for all using (public.is_staff()) with check (public.is_staff());
