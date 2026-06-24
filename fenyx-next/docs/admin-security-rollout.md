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
| Nutzer-API schreibt `user_roles` | Code live — Migration `20260625120000_*` auf Remote anwenden |

---

## Noch manuell

### Netlify

Prüfen ob gesetzt (nicht aus Repo ableitbar):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional: `RESEND_API_KEY`, `RESEND_FROM`

### SQL-Migration anwenden

Falls noch nicht auf Remote:

```text
supabase/migrations/20260625120000_admin_rbac_backfill_and_effective_rpc.sql
```

Enthält Backfill für Invite-Bug (`user_roles` vs `profiles.role`) und RPC `admin_get_effective_permissions_for_user`.

### Neuer Backend-Nutzer

**Standard (Einladungs-Mail):** `/admin/benutzer` → E-Mail + Rolle → Supabase-Einladung → `/passwort-festlegen`.

**Manuell (ohne Supabase-Mail):** Checkbox „Manuell anlegen“ → generiertes oder manuelles Passwort → optional Zugangsdaten per Resend oder einmalig im Dialog kopieren.

**Bestehender Auth-Nutzer:** „Bestehendem Nutzer Zugang geben“ → Nutzer wählen → Rolle zuweisen.

---

## Umgebungsvariablen (Server-only)

| Variable | Zweck |
|----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/admin/users` — Nutzer anlegen, `user_roles` setzen |
| `RESEND_API_KEY` | Optional — Zugangsdaten-Mail bei manuellem Anlegen |
| `RESEND_FROM` | Optional — Absender, z. B. `Fenyx Backend <noreply@fenyx-office.com>` |

Ohne `RESEND_API_KEY`: Checkbox „Zugangsdaten per E-Mail senden“ ist deaktiviert; generiertes Passwort wird einmalig im UI angezeigt.

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
| SQL Backfill + Edit-RPC | `supabase/migrations/20260625120000_admin_rbac_backfill_and_effective_rpc.sql` |
| SQL Cleanup | `supabase/migrations/20260624100000_drop_verify_admin.sql` |
| Nutzer-API | `app/api/admin/users/route.ts` |
| Permission Keys | `lib/admin/adminPermissionKeys.ts` |
| MFA Gate | `components/admin/AdminStaffMfaGate.tsx` |
| Benutzerverwaltung | `components/admin/UserAccessPanel.tsx` |
