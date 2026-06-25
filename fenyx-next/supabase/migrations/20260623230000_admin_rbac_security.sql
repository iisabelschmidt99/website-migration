-- ============================================================================
-- Fenyx Admin RBAC + MFA-Vorbereitung + Rate-Limiting
-- ----------------------------------------------------------------------------
-- Manuell im Supabase SQL Editor oder via psql ausführen.
-- Voraussetzung: schema.sql (profiles, CMS-Tabellen) ist bereits angewendet.
-- Orientierung: LUMEUS access-control / optional-MFA (vereinfacht für Fenyx CMS).
-- ============================================================================

-- ── 1) Enum super_admin ergänzen ───────────────────────────────────────────
-- WICHTIG: Diese Zeile in einem SEPARATEN SQL-Lauf ausführen (eigene Transaktion),
-- bevor der Rest der Datei läuft — sonst ERROR 55P04 (enum commit).
-- alter type public.user_role add value if not exists 'super_admin' before 'admin';

-- ── 2) Tabellen ────────────────────────────────────────────────────────────

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       public.user_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);

comment on table public.user_roles is 'Mehrere Rollen pro Nutzer (RBAC); ersetzt langfristig profiles.role allein.';

create table if not exists public.user_admin_permission_overrides (
  user_id         uuid not null references auth.users (id) on delete cascade,
  permission_key  text not null,
  granted         boolean not null default true,
  created_at      timestamptz not null default now(),
  primary key (user_id, permission_key)
);

comment on table public.user_admin_permission_overrides is 'Optionale Abweichungen vom Rollen-Default (super_admin verwaltet).';

create table if not exists public.user_admin_access_settings (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  require_mfa boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists user_admin_access_settings_set_updated_at on public.user_admin_access_settings;
create trigger user_admin_access_settings_set_updated_at
  before update on public.user_admin_access_settings
  for each row execute function public.set_updated_at();

create table if not exists public.admin_auth_attempts (
  id             uuid primary key default gen_random_uuid(),
  ip_address     inet not null unique,
  attempt_count  integer not null default 0,
  last_attempt   timestamptz not null default now(),
  locked_until   timestamptz,
  created_at     timestamptz not null default now()
);

-- ── 3) Rollen-Helfer (user_roles statt nur profiles) ───────────────────────

create or replace function public.is_super_admin(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = 'super_admin'::public.user_role
  );
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and role in ('admin'::public.user_role, 'super_admin'::public.user_role)
  )
  or exists (
    select 1 from public.profiles
    where id = _user_id and role in ('admin'::public.user_role, 'super_admin'::public.user_role)
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in (
        'super_admin'::public.user_role,
        'admin'::public.user_role,
        'editor'::public.user_role
      )
  )
  or exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin'::public.user_role, 'editor'::public.user_role)
  );
$$;

-- ── 4) Permission-Defaults (Fenyx CMS) ─────────────────────────────────────

create or replace function public.default_permissions_for_role(r public.user_role)
returns text[]
language plpgsql immutable set search_path = public
as $$
declare
  cms text[] := array[
    'feature.overview',
    'feature.referenzen',
    'feature.blog',
    'feature.team',
    'feature.kundenstimmen',
    'feature.events',
    'feature.medien',
    'feature.sicherheit',
    'feature.analytics'
  ];
begin
  case r
    when 'super_admin'::public.user_role then
      return cms || array[
        'feature.benutzer',
        'roles.assign_staff',
        'roles.assign_privileged'
      ];
    when 'admin'::public.user_role then
      return cms || array['feature.benutzer', 'roles.assign_staff'];
    when 'editor'::public.user_role then
      return cms;
    when 'viewer'::public.user_role then
      return array['feature.overview'];
    else
      return array[]::text[];
  end case;
end;
$$;

create or replace function public.effective_admin_permissions(_user_id uuid)
returns text[]
language plpgsql stable security definer set search_path = public
as $$
declare
  eff text[];
  o record;
begin
  select coalesce(array_agg(distinct p), array[]::text[])
  into eff
  from (
    select unnest(public.default_permissions_for_role(ur.role)) as p
    from public.user_roles ur
    where ur.user_id = _user_id
  ) s;

  for o in
    select permission_key, granted
    from public.user_admin_permission_overrides
    where user_id = _user_id
  loop
    if o.granted then
      if not (o.permission_key = any (eff)) then
        eff := array_append(eff, o.permission_key);
      end if;
    else
      select coalesce(array_agg(x), array[]::text[])
      into eff
      from unnest(eff) as x
      where x <> o.permission_key;
    end if;
  end loop;

  select coalesce(array_agg(distinct x), array[]::text[])
  into eff
  from unnest(eff) as x;

  return eff;
end;
$$;

create or replace function public.has_admin_permission(_user_id uuid, _key text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select _key = any (public.effective_admin_permissions(_user_id));
$$;

create or replace function public.get_my_admin_permissions()
returns text[]
language sql stable security definer set search_path = public
as $$
  select public.effective_admin_permissions(auth.uid());
$$;

-- ── 5) Rollen-Zuweisung ────────────────────────────────────────────────────

create or replace function public.user_may_assign_role(
  _actor uuid,
  _target_user uuid,
  _role public.user_role
)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when _role in ('admin'::public.user_role, 'super_admin'::public.user_role) then
      public.is_super_admin(_actor)
    else
      public.is_admin(_actor)
  end;
$$;

create or replace function public.user_may_remove_role(
  _actor uuid,
  _subject_user uuid,
  _role public.user_role
)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when _role in ('admin'::public.user_role, 'super_admin'::public.user_role) then
      public.is_super_admin(_actor)
    else
      public.is_admin(_actor)
  end;
$$;

-- ── 6) Staff-Verzeichnis (Admin UI) ────────────────────────────────────────

create or replace function public.get_staff_directory()
returns table (
  user_id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) and not public.is_super_admin(auth.uid()) then
    raise exception 'Kein Zugriff';
  end if;

  return query
  select
    u.id,
    u.email::text,
    p.full_name,
    u.created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where exists (select 1 from public.user_roles ur where ur.user_id = u.id)
     or exists (
       select 1 from public.profiles pr
       where pr.id = u.id and pr.role <> 'viewer'::public.user_role
     )
  order by u.created_at asc;
end;
$$;

create or replace function public.get_users_for_admin_picker()
returns table (id uuid, email text, full_name text)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.has_admin_permission(auth.uid(), 'feature.benutzer') then
    raise exception 'Kein Zugriff';
  end if;

  return query
  select u.id, u.email::text, p.full_name
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by u.email;
end;
$$;

-- ── 7) Rate-Limiting (verify-admin Edge Function) ───────────────────────────

create or replace function public.check_admin_auth_rate_limit(attempt_ip inet)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  attempt_record public.admin_auth_attempts%rowtype;
  lockout_duration interval;
begin
  select * into attempt_record
  from public.admin_auth_attempts
  where ip_address = attempt_ip;

  if attempt_record.locked_until is not null and attempt_record.locked_until > now() then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'locked_until', attempt_record.locked_until,
      'attempts', attempt_record.attempt_count
    );
  end if;

  if attempt_record is null or attempt_record.last_attempt < now() - interval '15 minutes' then
    insert into public.admin_auth_attempts (ip_address, attempt_count, last_attempt)
    values (attempt_ip, 0, now())
    on conflict (ip_address) do update
    set attempt_count = 0, last_attempt = now(), locked_until = null;

    return jsonb_build_object('allowed', true, 'attempts', 0);
  end if;

  if attempt_record.attempt_count >= 5 then
    lockout_duration := case
      when attempt_record.attempt_count >= 10 then interval '1 hour'
      when attempt_record.attempt_count >= 7 then interval '30 minutes'
      else interval '15 minutes'
    end;

    update public.admin_auth_attempts
    set locked_until = now() + lockout_duration,
        attempt_count = attempt_count + 1,
        last_attempt = now()
    where ip_address = attempt_ip;

    return jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'locked_until', now() + lockout_duration,
      'attempts', attempt_record.attempt_count + 1
    );
  end if;

  return jsonb_build_object('allowed', true, 'attempts', attempt_record.attempt_count);
end;
$$;

create or replace function public.record_admin_auth_attempt(attempt_ip inet, success boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.admin_auth_attempts (ip_address, attempt_count, last_attempt)
  values (attempt_ip, case when success then 0 else 1 end, now())
  on conflict (ip_address) do update
  set
    attempt_count = case
      when success then 0
      when public.admin_auth_attempts.last_attempt < now() - interval '15 minutes' then 1
      else public.admin_auth_attempts.attempt_count + 1
    end,
    last_attempt = now(),
    locked_until = case when success then null else public.admin_auth_attempts.locked_until end;
end;
$$;

-- ── 8) profiles.role mit user_roles synchron halten ──────────────────────────

create or replace function public.sync_profile_role_from_user_roles()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  best public.user_role;
begin
  select ur.role into best
  from public.user_roles ur
  where ur.user_id = coalesce(new.user_id, old.user_id)
  order by case ur.role
    when 'super_admin' then 1
    when 'admin' then 2
    when 'editor' then 3
    when 'viewer' then 4
  end
  limit 1;

  if best is not null then
    update public.profiles set role = best where id = coalesce(new.user_id, old.user_id);
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_profile_role_after_user_roles on public.user_roles;
create trigger sync_profile_role_after_user_roles
  after insert or update or delete on public.user_roles
  for each row execute function public.sync_profile_role_from_user_roles();

-- Neues Profil: auch user_roles-Zeile anlegen
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'viewer'::public.user_role)
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

-- ── 9) Backfill aus bestehenden profiles ───────────────────────────────────

insert into public.user_roles (user_id, role)
select id, role from public.profiles
where role is not null
on conflict (user_id, role) do nothing;

-- Ältesten Admin zusätzlich als super_admin (ein Owner)
insert into public.user_roles (user_id, role)
select p.id, 'super_admin'::public.user_role
from public.profiles p
where p.role = 'admin'::public.user_role
order by p.created_at asc
limit 1
on conflict (user_id, role) do nothing;

-- ── 10) RLS ────────────────────────────────────────────────────────────────

alter table public.user_roles enable row level security;
alter table public.user_admin_permission_overrides enable row level security;
alter table public.user_admin_access_settings enable row level security;
alter table public.admin_auth_attempts enable row level security;

drop policy if exists "user_roles: eigene lesen" on public.user_roles;
create policy "user_roles: eigene lesen" on public.user_roles
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "user_roles: delegiert einfügen" on public.user_roles;
create policy "user_roles: delegiert einfügen" on public.user_roles
  for insert with check (public.user_may_assign_role(auth.uid(), user_id, role));

drop policy if exists "user_roles: delegiert löschen" on public.user_roles;
create policy "user_roles: delegiert löschen" on public.user_roles
  for delete using (public.user_may_remove_role(auth.uid(), user_id, role));

drop policy if exists "overrides: super_admin verwaltet" on public.user_admin_permission_overrides;
create policy "overrides: super_admin verwaltet" on public.user_admin_permission_overrides
  for all using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists "access_settings: super_admin verwaltet" on public.user_admin_access_settings;
create policy "access_settings: super_admin verwaltet" on public.user_admin_access_settings
  for all using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists "access_settings: selbst lesen" on public.user_admin_access_settings;
create policy "access_settings: selbst lesen" on public.user_admin_access_settings
  for select using (auth.uid() = user_id or public.is_super_admin(auth.uid()));

-- admin_auth_attempts: nur service_role / security definer RPCs
drop policy if exists "admin_auth: kein direkter Client-Zugriff" on public.admin_auth_attempts;
create policy "admin_auth: kein direkter Client-Zugriff" on public.admin_auth_attempts
  for all using (false);

-- profiles: is_admin() nutzt jetzt auch user_roles
drop policy if exists "Profil: Admin verwaltet alle" on public.profiles;
create policy "Profil: Admin verwaltet alle" on public.profiles
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
