#!/usr/bin/env node
/**
 * Visueller Smoke-Test für /admin/analytics (alle Tabs).
 * Legt temporären Editor-Nutzer an (kein MFA), loggt per Session-Cookie ein, Screenshots.
 *
 * Usage: node scripts/test-analytics-dashboard-visual.mjs
 * Voraussetzung: npm run dev auf http://localhost:3000
 */
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DASHBOARD_TEST_BASE ?? "http://localhost:3000";
const OUT = path.join(__dirname, "..", ".dashboard-test-screenshots");
const TABS = [
  "Website",
  "Pages",
  "CTAs",
  "Leads",
  "Traffic Quality",
  "Performance",
  "Tracking Health",
  "GTM Health",
  "Cloudflare",
  "AI Crawler",
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

function projectRef(url) {
  return new URL(url).hostname.split(".")[0];
}

async function waitForDevServer(base, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(base, { redirect: "manual" });
      if (res.ok || res.status === 307 || res.status === 308) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Dev-Server nicht erreichbar: ${base}`);
}

async function createTempEditorUser(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY oder ANON_KEY fehlt.");
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const email = `dashboard-visual-${Date.now()}@fenyx-test.invalid`;
  const password = crypto.randomBytes(18).toString("base64url");

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr) throw createErr;
  const userId = created.user.id;

  await new Promise((r) => setTimeout(r, 300));
  const { error: roleErr } = await admin
    .from("user_roles")
    .upsert({ user_id: userId, role: "editor" }, { onConflict: "user_id,role" });
  if (roleErr) throw roleErr;

  const client = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInErr } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr || !signIn.session) throw signInErr ?? new Error("Kein Session nach Login");

  return { admin, userId, email, session: signIn.session, cookieName: `sb-${projectRef(url)}-auth-token` };
}

async function runBrowserScreenshots(cookieName, session) {
  const port = 9333 + Math.floor(Math.random() * 400);
  const profile = `/tmp/fenyx-dashboard-test-${Date.now()}`;
  const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  mkdirSync(OUT, { recursive: true });

  const proc = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--window-size=1440,1200",
      `${BASE}/admin/analytics`,
    ],
    { stdio: "ignore" },
  );

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function pageWs() {
    for (let i = 0; i < 80; i++) {
      try {
        const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
        const p = pages.find((x) => x.type === "page" && x.webSocketDebuggerUrl);
        if (p) return p.webSocketDebuggerUrl;
      } catch {}
      await sleep(250);
    }
    throw new Error("Chrome CDP nicht erreichbar");
  }

  let ws;
  let id = 0;
  const cbs = new Map();
  const results = [];

  function send(method, params = {}) {
    const callId = ++id;
    ws.send(JSON.stringify({ id: callId, method, params }));
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        cbs.delete(callId);
        reject(new Error(`timeout ${method}`));
      }, 20000);
      cbs.set(callId, {
        resolve: (v) => {
          clearTimeout(t);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(t);
          reject(e);
        },
      });
    });
  }

  try {
    ws = new WebSocket(await pageWs());
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });
    ws.onmessage = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id && cbs.has(d.id)) {
        const cb = cbs.get(d.id);
        cbs.delete(d.id);
        d.error ? cb.reject(new Error(JSON.stringify(d.error))) : cb.resolve(d);
      }
    };

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const host = new URL(BASE).hostname;
    const cookieValue = encodeURIComponent(JSON.stringify(session));
    await send("Network.setCookie", {
      name: cookieName,
      value: cookieValue,
      url: BASE,
      domain: host === "localhost" ? "localhost" : host,
      path: "/",
      httpOnly: false,
      secure: host !== "localhost",
      sameSite: "Lax",
    });

    await send("Page.navigate", { url: `${BASE}/admin/analytics` });
    await sleep(5000);

    const gate = await send("Runtime.evaluate", {
      expression: `(() => ({
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim(),
        denied: document.body.innerText.includes('Kein Zugriff'),
        login: location.pathname.includes('/admin/login'),
        loadError: document.body.innerText.includes('Analytics-Daten konnten nicht geladen'),
        tabCount: document.querySelectorAll('button').length,
      }))()`,
      returnByValue: true,
    });
    results.push({ step: "initial", data: gate.result.value });

    for (const tab of TABS) {
      await send("Runtime.evaluate", {
        expression: `(async()=>{const btn=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===${JSON.stringify(tab)}); if(btn){btn.click(); return true} return false})()`,
        awaitPromise: true,
        returnByValue: true,
      });
      await sleep(1200);
      const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      const file = path.join(OUT, `${tab.replace(/\s+/g, "-").toLowerCase()}.png`);
      writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      const probe = await send("Runtime.evaluate", {
        expression: `(() => ({
          tab: ${JSON.stringify(tab)},
          kpis: [...document.querySelectorAll('p.text-2xl')].map(e=>e.textContent?.trim()).slice(0,6),
          hasChart: !!document.querySelector('.recharts-wrapper'),
          hasMap: !!document.querySelector('svg[data-testid]') || document.body.innerText.includes('Country Map'),
          bodySnippet: document.body.innerText.slice(0,400),
        }))()`,
        returnByValue: true,
      });
      results.push({ tab, screenshot: file, probe: probe.result.value });
    }
  } finally {
    try {
      ws?.close();
    } catch {}
    proc.kill("SIGTERM");
    await sleep(400);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {}
  }

  return results;
}

async function main() {
  const env = loadEnvLocal();
  await waitForDevServer(BASE);
  console.log("Dev-Server OK:", BASE);

  const { admin, userId, email, session, cookieName } = await createTempEditorUser(env);
  console.log("Temp-User:", email, userId);

  try {
    const results = await runBrowserScreenshots(cookieName, session);
    const report = {
      base: BASE,
      screenshotsDir: OUT,
      tempUser: email,
      results,
    };
    writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
    console.log("\n=== Dashboard Visual Test ===");
    console.log("Screenshots:", OUT);
    console.log("Initial:", JSON.stringify(results.find((r) => r.step === "initial")?.data));
    for (const r of results.filter((x) => x.tab)) {
      console.log(`- ${r.tab}: ${r.screenshot}`);
      if (r.probe?.bodySnippet?.includes("konnten nicht geladen")) {
        console.log("  WARN: Datenladefehler sichtbar");
      }
    }
  } finally {
    await admin.auth.admin.deleteUser(userId);
    console.log("Temp-User gelöscht.");
  }
}

main().catch((err) => {
  console.error("Fehler:", err.message);
  process.exit(1);
});
