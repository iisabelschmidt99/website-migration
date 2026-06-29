import type { AnalyticsEventPayload, AnalyticsEventType } from "./types";
import { reduceUserAgent } from "./identity";

const VALID_EVENT_TYPES = new Set<AnalyticsEventType>([
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

const MAX_STRING = 512;
const MAX_PATH = 2048;
const MAX_ELEMENT_ID = 120;

function clip(value: unknown, max = MAX_STRING): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.trim().slice(0, max);
}

export function sanitizePagePath(path: string): string {
  const raw = path.slice(0, MAX_PATH);
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

export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  const defaults = [
    "https://www.fenyx-office.com",
    "https://fenyx-office.com",
    "https://fenyx-office.netlify.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  const allowed = (process.env.ANALYTICS_ALLOWED_ORIGINS ?? defaults.join(","))
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (origin) {
    try {
      return allowed.includes(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  if (host) {
    return allowed.some((entry) => {
      try {
        return new URL(entry).host === host;
      } catch {
        return entry === host;
      }
    });
  }

  return false;
}

function sanitizeEventData(
  eventType: AnalyticsEventType,
  data: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") clean[key] = value.slice(0, MAX_STRING);
    else if (typeof value === "number" && Number.isFinite(value)) clean[key] = value;
    else if (typeof value === "boolean") clean[key] = value;
  }

  if (eventType === "scroll_depth" && typeof clean.percent === "number") {
    clean.percent = Math.max(0, Math.min(100, Math.round(clean.percent)));
  }

  if (eventType === "time_on_page" && typeof clean.seconds === "number") {
    clean.seconds = Math.max(0, Math.min(86400, Math.round(clean.seconds)));
  }

  return clean;
}

export function sanitizeIncomingEvent(
  event: AnalyticsEventPayload,
  userAgent: string,
): AnalyticsEventPayload | null {
  if (!event.event_type || !VALID_EVENT_TYPES.has(event.event_type)) return null;

  const page_path = sanitizePagePath(event.page_path || "/");

  if (event.event_type === "generate_lead") {
    const leadType = clip(event.event_data?.lead_type, 64);
    const leadSurface = clip(event.event_data?.lead_surface, 64);
    if (leadType === "phone_click" || leadType === "email_click") {
      return null;
    }
    if (leadType === "contact_form" && (!leadSurface || !ALLOWED_LEAD_SURFACES.has(leadSurface))) {
      return null;
    }
  }

  if (event.event_type === "contact_form_view") {
    const leadSurface = clip(event.event_data?.lead_surface, 64);
    if (!leadSurface || !ALLOWED_LEAD_SURFACES.has(leadSurface)) return null;
  }

  return {
    ...event,
    page_path,
    page_title: clip(event.page_title, 300),
    page_visit_id: clip(event.page_visit_id, 64),
    page_type: clip(event.page_type, 64) as AnalyticsEventPayload["page_type"],
    service_area: clip(event.service_area, 64),
    audience: clip(event.audience, 64),
    city: clip(event.city, 64),
    contact_person: clip(event.contact_person, 64),
    element_id: clip(event.element_id, MAX_ELEMENT_ID),
    utm_source: clip(event.utm_source, 120),
    utm_medium: clip(event.utm_medium, 120),
    utm_campaign: clip(event.utm_campaign, 120),
    utm_content: clip(event.utm_content, 120),
    utm_term: clip(event.utm_term, 120),
    gclid: clip(event.gclid, 120),
    fbclid: clip(event.fbclid, 120),
    referrer_host: clip(event.referrer_host, 200),
    original_referrer: clip(event.original_referrer, 500),
    event_data: sanitizeEventData(event.event_type, event.event_data),
    device_type: event.device_type,
    event_ts: event.event_ts,
    user_agent: reduceUserAgent(userAgent),
  } as AnalyticsEventPayload & { user_agent?: string };
}

export function deriveServerLeadEvents(
  events: AnalyticsEventPayload[],
): AnalyticsEventPayload[] {
  const derived: AnalyticsEventPayload[] = [];
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
