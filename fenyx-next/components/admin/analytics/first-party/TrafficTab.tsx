"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { CHART_COLORS, SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import type { EventRow } from "@/lib/analytics/dashboardTypes";

export default function TrafficTab({
  sessions,
  events,
}: {
  sessions: CanonicalWebsiteSession[];
  events: EventRow[];
}) {
  const bots = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      const k = e.bot_classification ?? "human";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [events]);

  const qualityHist = useMemo(() => {
    const buckets = [
      { label: "1 Seite", min: 0, max: 1 },
      { label: "2–3", min: 2, max: 3 },
      { label: "4–6", min: 4, max: 6 },
      { label: "7+", min: 7, max: 999 },
    ];
    return buckets.map((b) => ({
      label: b.label,
      count: sessions.filter((s) => s.page_views >= b.min && s.page_views <= b.max).length,
    }));
  }, [sessions]);

  const bySource = useMemo(() => {
    const map = new Map<string, { sessions: number; engaged: number }>();
    for (const s of sessions) {
      const k = s.traffic_source_label;
      const cur = map.get(k) ?? { sessions: 0, engaged: 0 };
      cur.sessions += 1;
      if (s.status !== "bounced") cur.engaged += 1;
      map.set(k, cur);
    }
    return [...map.entries()]
      .map(([source, v]) => ({
        source,
        sessions: v.sessions,
        engagement: v.sessions ? Math.round((v.engaged / v.sessions) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 12);
  }, [sessions]);

  const colo = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (!s.edge_colo) continue;
      map.set(s.edge_colo, (map.get(s.edge_colo) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Session-Tiefe (Seiten/Session)" height={260}>
          <BarChart data={qualityHist}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis dataKey="label" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <FenyxTooltip />
            <Bar dataKey="count" fill={SIGNAL} name="Sessions" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Bot vs. Human (Events)" height={260}>
          <PieChart>
            <Pie data={bots} dataKey="value" nameKey="name" outerRadius={90}>
              {bots.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <FenyxTooltip />
          </PieChart>
        </ChartCard>
      </div>
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Traffic Quality by Source</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
              <th className="pb-2">Quelle</th>
              <th className="pb-2 text-right">Sessions</th>
              <th className="pb-2 text-right">Engagement %</th>
            </tr>
          </thead>
          <tbody>
            {bySource.map((r) => (
              <tr key={r.source} className="border-b border-white/5">
                <td className="py-2 text-mist-soft">{r.source}</td>
                <td className="py-2 text-right text-white">{r.sessions}</td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-16 bg-abyss-deep">
                      <div className="h-full bg-signal" style={{ width: `${r.engagement}%` }} />
                    </div>
                    <span className="text-white">{r.engagement}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {colo.length > 0 ? (
        <ChartCard title="Edge Colo (Cloudflare)" height={220}>
          <BarChart data={colo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis dataKey="name" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <FenyxTooltip />
            <Bar dataKey="value" fill={SIGNAL} name="Sessions" />
          </BarChart>
        </ChartCard>
      ) : null}
    </div>
  );
}
