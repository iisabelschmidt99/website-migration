"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import { formatDuration } from "@/components/admin/analytics/ui/chartLabels";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { buildPageContentMetrics } from "@/lib/analytics/dashboardMetrics";

export default function PagesTab({ events }: { events: EventRow[] }) {
  const rows = buildPageContentMetrics(events);
  const chartData = rows.slice(0, 10).map((row) => ({
    name: row.page_path.length > 36 ? `…${row.page_path.slice(-34)}` : row.page_path,
    views: row.page_views,
  }));

  return (
    <div className="space-y-6">
      <TabIntro
        title="Seitenperformance"
        description="Welche Seiten werden wie oft besucht, wie lange gelesen und wo werden CTAs geklickt?"
        hint="Einzelne URLs — für Seitenfolgen und Abbrüche siehe Tab „Paths“."
      />

      {rows.length > 0 ? (
        <ChartCard title="Top Seiten (Page Views)" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#8da4ba", fontSize: 10 }} />
            <FenyxTooltip />
            <Bar dataKey="views" fill={SIGNAL} name="Views" />
          </BarChart>
        </ChartCard>
      ) : null}

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Page Performance</h3>
        <p className="mb-4 text-xs text-mist">
          Views, Sessions, Verweildauer (Median), Scroll-Tiefe und CTA-Klicks pro URL.
        </p>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">
            Noch keine Seitendaten — Events erscheinen beim Browsen der Website.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
                  <th className="pb-2 pr-4">Seite</th>
                  <th className="pb-2 text-right">Views</th>
                  <th className="pb-2 text-right">Sessions</th>
                  <th className="pb-2 text-right">Ø Zeit</th>
                  <th className="pb-2 text-right">Scroll ≥75%</th>
                  <th className="pb-2 text-right">CTA</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.page_path} className="border-b border-white/5">
                    <td className="max-w-[320px] truncate py-2 pr-4 font-mono text-xs text-mist-soft">
                      {row.page_path}
                    </td>
                    <td className="py-2 text-right text-white">{row.page_views}</td>
                    <td className="py-2 text-right text-white">{row.unique_sessions}</td>
                    <td className="py-2 text-right text-white">{formatDuration(row.avg_time_seconds)}</td>
                    <td className="py-2 text-right text-white">{row.scroll_75}</td>
                    <td className="py-2 text-right text-white">{row.cta_clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
