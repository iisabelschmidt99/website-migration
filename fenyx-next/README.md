# Fenyx Website – Next.js

Das neue Grundgerüst der Fenyx-Website auf **Next.js** (Migration weg von Webflow).

## Was hier schon läuft

- **Next.js 14** mit App Router und TypeScript
- **Tailwind CSS** mit den Fenyx-Design-Tokens (Farben `abyss`/`signal`/`mist`, Font Inter, eckige Ecken) – 1:1 aus der alten Seite übernommen
- **Echte Marken-Fonts** (Roobert für Text, Telegraf für Überschriften), self-hosted über `next/font/local` – aus dem Webflow-Original übernommen
- **Header** (`components/Header.tsx`) – Logo + Navigation mit Mega-Menü-Dropdowns, plus mobiles Menü
- **Footer** (`components/Footer.tsx`) – komplett migriert inkl. Kontakt, Social-Links, Leistungs-Spalten
- **Startseite** (`app/page.tsx`) – Hero-Bereich migriert; weitere Abschnitte folgen
- **`.cursorrules`** – Dauerkontext für Cursor (Design-Tokens, Konventionen, URL-Struktur)

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) (Version 18 oder neuer).

```bash
cd fenyx-next
npm install      # einmalig: Abhängigkeiten installieren
npm run dev      # Entwicklungsserver starten
```

Dann im Browser **http://localhost:3000** öffnen. Änderungen am Code erscheinen sofort.

```bash
npm run build    # Produktions-Build erzeugen (testet, ob alles fehlerfrei ist)
```

## Projektstruktur

```
fenyx-next/
├─ app/
│  ├─ layout.tsx      # Hülle um jede Seite (Header + Footer + Schrift + SEO-Metadaten)
│  ├─ page.tsx        # Startseite "/"
│  └─ globals.css     # Tailwind + Basis-Styles
├─ components/
│  ├─ Header.tsx      # Navigation (einmal definiert, erscheint überall)
│  └─ Footer.tsx      # Footer
├─ public/assets/     # Bilder, Logos, Hero-Video
├─ tailwind.config.ts # Fenyx-Design-Tokens
└─ .cursorrules       # Dauerkontext für Cursor
```

## Nächste Schritte (seitenweise, wie mit Patrick besprochen)

1. **Restliche Homepage-Abschnitte** ergänzen: Referenzen-Logogrid, Leistungen/Lebenszyklus, „Bekannt aus", Kontaktformular.
2. **Unterseiten migrieren** – pro Leistung eine Seite unter der oben in `.cursorrules` definierten URL-Struktur.
3. **Kontaktformular** an die bestehende HubSpot-Anbindung (Netlify-Funktion) hängen.
4. **Supabase** anbinden: Blogsystem + Referenzen dynamisch.
5. **Analytics Tandem-System** — siehe [`docs/analytics-systems.md`](docs/analytics-systems.md) (System A cookielos + System B GTM/GA4).

## Hinweis zum Verhältnis zur alten Seite

Die alte statische Seite (HTML-Dateien im übergeordneten Ordner und in `../fenyx-rebuild/`)
bleibt unangetastet und weiter live. Dieses `fenyx-next/`-Projekt entsteht parallel
daneben, damit jederzeit verglichen und nichts überschrieben wird.
