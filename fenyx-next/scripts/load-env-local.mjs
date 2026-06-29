import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Cursor-MCP-Default — niemals für Fenyx-Deploys. */
export const BLOCKED_CLOUDFLARE_ACCOUNT_IDS = new Set([
  "9ee9feaf0b2f65864cc214ad39dec127",
]);

export function loadEnvLocal(rootDir = path.join(__dirname, "..")) {
  const raw = readFileSync(path.join(rootDir, ".env.local"), "utf8");
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

export function getCloudflareCredentials(env = loadEnvLocal()) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token =
    env.CLOUDFLARE_WORKERS_DEPLOY_TOKEN?.trim() ||
    env.CLOUDFLARE_API_TOKEN?.trim();

  if (!accountId) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID fehlt in fenyx-next/.env.local — siehe cloudflare/README.md",
    );
  }
  if (!token) {
    throw new Error(
      "CLOUDFLARE_WORKERS_DEPLOY_TOKEN (oder CLOUDFLARE_API_TOKEN) fehlt in .env.local",
    );
  }
  if (BLOCKED_CLOUDFLARE_ACCOUNT_IDS.has(accountId)) {
    throw new Error(
      `CLOUDFLARE_ACCOUNT_ID ${accountId} ist blockiert (falsches/Privat-Konto). Fenyx-Account-ID eintragen.`,
    );
  }
  return { accountId, token };
}
