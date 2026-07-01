# Redirect-Status (Stand: Einbau in next.config)

**Quelle:** `fenyx-live-2026-06-26.csv` (421 Redirects).
**Eingebaut:** 418 als 301 in `fenyx-next/redirects.data.mjs` → aktiv über `next.config.mjs`.

- 2 Quellen mit Query-String (`/log-in?…`) übersprungen (Next.js unterstützt Query in inline-Redirects nicht separat).
- 1 Quelle ausgeschlossen: `/einrichtung-standorte/stuttgart` (ist zugleich eine **Live-Seite** → Redirect hätte sie gekapert).
- Alle Redirects sind **Einzel-Hop** (Ziele direkt auf die finale Route aufgelöst).

## Namens-Abweichungen, die ich aufgelöst habe (bitte SEO bestätigen)
Die SEO-Ziele nutzen teils andere Pfad-Namen als unsere gebauten Routen. Ich habe die Ziele auf unsere Live-Routen aufgelöst, damit die Redirects funktionieren. **Bitte bestätigen, welcher Pfad kanonisch sein soll** (sonst benennen wir unsere Routen um):

| SEO-Ziel (Export) | aufgelöst auf (unsere Route) |
|---|---|
| `/bueromoebel-ankauf-verkauf/…` | `/ankauf/…` |
| `/bueroeinrichtung-standort/…` | `/einrichtung-standorte/…` |
| `/blog/…` | `/ratgeber/…` |
| `/uber-uns` | `/ueber-uns` |

## Noch offen – Ziele ohne existierende Seite (mit SEO klären)
Diese Redirect-Ziele zeigen auf Seiten, die es (noch) nicht gibt:

- `/workspace-analytics/…` (8) – Unterseiten von Workspace-Analytics existieren nicht (nur die Hauptseite `/einrichtung/workspace-analytics`)
- `/fachhandel` (4)
- `/kauf` (4) – exakte Treffer, die nicht auf `/kauf/<slug>` passen
- `/miete` (3) – vermutlich `/einrichtung/bueromoebel-mieten`? bestätigen
- `/auktionsplattform` (2)
- `/leistungen` (1), `/bueroverwertung-new` (1), `/bueroaufloesung-new` (1), `/buroauflosung-kosteneffizient` (1, Tippfehler?)

→ Sobald geklärt (Seite bauen oder Ziel korrigieren), ergänzen wir diese ~25.

## Test
Nach dem nächsten Deploy (oder lokal `npm run dev`) eine alte URL aufrufen, z. B.
`/ratgeber/wohlfuehlen-im-buero` → sollte auf `/bueroeinrichtung/wohlfuehlen-im-buero` weiterleiten (301).
