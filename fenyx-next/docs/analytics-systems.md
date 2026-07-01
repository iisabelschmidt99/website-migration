# Analytics — Tandem-System (System A + System B)

Stand: Juni 2026 · Staging: `https://fenyx-office.netlify.app`

Diese Datei ist die **technische Referenz** für beide Tracking-Systeme. Rollout-Schritte:
[`analytics-rollout.md`](./analytics-rollout.md). Datenschutz-Arbeitsgrundlage:
[`analytics-lia.md`](./analytics-lia.md).

---

## 1. Überblick

| | **System A — First-Party** | **System B — GTM / GA4** |
|---|---|---|
| Zweck | Reichweite, Funnel, RUM Web Vitals, Lead-Signale | Marketing-Reporting, GA4, später Retargeting |
| Consent | **Nicht erforderlich** (cookielos, kein Gerätespeicher) | **Einwilligung erforderlich** (Cookie-Banner) |
| Speicher | Supabase `analytics.*` | Google Analytics 4 |
| Client-Einstieg | `components/analytics/ClientTrackers.tsx` | `components/analytics/GtmLoader.tsx` |
| Ingress | Cloudflare Worker (Primär) oder `/api/collect` (Fallback) | `googletagmanager.com/gtm.js` |

Beide Systeme laufen **parallel** (Tandem). System A liefert die verlässliche First-Party-Wahrheit; System B ergänzt vendor-basiertes Marketing-Reporting — aber nur nach Consent.

```
Browser
  ├─ System A (immer aktiv, außer GPC/DNT)
  │    └─ POST → Cloudflare Worker → Supabase analytics.website_analytics_events
  │         (Fallback: POST → Netlify /api/collect → Supabase)
  │
  └─ System B (nur nach Cookie-Einwilligung)
       └─ GTM → GA4 Collect (region1.analytics.google.com/g/collect)
```

---

## 2. System A — First-Party / cookielos

### 2.1 Ingress-Pfade

**Produktion (bevorzugt):** Cloudflare Worker `fenyx-analytics-ingress`

- URL (workers.dev): `https://fenyx-analytics-ingress.isabel-98d.workers.dev`
- Netlify-Variable: `NEXT_PUBLIC_ANALYTICS_INGRESS_URL=<Worker-URL>`
- Deploy: `node scripts/deploy-analytics-worker-cf.mjs` (siehe [`cloudflare/README.md`](../cloudflare/README.md))

**Fallback:** Next.js Route `/api/collect`

- Greift, wenn `NEXT_PUBLIC_ANALYTICS_INGRESS_URL` leer ist
- Gleiche Event-Sanitisierung, schreibt ebenfalls in Supabase
- **Kein** Cloudflare-Geo-Enrichment (nur `cf-ipcountry`, falls Header vorhanden)

### 2.2 Authentifizierung gegen Supabase

Ingress nutzt einen **dedizierten Secret API Key** mit Rolle `analytics_ingress`:

```env
SUPABASE_ANALYTICS_KEY=sb_secret_...
```

Der Key wird als `apikey` **und** `Authorization: Bearer` an PostgREST gesendet (`Accept-Profile: analytics`).

> **Nicht mehr verwenden:** selbst gemintete HS256-JWTs (`SUPABASE_ANALYTICS_JWT`). Key über Supabase Management API anlegen.

### 2.3 Session-Hash (keine Cookies)

```text
SHA256(HMAC(SALT_SECRET, UTC-Datum) | IP/24 | reduzierte Browserkennung | Host)[0:16]
```

- Roh-IP wird **nicht** gespeichert
- Rotation täglich (UTC)
- `Sec-GPC: 1` und `DNT: 1` → Opt-out vor Hash-Bildung
- Secret: `ANALYTICS_SALT_SECRET` (Worker + Netlify)

### 2.4 Cloudflare-Anreicherung (nur Worker)

Der Worker reichert jedes Event serverseitig an:

| Feld | Quelle | Beispiel |
|---|---|---|
| `country_code` | `CF-IPCountry` | `DE` |
| `country_source` | fest | `cloudflare` |
| `region_code` | `request.cf.regionCode` | `HE` |
| `region` | `request.cf.region` | `Hesse` |
| `edge_colo` | `request.cf.colo` | `FRA` |
| `edge_asn` | `request.cf.asn` | `3209` |
| `edge_ray` | `CF-Ray` Header | … |
| `http_protocol` | `request.cf.httpProtocol` | `HTTP/3` |
| `tls_version` | `request.cf.tlsVersion` | `TLSv1.3` |
| `bot_classification` | CF Bot + UA-Heuristik | `human` / `verified_bot` / `suspected_bot` |

> **Hinweis:** `city` in der DB kommt aus dem **Seitenkontext** (Standort-LPs), nicht aus Cloudflare-Geo-IP.

### 2.5 Event-Typen

Implementiert in `lib/analytics/types.ts`, validiert in Worker und `/api/collect`:

| Event | Auslöser |
|---|---|
| `page_view` | Seitenwechsel (`PageViewTracker`) |
| `scroll_depth` | 25 / 50 / 75 / 90 % Scroll |
| `time_on_page` | Tab verlassen / `pagehide` |
| `cta_click` | `data-track-event="cta_click"` |
| `contact_form_view` | Kontakt-Section sichtbar |
| `generate_lead` | Formular / Telefon / E-Mail (auch serverseitig abgeleitet) |
| `phone_click` / `email_click` | `tel:` / `mailto:` Links |
| `outbound_click` | Externe Links |
| `video_start` | Hero-Video |
| `faq_open` | FAQ-Akkordeon |
| `tool_use` | Interaktive Tools |
| `location_select` | Standort-Auswahl |
| `select_item` / `view_item_list` | Referenzen / Listen |
| `rage_click` | Mehrfach-Klick-Muster |
| `web_vital` | `web-vitals` Library (CLS, FCP, INP, LCP, TTFB) |
| `consent_update` | Cookie-Banner |
| `gtm_loaded` | GTM-Script geladen |

Seitenkontext (`page_type`, `service_area`, `audience`, `city`, `contact_person`) kommt aus `lib/analytics/pageClassifier.ts`.

### 2.6 Core Web Vitals (RUM)

- Client: `lib/analytics/webVitals.ts` (`onCLS`, `onFCP`, `onINP`, `onLCP`, `onTTFB`)
- Gespeichert als `web_vital` in `event_data`: `metric_name`, `metric_value`, `rating`, `metric_id`
- **Echte Besucher-Messwerte** pro Event — nicht aggregiert

**CrUX (Admin-Tab):** Separates System. Google CrUX API liefert **aggregierte Felddaten** (p75 über viele Nutzer). Dient SEO/Monitoring, ersetzt nicht RUM. Endpoint: `/api/crux` → `analytics.crux_snapshots`.

### 2.7 Supabase-Schema

Migration: `supabase/migrations/20260625220000_analytics_tandem_system.sql`

| Tabelle | Zweck |
|---|---|
| `analytics.website_analytics_events` | Roh-Events |
| `analytics.website_journey_sessions` | Session-Aggregation (Seitenhistorie, Vitals, Consent) |
| `analytics.lead_funnel_session_data` | Funnel-Stufen: `bounced` → `engaged` → `intent` → `lead` |
| `analytics.website_session_attribution` | Attributions-Snapshot |
| `analytics.crux_snapshots` | CrUX-Felddaten |
| `analytics.gtm_health` | GTM-Health-Checks (Admin) |
| `analytics.cloudflare_metrics` | CF-Zone-Metriken (Admin) |

Admin-Dashboard: `/admin/analytics` (RBAC: Admin-Rollen).

#### Dashboard visuell testen

**Automatisch:**

```bash
cd fenyx-next
npm run dev          # Terminal 1
node scripts/test-analytics-dashboard-visual.mjs   # Terminal 2
```

Temporärer Editor-User (kein MFA), alle 10 Tabs, Screenshots in `.dashboard-test-screenshots/`.

**Manuell:** `/admin/login` → MFA → `/admin/analytics` → Tabs durchklicken.

| Tab | Status |
|---|---|
| Website, Pages, CTAs, Leads, Traffic Quality, Performance, Tracking Health | Live Supabase-Daten |
| GTM Health, Cloudflare, AI Crawler | Platzhalter (Env-Check, kein Live-Abruf im UI) |

### 2.8 PostgREST-Batch-Regel

Browser sendet **gemischte Event-Batches** (z. B. `page_view` + `web_vital` + `contact_form_view` in einem POST). PostgREST verlangt **identische JSON-Keys pro Row**. Worker und `/api/collect` normalisieren deshalb alle Zeilen auf dieselben Spalten (`null` statt fehlende Keys) — siehe `normalizeRowsForPostgrest()` in beiden Ingress-Pfaden.

---

## 3. System B — GTM / GA4

### 3.1 Consent-Gating

Implementierung: `components/analytics/GtmLoader.tsx` + `components/analytics/CookieBanner.tsx`

| Aktion | GTM / GA4 |
|---|---|
| Keine Interaktion (Wartezeit) | **Kein** GTM-Load |
| „Ablehnen“ | **Kein** GTM-Load |
| „Alle akzeptieren“ oder Statistik/Marketing aktiv | GTM lädt |

Consent Mode v2 (`lib/analytics/dataLayer.ts`):

- Default: `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` = `denied`
- Nach Consent: `update` entsprechend Checkbox-Auswahl
- DataLayer-Event: `fenyx_consent_update`

> **Aktuelles Verhalten:** GTM lädt, wenn `analytics` **oder** `marketing` Consent true ist. Für reines Marketing-Gating auf `marketing` einschränken — siehe Code-Kommentar in `GtmLoader.tsx`.

### 3.2 Container & GA4-Stream

| Setting | Wert |
|---|---|
| GTM Container | `GTM-WVXV6MS4` (`NEXT_PUBLIC_GTM_ID`) |
| GA4 Measurement ID (Staging) | `G-E8XZKVVHG6` — Stream für `https://fenyx-office.netlify.app` |
| GA4 Variable im GTM | Konstante **„GA4 Measurement ID“** — muss `G-E8XZKVVHG6` enthalten |

**Wichtig:** Nach Änderung der GA4-ID im GTM-Workspace muss der Container **neu veröffentlicht** werden. Die live `gtm.js` zeigt erst dann die neue ID.

Setup / Update per API:

```bash
cd fenyx-next
node scripts/setup-gtm-dev-container.mjs          # Workspace aktualisieren
node scripts/setup-gtm-dev-container.mjs --publish  # + veröffentlichen (Service Account braucht Publish-Recht)
```

Das Skript legt DataLayer-Variablen, Custom-Event-Trigger und GA4-Event-Tags an. Die GA4-ID-Variable wird bei Abweichung **aktualisiert** (nicht nur beim Erstanlegen).

Voraussetzung: `GTM_SERVICE_ACCOUNT_JSON` in `.env.local`, Service Account in GTM + GA4 als Nutzer.

### 3.3 DataLayer-Events (→ GA4 via GTM)

Gespiegelt aus System A, zusätzlich an GTM:

`page_view`, `virtual_page_view`, `cta_click`, `generate_lead`, `fenyx_consent_update`, `gtm_loaded`, `select_item`, `contact_form_view`, `tool_use`, `scroll_depth`, `web_vital`

Marketing-only Events (`pushMarketingEvent`) nur bei Marketing-Consent.

### 3.4 Verifikation (E2E)

1. Frische Browser-Session, Cookie-Banner → **Alle akzeptieren**
2. Netzwerk: `googletagmanager.com/gtm.js?id=GTM-WVXV6MS4` → 200
3. Netzwerk: `gtag/destination?id=G-E8XZKVVHG6` (nach Publish der korrekten ID)
4. Netzwerk: `region1.analytics.google.com/g/collect` mit `tid=G-E8XZKVVHG6`
5. Supabase: Events mit `utm_source=<test>` und `event_type` inkl. `consent_update`, `gtm_loaded`, `page_view`, `web_vital`

---

## 4. Umgebungsvariablen

### Netlify (Staging / Produktion)

| Variable | System | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | A + Admin | Nein |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | A (Client) | Nein (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin APIs | **Ja** |
| `SUPABASE_ANALYTICS_KEY` | A Ingress | **Ja** |
| `ANALYTICS_SALT_SECRET` | A Session-Hash | **Ja** |
| `NEXT_PUBLIC_ANALYTICS_INGRESS_URL` | A Client → Worker | Nein (public URL) |
| `NEXT_PUBLIC_GTM_ID` | B | Nein (steht im HTML) |
| `GOOGLE_CRUX_API_KEY` | Admin CrUX | **Ja** |
| `CLOUDFLARE_API_TOKEN` | Admin CF Tab | **Ja** |
| `CLOUDFLARE_ZONE_ID` | Admin CF Tab | Nein |

Import-Vorlage: `netlify.env.import` (gitignored). `NEXT_PUBLIC_*` in `netlify.toml` → `SECRETS_SCAN_OMIT_KEYS`.

**Nicht in Netlify nötig für Live-Tracking:** `GTM_SERVICE_ACCOUNT_JSON` (nur lokal für GTM-Setup), `GA4_MEASUREMENT_ID` (steckt im GTM-Container, nicht im Next.js-Bundle).

### Cloudflare Worker Secrets

| Secret | Inhalt |
|---|---|
| `SALT_SECRET` | = `ANALYTICS_SALT_SECRET` |
| `SUPABASE_PUBLISHABLE_KEY` | = `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_ANALYTICS_KEY` | = `SUPABASE_ANALYTICS_KEY` |
| `ALLOWED_ORIGIN` (optional) | Komma-Liste erlaubter Origins |

---

## 5. Deploy & Wartung

```bash
# Worker (nach Code-Änderung am Ingress)
cd fenyx-next
node scripts/cf-whoami.mjs                    # Account = Fenyx
node scripts/deploy-analytics-worker-cf.mjs

# GTM Workspace sync
node scripts/setup-gtm-dev-container.mjs [--publish]

# Netlify: Git push → Deploy; Env in Netlify UI prüfen
```

---

## 6. Bekannte Grenzen / Offene Punkte

| Thema | Status |
|---|---|
| GTM Publish per Service Account | Braucht **Publish**-Berechtigung in GTM; sonst manuell in tagmanager.google.com |
| GA4-ID im live Container | Variable im Workspace auf `G-E8XZKVVHG6` setzen + **Publish** — live `gtm.js` zeigt erst danach die neue ID |
| Admin `/api/crux`, `/api/cloudflare-analytics` | Benötigen `SUPABASE_SERVICE_ROLE_KEY` (Netlify **Runtime**-Env) + API-Keys; fehlender Key → **503** mit Hinweis, nicht 500 |
| CF Zone Analytics | Zone `fenyx-office.com` ggf. noch `pending` → keine GraphQL-Daten |
| CrUX vs RUM | CrUX = aggregiertes Google-Felddata; RUM = echte Besucher-Vitals in System A |

---

## 7. Weitere Dokumente

- [`analytics-rollout.md`](./analytics-rollout.md) — Checkliste Rollout
- [`analytics-lia.md`](./analytics-lia.md) — LIA / DSGVO-Arbeitsgrundlage System A
- [`../cloudflare/README.md`](../cloudflare/README.md) — CF Account, Worker-Deploy
- [`../cloudflare/workers/analytics-ingress/DEPLOY.md`](../cloudflare/workers/analytics-ingress/DEPLOY.md) — Worker-Details
- [`../../Empfehlung-B2B-Analytics-Fenyx.md`](../../Empfehlung-B2B-Analytics-Fenyx.md) — B2B-Ausbau-Empfehlung (Kundenunterlage)
