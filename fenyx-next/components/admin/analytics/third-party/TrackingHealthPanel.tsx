"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { hourlyEventCounts } from "@/lib/analytics/dashboardMetrics";

export default function TrackingHealthPanel({ events }: { events: EventRow[] }) {
  const hourly = hourlyEventCounts(events);
  const byType = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.event_type, (map.get(e.event_type) ?? 0) + 1);
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 12);
  }, [events]);

  return (
    <div className="space-y-6">
      <ChartCard title="Event-Ingestion (stündlich)" height={280}>
        <BarChart data={hourly}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="hour" tick={{ fill: "#8da4ba", fontSize: 10 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Legend />
          <Bar dataKey="page_view" fill={SIGNAL} name="page_view" stackId="a" />
          <Bar dataKey="consent_update" fill="#8da4ba" name="consent_update" stackId="a" />
          <Bar dataKey="gtm_loaded" fill="#dceaf5" name="gtm_loaded" stackId="a" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Pipeline Health (Consent → GTM → Page View)" height={260}>
        <LineChart data={hourly}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="hour" tick={{ fill: "#8da4ba", fontSize: 10 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Legend />
          <Line type="monotone" dataKey="consent_update" stroke="#8da4ba" name="consent_update" dot={false} />
          <Line type="monotone" dataKey="gtm_loaded" stroke={SIGNAL} name="gtm_loaded" dot={false} />
          <Line type="monotone" dataKey="page_view" stroke="#dceaf5" name="page_view" dot={false} />
        </LineChart>
      </ChartCard>
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Event Breakdown</h3>
        <table className="w-full text-sm">
          <tbody>
            {byType.map((r) => (
              <tr key={r.name} className="border-b border-white/5">
                <td className="py-2 text-mist">{r.name}</td>
                <td className="py-2 text-right text-white">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
