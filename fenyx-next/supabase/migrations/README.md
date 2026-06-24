# Supabase-Migrationen

## Angewendet auf `aadugmrnlvsmdxisaady` (Juni 2026)

| Version | Name | Status |
|---------|------|--------|
| `20260619082101` | `team_testimonials_events` | remote (vorher) |
| `20260623230000a` | `admin_rbac_super_admin_enum` | **angewendet** |
| `20260623230000` | `admin_rbac_security` | **angewendet** |

Backfill: `isabel@fenyx-office.com` → `admin` + `super_admin` (ältester Admin).

## Neu anwenden (anderes Projekt / Reset)

1. **`20260623230000a_admin_rbac_super_admin_enum.sql`** — allein ausführen, committen lassen
2. **`20260623230000_admin_rbac_security.sql`** — Tabellen, RPCs, RLS, Backfill
3. Edge Function **`verify-admin`** deployen: `supabase functions deploy verify-admin --use-api`
4. Secret **`ADMIN_PASSWORD`** setzen (nur für `verify-admin`)

Weg ohne DB-Passwort: Supabase Management API `POST .../database/query` mit PAT (`sbp_…`).

## Super-Admin manuell setzen

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.user_role from public.profiles
where email = 'deine@email.de'
on conflict (user_id, role) do nothing;
```

`profiles.role` bleibt per Trigger mit der höchsten Rolle aus `user_roles` synchron.
