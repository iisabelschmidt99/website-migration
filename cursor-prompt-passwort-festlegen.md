# Cursor-Prompt: „Passwort festlegen"-Seite für eingeladene Nutzer

Eingeladene Backend-Nutzer (per `auth.admin.inviteUserByEmail`) brauchen eine Seite, um nach dem Klick auf den Einladungslink ihr Passwort zu setzen. Aktuell landen sie auf `/admin/login` und können kein Passwort vergeben.

## Wichtig: Pfad außerhalb von `/admin`
Die Seite MUSS unter einem **öffentlichen** Pfad liegen, NICHT unter `/admin`. Grund: Die Middleware (`matcher: ["/admin","/admin/:path*"]`) leitet nicht-eingeloggte Aufrufe von `/admin/*` sofort auf den Login um — beim Einladungslink ist die Sitzung beim ersten Server-Aufruf aber noch nicht gesetzt (sie wird erst clientseitig aus der URL gelesen). Würde die Seite unter `/admin` liegen, käme der Nutzer nie an.

→ Seite anlegen unter **`app/passwort-festlegen/page.tsx`** (Top-Level, öffentlich, NICHT im `(panel)`-Ordner).

## 1) Invite-Route anpassen
In `app/api/admin/invite/route.ts` das `redirectTo` der Einladung von `/admin/login` auf die neue Seite ändern:
```ts
redirectTo: `${origin}/passwort-festlegen`,
```

## 2) Seite `app/passwort-festlegen/page.tsx` (Client-Komponente)
Ablauf:
- Beim Laden die Sitzung aus dem Einladungslink herstellen. Zwei Varianten abdecken (je nach Supabase-Flow):
  - **Hash-Variante** (`#access_token=…&type=invite`): Der Browser-Client aus `@/lib/supabase/client` hat `detectSessionInUrl` standardmäßig aktiv und übernimmt die Session automatisch. Kurz `supabase.auth.getSession()` abwarten/prüfen.
  - **Token-Hash-Variante** (`?token_hash=…&type=invite` in der Query): mit `supabase.auth.verifyOtp({ token_hash, type: "invite" })` die Session herstellen.
- Wenn keine gültige Session/kein Token vorhanden ist → freundliche Meldung „Dieser Link ist ungültig oder abgelaufen. Bitte eine neue Einladung anfordern." (kein Formular zeigen).
- Wenn Session da: Formular mit **Passwort** + **Passwort wiederholen**.
  - Mindestlänge 8 Zeichen, beide müssen übereinstimmen (clientseitig prüfen, Fehlermeldungen auf Deutsch).
  - Absenden → `supabase.auth.updateUser({ password })`.
  - Bei Erfolg: kurze Bestätigung, dann auf `/admin` weiterleiten (`router.replace("/admin")`, danach `router.refresh()`).
- Optik wie die bestehende Login-Seite (`app/admin/login/page.tsx`) übernehmen: gleiches Logo, gleiche Input-/Button-Styles, abyss-Hintergrund, zentriert. Deutsch kommentieren.

## 3) Hinweis-Kommentar in der Seite
Als Kommentar vermerken: Damit der Link funktioniert, muss in Supabase unter **Authentication → URL Configuration** die URL `…/passwort-festlegen` in den **Redirect URLs** freigegeben sein (lokal `http://localhost:3000/passwort-festlegen` und die Netlify-/Produktions-URL).

## Optional (nur wenn schnell): Wiederverwendung für Passwort-Reset
Die gleiche Seite funktioniert später auch für „Passwort vergessen" (Recovery-Link, `type: "recovery"`). Wenn ohne Mehraufwand möglich, `type` aus der URL flexibel behandeln (`invite` oder `recovery`); sonst weglassen.

## Abschluss
- Nur anfassen: neue Datei `app/passwort-festlegen/page.tsx`, `app/api/admin/invite/route.ts`.
- `tsc --noEmit` muss durchlaufen.
- Lokal testen: über `/admin/benutzer` eine Einladung an eine zweite Adresse schicken, in Supabase unter Authentication → Users beim Nutzer „Generate link" kopieren, im Browser öffnen → sollte auf `/passwort-festlegen` führen, Passwort setzen, danach eingeloggt auf `/admin` landen.
