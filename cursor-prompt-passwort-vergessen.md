# Cursor-Prompt: „Passwort vergessen"-Flow (Reset anfordern)

Die Seite `app/passwort-festlegen/page.tsx` verarbeitet bereits Recovery-Links (`type=recovery` via `verifyOtp`). Es fehlt nur die **Anforderungs-Seite**, über die man als eingeloggt-ausgesperrter Nutzer einen Reset-Link per E-Mail anfordert.

## 1) Neue Seite `app/passwort-vergessen/page.tsx` (öffentlich, Client-Komponente)
- Optik wie `app/admin/login/page.tsx` (Logo, gleiche Input-/Button-Styles, abyss-Hintergrund, zentriert, max-w-sm). Deutsch kommentieren.
- Ein Feld: **E-Mail**. Button „Link senden".
- Beim Absenden:
  ```ts
  const supabase = createClient(); // @/lib/supabase/client
  await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/passwort-festlegen`,
  });
  ```
- Aus Sicherheitsgründen **neutrale** Erfolgsmeldung anzeigen (egal ob die E-Mail existiert):
  „Falls ein Konto mit dieser Adresse existiert, haben wir dir einen Link zum Zurücksetzen geschickt."
- Fehlerfall (z.B. Backend nicht konfiguriert / Netzwerk) freundlich abfangen.
- Loading-State am Button („Sende …").

## 2) Login-Seite ergänzen — `app/admin/login/page.tsx`
- Unter dem Login-Formular einen dezenten Link einfügen:
  `<Link href="/passwort-vergessen" className="...">Passwort vergessen?</Link>`
  (Styling dezent, mist/hover-signal, wie die übrigen Sekundär-Links.)

## 3) Hinweis
- Als Kommentar vermerken: In Supabase unter **Authentication → URL Configuration** muss `.../passwort-festlegen` in den Redirect URLs freigegeben sein (lokal `http://localhost:3000/passwort-festlegen` + Produktions-/Netlify-URL) — sonst kommt der Reset-Link nicht auf der Seite an. (Gleiche Voraussetzung wie beim Einladungs-Flow.)

## Abschluss
- Nur anfassen: neue Datei `app/passwort-vergessen/page.tsx`, `app/admin/login/page.tsx`.
- `tsc --noEmit` muss durchlaufen.
- Test: `/admin/login` → „Passwort vergessen?" → E-Mail eingeben → Reset-Mail kommt → Link führt auf `/passwort-festlegen` → neues Passwort setzen → eingeloggt auf `/admin`.
