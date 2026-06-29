"use client";

import { canTrackAnalyticsVendor, canTrackMarketing, getConsent } from "./consent";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagProxy(...args: unknown[]) {
      window.dataLayer?.push({ event: "gtag_call", args });
    };
}

export function pushConsentDefaults() {
  ensureDataLayer();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

export function pushConsentUpdate() {
  ensureDataLayer();
  const consent = getConsent();
  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
  window.dataLayer?.push({
    event: "fenyx_consent_update",
    analytics,
    marketing,
  });
}

export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  if (!canTrackAnalyticsVendor() && event !== "fenyx_consent_update") return;
  ensureDataLayer();
  window.dataLayer?.push({ event, ...params });
}

export function pushMarketingEvent(event: string, params: Record<string, unknown> = {}) {
  if (!canTrackMarketing()) return;
  pushDataLayer(event, params);
}

export function pushVirtualPageView(path: string, title: string) {
  pushDataLayer("virtual_page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function pushLead(params: Record<string, unknown>) {
  pushMarketingEvent("generate_lead", params);
}
