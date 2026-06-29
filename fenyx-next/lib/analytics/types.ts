export type AnalyticsEventType =
  | "page_view"
  | "scroll_depth"
  | "time_on_page"
  | "cta_click"
  | "contact_form_view"
  | "generate_lead"
  | "phone_click"
  | "email_click"
  | "outbound_click"
  | "video_start"
  | "faq_open"
  | "tool_use"
  | "location_select"
  | "select_item"
  | "view_item_list"
  | "rage_click"
  | "web_vital"
  | "consent_update"
  | "gtm_loaded";

export type PageType =
  | "home"
  | "service_hub"
  | "service_detail"
  | "campaign_lp"
  | "city_einrichtung"
  | "city_mieten"
  | "audience"
  | "reference_list"
  | "reference_detail"
  | "event_list"
  | "event_detail"
  | "article_list"
  | "article_detail"
  | "press_list"
  | "press_detail"
  | "about"
  | "locations"
  | "contact"
  | "legal";

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type TrackingContext = {
  page_type?: PageType;
  service_area?: string;
  audience?: string;
  city?: string;
  contact_person?: string;
};

export type AnalyticsEventPayload = TrackingContext & {
  event_type: AnalyticsEventType;
  page_path: string;
  page_title?: string;
  page_visit_id?: string;
  element_id?: string;
  event_data?: Record<string, unknown>;
  event_ts?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer_host?: string;
  original_referrer?: string;
  traffic_source_category?: string;
  device_type?: DeviceType;
};

export type CollectRequestBody = {
  events: AnalyticsEventPayload[];
};
