# Admin-Sicherheit — Rollout-Status

Stand: Juni 2026. **Frontend + Remote-DB (RBAC) sind live.**

---

## Erledigt (Remote)

| Schritt | Status |
|---------|--------|
| RBAC-Tabellen, RPCs, RLS | Angewendet |
| `super_admin`: isabel@fenyx-office.com | Aktiv |
| `admin`: hofbauer.ptt@gmail.com | Eingeladen + Rolle gesetzt |
| MFA TOTP (Auth) | Aktiv |
| `verify-admin` / `ADMIN_PASSWORD` | **Entfernt** (kein Shared-Password-Modell) |

---

## Noch manuell

### Netlify

Prüfen ob gesetzt (nicht aus Repo ableitbar): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### Neuer Admin-Nutzer

Über `/admin/benutzer` → Einladung, oder Auth Admin API + `user_roles` setzen.

Patrick (`hofbauer.ptt@gmail.com`): Einladungs-Mail → `/passwort-festlegen` → danach `/admin/login`.

---

## Sicherheitsmodell

- **Login:** Supabase Auth (persönliches Passwort) + optional TOTP (`AdminStaffMfaGate`)
- **Berechtigungen:** `user_roles` + `get_my_admin_permissions()`
- **Kein** teamweites `ADMIN_PASSWORD` / `verify-admin`

---

## Kurzreferenz

| Artefakt | Pfad |
|----------|------|
| SQL Enum | `supabase/migrations/20260623230000a_admin_rbac_super_admin_enum.sql` |
| SQL RBAC | `supabase/migrations/20260623230000_admin_rbac_security.sql` |
| SQL Cleanup | `supabase/migrations/20260624100000_drop_verify_admin.sql` |
| Permission Keys | `lib/admin/adminPermissionKeys.ts` |
| MFA Gate | `components/admin/AdminStaffMfaGate.tsx` |
| Benutzerverwaltung | `components/admin/UserAccessPanel.tsx` |
