"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import MetricRow from "@/components/admin/analytics/ui/MetricRow";
import { CHART_COLORS, SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import CountryHeatMap from "./CountryHeatMap";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { countryMetrics, dailySessionTrend, regionMetrics } from "@/lib/analytics/dashboardMetrics";

export default function OverviewTab({ sessions }: { sessions: CanonicalWebsiteSession[] }) {
  const daily = dailySessionTrend(sessions);
  const countries = countryMetrics(sessions);
  const regions = regionMetrics(sessions);
  const devices = [...sessions.reduce((m, s) => {
    const d = s.device_type ?? "unknown";
    m.set(d, (m.get(d) ?? 0) + 1);
    return m;
  }, new Map<string, number>())].map(([name, value]) => ({ name, value }));
  const sources = [...sessions.reduce((m, s) => {
    m.set(s.traffic_source_label, (m.get(s.traffic_source_label) ?? 0) + 1);
    return m;
  }, new Map<string, number>())].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div className="space-y-6">
      <MetricRow
        items={[
          { label: "Sessions", value: sessions.length },
          { label: "Engaged", value: sessions.filter((s) => s.status !== "bounced").length },
          { label: "Leads", value: sessions.filter((s) => s.reached_lead).length },
          {
            label: "Lead Rate",
            value: sessions.length
              ? `${Math.round((sessions.filter((s) => s.reached_lead).length / sessions.length) * 1000) / 10}%`
              : "0%",
          },
          {
            label: "Pages/Session",
            value: sessions.length
              ? Math.round((sessions.reduce((a, s) => a + s.page_views, 0) / sessions.length) * 10) / 10
              : 0,
          },
        ]}
      />

      <CountryHeatMap
        data={countries}
        regionData={regions}
        totalSessions={sessions.length}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ChartCard title="Sessions & Leads (täglich)" className="lg:col-span-3" height={280}>
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
            <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
            <FenyxTooltip />
            <Legend />
            <Bar dataKey="sessions" fill={SIGNAL} name="Sessions" />
            <Bar dataKey="leads" fill="#8da4ba" name="Leads" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Geräte" className="lg:col-span-2" height={280}>
          <PieChart>
            <Pie data={devices} dataKey="value" nameKey="name" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
              {devices.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <FenyxTooltip />
          </PieChart>
        </ChartCard>
      </div>

      <ChartCard title="Traffic-Quellen (Top 8)" height={260}>
        <BarChart data={sources} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Sessions" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
