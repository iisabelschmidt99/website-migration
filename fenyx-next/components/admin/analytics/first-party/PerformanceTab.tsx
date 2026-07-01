"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { buildWebVitalsDashboard, rumP75, type WebVitalMetricSummary } from "@/lib/analytics/dashboardMetrics";

const THRESHOLDS: Record<string, { good: number; poor: number; unit: string; label: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms", label: "Largest Contentful Paint" },
  CLS: { good: 100, poor: 250, unit: "", label: "Cumulative Layout Shift" },
  INP: { good: 200, poor: 500, unit: "ms", label: "Interaction to Next Paint" },
  FCP: { good: 1800, poor: 3000, unit: "ms", label: "First Contentful Paint" },
  TTFB: { good: 800, poor: 1800, unit: "ms", label: "Time to First Byte" },
};

function vitalRating(name: string, value: number | null): "good" | "needs-improvement" | "poor" | "none" {
  if (value === null) return "none";
  const threshold = THRESHOLDS[name];
  if (!threshold) return "none";
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function ratingClass(rating: ReturnType<typeof vitalRating>): string {
  if (rating === "good") return "text-system-success";
  if (rating === "needs-improvement") return "text-system-warning";
  if (rating === "poor") return "text-system-error";
  return "text-mist";
}

function ratingBadge(rating: ReturnType<typeof vitalRating>): string {
  if (rating === "good") return "Gut";
  if (rating === "needs-improvement") return "Verbesserung";
  if (rating === "poor") return "Schlecht";
  return "—";
}

function formatVital(name: string, value: number | null): string {
  if (value === null) return "—";
  const unit = THRESHOLDS[name]?.unit ?? "";
  return `${Math.round(value)}${unit}`;
}

function MetricSummaryCard({ metric }: { metric: WebVitalMetricSummary }) {
  const threshold = THRESHOLDS[metric.name];
  const primary = metric.p75 ?? metric.median;
  const rating = vitalRating(metric.name, primary);
  const total = metric.ratings.good + metric.ratings.needsImprovement + metric.ratings.poor;

  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-white">{metric.name}</span>
        {primary !== null ? (
          <span className="border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mist">
            {ratingBadge(rating)}
          </span>
        ) : null}
      </div>
      <p className={`text-3xl font-heading ${ratingClass(rating)}`}>{formatVital(metric.name, primary)}</p>
      <p className="mt-1 text-xs text-mist">p75 · {metric.total} Samples</p>
      {total > 0 ? (
        <>
          <div className="mt-3 flex h-2 overflow-hidden bg-abyss-deep">
            <div className="bg-system-success" style={{ width: `${(metric.ratings.good / total) * 100}%` }} />
            <div
              className="bg-system-warning"
              style={{ width: `${(metric.ratings.needsImprovement / total) * 100}%` }}
            />
            <div className="bg-system-error" style={{ width: `${(metric.ratings.poor / total) * 100}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-mist">
            <span>{metric.ratings.good} gut</span>
            <span>{metric.ratings.needsImprovement} ok</span>
            <span>{metric.ratings.poor} schlecht</span>
          </div>
        </>
      ) : null}
      {threshold ? (
        <p className="mt-2 text-[10px] text-mist-ash">{threshold.label}</p>
      ) : null}
    </div>
  );
}

export default function PerformanceTab({
  events,
  sessions,
  cruxConfigured,
}: {
  events: EventRow[];
  sessions: CanonicalWebsiteSession[];
  cruxConfigured: boolean;
}) {
  const dashboard = useMemo(() => buildWebVitalsDashboard(events, sessions), [events, sessions]);
  const rum = rumP75(events.filter((event) => !event.page_path.startsWith("/admin")));
  const [cruxOpen, setCruxOpen] = useState(false);
  const [crux, setCrux] = useState<{ metric: string; p75: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceOpen, setDeviceOpen] = useState({ desktop: true, mobile: false });

  async function fetchCrux() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crux?origin=https://fenyx-office.netlify.app", { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setCrux([
        { metric: "LCP", p75: json.row?.lcp_p75 ?? 0 },
        { metric: "INP", p75: json.row?.inp_p75 ?? 0 },
        { metric: "CLS", p75: json.row?.cls_p75 ?? 0 },
        { metric: "FCP", p75: json.row?.fcp_p75 ?? 0 },
        { metric: "TTFB", p75: json.row?.ttfb_p75 ?? 0 },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "CrUX Abruf fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  const compareData = rum.map((row) => {
    const c = crux?.find((item) => item.metric === row.metric);
    return { metric: row.metric, RUM: row.p75, CrUX: c?.p75 ?? 0, samples: row.samples };
  });

  if (!dashboard) {
    return (
      <div className="space-y-6">
        <TabIntro
          title="Performance (RUM)"
          description="Echte Ladezeiten aus Besucher-Browsern — pro Seite und Gerät."
          hint="CrUX (Google) ist origin-weit aggregiert und ersetzt nicht RUM pro Seite."
        />
        <div className="border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-mist">
          Noch keine Web-Vitals-Daten — `web_vital`-Events erscheinen beim Browsen der Website.
        </div>
      </div>
    );
  }

  const coverage = dashboard.performanceCoverage;

  return (
    <div className="space-y-6">
      <TabIntro
        title="Performance (RUM)"
        description="Echte Ladezeiten aus Besucher-Browsern — pro Seite und Gerät."
        hint="CrUX (Google) ist origin-weit aggregiert und ersetzt nicht RUM pro Seite."
      />

      <div className="flex flex-wrap gap-3 border border-white/10 bg-white/[0.02] p-4 text-xs text-mist">
        <span className="font-semibold text-white">Coverage</span>
        <span>
          {coverage.pageViewsWithWebVitals} von {coverage.totalPageViews} Page Views mit Web Vital
        </span>
        <span className="border border-white/10 px-2 py-0.5">{coverage.pageViewCoveragePercent}% Visit-Coverage</span>
        <span className="border border-white/10 px-2 py-0.5">{coverage.totalWebVitalSamples} Samples</span>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-mist">Summary (p75)</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dashboard.metricSummaries.map((metric) => (
            <MetricSummaryCard key={metric.name} metric={metric} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-mist">Nach Gerät</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {(["desktop", "mobile"] as const).map((device) => {
            const rows = dashboard.byDevice[device];
            const sampleCount = rows.reduce((sum, row) => sum + row.total, 0);
            return (
              <div key={device} className="border border-white/10 bg-white/[0.02] p-4">
                <button
                  type="button"
                  onClick={() => setDeviceOpen((state) => ({ ...state, [device]: !state[device] }))}
                  className="mb-3 flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold capitalize text-white">
                    {device === "desktop" ? "Desktop" : "Mobil"}
                  </span>
                  <span className="text-xs text-mist">{sampleCount} Samples</span>
                </button>
                {deviceOpen[device] ? (
                  <div className="space-y-3">
                    {rows.map((row) => {
                      const primary = row.p75 ?? row.median;
                      const rating = vitalRating(row.name, primary);
                      return (
                        <div key={`${device}-${row.name}`}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-mist">{row.name}</span>
                            <span className={ratingClass(rating)}>{formatVital(row.name, primary)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Per-Page Breakdown</h3>
        <p className="mb-4 text-xs text-mist">
          Median-Werte pro Seite — farbcodiert nach Google-Schwellwerten (grün/gelb/rot).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
                <th className="pb-2 pr-4">Seite</th>
                <th className="pb-2 text-right">Views</th>
                <th className="pb-2 text-right">Mit Vitals</th>
                <th className="pb-2 text-right">Coverage</th>
                <th className="pb-2 text-right">LCP</th>
                <th className="pb-2 text-right">FCP</th>
                <th className="pb-2 text-right">TTFB</th>
                <th className="pb-2 text-right">CLS</th>
                <th className="pb-2 text-right">INP</th>
                <th className="pb-2 text-right">Samples</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.pageBreakdown.slice(0, 25).map((row) => (
                <tr key={row.page} className="border-b border-white/5">
                  <td className="max-w-[260px] truncate py-2 pr-4 font-mono text-xs text-mist-soft">{row.page}</td>
                  <td className="py-2 text-right text-white">{row.pageViews}</td>
                  <td className="py-2 text-right text-white">{row.visitsWithWebVitals}</td>
                  <td className="py-2 text-right text-mist">{row.coveragePercent}%</td>
                  <td className={`py-2 text-right ${ratingClass(vitalRating("LCP", row.lcp))}`}>{row.lcp ?? "—"}</td>
                  <td className={`py-2 text-right ${ratingClass(vitalRating("FCP", row.fcp))}`}>{row.fcp ?? "—"}</td>
                  <td className={`py-2 text-right ${ratingClass(vitalRating("TTFB", row.ttfb))}`}>{row.ttfb ?? "—"}</td>
                  <td className={`py-2 text-right ${ratingClass(vitalRating("CLS", row.cls))}`}>{row.cls ?? "—"}</td>
                  <td className={`py-2 text-right ${ratingClass(vitalRating("INP", row.inp))}`}>{row.inp ?? "—"}</td>
                  <td className="py-2 text-right text-mist">{row.samples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.02]">
        <button
          type="button"
          onClick={() => setCruxOpen((value) => !value)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <h3 className="text-sm font-semibold text-white">Google CrUX Felddaten (Origin-Level)</h3>
            <p className="text-xs text-mist">Optional — aggregiert über viele Google-Nutzer, nicht pro Seite.</p>
          </div>
          <span className="text-xs text-mist">{cruxOpen ? "▲" : "▼"}</span>
        </button>
        {cruxOpen ? (
          <div className="space-y-4 border-t border-white/10 px-5 pb-5 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-mist">
                {cruxConfigured ? "Ergänzt RUM um Felddaten der Origin." : "GOOGLE_CRUX_API_KEY fehlt in .env.local"}
              </p>
              <button
                type="button"
                disabled={!cruxConfigured || loading}
                onClick={fetchCrux}
                className="border border-signal bg-signal px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black disabled:opacity-50"
              >
                {loading ? "Lädt…" : "CrUX laden"}
              </button>
            </div>
            {error ? <p className="text-sm text-system-error">{error}</p> : null}
            {crux ? (
              <ChartCard title="RUM vs. CrUX (p75)" height={260}>
                <BarChart data={compareData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
                  <XAxis dataKey="metric" tick={{ fill: "#8da4ba", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
                  <FenyxTooltip />
                  <Bar dataKey="RUM" fill={SIGNAL} name="RUM p75" />
                  <Bar dataKey="CrUX" fill="#8da4ba" name="CrUX p75" />
                </BarChart>
              </ChartCard>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
