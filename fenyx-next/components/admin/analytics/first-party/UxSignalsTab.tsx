"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { dailyEventTrend } from "@/lib/analytics/dashboardMetrics";

export default function UxSignalsTab({ events }: { events: EventRow[] }) {
  const rageDaily = dailyEventTrend(events, "rage_click");
  const outboundDaily = dailyEventTrend(events, "outbound_click");

  const topPages = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      if (e.event_type !== "rage_click" && e.event_type !== "outbound_click") continue;
      map.set(e.page_path, (map.get(e.page_path) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, value]) => ({ name: name.slice(0, 35), value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [events]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Rage Clicks (täglich)" height={240}>
          <BarChart data={rageDaily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <FenyxTooltip />
            <Bar dataKey="count" fill={SIGNAL} name="Events" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Outbound Clicks (täglich)" height={240}>
          <BarChart data={outboundDaily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <FenyxTooltip />
            <Bar dataKey="count" fill="#8da4ba" name="Events" />
          </BarChart>
        </ChartCard>
      </div>
      <ChartCard title="Top Seiten (UX-Signale)" height={260}>
        <BarChart data={topPages} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#8da4ba", fontSize: 10 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Events" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
