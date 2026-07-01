#!/usr/bin/env node
/**
 * Screenshots für das neue AnalyticsHub (Gruppen + First-Party-Tabs).
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

/** { file, url?, clickTab? } — entweder direkte URL oder Tab-Klick auf First-Party */
const SHOTS = [
  { file: "01-first-party-overview", url: `${BASE}/admin/analytics?group=first-party` },
  { file: "02-first-party-sessions", url: `${BASE}/admin/analytics?group=first-party`, clickTab: "Sessions" },
  { file: "03-first-party-pages", url: `${BASE}/admin/analytics?group=first-party`, clickTab: "Pages" },
  { file: "04-first-party-paths", url: `${BASE}/admin/analytics?group=first-party`, clickTab: "Paths" },
  { file: "05-third-party-gtm", url: `${BASE}/admin/analytics?group=third-party&tab=gtm` },
  { file: "06-third-party-tracking", url: `${BASE}/admin/analytics?group=third-party&tab=tracking` },
  { file: "07-cloudflare-zone", url: `${BASE}/admin/analytics?group=cloudflare&tab=zone` },
  { file: "08-cloudflare-ai-crawl", url: `${BASE}/admin/analytics?group=cloudflare&tab=ai-crawl` },
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

async function createTempEditorUser(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey || !anonKey) {
    throw new Error("Supabase-Keys fehlen in .env.local");
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const email = `analytics-shot-${Date.now()}@fenyx-test.invalid`;
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
  const { data: signIn, error: signInErr } = await client.auth.signInWithPassword({ email, password });
  if (signInErr || !signIn.session) throw signInErr ?? new Error("Login fehlgeschlagen");

  return { admin, userId, session: signIn.session, cookieName: `sb-${projectRef(url)}-auth-token` };
}

async function captureAll(cookieName, session) {
  const port = 9444 + Math.floor(Math.random() * 200);
  const profile = `/tmp/fenyx-analytics-shot-${Date.now()}`;
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
      "--window-size=1440,1400",
      "about:blank",
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
  const report = [];

  function send(method, params = {}) {
    const callId = ++id;
    ws.send(JSON.stringify({ id: callId, method, params }));
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        cbs.delete(callId);
        reject(new Error(`timeout ${method}`));
      }, 25000);
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
      height: 1400,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const host = new URL(BASE).hostname;
    await send("Network.setCookie", {
      name: cookieName,
      value: encodeURIComponent(JSON.stringify(session)),
      url: BASE,
      domain: host === "localhost" ? "localhost" : host,
      path: "/",
      httpOnly: false,
      secure: host !== "localhost",
      sameSite: "Lax",
    });

    for (const shot of SHOTS) {
      await send("Page.navigate", { url: shot.url });
      await sleep(shot.clickTab ? 4500 : 3500);

      if (shot.clickTab) {
        await send("Runtime.evaluate", {
          expression: `(async()=>{const btn=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===${JSON.stringify(shot.clickTab)}); if(btn){btn.click(); return true} return false})()`,
          awaitPromise: true,
          returnByValue: true,
        });
        await sleep(1500);
      }

      const probe = await send("Runtime.evaluate", {
        expression: `(() => ({
          title: document.title,
          path: location.pathname + location.search,
          denied: document.body.innerText.includes('Kein Zugriff'),
          login: location.pathname.includes('/admin/login'),
          loadError: document.body.innerText.includes('konnten nicht geladen'),
          h1: document.querySelector('h1')?.textContent?.trim(),
          charts: document.querySelectorAll('.recharts-wrapper').length,
          snippet: document.body.innerText.slice(0, 280),
        }))()`,
        returnByValue: true,
      });

      const probeVal = probe.result?.value ?? {};
      const png = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      const file = path.join(OUT, `${shot.file}.png`);
      writeFileSync(file, Buffer.from(png.result.data, "base64"));
      report.push({ ...shot, file, probe: probeVal });
      console.log(`OK ${shot.file}.png — charts:${probeVal.charts ?? "?"} login:${probeVal.login ?? "?"}`);
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

  return report;
}

async function main() {
  const env = loadEnvLocal();
  const res = await fetch(BASE, { redirect: "manual" });
  if (!res.ok && res.status !== 307 && res.status !== 308) {
    throw new Error(`Dev-Server nicht erreichbar: ${BASE}`);
  }

  const { admin, userId, session, cookieName } = await createTempEditorUser(env);
  try {
    const report = await captureAll(cookieName, session);
    writeFileSync(path.join(OUT, "capture-report.json"), JSON.stringify(report, null, 2));
    console.log("\nScreenshots:", OUT);
  } finally {
    await admin.auth.admin.deleteUser(userId);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
