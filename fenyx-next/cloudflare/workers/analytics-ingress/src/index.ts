type Env = {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  SUPABASE_ANALYTICS_JWT: string;
  SALT_SECRET: string;
  ALLOWED_ORIGIN?: string;
};

type IncomingEvent = Record<string, unknown> & {
  page_path?: string;
  event_type?: string;
  event_data?: Record<string, unknown>;
  original_referrer?: string;
  referrer_host?: string;
  utm_source?: string;
  utm_medium?: string;
  gclid?: string;
  fbclid?: string;
  element_id?: string;
};

const VALID_EVENT_TYPES = new Set([
  "page_view",
  "scroll_depth",
  "time_on_page",
  "cta_click",
  "contact_form_view",
  "generate_lead",
  "phone_click",
  "email_click",
  "outbound_click",
  "video_start",
  "faq_open",
  "tool_use",
  "location_select",
  "select_item",
  "view_item_list",
  "rage_click",
  "web_vital",
  "consent_update",
  "gtm_loaded",
]);

const ALLOWED_QUERY_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
]);

const ALLOWED_LEAD_SURFACES = new Set([
  "contact_section",
  "service_contact",
  "hubspot_form",
  "header_cta",
  "footer",
  "team",
  "link",
]);

const DEFAULT_ORIGINS = [
  "https://www.fenyx-office.com",
  "https://fenyx-office.com",
  "https://fenyx-office.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const MAX_EVENTS = 50;
const MAX_BODY_BYTES = 256_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 120;

const rateBuckets = new Map<string, { count: number; reset: number }>();

function wantsPrivacyOptOut(request: Request) {
  return request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1";
}

function allowedOrigins(env: Env): string[] {
  const raw = env.ALLOWED_ORIGIN?.trim();
  if (!raw) return DEFAULT_ORIGINS;
  return raw.split(",").map((v) => v.trim()).filter(Boolean);
}

function corsHeaders(request: Request, env: Env): Record<string, string> | null {
  const origin = request.headers.get("origin");
  const allowed = allowedOrigins(env);
  if (!origin || !allowed.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function getClientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.reset) {
    rateBuckets.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_MAX) return false;
  bucket.count += 1;
  return true;
}

function clip(value: unknown, max = 512): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.trim().slice(0, max);
}

function sanitizePagePath(path: string): string {
  const raw = path.slice(0, 2048);
  const qIndex = raw.indexOf("?");
  if (qIndex === -1) return raw || "/";
  const pathname = raw.slice(0, qIndex) || "/";
  const params = new URLSearchParams(raw.slice(qIndex + 1));
  const allowed = new URLSearchParams();
  for (const key of ALLOWED_QUERY_KEYS) {
    const value = params.get(key);
    if (value) allowed.set(key, value.slice(0, 200));
  }
  const query = allowed.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function reduceUserAgent(userAgent: string) {
  const ua = userAgent.slice(0, 512);
  const edge = ua.match(/Edg\/(\d+)/);
  if (edge) return `Edge/${edge[1]}`;
  const chrome = ua.match(/Chrome\/(\d+)/);
  if (chrome) return `Chrome/${chrome[1]}`;
  const safari = ua.match(/Version\/(\d+).*Safari/);
  if (safari) return `Safari/${safari[1]}`;
  const firefox = ua.match(/Firefox\/(\d+)/);
  if (firefox) return `Firefox/${firefox[1]}`;
  return ua.split(" ")[0] ?? "unknown";
}

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(input: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function truncateIp(ip: string) {
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":");
  const octets = ip.split(".");
  return octets.length === 4 ? `${octets[0]}.${octets[1]}.${octets[2]}.0` : ip;
}

async function deriveSessionHash(request: Request, env: Env) {
  const origin = request.headers.get("origin");
  const host = origin ? new URL(origin).hostname : new URL(request.url).hostname;
  const day = new Date().toISOString().slice(0, 10);
  const dailySalt = await hmac(env.SALT_SECRET, day);
  const input = `${dailySalt}|${truncateIp(getClientIp(request))}|${reduceUserAgent(request.headers.get("user-agent") ?? "")}|${host}`;
  return (await sha256(input)).slice(0, 16);
}

function deviceType(ua: string) {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|kindle|silk/.test(lower)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(lower)) return "mobile";
  return lower ? "desktop" : "unknown";
}

function classifyTraffic(event: IncomingEvent) {
  if (event.gclid) return "paid_search";
  if (event.fbclid) return "paid_social";
  const medium = String(event.utm_medium ?? "").toLowerCase();
  if (event.utm_source) {
    if (/(cpc|ppc|paid|sem)/.test(medium)) return "paid_search";
    if (/social/.test(medium)) return "organic_social";
    if (/email/.test(medium)) return "email";
    return "campaign";
  }
  const ref = String(event.referrer_host ?? "").toLowerCase();
  if (!ref) return "direct";
  if (/(google|bing|duckduckgo|ecosia|yahoo)/.test(ref)) return "organic_search";
  if (/(facebook|instagram|linkedin|tiktok|x\.com|twitter)/.test(ref)) return "organic_social";
  if (/(chatgpt|perplexity|claude|gemini|copilot)/.test(ref)) return "ai_referral";
  return "referral";
}

function sanitizeIncomingEvent(event: IncomingEvent, ua: string): IncomingEvent | null {
  const eventType = clip(event.event_type, 64);
  if (!eventType || !VALID_EVENT_TYPES.has(eventType)) return null;

  const page_path = sanitizePagePath(String(event.page_path || "/"));

  if (eventType === "generate_lead") {
    const leadType = clip(event.event_data?.lead_type, 64);
    const leadSurface = clip(event.event_data?.lead_surface, 64);
    if (leadType === "phone_click" || leadType === "email_click") return null;
    if (leadType === "contact_form" && (!leadSurface || !ALLOWED_LEAD_SURFACES.has(leadSurface))) {
      return null;
    }
  }

  if (eventType === "contact_form_view") {
    const leadSurface = clip(event.event_data?.lead_surface, 64);
    if (!leadSurface || !ALLOWED_LEAD_SURFACES.has(leadSurface)) return null;
  }

  return {
    ...event,
    event_type: eventType,
    page_path,
    page_title: clip(event.page_title, 300),
    page_visit_id: clip(event.page_visit_id, 64),
    page_type: clip(event.page_type, 64),
    service_area: clip(event.service_area, 64),
    audience: clip(event.audience, 64),
    city: clip(event.city, 64),
    contact_person: clip(event.contact_person, 64),
    element_id: clip(event.element_id, 120),
    utm_source: clip(event.utm_source, 120),
    utm_medium: clip(event.utm_medium, 120),
    utm_campaign: clip(event.utm_campaign, 120),
    utm_content: clip(event.utm_content, 120),
    utm_term: clip(event.utm_term, 120),
    gclid: clip(event.gclid, 120),
    fbclid: clip(event.fbclid, 120),
    referrer_host: clip(event.referrer_host, 200),
    original_referrer: clip(event.original_referrer, 500),
    user_agent: reduceUserAgent(ua),
  };
}

function deriveServerLeadEvents(events: IncomingEvent[]): IncomingEvent[] {
  const derived: IncomingEvent[] = [];
  for (const event of events) {
    if (event.event_type !== "phone_click" && event.event_type !== "email_click") continue;
    derived.push({
      ...event,
      event_type: "generate_lead",
      event_data: {
        lead_type: event.event_type === "phone_click" ? "phone_click" : "email_click",
        lead_surface: clip(event.event_data?.lead_surface, 64) ?? "link",
        element_id: event.element_id,
      },
    });
  }
  return derived;
}

function eventToRow(event: IncomingEvent, sessionHash: string, request: Request, cf: Record<string, unknown>) {
  const ua = request.headers.get("user-agent") ?? "";
  const verifiedBot = cf.clientBot === true;
  return {
    session_hash: sessionHash,
    page_visit_id: event.page_visit_id,
    event_type: event.event_type,
    page_path: event.page_path || "/",
    page_title: event.page_title,
    page_type: event.page_type,
    service_area: event.service_area,
    audience: event.audience,
    city: event.city,
    contact_person: event.contact_person,
    element_id: event.element_id,
    event_data: event.event_data ?? {},
    utm_source: event.utm_source,
    utm_medium: event.utm_medium,
    utm_campaign: event.utm_campaign,
    utm_content: event.utm_content,
    utm_term: event.utm_term,
    gclid: event.gclid,
    fbclid: event.fbclid,
    referrer_host: event.referrer_host,
    original_referrer: event.original_referrer,
    traffic_source_category: event.traffic_source_category ?? classifyTraffic(event),
    device_type: event.device_type ?? deviceType(ua),
    quality_flags: {
      bot_suspected: verifiedBot || /bot|crawler|spider|preview/i.test(ua),
      gpc: request.headers.get("sec-gpc") === "1",
      dnt: request.headers.get("dnt") === "1",
    },
    country_code: request.headers.get("cf-ipcountry") || undefined,
    country_source: request.headers.get("cf-ipcountry") ? "cloudflare" : undefined,
    region_code: typeof cf.regionCode === "string" ? cf.regionCode : undefined,
    region: typeof cf.region === "string" ? cf.region : undefined,
    visitor_type: verifiedBot ? "verified_bot" : "human",
    verified_bot: verifiedBot,
    verified_bot_category: verifiedBot ? "cloudflare_verified_bot" : undefined,
    bot_classification: verifiedBot
      ? "verified_bot"
      : /bot|crawler|spider|preview/i.test(ua)
        ? "suspected_bot"
        : "human",
    edge_colo: typeof cf.colo === "string" ? cf.colo : undefined,
    edge_asn: typeof cf.asn === "number" ? cf.asn : undefined,
    edge_ray: request.headers.get("cf-ray") || undefined,
    http_protocol: typeof cf.httpProtocol === "string" ? cf.httpProtocol : undefined,
    tls_version: typeof cf.tlsVersion === "string" ? cf.tlsVersion : undefined,
    user_agent: reduceUserAgent(ua),
    event_ts: event.event_ts ?? new Date().toISOString(),
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") {
      if (!cors) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") return new Response("Not found", { status: 404 });
    if (!cors) {
      return Response.json({ error: "Ungültiger Origin." }, { status: 403 });
    }
    if (!env.SALT_SECRET || !env.SUPABASE_PUBLISHABLE_KEY || !env.SUPABASE_ANALYTICS_JWT) {
      return Response.json({ error: "Analytics Worker nicht vollständig konfiguriert." }, { status: 503, headers: cors });
    }
    if (wantsPrivacyOptOut(request)) {
      return Response.json({ ok: true, action: "opt_out" }, { headers: cors });
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
      return Response.json({ error: "Payload zu groß." }, { status: 413, headers: cors });
    }

    const ip = getClientIp(request) || "unknown";
    if (!checkRateLimit(ip)) {
      return Response.json({ error: "Rate limit erreicht." }, { status: 429, headers: cors });
    }

    const body = await request.json().catch(() => ({ events: [] })) as { events?: IncomingEvent[] };
    const ua = request.headers.get("user-agent") ?? "";
    const sanitized = (Array.isArray(body.events) ? body.events : [])
      .slice(0, MAX_EVENTS)
      .map((event) => sanitizeIncomingEvent(event, ua))
      .filter((event): event is IncomingEvent => event !== null);
    const events = [...sanitized, ...deriveServerLeadEvents(sanitized)];

    if (events.length === 0) return Response.json({ ok: true, inserted: 0 }, { headers: cors });

    const sessionHash = await deriveSessionHash(request, env);
    const cf = (request as Request & { cf?: Record<string, unknown> }).cf ?? {};
    const rows = events.map((event) => eventToRow(event, sessionHash, request, cf));

    const res = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/website_analytics_events`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_ANALYTICS_JWT}`,
        "Content-Type": "application/json",
        "Accept-Profile": "analytics",
        "Content-Profile": "analytics",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      console.error("Analytics insert failed:", await res.text());
      return Response.json({ error: "Analytics insert fehlgeschlagen." }, { status: 502, headers: cors });
    }
    return Response.json({ ok: true, inserted: rows.length }, { headers: cors });
  },
};
