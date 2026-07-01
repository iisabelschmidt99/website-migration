import type { CanonicalWebsiteSession } from "./websiteCanonicalAnalytics";
import type { EventRow, FunnelSessionRow } from "./dashboardTypes";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
  US: "USA",
  GB: "Großbritannien",
  FR: "Frankreich",
  NL: "Niederlande",
  IT: "Italien",
  ES: "Spanien",
  PL: "Polen",
};

/** Fasst aufeinanderfolgende identische Pfade (nach Query-Strip) zu einem Schritt zusammen. */
export function collapseConsecutivePaths(paths: string[]): string[] {
  const result: string[] = [];
  for (const raw of paths) {
    const path = raw.split("?")[0] || "/";
    if (result.length === 0 || result[result.length - 1] !== path) {
      result.push(path);
    }
  }
  return result;
}

export function countSinglePageSessions(sessions: CanonicalWebsiteSession[]): number {
  return sessions.filter((session) => {
    if (!session.page_history.length) return true;
    return collapseConsecutivePaths(session.page_history.map((page) => page.path)).length <= 1;
  }).length;
}

export function isHumanEvent(event: EventRow): boolean {
  const bot = event.bot_classification;
  return bot !== "verified_bot" && bot !== "suspected_bot";
}

export function humanEvents(events: EventRow[]): EventRow[] {
  return events.filter(isHumanEvent);
}

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
    const raw = s.country_code?.trim();
    const code = raw ? raw.toUpperCase() : "UNKNOWN";
    const cur = map.get(code) ?? { sessions: 0, leads: 0 };
    cur.sessions += 1;
    if (s.reached_lead) cur.leads += 1;
    map.set(code, cur);
  }
  return [...map.entries()]
    .map(([country_code, v]) => ({
      country_code,
      country_name:
        country_code === "UNKNOWN" ? "Unbekannt" : (COUNTRY_NAMES[country_code] ?? country_code),
      sessions: v.sessions,
      leads: v.leads,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function topKnownCountry(
  countries: ReturnType<typeof countryMetrics>,
): ReturnType<typeof countryMetrics>[number] | undefined {
  return countries.find((country) => country.country_code !== "UNKNOWN");
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
  return buildPageContentMetrics(events).map((row) => ({
    path: row.page_path,
    views: row.page_views,
    ctas: row.cta_clicks,
  }));
}

export type PageContentMetric = {
  page_path: string;
  page_views: number;
  unique_sessions: number;
  avg_time_seconds: number;
  scroll_75: number;
  scroll_90: number;
  cta_clicks: number;
};

export type EntryPageMetric = {
  page: string;
  sessions: number;
  engaged: number;
  leads: number;
  engagedPct: number;
  leadPct: number;
};

export type DropOffPageMetric = {
  page: string;
  count: number;
};

export type WebVitalMetricSummary = {
  name: string;
  median: number | null;
  p75: number | null;
  p95: number | null;
  p99: number | null;
  min: number | null;
  max: number | null;
  total: number;
  ratings: { good: number; needsImprovement: number; poor: number };
};

export type WebVitalPageBreakdown = {
  page: string;
  pageViews: number;
  visitsWithWebVitals: number;
  coveragePercent: number;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
  samples: number;
};

export type PerformanceCoverage = {
  totalSessions: number;
  sessionsWithWebVitals: number;
  totalWebVitalSamples: number;
  totalPageViews: number;
  pageViewsWithWebVitals: number;
  pageViewCoveragePercent: number;
};

export type WebVitalsDashboard = {
  metricSummaries: WebVitalMetricSummary[];
  pageBreakdown: WebVitalPageBreakdown[];
  byDevice: {
    desktop: WebVitalMetricSummary[];
    mobile: WebVitalMetricSummary[];
  };
  performanceCoverage: PerformanceCoverage;
};

export type UxSignalsData = {
  totalRage: number;
  totalOutbound: number;
  rageTable: { selector: string; page: string; clickCount: number; occurrences: number }[];
  outboundTable: { host: string; count: number; pages: string[] }[];
};

function normalizePath(path: string | undefined): string {
  return path || "/";
}

function getPageVisitKey(event: EventRow): string {
  const visitId = event.page_visit_id?.trim();
  if (visitId) return visitId;
  return `${event.session_hash ?? "unknown-session"}::${normalizePath(event.page_path)}`;
}

function isTrackablePage(path: string): boolean {
  return !normalizePath(path).startsWith("/admin");
}

function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return lo === hi ? sorted[lo] : sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]);
}

function median(values: number[]): number | null {
  return percentile(values, 50);
}

export function buildPageContentMetrics(events: EventRow[]): PageContentMetric[] {
  const pageMap = new Map<
    string,
    {
      page_views: number;
      scroll_75: number;
      scroll_90: number;
      cta_clicks: number;
    }
  >();

  for (const event of events) {
    const path = normalizePath(event.page_path);
    if (!pageMap.has(path)) {
      pageMap.set(path, { page_views: 0, scroll_75: 0, scroll_90: 0, cta_clicks: 0 });
    }
    const metrics = pageMap.get(path)!;

    if (event.event_type === "page_view") {
      metrics.page_views += 1;
    } else if (event.event_type === "scroll_depth") {
      const percent = Number(event.event_data?.percent);
      if (!Number.isNaN(percent)) {
        if (percent >= 75) metrics.scroll_75 += 1;
        if (percent >= 90) metrics.scroll_90 += 1;
      }
    } else if (event.event_type === "cta_click") {
      metrics.cta_clicks += 1;
    }
  }

  const sessionsByPage = new Map<string, Set<string>>();
  for (const event of events) {
    if (!event.session_hash) continue;
    const path = normalizePath(event.page_path);
    if (!sessionsByPage.has(path)) sessionsByPage.set(path, new Set());
    sessionsByPage.get(path)!.add(event.session_hash);
  }

  const timeByPage = new Map<string, number[]>();
  for (const event of events) {
    if (event.event_type !== "time_on_page") continue;
    const seconds = Number(event.event_data?.seconds);
    if (Number.isNaN(seconds) || seconds <= 0 || seconds >= 1800) continue;
    const path = normalizePath(event.page_path);
    if (!timeByPage.has(path)) timeByPage.set(path, []);
    timeByPage.get(path)!.push(seconds);
  }

  return [...pageMap.entries()]
    .map(([page_path, metrics]) => {
      const times = timeByPage.get(page_path) ?? [];
      times.sort((a, b) => a - b);
      return {
        page_path,
        page_views: metrics.page_views,
        unique_sessions: sessionsByPage.get(page_path)?.size ?? 0,
        avg_time_seconds: times.length ? times[Math.floor(times.length / 2)] : 0,
        scroll_75: metrics.scroll_75,
        scroll_90: metrics.scroll_90,
        cta_clicks: metrics.cta_clicks,
      };
    })
    .sort((a, b) => b.page_views - a.page_views);
}

export function buildEntryPageMetrics(sessions: CanonicalWebsiteSession[]): EntryPageMetric[] {
  const map = new Map<string, { sessions: number; engaged: number; leads: number }>();
  for (const session of sessions) {
    const page = session.landing_page || "/";
    const cur = map.get(page) ?? { sessions: 0, engaged: 0, leads: 0 };
    cur.sessions += 1;
    if (session.status !== "bounced") cur.engaged += 1;
    if (session.reached_lead) cur.leads += 1;
    map.set(page, cur);
  }

  return [...map.entries()]
    .map(([page, value]) => ({
      page,
      sessions: value.sessions,
      engaged: value.engaged,
      leads: value.leads,
      engagedPct: value.sessions ? Math.round((value.engaged / value.sessions) * 100) : 0,
      leadPct: value.sessions ? Math.round((value.leads / value.sessions) * 100) : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function buildDropOffPages(sessions: CanonicalWebsiteSession[]): DropOffPageMetric[] {
  const map = new Map<string, number>();
  for (const session of sessions) {
    if (session.reached_lead || session.status === "bounced") continue;
    const last = session.page_history[session.page_history.length - 1]?.path ?? session.landing_page;
    if (!last) continue;
    map.set(last, (map.get(last) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildPageWebVitalsCoverage(events: EventRow[]) {
  const pageViewsByPage = new Map<string, Set<string>>();
  const vitalsVisitsByPage = new Map<string, Set<string>>();
  const vitalSamplesByPage = new Map<string, number>();

  for (const event of events) {
    if (!isTrackablePage(event.page_path)) continue;
    const page = normalizePath(event.page_path);
    const visitKey = getPageVisitKey(event);

    if (event.event_type === "page_view") {
      const visits = pageViewsByPage.get(page) ?? new Set<string>();
      visits.add(visitKey);
      pageViewsByPage.set(page, visits);
      continue;
    }

    if (event.event_type === "web_vital") {
      const visits = vitalsVisitsByPage.get(page) ?? new Set<string>();
      visits.add(visitKey);
      vitalsVisitsByPage.set(page, visits);
      vitalSamplesByPage.set(page, (vitalSamplesByPage.get(page) ?? 0) + 1);
    }
  }

  return [...pageViewsByPage.entries()]
    .map(([page, pageViewVisits]) => {
      const visitsWithWebVitals = vitalsVisitsByPage.get(page)?.size ?? 0;
      const pageViews = pageViewVisits.size;
      return {
        page,
        pageViews,
        visitsWithWebVitals,
        coveragePercent: pageViews > 0 ? Math.round((visitsWithWebVitals / pageViews) * 100) : 0,
        totalSamples: vitalSamplesByPage.get(page) ?? 0,
      };
    })
    .sort((a, b) => b.pageViews - a.pageViews);
}

function summarizeMetricSet(set: Record<string, { values: number[]; ratings: { good: number; needsImprovement: number; poor: number } }>): WebVitalMetricSummary[] {
  return (["LCP", "CLS", "INP", "FCP", "TTFB"] as const).map((name) => {
    const metric = set[name];
    if (!metric) {
      return {
        name,
        median: null,
        p75: null,
        p95: null,
        p99: null,
        min: null,
        max: null,
        total: 0,
        ratings: { good: 0, needsImprovement: 0, poor: 0 },
      };
    }
    const vals = metric.values;
    return {
      name,
      median: median(vals),
      p75: percentile(vals, 75),
      p95: percentile(vals, 95),
      p99: percentile(vals, 99),
      min: vals.length ? Math.min(...vals) : null,
      max: vals.length ? Math.max(...vals) : null,
      total: vals.length,
      ratings: metric.ratings,
    };
  });
}

export function buildWebVitalsDashboard(
  events: EventRow[],
  sessions: CanonicalWebsiteSession[],
): WebVitalsDashboard | null {
  const vitals = events.filter((e) => e.event_type === "web_vital" && isTrackablePage(e.page_path));
  if (vitals.length === 0) return null;

  type VitalMetric = { values: number[]; ratings: { good: number; needsImprovement: number; poor: number } };
  const byMetric: Record<string, VitalMetric> = {};
  const byDeviceMetric: Record<"desktop" | "mobile", Record<string, VitalMetric>> = {
    desktop: {},
    mobile: {},
  };
  const byPage: Record<string, Record<string, number[]>> = {};

  for (const event of vitals) {
    const name = String(event.event_data?.metric_name ?? "").toUpperCase();
    const value = Number(event.event_data?.metric_value);
    const rating = String(event.event_data?.rating ?? "poor");
    const page = normalizePath(event.page_path);
    if (!name || Number.isNaN(value)) continue;

    if (!byMetric[name]) byMetric[name] = { values: [], ratings: { good: 0, needsImprovement: 0, poor: 0 } };
    byMetric[name].values.push(value);
    if (rating === "good") byMetric[name].ratings.good += 1;
    else if (rating === "needs-improvement") byMetric[name].ratings.needsImprovement += 1;
    else byMetric[name].ratings.poor += 1;

    const device = event.device_type === "mobile" ? "mobile" : event.device_type === "desktop" ? "desktop" : null;
    if (device) {
      if (!byDeviceMetric[device][name]) {
        byDeviceMetric[device][name] = { values: [], ratings: { good: 0, needsImprovement: 0, poor: 0 } };
      }
      byDeviceMetric[device][name].values.push(value);
      if (rating === "good") byDeviceMetric[device][name].ratings.good += 1;
      else if (rating === "needs-improvement") byDeviceMetric[device][name].ratings.needsImprovement += 1;
      else byDeviceMetric[device][name].ratings.poor += 1;
    }

    if (!byPage[page]) byPage[page] = {};
    if (!byPage[page][name]) byPage[page][name] = [];
    byPage[page][name].push(value);
  }

  const pageCoverageRows = buildPageWebVitalsCoverage(events.filter((e) => isTrackablePage(e.page_path)));
  const totalPageViews = pageCoverageRows.reduce((sum, row) => sum + row.pageViews, 0);
  const pageViewsWithWebVitals = pageCoverageRows.reduce((sum, row) => sum + row.visitsWithWebVitals, 0);

  const pageBreakdown: WebVitalPageBreakdown[] = pageCoverageRows.map((coverageRow) => {
    const metrics = byPage[coverageRow.page] ?? {};
    return {
      page: coverageRow.page,
      pageViews: coverageRow.pageViews,
      visitsWithWebVitals: coverageRow.visitsWithWebVitals,
      coveragePercent: coverageRow.coveragePercent,
      lcp: metrics.LCP ? Math.round(median(metrics.LCP) ?? 0) : null,
      cls: metrics.CLS ? Math.round(median(metrics.CLS) ?? 0) : null,
      inp: metrics.INP ? Math.round(median(metrics.INP) ?? 0) : null,
      fcp: metrics.FCP ? Math.round(median(metrics.FCP) ?? 0) : null,
      ttfb: metrics.TTFB ? Math.round(median(metrics.TTFB) ?? 0) : null,
      samples: coverageRow.totalSamples,
    };
  });

  const sessionHashesWithVitals = new Set(
    vitals.map((event) => event.session_hash).filter(Boolean) as string[],
  );

  return {
    metricSummaries: summarizeMetricSet(byMetric),
    pageBreakdown,
    byDevice: {
      desktop: summarizeMetricSet(byDeviceMetric.desktop),
      mobile: summarizeMetricSet(byDeviceMetric.mobile),
    },
    performanceCoverage: {
      totalSessions: sessions.length,
      sessionsWithWebVitals: sessionHashesWithVitals.size,
      totalWebVitalSamples: vitals.length,
      totalPageViews,
      pageViewsWithWebVitals,
      pageViewCoveragePercent: totalPageViews > 0 ? Math.round((pageViewsWithWebVitals / totalPageViews) * 100) : 0,
    },
  };
}

export function buildUxSignalsData(events: EventRow[]): UxSignalsData {
  const rageClicks = events.filter((e) => e.event_type === "rage_click");
  const outboundClicks = events.filter((e) => e.event_type === "outbound_click");

  const rageBySelector = new Map<string, { selector: string; page: string; clickCount: number; occurrences: number }>();
  for (const event of rageClicks) {
    const selector = String(event.event_data?.selector ?? "unknown");
    const page = normalizePath(event.page_path);
    const key = `${selector}__${page}`;
    const cur = rageBySelector.get(key) ?? { selector, page, clickCount: 0, occurrences: 0 };
    cur.clickCount += Number(event.event_data?.click_count) || 1;
    cur.occurrences += 1;
    rageBySelector.set(key, cur);
  }

  const outboundByHost = new Map<string, { host: string; count: number; pages: Set<string> }>();
  for (const event of outboundClicks) {
    const host = String(event.event_data?.outbound_host ?? "unknown");
    const page = normalizePath(event.page_path);
    const cur = outboundByHost.get(host) ?? { host, count: 0, pages: new Set<string>() };
    cur.count += 1;
    cur.pages.add(page);
    outboundByHost.set(host, cur);
  }

  return {
    totalRage: rageClicks.length,
    totalOutbound: outboundClicks.length,
    rageTable: [...rageBySelector.values()].sort((a, b) => b.occurrences - a.occurrences),
    outboundTable: [...outboundByHost.values()]
      .map((row) => ({ host: row.host, count: row.count, pages: [...row.pages] }))
      .sort((a, b) => b.count - a.count),
  };
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
  const map = new Map<string, { label: string; page_view: number; consent_update: number; gtm_loaded: number }>();
  for (const e of events) {
    if (!e.event_ts) continue;
    const ts = parseISO(e.event_ts);
    const key = format(ts, "yyyy-MM-dd HH:00");
    const cur = map.get(key) ?? {
      label: format(ts, "d. HH:mm", { locale: de }),
      page_view: 0,
      consent_update: 0,
      gtm_loaded: 0,
    };
    if (e.event_type === "page_view") cur.page_view += 1;
    if (e.event_type === "consent_update") cur.consent_update += 1;
    if (e.event_type === "gtm_loaded") cur.gtm_loaded += 1;
    map.set(key, cur);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-48)
    .map(([, v]) => ({
      hour: v.label,
      page_view: v.page_view,
      consent_update: v.consent_update,
      gtm_loaded: v.gtm_loaded,
    }));
}
