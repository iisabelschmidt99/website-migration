import type { CanonicalWebsiteSession } from "./websiteCanonicalAnalytics";
import type { EventRow, FunnelSessionRow } from "./dashboardTypes";
import { format, parseISO, startOfDay } from "date-fns";
import { de } from "date-fns/locale";

export function countByKey(items: string[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const k of items) {
    const key = k || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function dailySessionTrend(sessions: CanonicalWebsiteSession[]): { day: string; sessions: number; leads: number }[] {
  const map = new Map<string, { sessions: number; leads: number }>();
  for (const s of sessions) {
    const day = format(parseISO(s.landing_time), "yyyy-MM-dd");
    const cur = map.get(day) ?? { sessions: 0, leads: 0 };
    cur.sessions += 1;
    if (s.reached_lead || s.leads > 0) cur.leads += 1;
    map.set(day, cur);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, v]) => ({
      day: format(parseISO(day), "d. MMM", { locale: de }),
      sessions: v.sessions,
      leads: v.leads,
    }));
}

export function dailyEventTrend(events: EventRow[], eventType: string): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const e of events) {
    if (e.event_type !== eventType) continue;
    const ts = e.event_ts;
    if (!ts) continue;
    const day = format(parseISO(ts), "yyyy-MM-dd");
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, count]) => ({ day: format(parseISO(day), "d. MMM", { locale: de }), count }));
}

export function countryMetrics(sessions: CanonicalWebsiteSession[]) {
  const map = new Map<string, { sessions: number; leads: number }>();
  for (const s of sessions) {
    const code = (s.country_code ?? "unknown").toUpperCase();
    const cur = map.get(code) ?? { sessions: 0, leads: 0 };
    cur.sessions += 1;
    if (s.reached_lead) cur.leads += 1;
    map.set(code, cur);
  }
  return [...map.entries()]
    .map(([country_code, v]) => ({ country_code, country_name: country_code, sessions: v.sessions, leads: v.leads }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function regionMetrics(sessions: CanonicalWebsiteSession[]) {
  const map = new Map<string, { region_code: string; region_name: string; sessions: number }>();
  for (const s of sessions) {
    if (!s.country_code || !["DE", "AT", "CH"].includes(s.country_code)) continue;
    const code = s.region_code ?? "unknown";
    const cur = map.get(code) ?? { region_code: code, region_name: s.region ?? code, sessions: 0 };
    cur.sessions += 1;
    map.set(code, cur);
  }
  return [...map.values()].sort((a, b) => b.sessions - a.sessions);
}

export function pagePerformance(events: EventRow[]) {
  const views = events.filter((e) => e.event_type === "page_view");
  const map = new Map<string, { views: number; ctas: number }>();
  for (const e of views) {
    const cur = map.get(e.page_path) ?? { views: 0, ctas: 0 };
    cur.views += 1;
    map.set(e.page_path, cur);
  }
  for (const e of events) {
    if (e.event_type !== "cta_click") continue;
    const cur = map.get(e.page_path) ?? { views: 0, ctas: 0 };
    cur.ctas += 1;
    map.set(e.page_path, cur);
  }
  return [...map.entries()]
    .map(([path, v]) => ({ path, views: v.views, ctas: v.ctas }))
    .sort((a, b) => b.views - a.views);
}

export function rumP75(events: EventRow[]): { metric: string; p75: number; samples: number }[] {
  const names = ["LCP", "INP", "CLS", "FCP", "TTFB"];
  const buckets = new Map<string, number[]>();
  for (const e of events) {
    if (e.event_type !== "web_vital") continue;
    const name = String(e.event_data?.metric_name ?? "").toUpperCase();
    const val = Number(e.event_data?.metric_value);
    if (!name || Number.isNaN(val)) continue;
    if (!buckets.has(name)) buckets.set(name, []);
    buckets.get(name)!.push(val);
  }
  return names.map((metric) => {
    const vals = (buckets.get(metric) ?? []).sort((a, b) => a - b);
    const p75 = vals.length ? vals[Math.floor(vals.length * 0.75)] : 0;
    return { metric, p75, samples: vals.length };
  });
}

export function funnelKpis(sessions: CanonicalWebsiteSession[], funnel: FunnelSessionRow[]) {
  const human = sessions.filter((s) => !s.is_bot);
  const total = human.length;
  const engaged = human.filter((s) => s.status !== "bounced").length;
  const leads = human.filter((s) => s.reached_lead || s.leads > 0).length;
  const pageViews = funnel.reduce((sum, f) => sum + f.page_views, 0);
  const leadRate = total ? `${Math.round((leads / total) * 1000) / 10}%` : "0%";
  const pagesPerSession = total ? Math.round((pageViews / total) * 10) / 10 : 0;
  return { total, engaged, leads, leadRate, pageViews, pagesPerSession };
}

export function hourlyEventCounts(events: EventRow[]): { hour: string; page_view: number; consent_update: number; gtm_loaded: number }[] {
  const map = new Map<string, { page_view: number; consent_update: number; gtm_loaded: number }>();
  for (const e of events) {
    if (!e.event_ts) continue;
    const hour = format(startOfDay(parseISO(e.event_ts)), "HH:00");
    const key = format(parseISO(e.event_ts), "yyyy-MM-dd HH:00");
    const cur = map.get(key) ?? { page_view: 0, consent_update: 0, gtm_loaded: 0 };
    if (e.event_type === "page_view") cur.page_view += 1;
    if (e.event_type === "consent_update") cur.consent_update += 1;
    if (e.event_type === "gtm_loaded") cur.gtm_loaded += 1;
    map.set(key, cur);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-48)
    .map(([hour, v]) => ({ hour: hour.slice(11), ...v }));
}
