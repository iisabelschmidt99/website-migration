export type PageHistoryEntry = {
  path: string;
  timestamp: string;
  scroll_depth?: number;
  time_on_page?: number;
  clicks?: string[];
};

export type JourneySessionRow = {
  session_hash: string;
  landing_page: string | null;
  landing_time: string | null;
  original_referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  fbclid: string | null;
  traffic_source_category: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  region: string | null;
  bot_classification: string | null;
  verified_bot: boolean | null;
  page_history: PageHistoryEntry[] | null;
  web_vitals: unknown[] | null;
  reached_lead: boolean | null;
  lead_surface: string | null;
  lead_service_area: string | null;
  consent_analytics: boolean | null;
  consent_marketing: boolean | null;
  edge_colo: string | null;
  edge_asn: number | null;
  updated_at: string | null;
};

export type FunnelSessionRow = {
  session_hash: string;
  status: string;
  primary_service_area: string | null;
  traffic_source_category: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  bot_classification: string | null;
  page_views: number;
  cta_clicks: number;
  contact_form_views: number;
  leads: number;
};

export type EventRow = {
  session_hash?: string;
  event_type: string;
  event_ts?: string;
  page_path: string;
  page_type: string | null;
  service_area: string | null;
  traffic_source_category: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  event_data: Record<string, unknown> | null;
  quality_flags?: Record<string, unknown> | null;
  bot_classification: string | null;
};

export type AnalyticsHubProps = {
  events: EventRow[];
  journeys: JourneySessionRow[];
  funnel: FunnelSessionRow[];
  cruxConfigured: boolean;
  gtmConfigured: boolean;
  cloudflareConfigured: boolean;
};
