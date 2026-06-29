"use client";

import { trackEvent } from "./tracker";
import type { AnalyticsEventPayload } from "./types";

export function trackPageView(overrides: Partial<AnalyticsEventPayload> = {}) {
  trackEvent("page_view", {}, overrides);
}

export function trackCtaClick(elementId: string, label?: string) {
  trackEvent("cta_click", { element_id: elementId, label }, { element_id: elementId });
}

export function trackContactFormView(surface = "contact_section") {
  trackEvent("contact_form_view", { lead_surface: surface });
}

export function trackGenerateLead(
  leadType: "contact_form" | "phone_click" | "email_click",
  leadSurface: string,
) {
  trackEvent("generate_lead", {
    lead_type: leadType,
    lead_surface: leadSurface,
  });
}

export function trackToolUse(tool: string, action: string, extra: Record<string, unknown> = {}) {
  trackEvent("tool_use", { tool, action, ...extra });
}

export function trackSelectItem(itemType: string, itemSlug: string, elementId?: string) {
  trackEvent("select_item", { item_type: itemType, item_slug: itemSlug }, { element_id: elementId });
}
