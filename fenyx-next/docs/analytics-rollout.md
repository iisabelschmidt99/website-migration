# Analytics — Rollout-Checkliste

Technische Referenz: [`analytics-systems.md`](./analytics-systems.md)

## Status Staging (`fenyx-office.netlify.app`)

| Komponente | Status |
|---|---|
| System A — Cloudflare Worker | Live (`fenyx-analytics-ingress.isabel-98d.workers.dev`) |
| System A — `/api/collect` Fallback | Live |
| System A — Supabase Events | Live (E2E bestätigt) |
| System B — GTM Container | Live (`GTM-WVXV6MS4`) |
| System B — Consent-Gating | Live (kein GTM ohne Accept) |
| System B — GA4 Collect | Live nach Publish; Measurement ID = **`G-E8XZKVVHG6`** |
| Admin CrUX / CF Tabs | Env-abhängig (`SUPABASE_SERVICE_ROLE_KEY`, API-Keys) |

---

## 1. Supabase

```bash
# Migration anwenden (falls noch nicht geschehen)
# 20260625220000_analytics_tandem_system.sql
```

Analytics Secret Key anlegen (Rolle `analytics_ingress`) → `SUPABASE_ANALYTICS_KEY=sb_secret_...`

---

## 2. Netlify Environment

Pflicht für System A:

```env
SUPABASE_ANALYTICS_KEY=sb_secret_...
ANALYTICS_SALT_SECRET=<64 hex chars>
NEXT_PUBLIC_ANALYTICS_INGRESS_URL=https://fenyx-analytics-ingress.isabel-98d.workers.dev
```

Pflicht für System B:

```env
NEXT_PUBLIC_GTM_ID=GTM-WVXV6MS4
```

Bereits vorhanden (nicht erneut importieren): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Import-Hilfe: `netlify.env.import` (lokal, gitignored).

`NEXT_PUBLIC_*` **nicht** als Netlify-Secret markieren — sonst Secrets-Scan-Fehler. Ausnahmen in Root-`netlify.toml` → `SECRETS_SCAN_OMIT_KEYS`.

---

## 3. Cloudflare Worker

```bash
cd fenyx-next
node scripts/cf-whoami.mjs          # muss Fenyx-Account zeigen
node scripts/deploy-analytics-worker-cf.mjs
```

Setzt automatisch: `SALT_SECRET`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_ANALYTICS_KEY`.

---

## 4. GTM / GA4

1. `.env.local`: `GTM_SERVICE_ACCOUNT_JSON`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-E8XZKVVHG6`
2. Workspace sync:

```bash
node scripts/setup-gtm-dev-container.mjs
```

3. **Veröffentlichen** — per `--publish` (Service Account braucht Publish-Recht) **oder** manuell in [tagmanager.google.com](https://tagmanager.google.com) → Container `GTM-WVXV6MS4` → Senden → Publish
4. Prüfen: `curl -s "https://www.googletagmanager.com/gtm.js?id=GTM-WVXV6MS4" | grep G-E8XZKVVHG6`

---

## 5. Smoke-Test

1. Seite öffnen mit `?utm_source=smoke_test`
2. Cookie-Banner → Alle akzeptieren
3. 2–3 Seiten klicken, scrollen, CTA testen
4. Supabase: `analytics.website_analytics_events` WHERE `utm_source = 'smoke_test'`
5. Browser-Netzwerk: Worker POST → 200; GA4 `g/collect` mit `tid=G-E8XZKVVHG6`

---

## 6. Admin-Dashboards (optional)

| Tab | Variable |
|---|---|
| CrUX / Field CWV | `GOOGLE_CRUX_API_KEY` oder `GOOGLE_CWV_API_KEY` |
| GTM Health | `GTM_SERVICE_ACCOUNT_JSON` |
| Cloudflare | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` |

Alle Admin-APIs brauchen gültige Admin-Session **und** `SUPABASE_SERVICE_ROLE_KEY` in Netlify.

---

## 7. Datenschutz

`/datenschutz` um Hinweise auf cookielose Reichweitenmessung (System A) und einwilligungsbasiertes Marketing-Tracking (System B) ergänzen. Siehe [`analytics-lia.md`](./analytics-lia.md).
