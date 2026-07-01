"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";

export default function PathsTab({ sessions }: { sessions: CanonicalWebsiteSession[] }) {
  const entryPages = useMemo(() => {
    const map = new Map<string, { total: number; engaged: number; leads: number }>();
    for (const s of sessions) {
      const path = s.landing_page || "/";
      const cur = map.get(path) ?? { total: 0, engaged: 0, leads: 0 };
      cur.total += 1;
      if (s.status !== "bounced") cur.engaged += 1;
      if (s.reached_lead) cur.leads += 1;
      map.set(path, cur);
    }
    return [...map.entries()]
      .map(([path, v]) => ({
        path,
        total: v.total,
        engagedPct: v.total ? Math.round((v.engaged / v.total) * 100) : 0,
        leadPct: v.total ? Math.round((v.leads / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }, [sessions]);

  const dropOffs = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (s.reached_lead || s.status === "bounced") continue;
      const last = s.page_history[s.page_history.length - 1]?.path ?? s.landing_page;
      if (last) map.set(last, (map.get(last) ?? 0) + 1);
    }
    return [...map.entries()].map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Einstiegsseiten</h3>
        <div className="space-y-3">
          {entryPages.map((p) => (
            <div key={p.path}>
              <div className="mb-1 flex justify-between text-xs text-mist">
                <span className="truncate text-mist-soft">{p.path}</span>
                <span>{p.total} Sessions</span>
              </div>
              <div className="flex h-2 overflow-hidden bg-abyss-deep">
                <div className="bg-signal" style={{ width: `${p.leadPct}%` }} title={`Lead ${p.leadPct}%`} />
                <div className="bg-mist/40" style={{ width: `${Math.max(0, p.engagedPct - p.leadPct)}%` }} title={`Engaged ${p.engagedPct}%`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChartCard title="Drop-off Seiten (ohne Lead)" height={280}>
        <BarChart data={dropOffs.map((d) => ({ name: d.path.slice(0, 30), count: d.count }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="name" tick={{ fill: "#8da4ba", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="count" fill={SIGNAL} name="Sessions" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
