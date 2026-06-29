# Fenyx Analytics Ingress Worker

Der Worker ist der Produktionspfad für System A. Er schreibt direkt per PostgREST in
`analytics.website_analytics_events` und nutzt dafür ein JWT mit Rolle
`analytics_ingress`.

## Secrets

```bash
wrangler secret put SALT_SECRET
wrangler secret put SUPABASE_PUBLISHABLE_KEY
wrangler secret put SUPABASE_ANALYTICS_JWT
```

Optional in `wrangler.toml` oder als Secret – **Pflicht in Produktion**:

```text
ALLOWED_ORIGIN=https://www.fenyx-office.com,https://fenyx-office.com
```

Ohne `ALLOWED_ORIGIN` sind nur die Standard-Origins (fenyx-office.com + localhost) erlaubt.
CORS schlägt fehl, wenn der Request-Origin nicht auf der Liste steht.

`SUPABASE_ANALYTICS_JWT` wird mit `scripts/mint-analytics-jwt.mjs` erzeugt (90 Tage Gültigkeit).

## Deploy

```bash
cd cloudflare/workers/analytics-ingress
wrangler deploy
```

Danach in Netlify setzen:

```text
NEXT_PUBLIC_ANALYTICS_INGRESS_URL=https://<worker-url>
```

Wenn die Variable leer ist, postet der Client an `/api/collect` als direkten
Netlify-Fallback.
