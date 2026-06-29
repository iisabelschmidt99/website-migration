#!/usr/bin/env node
/**
 * Zeigt, welches Cloudflare-Konto die Tokens in .env.local sehen.
 * Vor jedem Deploy ausführen: node scripts/cf-whoami.mjs
 */
import {
  BLOCKED_CLOUDFLARE_ACCOUNT_IDS,
  getCloudflareCredentials,
  loadEnvLocal,
} from "./load-env-local.mjs";

async function main() {
  const env = loadEnvLocal();
  const { accountId, token } = getCloudflareCredentials(env);

  const verifyRes = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const verify = await verifyRes.json();
  if (!verify.success) {
    console.error("Token ungültig:", verify.errors);
    process.exit(1);
  }

  const accountRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const account = await accountRes.json();
  if (!account.success) {
    console.error("Account nicht erreichbar mit diesem Token:", account.errors);
    process.exit(1);
  }

  const blocked = BLOCKED_CLOUDFLARE_ACCOUNT_IDS.has(accountId);
  console.log("Cloudflare (nur aus fenyx-next/.env.local):");
  console.log("  Account-ID:", accountId);
  console.log("  Account-Name:", account.result?.name ?? "—");
  console.log("  Token-Status:", verify.result?.status ?? "—");
  console.log("  Zone-ID (.env):", env.CLOUDFLARE_ZONE_ID || "(noch nicht gesetzt)");
  if (blocked) {
    console.error("\nFEHLER: Diese Account-ID ist für Fenyx blockiert.");
    process.exit(1);
  }
  console.log("\nOK — deploy nur mit: node scripts/deploy-analytics-worker-cf.mjs");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
