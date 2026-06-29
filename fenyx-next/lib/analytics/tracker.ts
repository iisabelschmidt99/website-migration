"use client";

import { getTrackingContext } from "./context";
import type { AnalyticsEventPayload, AnalyticsEventType } from "./types";

const FLUSH_INTERVAL_MS = 2000;
const MAX_QUEUE = 100;

let queue: AnalyticsEventPayload[] = [];
let flushTimer: number | null = null;
let pageVisitId: string | null = null;
let pageStartedAt = Date.now();
const sentScrollDepths = new Set<number>();

function getPageVisitId() {
  if (!pageVisitId) {
    pageVisitId = `pv_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return pageVisitId;
}

function endpoint() {
  return process.env.NEXT_PUBLIC_ANALYTICS_INGRESS_URL || "/api/collect";
}

function paramsFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
    gclid: params.get("gclid") ?? undefined,
    fbclid: params.get("fbclid") ?? undefined,
  };
}

function referrerHost() {
  if (!document.referrer) return undefined;
  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function resetPageVisit() {
  pageVisitId = null;
  pageStartedAt = Date.now();
  sentScrollDepths.clear();
}

export function trackEvent(
  event_type: AnalyticsEventType,
  event_data: Record<string, unknown> = {},
  overrides: Partial<AnalyticsEventPayload> = {},
) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  const event: AnalyticsEventPayload = {
    ...getTrackingContext(),
    ...paramsFromLocation(),
    event_type,
    page_path: window.location.pathname,
    page_title: document.title,
    page_visit_id: getPageVisitId(),
    original_referrer: document.referrer || undefined,
    referrer_host: referrerHost(),
    event_ts: new Date().toISOString(),
    event_data,
    ...overrides,
  };

  queue.push(event);
  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  scheduleFlush();
}

function sendWithBeacon(events: AnalyticsEventPayload[]) {
  if (!navigator.sendBeacon) return false;
  try {
    return navigator.sendBeacon(
      endpoint(),
      new Blob([JSON.stringify({ events })], { type: "application/json" }),
    );
  } catch {
    return false;
  }
}

export async function flushAnalytics(useBeacon = false) {
  if (queue.length === 0) return;
  const events = queue;
  queue = [];

  if (useBeacon && sendWithBeacon(events)) return;

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
    if (!res.ok) queue.unshift(...events.slice(0, MAX_QUEUE));
  } catch {
    queue.unshift(...events.slice(0, MAX_QUEUE));
  }
}

function scheduleFlush() {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushAnalytics();
  }, FLUSH_INTERVAL_MS);
}

export function initAnalyticsTracker() {
  if (typeof window === "undefined") return;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const percent = Math.round((window.scrollY / max) * 100);
    for (const depth of [25, 50, 75, 90]) {
      if (percent >= depth && !sentScrollDepths.has(depth)) {
        sentScrollDepths.add(depth);
        trackEvent("scroll_depth", { percent: depth });
      }
    }
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const el = target?.closest<HTMLElement>("[data-track-event], a[href]");
    if (!el) return;

    const explicit = el.dataset.trackEvent as AnalyticsEventType | undefined;
    const href = el instanceof HTMLAnchorElement ? el.href : undefined;
    const elementId =
      el.dataset.trackId ||
      el.id ||
      el.textContent?.trim().toLowerCase().replace(/\s+/g, "_").slice(0, 80);

    if (explicit) {
      trackEvent(explicit, {
        element_id: elementId,
        label: el.dataset.trackLabel ?? el.textContent?.trim(),
        tool: el.dataset.trackTool,
        action: el.dataset.trackAction,
        item_type: el.dataset.trackItemType,
        item_slug: el.dataset.trackItemSlug,
        href,
      }, { element_id: elementId });
      return;
    }

    if (href?.startsWith("tel:")) {
      trackEvent("phone_click", { element_id: elementId, href, lead_surface: el.dataset.trackSurface ?? "link" }, { element_id: elementId });
    } else if (href?.startsWith("mailto:")) {
      trackEvent("email_click", { element_id: elementId, href, lead_surface: el.dataset.trackSurface ?? "link" }, { element_id: elementId });
    } else if (href) {
      const url = new URL(href);
      if (url.hostname !== window.location.hostname) {
        trackEvent("outbound_click", {
          outbound_host: url.hostname.replace(/^www\./, ""),
          element_id: elementId,
        }, { element_id: elementId });
      }
    }
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      const seconds = Math.round((Date.now() - pageStartedAt) / 1000);
      trackEvent("time_on_page", { seconds, capped: seconds > 3600 });
      void flushAnalytics(true);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onClick);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", () => void flushAnalytics(true));
  window.addEventListener("beforeunload", () => void flushAnalytics(true));
}
