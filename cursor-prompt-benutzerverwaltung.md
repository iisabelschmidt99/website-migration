# Cursor-Prompt: Benutzerverwaltung + Rollensystem (Admin-Tab)

Baue den Platzhalter-Tab `app/admin/(panel)/benutzer/page.tsx` zu einer echten Benutzerverwaltung aus. Rollensystem (`admin` / `editor` / `viewer`) existiert schon in `profiles` inkl. RLS-Policy „Profil: Admin verwaltet alle" (`is_admin()`) und Helper `is_admin()`. Bestehendes Admin-Design (abyss/mist/signal, Sidebar-Layout) übernehmen, nichts anderes umbauen. Deutsch kommentieren.

## Rechte-Konzept (wichtig)
- **Rollen lesen/ändern bestehender Konten** geht mit dem normalen Server-Client (`@/lib/supabase/server`) — die RLS-Policy `is_admin()` lässt Admins alle `profiles` sehen und ändern. **Kein** Service-Role nötig.
- **Nur** das Einladen NEUER Nutzer braucht erhöhte Rechte (Supabase Admin-API) → dafür eine server-seitige Route mit Service-Role (siehe Punkt 3). Service-Role-Key bleibt server-only, niemals im Client.

## 1) Zugriff: nur Admins
- Der Benutzer-Tab ist **admin-only** (nicht editor). Am Anfang von `benutzer/page.tsx` (Server-Komponente) die Rolle des eingeloggten Users laden; wenn `role !== 'admin'` → freundlicher „Kein Zugriff (nur Admins)"-Hinweis rendern, keine Daten.
- In `components/admin/AdminNav.tsx` den Punkt „Benutzer" nur anzeigen, wenn der User Admin ist (Rolle als Prop ins Nav reichen, die das Panel-Layout schon kennt).

## 2) Benutzerliste + Rolle ändern
- `benutzer/page.tsx`: alle `profiles` laden (`id, email, full_name, role, created_at`), sortiert nach `created_at`.
- Tabelle/Liste: Name, E-Mail, aktuelle Rolle, angelegt am.
- Pro Zeile ein **Rollen-Dropdown** (admin / editor / viewer). Änderung über eine **Server Action** (`updateUserRole(userId, role)`), die per `@/lib/supabase/server` ein `update` auf `profiles.role` macht (RLS erzwingt Admin). Danach `revalidatePath('/admin/benutzer')`.
- Schutz: Der eingeloggte Admin darf sich **nicht selbst** die Admin-Rolle entziehen (Self-Lockout vermeiden) — sein eigenes Dropdown deaktivieren oder serverseitig ablehnen, wenn `userId === auth.uid()` und Ziel ≠ admin.
- Neue Komponente `components/admin/UserRoleSelect.tsx` (Client) für das Dropdown, ruft die Server Action.

## 3) Neuen Nutzer einladen (Service-Role)
- Formular oben auf der Seite: E-Mail + Startrolle → lädt per **Supabase Admin-API** ein.
- Server-seitige Route `app/api/admin/invite/route.ts` (Node-Runtime, NICHT Edge — braucht den Service-Role-Key):
  - Zuerst **prüfen, dass der Aufrufer Admin ist** (Session über `@/lib/supabase/server`, Rolle aus `profiles`). Wenn nicht → 403.
  - Dann mit einem Service-Role-Client (`createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)` aus `@supabase/supabase-js`, NUR hier serverseitig) `auth.admin.inviteUserByEmail(email)` aufrufen.
  - Die gewünschte Startrolle anschließend in `profiles` setzen (der DB-Trigger legt das Profil mit Default `viewer` an; danach auf die gewählte Rolle updaten — ggf. kurz auf das Profil warten/`upsert`).
  - Saubere JSON-Antwort + Fehlerbehandlung (z.B. „E-Mail bereits vorhanden").
- Client-Formular `components/admin/InviteUserForm.tsx` ruft die Route per `fetch('/api/admin/invite', …)`, zeigt Erfolg/Fehler.
- **Hinweis als Kommentar in der Route:** Damit das in Produktion (Netlify) funktioniert, muss `SUPABASE_SERVICE_ROLE_KEY` als **server-seitige** Env-Variable in Netlify gesetzt sein (NICHT `NEXT_PUBLIC`, nicht im Client-Bundle). Lokal liegt er bereits in `.env.local`.

## Abschluss
- Nur folgende Dateien anfassen: `benutzer/page.tsx`, `components/admin/AdminNav.tsx`, neue Komponenten `UserRoleSelect.tsx` / `InviteUserForm.tsx`, neue Route `app/api/admin/invite/route.ts`.
- `tsc --noEmit` muss durchlaufen.
- Den Service-Role-Key NUR in der Route-Datei verwenden; er darf in keiner Client-Komponente importiert werden.
