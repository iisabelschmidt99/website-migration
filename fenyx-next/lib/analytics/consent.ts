"use client";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  version: "1.0";
  updatedAt: string;
};

const KEY = "fenyx-cookie-consent";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function setConsent(partial: Omit<ConsentState, "necessary" | "version" | "updatedAt">) {
  const consent: ConsentState = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    preferences: partial.preferences,
    version: "1.0",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("fenyx:consentchange", { detail: consent }));
  return consent;
}

export function canTrackMarketing() {
  return getConsent()?.marketing === true;
}

export function canTrackAnalyticsVendor() {
  return getConsent()?.analytics === true;
}
