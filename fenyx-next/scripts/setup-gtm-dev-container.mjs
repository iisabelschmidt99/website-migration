#!/usr/bin/env node
/**
 * Phase 2: Dev-GTM-Container (NEW_GTM_ID) mit DataLayer-Variablen, Triggern und GA4-Event-Tags.
 * Usage: node scripts/setup-gtm-dev-container.mjs [--publish]
 */
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publish = process.argv.includes("--publish");

const EVENTS = [
  "page_view",
  "cta_click",
  "generate_lead",
  "fenyx_consent_update",
  "gtm_loaded",
  "select_item",
  "contact_form_view",
  "tool_use",
  "scroll_depth",
  "web_vital",
];

const DLV_VARS = [
  "event",
  "page_path",
  "page_title",
  "element_id",
  "lead_type",
  "lead_surface",
  "item_type",
  "item_slug",
  "analytics",
  "marketing",
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

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: [
        "https://www.googleapis.com/auth/tagmanager.edit.containers",
        "https://www.googleapis.com/auth/tagmanager.publish",
      ].join(" "),
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

async function gtmFetch(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error?.message || `${res.status} ${url}`);
  }
  return body;
}

function dlVariable(name) {
  return {
    name: `DLV - ${name}`,
    type: "v",
    parameter: [
      { type: "integer", key: "dataLayerVersion", value: "2" },
      { type: "boolean", key: "setDefaultValue", value: "false" },
      { type: "template", key: "name", value: name },
    ],
  };
}

function customEventTrigger(eventName) {
  return {
    name: `CE - ${eventName}`,
    type: "customEvent",
    customEventFilter: [
      {
        type: "equals",
        parameter: [
          { type: "template", key: "arg0", value: "{{_event}}" },
          { type: "template", key: "arg1", value: eventName },
        ],
      },
    ],
  };
}

function ga4EventTag(eventName, triggerId) {
  return {
    name: `GA4 Event - ${eventName}`,
    type: "gaawe",
    parameter: [
      { type: "boolean", key: "sendEcommerceData", value: "false" },
      { type: "template", key: "eventName", value: eventName },
      {
        type: "template",
        key: "measurementIdOverride",
        value: "{{GA4 Measurement ID}}",
      },
    ],
    firingTriggerId: [triggerId],
    tagFiringOption: "oncePerEvent",
  };
}

function constantVariable(name, value) {
  return {
    name,
    type: "c",
    parameter: [{ type: "template", key: "value", value }],
  };
}

async function findByName(listPath, token, name) {
  const data = await gtmFetch(token, listPath);
  const key = Object.keys(data).find((k) => Array.isArray(data[k]));
  const items = key ? data[key] : [];
  return items.find((item) => item.name === name);
}

async function createIfMissing(listPath, createPath, token, payload) {
  const existing = await findByName(listPath, token, payload.name);
  if (existing) return { skipped: true, item: existing };
  const item = await gtmFetch(token, createPath, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { skipped: false, item };
}

async function upsertConstantVariable(base, token, name, value) {
  const listPath = `${base}/variables`;
  const existing = await findByName(listPath, token, name);
  const payload = constantVariable(name, value);
  if (!existing) {
    const item = await gtmFetch(token, listPath, { method: "POST", body: JSON.stringify(payload) });
    return { action: "created", item };
  }
  const current = existing.parameter?.find((p) => p.key === "value")?.value;
  if (current === value) return { action: "unchanged", item: existing };
  const updated = {
    ...existing,
    parameter: [{ type: "template", key: "value", value }],
  };
  const item = await gtmFetch(token, `${listPath}/${existing.variableId}`, {
    method: "PUT",
    body: JSON.stringify(updated),
  });
  return { action: "updated", item, previous: current };
}

async function main() {
  const env = loadEnvLocal();
  const targetPublicId = env.NEW_GTM_ID || env.NEXT_PUBLIC_GTM_ID;
  const sa = env.GTM_SERVICE_ACCOUNT_JSON;
  const ga4Id = env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || env.GA4_MEASUREMENT_ID || "";

  if (!sa?.client_email) {
    console.error("GTM_SERVICE_ACCOUNT_JSON fehlt oder ungültig.");
    process.exit(1);
  }
  if (!targetPublicId) {
    console.error("NEW_GTM_ID oder NEXT_PUBLIC_GTM_ID fehlt.");
    process.exit(1);
  }

  const token = await getAccessToken(sa);
  const accounts = await gtmFetch(token, "https://tagmanager.googleapis.com/tagmanager/v2/accounts");
  let container = null;
  let accountId = null;

  for (const account of accounts.account ?? []) {
    const containers = await gtmFetch(
      token,
      `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${account.accountId}/containers`,
    );
    const hit = (containers.container ?? []).find((c) => c.publicId === targetPublicId);
    if (hit) {
      container = hit;
      accountId = account.accountId;
      break;
    }
  }

  if (!container) {
    console.error(`Container ${targetPublicId} nicht gefunden.`);
    process.exit(1);
  }

  console.log(`Container: ${container.publicId} (${container.name})`);

  const domains = new Set([
    ...(container.domainName ?? []),
    "fenyx-office.netlify.app",
    "localhost",
    "fenyx-office.com",
    "www.fenyx-office.com",
  ]);
  await gtmFetch(
    token,
    `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${accountId}/containers/${container.containerId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...container,
        domainName: [...domains],
      }),
    },
  );
  console.log("Domains aktualisiert:", [...domains].join(", "));

  const workspaces = await gtmFetch(
    token,
    `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${accountId}/containers/${container.containerId}/workspaces`,
  );
  const workspace = (workspaces.workspace ?? []).find((w) => w.name === "Default Workspace") ?? workspaces.workspace?.[0];
  if (!workspace) throw new Error("Kein Workspace gefunden.");
  const base = `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${accountId}/containers/${container.containerId}/workspaces/${workspace.workspaceId}`;

  if (ga4Id) {
    const ga4Var = await upsertConstantVariable(base, token, "GA4 Measurement ID", ga4Id);
    console.log(
      ga4Var.action === "updated"
        ? `GA4 Measurement ID aktualisiert: ${ga4Var.previous} -> ${ga4Id}`
        : ga4Var.action === "created"
          ? "GA4 Measurement ID Variable erstellt."
          : "GA4 Measurement ID bereits korrekt.",
    );
  } else {
    console.log("Hinweis: GA4_MEASUREMENT_ID nicht gesetzt – Event-Tags werden übersprungen (Preview/Trigger reicht zum Test).");
  }

  for (const name of DLV_VARS) {
    const result = await createIfMissing(`${base}/variables`, `${base}/variables`, token, dlVariable(name));
    console.log(result.skipped ? "Variable existiert:" : "Variable erstellt:", name);
  }

  const triggerIds = {};
  for (const eventName of EVENTS) {
    const result = await createIfMissing(
      `${base}/triggers`,
      `${base}/triggers`,
      token,
      customEventTrigger(eventName),
    );
    triggerIds[eventName] = result.item.triggerId;
    console.log(result.skipped ? "Trigger existiert:" : "Trigger erstellt:", eventName);
  }

  if (ga4Id) {
    for (const eventName of EVENTS) {
      const result = await createIfMissing(
        `${base}/tags`,
        `${base}/tags`,
        token,
        ga4EventTag(eventName, triggerIds[eventName]),
      );
      console.log(result.skipped ? "Tag existiert:" : "Tag erstellt:", `GA4 Event - ${eventName}`);
    }
  }

  if (publish) {
    const version = await gtmFetch(token, `${base}:create_version`, {
      method: "POST",
      body: JSON.stringify({ name: `Fenyx setup ${new Date().toISOString().slice(0, 10)}`, notes: "Automatisches Dev-Setup" }),
    });
    await gtmFetch(
      token,
      `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${accountId}/containers/${container.containerId}/versions/${version.containerVersion.containerVersionId}:publish`,
      { method: "POST", body: "{}" },
    );
    console.log("Version veröffentlicht:", version.containerVersion.containerVersionId);
  } else {
    console.log("\nWorkspace bereit. Preview testen oder mit --publish veröffentlichen.");
  }

  console.log("\nGTM Preview URL: https://tagmanager.google.com/");
  console.log("Container ID für Netlify:", targetPublicId);
}

main().catch((err) => {
  console.error("Fehler:", err.message);
  process.exit(1);
});
