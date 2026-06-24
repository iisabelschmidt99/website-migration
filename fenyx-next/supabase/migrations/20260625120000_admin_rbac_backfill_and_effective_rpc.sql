-- Backfill: profiles.role ≠ viewer, aber user_roles nur viewer (Invite-Bug vor Fix)
-- + RPC admin_get_effective_permissions_for_user für Edit-Dialog

-- ── Backfill ────────────────────────────────────────────────────────────────

insert into public.user_roles (user_id, role)
select p.id, p.role
from public.profiles p
where p.role is not null
  and p.role <> 'viewer'::public.user_role
  and not exists (
    select 1 from public.user_roles ur
    where ur.user_id = p.id and ur.role = p.role
  )
on conflict (user_id, role) do nothing;

delete from public.user_roles ur
using public.profiles p
where ur.user_id = p.id
  and ur.role = 'viewer'::public.user_role
  and p.role is not null
  and p.role <> 'viewer'::public.user_role
  and exists (
    select 1 from public.user_roles ur2
    where ur2.user_id = p.id and ur2.role = p.role
  );

-- ── Effective permissions für Zielnutzer (Edit-Dialog) ─────────────────────

create or replace function public.admin_get_effective_permissions_for_user(_target uuid)
returns text[]
language sql stable security definer set search_path = public
as $$
  select case
    when auth.uid() = _target or public.is_super_admin(auth.uid()) then
      public.effective_admin_permissions(_target)
    else
      array[]::text[]
  end;
$$;

comment on function public.admin_get_effective_permissions_for_user(uuid) is
  'Effektive Admin-Permissions eines Nutzers — nur für sich selbst oder super_admin.';
