# Analytics Tandem-System — Rollout

## Live ohne externe Credentials

- Migration `20260625220000_analytics_tandem_system.sql` anwenden.
- `ANALYTICS_SALT_SECRET`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` und
  `SUPABASE_ANALYTICS_JWT` in Netlify setzen.
- Der Client postet an `/api/collect`; die Route schreibt direkt in Supabase
  (`analytics.website_analytics_events`), ohne Supabase Edge Function.
- Cookiebanner ist aktiv; GTM bleibt ohne `NEXT_PUBLIC_GTM_ID` aus.

## Cloudflare Worker

1. `SUPABASE_JWT_SECRET` lokal setzen.
2. `node scripts/mint-analytics-jwt.mjs` ausführen.
3. Worker-Secrets setzen:

```bash
wrangler secret put SALT_SECRET
wrangler secret put SUPABASE_PUBLISHABLE_KEY
wrangler secret put SUPABASE_ANALYTICS_JWT
```

4. `cloudflare/workers/analytics-ingress` deployen.
5. Worker-URL als `NEXT_PUBLIC_ANALYTICS_INGRESS_URL` in Netlify setzen.

## System B / GTM

- `NEXT_PUBLIC_GTM_ID` erst setzen, wenn der Container bereit ist.
- GTM lädt nur nach Consent.
- Optional später: `NEXT_PUBLIC_GTM_BASE_URL` auf sGTM-Subdomain setzen.

## Dormant Dashboards

| Tab | Benötigte Variable |
|---|---|
| CrUX / Field CWV | `GOOGLE_CWV_API_KEY` |
| GTM Health | `GTM_SERVICE_ACCOUNT_JSON` |
| Cloudflare + AI Crawler | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` |

## Datenschutz

Zusätzlich `/datenschutz` um Reichweitenmessung und System-B-Hinweis ergänzen.
