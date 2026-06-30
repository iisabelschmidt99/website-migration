# Fenyx Analytics Ingress Worker

Produktions-Ingress für **System A**. Empfängt Event-Batches vom Browser, reichert sie mit Cloudflare-Metadaten an und schreibt in Supabase `analytics.website_analytics_events`.

Vollständige Doku: [`../../../docs/analytics-systems.md`](../../../docs/analytics-systems.md)

## Live-URL

```text
https://fenyx-analytics-ingress.isabel-98d.workers.dev
```

Netlify: `NEXT_PUBLIC_ANALYTICS_INGRESS_URL=<URL oben>`

## Secrets (via Deploy-Script oder wrangler)

| Secret | Wert |
|---|---|
| `SALT_SECRET` | = `ANALYTICS_SALT_SECRET` aus `.env.local` |
| `SUPABASE_PUBLISHABLE_KEY` | = `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_ANALYTICS_KEY` | = `SUPABASE_ANALYTICS_KEY` (`sb_secret_...`, Rolle `analytics_ingress`) |

Optional:

```text
ALLOWED_ORIGIN=https://www.fenyx-office.com,https://fenyx-office.com,https://fenyx-office.netlify.app
```

Ohne `ALLOWED_ORIGIN` gelten die Standard-Origins in `src/index.ts` (inkl. Netlify-Staging).

> **Legacy:** `SUPABASE_ANALYTICS_JWT` wird als Fallback unterstützt, ist aber deprecated. Neuen Key über Supabase Management API anlegen — **nicht** selbst minten.

## Deploy (empfohlen)

```bash
cd fenyx-next
node scripts/cf-whoami.mjs
node scripts/deploy-analytics-worker-cf.mjs
```

## Deploy (manuell)

```bash
cd fenyx-next/cloudflare/workers/analytics-ingress
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_WORKERS_DEPLOY_TOKEN"
npx wrangler deploy --account-id "$CLOUDFLARE_ACCOUNT_ID"
# Secrets einzeln: wrangler secret put SALT_SECRET ...
```

## Cloudflare-Anreicherung

Pro Event (nur Worker, nicht `/api/collect`):

- Geo: `country_code`, `region_code`, `region`
- Edge: `edge_colo`, `edge_asn`, `edge_ray`, `http_protocol`, `tls_version`
- Bot: `bot_classification`, `visitor_type`, `verified_bot`

## Fallback

Ist `NEXT_PUBLIC_ANALYTICS_INGRESS_URL` leer, postet der Client an `/api/collect` (Netlify Function).
