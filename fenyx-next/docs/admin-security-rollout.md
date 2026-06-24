# Admin-Sicherheit — Rollout-Status

Stand: Juni 2026. **Frontend + Remote-DB (RBAC) sind live.** Einige Deploy-/Ops-Schritte bleiben manuell.

---

## Erledigt

| Schritt | Status |
|---------|--------|
| Frontend: Login-MFA, `AdminStaffMfaGate`, RBAC-Nav, `UserAccessPanel`, Sicherheit | Im Repo |
| SQL: `user_roles`, Overrides, MFA-Settings, Rate-Limit-RPCs, RLS | **Auf Supabase angewendet** |
| Backfill + `super_admin` für ältesten Admin | **Erledigt** (`isabel@fenyx-office.com`) |
| Edge Function `verify-admin` | **Deployed** (ACTIVE) |
| MFA TOTP (Auth) | **Aktiv** (`mfa_totp_enroll_enabled`, `mfa_totp_verify_enabled`) |
| Lokal: `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` | Erledigt |

---

## Noch manuell (Ops / Client)

### Netlify Production

Unter Site settings → Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (serverseitig, kein `NEXT_PUBLIC_`)

Nach Env-Änderung: neues Deploy auslösen.

### Edge Function Secret

```bash
cd fenyx-next
supabase secrets set ADMIN_PASSWORD='…'   # separates Admin-Passwort, nicht Supabase-Login
```

Ohne Secret antwortet `verify-admin` mit 500. UI-Anbindung (`SecureAdminAuth`) ist noch offen.

### Optional: weiterer Super-Admin

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.user_role from public.profiles
where email = 'deine@email.de'
on conflict (user_id, role) do nothing;
```

---

## Lokal testen

```bash
cd fenyx-next
npm install
npm run dev
```

1. `/admin/login` — E-Mail/Passwort
2. MFA (TOTP) falls Pflicht / Enrollment
3. `/admin/benutzer` — RBAC über `get_my_admin_permissions()`
4. `/admin/sicherheit` — Passwort + MFA

---

## Kurzreferenz

| Artefakt | Pfad |
|----------|------|
| SQL (Schritt 1 Enum) | `supabase/migrations/20260623230000a_admin_rbac_super_admin_enum.sql` |
| SQL (Schritt 2 RBAC) | `supabase/migrations/20260623230000_admin_rbac_security.sql` |
| Edge Function | `supabase/functions/verify-admin/index.ts` |
| Permission Keys | `lib/admin/adminPermissionKeys.ts` |
| MFA Gate | `components/admin/AdminStaffMfaGate.tsx` |
| Benutzerverwaltung | `components/admin/UserAccessPanel.tsx` |

---

## Bekannte Einschränkungen

- **`verify-admin`**: deployed, UI noch nicht eingebunden
- **`supabase db push`**: braucht DB-Passwort; Migration wurde via Management API angewendet
- Audit-Logs / Security-Events (LUMEUS-Vollversion) nicht portiert
