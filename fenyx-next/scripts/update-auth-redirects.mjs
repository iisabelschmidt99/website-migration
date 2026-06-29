#!/usr/bin/env node
/**
 * Redirect-URLs in Supabase Auth freigeben (Management API).
 * Usage: node scripts/update-auth-redirects.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = "aadugmrnlvsmdxisaady";

const REQUIRED = [
  "https://fenyx-office.netlify.app/auth/landing",
  "https://fenyx-office.netlify.app/passwort-festlegen",
  "http://localhost:3000/auth/landing",
  "http://localhost:3000/passwort-festlegen",
  "https://fenyx-office.netlify.app/**",
  "http://localhost:3000/**",
];

function loadEnvLocal() {
  const raw = readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
  const vars = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

function parseAllowList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  // API liefert teils zusammengeklebte Strings ohne Trennzeichen — per Schema splitten.
  return value
    .split(/(?=https?:\/\/)/)
    .map((s) => s.trim().replace(/,+$/, ""))
    .filter(Boolean);
}

async function main() {
  const env = loadEnvLocal();
  const token = env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.error("SUPABASE_ACCESS_TOKEN fehlt in .env.local");
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const base = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;

  const getRes = await fetch(base, { headers });
  if (!getRes.ok) {
    const body = await getRes.text();
    throw new Error(`GET auth config ${getRes.status}: ${body}`);
  }

  const current = await getRes.json();
  const existing = parseAllowList(current.uri_allow_list ?? current.URI_ALLOW_LIST);
  const merged = [...new Set([...existing, ...REQUIRED])];

  const patchBody = {
    site_url: current.site_url ?? "https://fenyx-office.netlify.app",
    uri_allow_list: merged.join(","),
  };

  const patchRes = await fetch(base, {
    method: "PATCH",
    headers,
    body: JSON.stringify(patchBody),
  });

  if (!patchRes.ok) {
    const body = await patchRes.text();
    throw new Error(`PATCH auth config ${patchRes.status}: ${body}`);
  }

  const updated = await patchRes.json();
  const finalList = parseAllowList(updated.uri_allow_list ?? updated.URI_ALLOW_LIST);

  console.log("Auth Redirect URLs aktualisiert.");
  console.log("site_url:", updated.site_url ?? patchBody.site_url);
  console.log("uri_allow_list:");
  for (const url of finalList) console.log(" ", url);

  const missing = REQUIRED.filter((u) => !finalList.includes(u));
  if (missing.length) {
    console.warn("Warnung – folgende URLs fehlen noch:", missing);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fehler:", err.message);
  process.exit(1);
});
