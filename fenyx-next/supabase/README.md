# Supabase – Datenmodell & Setup

Datenmodell für das Fenyx-Backend (`/admin`): Referenzen, Blog, User-Management mit Rollen, Bilder-Upload. Passend zu Patricks Backend-Plan.

## Was `schema.sql` anlegt

| Bereich | Tabelle / Objekt | Zweck |
|---|---|---|
| Referenzen | `references` | Case Studies – Felder 1:1 wie im Frontend (`data/referenz-case-studies.ts`) |
| Blog | `blog_posts` | Blogartikel (Inhalt als Markdown) |
| User-Management | `profiles` + Rollen-Typ `user_role` | Nutzer mit Rolle `admin` / `editor` / `viewer` |
| Bilder | Storage-Bucket `media` | Upload-Tab; öffentlich lesbar, nur Redaktion lädt hoch |
| Sicherheit | Row Level Security (RLS) | Öffentlich nur *veröffentlichte* Inhalte; Schreiben nur Redaktion |

**2FA / Passwort ändern** (Security-Tab): macht Supabase Auth selbst – dafür ist kein eigenes SQL nötig.

## Einrichtung – Schritt für Schritt

1. **Supabase-Projekt anlegen** auf supabase.com (Region EU, z. B. Frankfurt – wichtig für DSGVO).
2. Im Projekt links **SQL Editor** öffnen → Inhalt von `schema.sql` einfügen → **Run**.
3. **Dich als Nutzer anlegen:** unter *Authentication → Users → Add user* mit deiner E-Mail. Dadurch entsteht automatisch ein Profil (Rolle `viewer`).
4. **Dich zum Admin machen:** im SQL Editor ausführen:
   ```sql
   update public.profiles set role = 'admin' where email = 'isabel@fenyx-office.com';
   ```
5. **Schlüssel kopieren** unter *Project Settings → API*:
   - `Project URL`
   - `anon public` key (für die öffentliche Website, liest nur veröffentlichte Inhalte)
   - `service_role` key (nur für Edge Functions / Server – **niemals** ins Frontend!)
6. **In Next.js eintragen:** Datei `fenyx-next/.env.local` anlegen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...        # Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon public key
   SUPABASE_SERVICE_ROLE_KEY=...       # nur serverseitig
   ```
   (`.env.local` ist bereits über `.gitignore` ausgeschlossen – kommt nicht ins Repo.)

## Architektur (wie besprochen mit Patrick)

- **Öffentliche Website** liest mit dem `anon`-Key direkt aus Supabase – durch RLS kommen nur `published = true`-Einträge raus. Perfekt für serverseitiges Rendering + automatische Metadaten pro Eintrag.
- **`/admin`-Schreibzugriffe** laufen über **Edge Functions** (mit `service_role` bzw. eingeloggter Redaktion). Die RLS-Regeln greifen zusätzlich als Sicherheitsnetz.
- **Rollen:** `admin` darf alles inkl. Nutzerverwaltung, `editor` pflegt Inhalte, `viewer` darf nur sehen.

## Inhalte aus Webflow übernehmen

Sobald du die **Referenzen-** und **Blog-Collection** als CSV aus Webflow exportiert hast, leite ich daraus ein Import-Skript ab, das die Zeilen in `references` bzw. `blog_posts` schreibt (Felder sind schon passend angelegt). Bis dahin kannst du die bestehenden Referenzen aus `data/referenz-case-studies.ts` übernehmen.

## Nächste Schritte (Reihenfolge)

1. Schema einspielen + Admin setzen (oben).
2. Supabase-Client im Next.js-Projekt einrichten (`lib/supabase.ts`).
3. `/admin`-Grundgerüst mit Login + Tabs (Referenzen, Blog, Upload, User, Security, Analytics).
4. Referenzen/Blog von den `data/`-Dateien auf Supabase umstellen.
5. Edge Functions für die Schreibvorgänge.
