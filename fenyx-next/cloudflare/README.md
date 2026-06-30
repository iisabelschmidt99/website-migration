# Cloudflare — nur Fenyx-Konto (repo-lokal)

**Wichtig:** Cursor-Cloudflare-MCP und globales `wrangler login` können auf ein **falsches** Konto zeigen (z. B. Privat-Account). Für dieses Repo gilt **ausschließlich** `.env.local`.

## Einmal einrichten

1. Im **Fenyx**-Cloudflare-Dashboard einloggen (nicht MCP, nicht anderer Account).

2. **Account-ID** kopieren: Dashboard → rechts „Account ID“.

3. **API-Token** erstellen (Workers deploy):
   - My Profile → API Tokens → Create Token
   - Template: **Edit Cloudflare Workers** (oder Custom: Account → Workers Scripts → Edit)
   - Account Resources: **nur Fenyx-Account**

4. In `fenyx-next/.env.local` eintragen:

```env
CLOUDFLARE_ACCOUNT_ID=<fenyx-account-id>
CLOUDFLARE_WORKERS_DEPLOY_TOKEN=<workers-deploy-token>
CLOUDFLARE_ZONE_ID=<zone-id-fenyx-office.com>
```

5. Prüfen (Pflicht vor Deploy):

```bash
cd fenyx-next
node scripts/cf-whoami.mjs
```

Ausgabe muss **Fenyx-Account-Name** zeigen — nicht ein Privat-/Fremdkonto.

## Worker deployen

```bash
cd fenyx-next
node scripts/cf-whoami.mjs
node scripts/deploy-analytics-worker-cf.mjs
```

Danach `NEXT_PUBLIC_ANALYTICS_INGRESS_URL` in Netlify setzen (Worker-URL aus Script-Output).

Analytics-Doku: [`docs/analytics-systems.md`](../docs/analytics-systems.md)

## Verboten in diesem Repo

- Cloudflare **MCP** (`user-cloudflare-api`) — siehe `.cursor/rules/no-mcp.mdc`
- Deploy **ohne** `CLOUDFLARE_ACCOUNT_ID` in `.env.local`
- Globales `wrangler login` allein reicht **nicht** — Token + Account-ID aus `.env.local` sind maßgeblich

## Wrangler (optional)

```bash
cd fenyx-next/cloudflare/workers/analytics-ingress
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_WORKERS_DEPLOY_TOKEN"  # aus .env.local
npx wrangler deploy --account-id "$CLOUDFLARE_ACCOUNT_ID"
```

`account_id` steht absichtlich **nicht** hardcoded in `wrangler.toml`.
