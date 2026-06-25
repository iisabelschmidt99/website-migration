#!/usr/bin/env node
/**
 * Nutzer löschen und neu per Supabase-Einladung anlegen.
 * Usage: node scripts/reseed-admin-user.mjs <email> [role]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const email = process.argv[2]?.trim().toLowerCase();
const role = process.argv[3]?.trim() ?? "admin";
const redirectTo =
  process.argv[4]?.trim() ?? "https://fenyx-office.netlify.app/auth/landing";

if (!email) {
  console.error("Usage: node scripts/reseed-admin-user.mjs <email> [role] [redirectTo]");
  process.exit(1);
}

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

async function findUserByEmail(admin, targetEmail) {
  let page = 1;
  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (hit) return hit;
    if (data.users.length < 200) break;
    page += 1;
  }
  return null;
}

async function waitForProfile(admin, userId) {
  for (let i = 0; i < 8; i++) {
    const { data } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (data) return;
    await new Promise((r) => setTimeout(r, 150));
  }
}

async function assignStaffRole(admin, userId, targetRole) {
  if (targetRole !== "viewer") {
    const { error: delErr } = await admin
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "viewer");
    if (delErr) throw delErr;
  }
  const { error: insErr } = await admin
    .from("user_roles")
    .upsert({ user_id: userId, role: targetRole }, { onConflict: "user_id,role" });
  if (insErr) throw insErr;
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local");
    process.exit(1);
  }

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const existing = await findUserByEmail(admin, email);
  if (existing) {
    console.log(`Lösche bestehenden Nutzer ${email} (${existing.id}) …`);
    const { error: delError } = await admin.auth.admin.deleteUser(existing.id);
    if (delError) throw delError;
    console.log("Gelöscht.");
  } else {
    console.log("Kein bestehender Nutzer gefunden — lege neu an.");
  }

  console.log(`Sende Einladung an ${email} …`);
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("Einladung ohne Nutzer-ID.");

  await waitForProfile(admin, userId);
  await assignStaffRole(admin, userId, role);

  console.log("OK");
  console.log("  E-Mail:", email);
  console.log("  Rolle:", role);
  console.log("  User-ID:", userId);
  console.log("  Redirect:", redirectTo);
  console.log("  Einladungs-Mail sollte unterwegs sein.");
}

main().catch((err) => {
  console.error("Fehler:", err.message);
  process.exit(1);
});
