# Redirect-Abgleich: SEO-Export vs. neuer Next.js-Stand

**Quelle:** `fenyx-live-2026-06-26.csv` — 421 Weiterleitungen (alt → neu), sauber (keine Dubletten, keine Selbst-Redirects, alle Pfade gültig).
**Redirect-Datei erzeugt:** `redirects-301-DRAFT.txt` (Netlify-Format, 301).

## ⚠️ Kernbefund
Von 421 Ziel-URLs zeigen **160 auf bereits vorhandene** Routen — aber **261 auf URLs, die der aktuelle Next.js-Stand (noch) NICHT bedient.** Grund: Der SEO-Export geht von einer **flachen** URL-Struktur aus, das neue Projekt ist aber teils **verschachtelt** gebaut.

Beispiel:
| SEO-Ziel (Export) | aktuelle Next.js-Route |
|---|---|
| `/bueroaufloesung` | `/verwertung/bueroaufloesung` |
| `/workspace-analytics` | `/einrichtung/workspace-analytics` |
| `/digitale-inventarisierung` | `/bestandsmanagement/digitale-inventarisierung` |
| `/mittelstand` | `/fenyx-fuer-sie/mittelstand` |
| `/blog/…` | `/ratgeber/…` |

**Heißt:** Würden wir die Redirects jetzt live schalten, liefen 261 davon auf 404-Seiten. Erst muss die **URL-Struktur des neuen Sites an die SEO-Ziele angeglichen** werden.

## Die 261 offenen Ziele – in drei Gruppen

### 1) Neue Landingpage-Collections (müssen noch gebaut werden) — ~195
Das sind die Seiten aus unserer „~297 Landingpages"-Liste; sie existieren noch gar nicht:
- `/bueroeinrichtung/…` (116)
- `/kauf/…` (38)
- `/bueromoebel-ankauf-verkauf/…` (22)
- `/bueroeinrichtung-standort/…` (19)

→ Entstehen ideal über den **Page-Builder** bzw. die Landingpage-Collections.

### 2) Struktur-Konflikt – Seite existiert, aber unter anderem Pfad — ~45
Diese Seiten sind schon gebaut, nur eben verschachtelt statt flach:
- `/bueroaufloesung` (21) → `/verwertung/bueroaufloesung`
- `/workspace-analytics` (10) → `/einrichtung/workspace-analytics`
- `/digitale-inventarisierung` (2), `/projektmanagement` (2) → unter `/bestandsmanagement/…`
- `/aufbereitung` (2), `/mitarbeiterverkauf` (1) → unter `/verwertung/…`
- `/mittelstand` (2), `/grossunternehmen` (2) → unter `/fenyx-fuer-sie/…`
- `/miete` (3), `/bueromoebel-mieten` (1) → `/einrichtung/bueromoebel-mieten`

→ Entscheidung nötig: **Routen flach umbenennen** (empfohlen, da SEO-Vorgabe) oder zusätzliche interne Weiterleitung.

### 3) Mit dem SEO-Mann zu klären (Unstimmigkeiten) — ~21
- `/blog/…` (6) — wir hatten Blog → `/ratgeber` umbenannt. Behalten wir doch `/blog`?
- `/uber-uns` (4) — fehlt das „e" (richtig wäre `/ueber-uns`)? Tippfehler oder Absicht?
- `/fachhandel` (4), `/auktionsplattform` (2), `/leistungen` (1) — gibt es als neue Seiten noch nicht.
- `/bueroverwertung-new`, `/bueroaufloesung-new`, `/buroauflosung-kosteneffizient` (Tippfehler-Variante?) — kurz gegenprüfen.

## Empfehlung / nächste Schritte
1. **Struktur-Entscheidung:** Die SEO-Ziele als **kanonische, flache** URL-Struktur übernehmen (der SEO-Mann hat sie ja so definiert). Das ist der saubere Weg — sonst zeigen die 301 ins Leere.
2. **Gruppe 2** (45) zuerst: bestehende Routen flach umbenennen → schnell erledigt, viele Treffer.
3. **Gruppe 1** (195) über Page-Builder/Collections bauen.
4. **Gruppe 3** (21) mit dem SEO-Mann durchgehen (v. a. `/blog` vs `/ratgeber` und `/uber-uns`).
5. Redirect-Datei (`redirects-301-DRAFT.txt`) erst **nach** Schritt 1–3 in das Projekt übernehmen und live schalten — dann zeigen alle 421 auf echte Seiten.

> Wichtig vor Go-Live: Auch die **interne Verlinkung** (Menü/Footer/Buttons) auf die finalen flachen URLs anpassen, sonst verlinkt die Seite intern auf Pfade, die nur per Redirect erreichbar sind.
