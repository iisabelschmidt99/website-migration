"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { rumP75 } from "@/lib/analytics/dashboardMetrics";

export default function PerformanceTab({
  events,
  cruxConfigured,
}: {
  events: EventRow[];
  cruxConfigured: boolean;
}) {
  const rum = rumP75(events);
  const [crux, setCrux] = useState<{ metric: string; p75: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const compareData = rum.map((r) => {
    const c = crux?.find((x) => x.metric === r.metric);
    return { metric: r.metric, RUM: r.p75, CrUX: c?.p75 ?? 0, samples: r.samples };
  });

  return (
    <div className="space-y-6">
      <ChartCard title="RUM Web Vitals (p75)" height={280}>
        <BarChart data={rum}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="metric" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="p75" fill={SIGNAL} name="p75" />
        </BarChart>
      </ChartCard>
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">CrUX Felddaten (Google)</h3>
            <p className="text-xs text-mist">
              {cruxConfigured ? "Aggregiert über viele Nutzer — ergänzt RUM." : "GOOGLE_CRUX_API_KEY fehlt"}
            </p>
          </div>
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
      <p className="text-xs text-mist">RUM Samples: {rum.reduce((s, r) => s + r.samples, 0)} Events</p>
    </div>
  );
}
