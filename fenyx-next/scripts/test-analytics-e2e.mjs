#!/usr/bin/env node
/**
 * E2E-Smoke-Tests für /admin/analytics (Analytics Correctness Sweep).
 * Nutzt Headless-Chrome via CDP — kein Playwright nötig.
 *
 * Usage: node scripts/test-analytics-e2e.mjs
 * Voraussetzung: npm run dev auf http://localhost:3000
 */
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DASHBOARD_TEST_BASE ?? "http://localhost:3000";

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
    throw new Error("Supabase-Keys fehlen in .env.local");
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const email = `analytics-e2e-${Date.now()}@fenyx-test.invalid`;
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

function assert(name, condition, detail = "") {
  if (!condition) {
    throw new Error(`FAIL ${name}${detail ? `: ${detail}` : ""}`);
  }
  console.log(`PASS ${name}`);
}

async function runE2e(cookieName, session) {
  const port = 9555 + Math.floor(Math.random() * 200);
  const profile = `/tmp/fenyx-analytics-e2e-${Date.now()}`;
  const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

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

  async function evalJs(expression, awaitPromise = false) {
    const res = await send("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue: true,
    });
    const inner = res.result?.result ?? res.result;
    if (inner?.exceptionDetails) {
      throw new Error(`JS: ${JSON.stringify(inner.exceptionDetails)}`);
    }
    return inner?.value ?? null;
  }

  async function navigate(url) {
    await send("Page.navigate", { url });
    await sleep(4500);
  }

  async function clickButton(label) {
    const clicked = await evalJs(
      `(async()=>{const btn=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===${JSON.stringify(label)}); if(btn){btn.click(); return true} return false})()`,
      true,
    );
    await sleep(2000);
    return clicked;
  }

  async function clickTab(label) {
    const clicked = await evalJs(
      `(async()=>{
        const tabs = [...document.querySelectorAll('button')].filter(b => {
          const t = b.textContent?.trim();
          return ['Overview','Sessions','Pages','Paths','CTAs','Traffic','Leads','Performance','UX Signals'].includes(t ?? '');
        });
        const btn = tabs.find(b => b.textContent?.trim() === ${JSON.stringify(label)});
        if (btn) { btn.click(); return true; }
        return false;
      })()`,
      true,
    );
    await sleep(2000);
    return clicked;
  }

  async function waitForText(text, attempts = 8) {
    for (let i = 0; i < attempts; i++) {
      const found = await evalJs(`document.body.innerText.includes(${JSON.stringify(text)})`);
      if (found) return true;
      await sleep(500);
    }
    return false;
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

    // 1) First-Party lädt
    await navigate(`${BASE}/admin/analytics?group=first-party`);
    // Warten bis Client-Komponenten (DateRangeSelector) hydriert sind
    let probe = null;
    for (let i = 0; i < 10; i++) {
      probe = await evalJs(`(() => ({
        login: location.pathname.includes('/admin/login'),
        denied: document.body.innerText.includes('Kein Zugriff'),
        loadError: document.body.innerText.includes('konnten nicht geladen'),
        h1: document.querySelector('h1')?.textContent?.trim(),
        hasRangeLabel: document.body.innerText.includes('Zeitraum') && document.body.innerText.includes('First-Party'),
        heuteActive: [...document.querySelectorAll('button')].some(
          (b) => b.textContent?.trim() === 'Heute' && b.className.includes('bg-signal'),
        ),
        search: location.search,
      }))()`);
      if (probe?.h1 === "Analytics" && probe?.hasRangeLabel) break;
      await sleep(800);
    }

    assert("Analytics-Seite erreichbar (kein Login)", probe && !probe.login, probe?.login ? "redirect" : "probe null");
    assert("Kein Zugriffsfehler", probe && !probe.denied);
    assert("Kein Datenladefehler", probe && !probe.loadError);
    assert("H1 = Analytics", probe?.h1 === "Analytics", JSON.stringify(probe));
    assert("Zeitraum-Selector nur First-Party sichtbar", probe?.hasRangeLabel === true);
    assert("Preset 'Heute' aktiv", probe?.heuteActive === true);

    // 2) Zeitraum-URL wechseln
    const clicked30 = await clickButton("30 Tage");
    assert("30-Tage-Button klickbar", clicked30);
    probe = await evalJs(`(() => ({
      search: location.search,
      bodyHasOverview: document.body.innerText.includes('Überblick'),
    }))()`);
    assert("URL enthält range=30d", probe.search.includes("range=30d"));

    // 3) Paths-Tab — Bounce-Metrik
    assert("Paths-Tab klickbar", await clickTab("Paths"));
    assert("Paths: Ein-Seiten (Bounce) sichtbar", await waitForText("EIN-SEITEN (BOUNCE)"));
    assert("Paths: Pfad-Analyse sichtbar", await waitForText("Pfad-Analyse"));

    // 4) Leads-Tab — Surface-Breakdown
    assert("Leads-Tab klickbar", await clickTab("Leads"));
    assert("Leads: Surface-Breakdown sichtbar", await waitForText("Leads nach Surface"));
    assert("Leads: Service-Area-Breakdown sichtbar", await waitForText("Leads nach Service-Area"));
    probe = await evalJs(`document.body.innerText.includes('Lead-Trend')`);
    assert("Leads: kein doppeltes Lead-Trend-Chart", !probe);

    // 5) Third-Party — kein First-Party-Zeitraum-Selector
    await navigate(`${BASE}/admin/analytics?group=third-party&tab=tracking`);
    probe = await evalJs(`(() => ({
      hasRangeLabel: document.body.innerText.includes('Zeitraum · First-Party'),
      hasScopeHint: document.body.innerText.includes('ohne Zeitraum-Filter'),
    }))()`);
    assert("Third-Party: kein First-Party-Zeitraum-Selector", !probe.hasRangeLabel);
    assert("Third-Party: Scope-Hinweis sichtbar", probe.hasScopeHint);

    // 6) 90-Tage server-seitig via URL
    await navigate(`${BASE}/admin/analytics?group=first-party&range=90d`);
    probe = await evalJs(`(() => ({
      search: location.search,
      days90Active: [...document.querySelectorAll('button')].some(
        (b) => b.textContent?.trim() === '90 Tage' && b.className.includes('bg-signal'),
      ),
    }))()`);
    assert("URL range=90d", probe.search.includes("range=90d"));
    assert("Preset '90 Tage' aktiv", probe.days90Active);
  } finally {
    try {
      ws?.close();
    } catch {}
    proc.kill("SIGTERM");
    await sleep(400);
  }
}

async function main() {
  await waitForDevServer(BASE);
  console.log("Dev-Server OK:", BASE);

  const env = loadEnvLocal();
  const { admin, userId, session, cookieName } = await createTempEditorUser(env);

  try {
    await runE2e(cookieName, session);
    console.log("\n=== Alle E2E-Tests bestanden ===");
  } finally {
    await admin.auth.admin.deleteUser(userId);
  }
}

main().catch((err) => {
  console.error("\nE2E fehlgeschlagen:", err.message);
  process.exit(1);
});
