# Supabase-Migrationen

## Angewendet auf `aadugmrnlvsmdxisaady`

| Version | Name | Status |
|---------|------|--------|
| `20260619082101` | `team_testimonials_events` | remote |
| `20260623230000a` | `admin_rbac_super_admin_enum` | angewendet |
| `20260623230000` | `admin_rbac_security` | angewendet |
| `20260624100000` | `drop_verify_admin` | angewendet |
| `20260625120000` | `admin_rbac_backfill_and_effective_rpc` | **noch anwenden** |
| `20260625220000` | `analytics_tandem_system` | **noch anwenden** |

## Neu anwenden (anderes Projekt)

1. `20260623230000a_admin_rbac_super_admin_enum.sql` — allein ausführen
2. `20260623230000_admin_rbac_security.sql`
3. `20260624100000_drop_verify_admin.sql` — entfernt shared-password Rate-Limit (nicht genutzt)
4. `20260625120000_admin_rbac_backfill_and_effective_rpc.sql` — Backfill Invite-Bug + Edit-RPC
5. `20260625220000_analytics_tandem_system.sql` — Analytics-Schema, Direct-Ingress, Lead-Funnel, Dashboard-Tabellen

Weg ohne DB-Passwort: Management API `POST .../database/query` mit PAT.

## Super-Admin setzen

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.user_role from public.profiles
where email = 'deine@email.de'
on conflict (user_id, role) do nothing;
```
