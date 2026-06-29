#!/usr/bin/env node
/**
 * Testet GOOGLE_CRUX_API_KEY + GTM_SERVICE_ACCOUNT_JSON aus .env.local.
 * Optional: neuen GTM-Container anlegen (--create-container).
 */
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const createContainer = process.argv.includes("--create-container");

function loadEnvLocal() {
  const raw = readFileSync(envPath, "utf8");
  const vars = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }

  const jsonStart = raw.indexOf("GTM_SERVICE_ACCOUNT_JSON=");
  if (jsonStart !== -1) {
    const after = raw.slice(jsonStart + "GTM_SERVICE_ACCOUNT_JSON=".length);
    const jsonBlock = after.split("\n# ──")[0].trim();
    try {
      vars.GTM_SERVICE_ACCOUNT_JSON = JSON.parse(jsonBlock);
    } catch {
      vars.GTM_SERVICE_ACCOUNT_JSON = null;
    }
  }
  return vars;
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(serviceAccount, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: scopes.join(" "),
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = sign
    .sign(serviceAccount.private_key)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error_description || body.error || "Token exchange failed");
  return body.access_token;
}

async function testCrux(apiKey) {
  const origin = "https://www.fenyx-office.com";
  const res = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, formFactor: "ALL_FORM_FACTORS" }),
    },
  );
  const body = await res.json();
  if (res.status === 404) return { ok: true, note: "Kein CrUX-Datensatz für Origin (normal bei wenig Traffic)" };
  if (!res.ok) return { ok: false, error: body.error?.message || res.statusText };
  const metrics = body.record?.metrics ?? {};
  return {
    ok: true,
    lcp: metrics.largest_contentful_paint?.percentiles?.p75,
    inp: metrics.interaction_to_next_paint?.percentiles?.p75,
    cls: metrics.cumulative_layout_shift?.percentiles?.p75,
  };
}

async function testGtm(serviceAccount, { create }) {
  const token = await getAccessToken(serviceAccount, [
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
    "https://www.googleapis.com/auth/tagmanager.readonly",
  ]);

  const headers = { Authorization: `Bearer ${token}` };
  const accountsRes = await fetch("https://tagmanager.googleapis.com/tagmanager/v2/accounts", { headers });
  const accountsBody = await accountsRes.json();
  if (!accountsRes.ok) {
    return { ok: false, step: "accounts", error: accountsBody.error?.message || accountsRes.statusText };
  }

  const accounts = accountsBody.account ?? [];
  if (accounts.length === 0) {
    return {
      ok: false,
      step: "accounts",
      error: "Keine GTM-Accounts sichtbar. Service Account in tagmanager.google.com unter Admin → User Management einladen.",
    };
  }

  const result = {
    ok: true,
    accounts: [],
    liveContainerId: process.env.NEXT_PUBLIC_GTM_ID || null,
  };

  for (const account of accounts) {
    const containersRes = await fetch(
      `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${account.accountId}/containers`,
      { headers },
    );
    const containersBody = await containersRes.json();
    const containers = containersBody.container ?? [];

    const entry = {
      accountId: account.accountId,
      accountName: account.name,
      containers: containers.map((c) => ({
        containerId: c.containerId,
        publicId: c.publicId,
        name: c.name,
        domainName: c.domainName,
      })),
    };

    if (create) {
      const devName = "Fenyx Next.js (Dev)";
      const exists = containers.some((c) => c.name === devName);
      if (exists) {
        entry.created = { skipped: true, reason: `Container "${devName}" existiert bereits` };
      } else {
        const createRes = await fetch(
          `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${account.accountId}/containers`,
          {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({
              name: devName,
              usageContext: ["web"],
              domainName: ["fenyx-office.com", "www.fenyx-office.com", "localhost"],
            }),
          },
        );
        const createBody = await createRes.json();
        if (!createRes.ok) {
          entry.created = { ok: false, error: createBody.error?.message || createRes.statusText };
        } else {
          entry.created = {
            ok: true,
            publicId: createBody.publicId,
            containerId: createBody.containerId,
            name: createBody.name,
          };
        }
      }
    }

    result.accounts.push(entry);
  }

  return result;
}

async function main() {
  const env = loadEnvLocal();
  process.env.NEXT_PUBLIC_GTM_ID = env.NEXT_PUBLIC_GTM_ID;

  console.log("=== CrUX API Key ===");
  if (!env.GOOGLE_CRUX_API_KEY) {
    console.log("FAIL: GOOGLE_CRUX_API_KEY fehlt");
  } else {
    const crux = await testCrux(env.GOOGLE_CRUX_API_KEY);
    console.log(crux.ok ? "OK" : "FAIL", crux.ok ? crux : crux.error);
  }

  console.log("\n=== GTM Service Account ===");
  if (!env.GTM_SERVICE_ACCOUNT_JSON?.client_email) {
    console.log("FAIL: GTM_SERVICE_ACCOUNT_JSON fehlt oder ungültig");
    process.exit(1);
  }
  console.log("E-Mail:", env.GTM_SERVICE_ACCOUNT_JSON.client_email);

  const gtm = await testGtm(env.GTM_SERVICE_ACCOUNT_JSON, { create: createContainer });
  if (!gtm.ok) {
    console.log("FAIL bei", gtm.step + ":", gtm.error);
    process.exit(1);
  }

  for (const account of gtm.accounts) {
    console.log(`\nAccount: ${account.accountName} (${account.accountId})`);
    for (const c of account.containers) {
      const live = c.publicId === env.NEXT_PUBLIC_GTM_ID ? " ← LIVE (unverändert)" : "";
      console.log(`  - ${c.publicId}  ${c.name}${live}`);
    }
    if (account.created) {
      console.log("  Container-Erstellung:", account.created);
    }
  }

  if (!createContainer) {
    console.log("\nHinweis: Neuen Dev-Container anlegen mit:");
    console.log("  node scripts/test-google-credentials.mjs --create-container");
  }
}

main().catch((e) => {
  console.error("Fehler:", e.message);
  process.exit(1);
});
