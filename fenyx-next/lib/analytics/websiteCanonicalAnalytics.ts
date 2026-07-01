import type { FunnelSessionRow, JourneySessionRow, PageHistoryEntry } from "./dashboardTypes";

export type BotClassification = "verified_bot" | "suspected_bot" | "human";

export type CanonicalWebsiteSession = {
  session_hash: string;
  landing_page: string;
  landing_time: string;
  last_activity_at: string;
  duration_seconds: number;
  page_views: number;
  cta_clicks: number;
  contact_form_views: number;
  leads: number;
  status: string;
  traffic_source_category: string;
  traffic_source_label: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_host: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  region: string | null;
  bot_classification: BotClassification;
  is_bot: boolean;
  reached_lead: boolean;
  lead_surface: string | null;
  lead_service_area: string | null;
  page_history: PageHistoryEntry[];
  edge_colo: string | null;
  edge_asn: number | null;
  consent_analytics: boolean | null;
  consent_marketing: boolean | null;
};

const SOURCE_LABELS: Record<string, string> = {
  paid_search: "Paid Search",
  paid_social: "Paid Social",
  organic_search: "Organic Search",
  organic_social: "Organic Social",
  email: "Email",
  referral: "Referral",
  ai_referral: "AI Referral",
  direct: "Direct",
  unknown: "Unknown",
};

function normalizeBot(row: { bot_classification?: string | null; verified_bot?: boolean | null }): BotClassification {
  const c = row.bot_classification;
  if (c === "verified_bot" || c === "suspected_bot") return c;
  if (row.verified_bot) return "verified_bot";
  return "human";
}

function sourceLabel(cat: string | null | undefined): string {
  return SOURCE_LABELS[cat ?? "unknown"] ?? cat ?? "Unknown";
}

export function buildCanonicalSessions(
  journeys: JourneySessionRow[],
  funnel: FunnelSessionRow[],
): CanonicalWebsiteSession[] {
  const journeyMap = new Map(journeys.map((j) => [j.session_hash, j]));
  const funnelMap = new Map(funnel.map((f) => [f.session_hash, f]));
  const hashes = new Set([...journeyMap.keys(), ...funnelMap.keys()]);
  const rows: CanonicalWebsiteSession[] = [];

  for (const hash of hashes) {
    const j = journeyMap.get(hash);
    const f = funnelMap.get(hash);
    const bot = normalizeBot({ bot_classification: j?.bot_classification ?? f?.bot_classification, verified_bot: j?.verified_bot });
    const landingTime = j?.landing_time ?? new Date(0).toISOString();
    const history = (j?.page_history ?? []) as PageHistoryEntry[];
    const cat = j?.traffic_source_category ?? f?.traffic_source_category ?? "unknown";

    rows.push({
      session_hash: hash,
      landing_page: j?.landing_page ?? f?.primary_service_area ?? "/",
      landing_time: landingTime,
      last_activity_at: j?.updated_at ?? landingTime,
      duration_seconds: 0,
      page_views: f?.page_views ?? history.length,
      cta_clicks: f?.cta_clicks ?? 0,
      contact_form_views: f?.contact_form_views ?? 0,
      leads: f?.leads ?? (j?.reached_lead ? 1 : 0),
      status: f?.status ?? "bounced",
      traffic_source_category: cat,
      traffic_source_label: sourceLabel(cat),
      utm_source: j?.utm_source ?? null,
      utm_medium: j?.utm_medium ?? null,
      utm_campaign: j?.utm_campaign ?? null,
      referrer_host: j?.original_referrer ?? null,
      device_type: j?.device_type ?? f?.device_type ?? null,
      country_code: j?.country_code ?? f?.country_code ?? null,
      region_code: j?.region_code ?? f?.region_code ?? null,
      region: j?.region ?? null,
      bot_classification: bot,
      is_bot: bot !== "human",
      reached_lead: j?.reached_lead === true || (f?.leads ?? 0) > 0,
      lead_surface: j?.lead_surface ?? null,
      lead_service_area: j?.lead_service_area ?? null,
      page_history: history,
      edge_colo: j?.edge_colo ?? null,
      edge_asn: j?.edge_asn ?? null,
      consent_analytics: j?.consent_analytics ?? null,
      consent_marketing: j?.consent_marketing ?? null,
    });
  }

  return rows.sort((a, b) => new Date(b.landing_time).getTime() - new Date(a.landing_time).getTime());
}

export function humanSessions(sessions: CanonicalWebsiteSession[]): CanonicalWebsiteSession[] {
  return sessions.filter((s) => !s.is_bot);
}
