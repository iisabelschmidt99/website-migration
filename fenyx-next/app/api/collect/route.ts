import { NextResponse } from "next/server";
import {
  classifyTraffic,
  deriveSessionHash,
  detectDeviceType,
  reduceUserAgent,
  wantsPrivacyOptOut,
} from "@/lib/analytics/identity";
import { checkRateLimit, isBodyTooLarge } from "@/lib/analytics/rateLimit";
import {
  deriveServerLeadEvents,
  isAllowedOrigin,
  sanitizeIncomingEvent,
} from "@/lib/analytics/sanitize";
import type { AnalyticsEventPayload, CollectRequestBody } from "@/lib/analytics/types";

export const runtime = "nodejs";

const MAX_EVENTS = 50;

function getIngressConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const jwt = process.env.SUPABASE_ANALYTICS_JWT || process.env.ANALYTICS_INGRESS_JWT;
  if (!url || !apikey || !jwt) {
    throw new Error("Analytics-Ingress-JWT, Supabase URL oder Publishable Key fehlt.");
  }
  return { url: url.replace(/\/$/, ""), apikey, jwt };
}

function normalizeHost(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).hostname;
    } catch {
      // ignore
    }
  }
  return new URL(request.url).hostname;
}

function referrerHost(referrer?: string): string | undefined {
  if (!referrer) return undefined;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function sanitizeEvent(
  event: AnalyticsEventPayload,
  request: Request,
  sessionHash: string,
) {
  const ua = request.headers.get("user-agent") ?? "";
  const reducedUa = reduceUserAgent(ua);
  const refHost = event.referrer_host ?? referrerHost(event.original_referrer);
  const device = event.device_type ?? detectDeviceType(ua);
  const source = event.traffic_source_category ?? classifyTraffic({
    utm_source: event.utm_source,
    utm_medium: event.utm_medium,
    referrer_host: refHost,
    gclid: event.gclid,
    fbclid: event.fbclid,
  });

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
    referrer_host: refHost,
    original_referrer: event.original_referrer,
    traffic_source_category: source,
    device_type: device,
    quality_flags: {
      bot_suspected: /bot|crawler|spider|preview/i.test(ua),
      gpc: request.headers.get("sec-gpc") === "1",
      dnt: request.headers.get("dnt") === "1",
    },
    country_code: request.headers.get("cf-ipcountry")?.slice(0, 2) || undefined,
    country_source: request.headers.get("cf-ipcountry") ? "cloudflare" : undefined,
    user_agent: reducedUa,
    bot_classification: /bot|crawler|spider|preview/i.test(ua) ? "suspected_bot" : "human",
    event_ts: event.event_ts ?? new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  if (wantsPrivacyOptOut(request)) {
    return NextResponse.json({ ok: true, action: "opt_out" });
  }

  const origin = request.headers.get("origin");
  const host = normalizeHost(request);
  if (!isAllowedOrigin(origin, host)) {
    return NextResponse.json({ error: "Ungültiger Origin." }, { status: 403 });
  }

  if (isBodyTooLarge(request.headers.get("content-length"))) {
    return NextResponse.json({ error: "Payload zu groß." }, { status: 413 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit erreicht." }, { status: 429 });
  }

  let body: CollectRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Analytics-Payload." }, { status: 400 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  const sanitized = (Array.isArray(body.events) ? body.events : [])
    .slice(0, MAX_EVENTS)
    .map((event) => sanitizeIncomingEvent(event, ua))
    .filter((event): event is AnalyticsEventPayload => event !== null);

  const events = [...sanitized, ...deriveServerLeadEvents(sanitized)];

  if (events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  const sessionHash = await deriveSessionHash(
    request,
    { SALT_SECRET: process.env.ANALYTICS_SALT_SECRET ?? process.env.SALT_SECRET },
    host,
  );

  if (!sessionHash) {
    return NextResponse.json(
      { error: "Analytics ist derzeit nicht konfiguriert." },
      { status: 503 },
    );
  }

  try {
    const config = getIngressConfig();
    const rows = events.map((event) => sanitizeEvent(event, request, sessionHash));
    const res = await fetch(`${config.url}/rest/v1/website_analytics_events`, {
      method: "POST",
      headers: {
        apikey: config.apikey,
        Authorization: `Bearer ${config.jwt}`,
        "Content-Type": "application/json",
        "Accept-Profile": "analytics",
        "Content-Profile": "analytics",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });
    if (!res.ok) {
      console.error("Analytics insert failed:", await res.text());
      return NextResponse.json({ error: "Analytics insert fehlgeschlagen." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, inserted: rows.length });
  } catch (e) {
    console.error("Analytics collect error:", e);
    return NextResponse.json({ error: "Analytics insert fehlgeschlagen." }, { status: 500 });
  }
}
