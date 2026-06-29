#!/usr/bin/env node
/**
 * Deployt den Analytics-Ingress-Worker ins Fenyx-Cloudflare-Konto.
 * Voraussetzung: node scripts/cf-whoami.mjs (Account prüfen)
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCloudflareCredentials, loadEnvLocal } from "./load-env-local.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workerDir = path.join(__dirname, "..", "cloudflare", "workers", "analytics-ingress");
const bundlePath = "/tmp/fenyx-analytics-ingress.mjs";

const env = loadEnvLocal();
const { accountId, token } = getCloudflareCredentials(env);

execSync(
  `npx esbuild "${path.join(workerDir, "src/index.ts")}" --bundle --format=esm --platform=browser --outfile="${bundlePath}"`,
  { stdio: "inherit", cwd: workerDir },
);

const script = readFileSync(bundlePath, "utf8");
const allowedOrigin =
  "https://www.fenyx-office.com,https://fenyx-office.com,https://fenyx-office.netlify.app,http://localhost:3000";

const metadata = {
  main_module: "index.mjs",
  compatibility_date: "2026-06-24",
  bindings: [
    { type: "plain_text", name: "SUPABASE_URL", text: env.NEXT_PUBLIC_SUPABASE_URL },
    { type: "plain_text", name: "ALLOWED_ORIGIN", text: allowedOrigin },
  ],
};

const boundary = `FormBoundary${Date.now()}`;
const body = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="metadata"',
  "Content-Type: application/json",
  "",
  JSON.stringify(metadata),
  `--${boundary}`,
  'Content-Disposition: form-data; name="index.mjs"; filename="index.mjs"',
  "Content-Type: application/javascript+module",
  "",
  script,
  `--${boundary}--`,
].join("\r\n");

console.log(`Deploy → Account ${accountId} / Worker fenyx-analytics-ingress`);

const uploadRes = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/fenyx-analytics-ingress`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  },
);
const uploadJson = await uploadRes.json();
if (!uploadJson.success) {
  console.error("Upload fehlgeschlagen:", uploadJson.errors);
  process.exit(1);
}
console.log("Worker-Script hochgeladen.");

const secrets = {
  SALT_SECRET: env.ANALYTICS_SALT_SECRET,
  SUPABASE_PUBLISHABLE_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_ANALYTICS_JWT: env.SUPABASE_ANALYTICS_JWT,
};

for (const [name, text] of Object.entries(secrets)) {
  if (!text) {
    console.error(`Secret fehlt: ${name}`);
    process.exit(1);
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/fenyx-analytics-ingress/secrets`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, text, type: "secret_text" }),
    },
  );
  const json = await res.json();
  if (!json.success) {
    console.error(`Secret ${name} fehlgeschlagen:`, json.errors);
    process.exit(1);
  }
  console.log(`Secret gesetzt: ${name}`);
}

await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/fenyx-analytics-ingress/subdomain`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enabled: true }),
  },
);

const subRes = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
  { headers: { Authorization: `Bearer ${token}` } },
);
const subJson = await subRes.json();
const workerUrl = subJson.result?.subdomain
  ? `https://fenyx-analytics-ingress.${subJson.result.subdomain}.workers.dev`
  : null;

console.log("OK");
console.log("Worker-URL:", workerUrl);
console.log("Netlify: NEXT_PUBLIC_ANALYTICS_INGRESS_URL=" + workerUrl);
