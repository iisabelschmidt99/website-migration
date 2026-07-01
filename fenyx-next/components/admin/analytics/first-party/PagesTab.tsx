"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { pagePerformance } from "@/lib/analytics/dashboardMetrics";

export default function PagesTab({ events }: { events: EventRow[] }) {
  const rows = pagePerformance(events).slice(0, 25);
  const chartData = rows.slice(0, 15).map((r) => ({ name: r.path.length > 40 ? `…${r.path.slice(-38)}` : r.path, views: r.views }));

  return (
    <div className="space-y-6">
      <ChartCard title="Top Seiten (Page Views)" height={320}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#8da4ba", fontSize: 10 }} />
          <FenyxTooltip />
          <Bar dataKey="views" fill={SIGNAL} name="Views" />
        </BarChart>
      </ChartCard>
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
              <th className="pb-2">Pfad</th>
              <th className="pb-2 text-right">Views</th>
              <th className="pb-2 text-right">CTA Klicks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.path} className="border-b border-white/5">
                <td className="py-2 text-mist-soft">{r.path}</td>
                <td className="py-2 text-right text-white">{r.views}</td>
                <td className="py-2 text-right text-white">{r.ctas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
