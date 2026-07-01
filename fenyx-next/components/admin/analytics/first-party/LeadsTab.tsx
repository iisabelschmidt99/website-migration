"use client";

import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { dailySessionTrend } from "@/lib/analytics/dashboardMetrics";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export default function LeadsTab({ sessions }: { sessions: CanonicalWebsiteSession[] }) {
  const leadSessions = sessions.filter((s) => s.reached_lead || s.leads > 0);
  const daily = dailySessionTrend(leadSessions).map((d) => ({ day: d.day, leads: d.leads }));

  const byArea = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of leadSessions) {
      const area = s.page_history[0]?.path?.split("/").filter(Boolean)[0] ?? "other";
      map.set(area, (map.get(area) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [leadSessions]);

  const trend = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of leadSessions) {
      const day = format(parseISO(s.landing_time), "yyyy-MM-dd");
      map.set(day, (map.get(day) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, count]) => ({ day: format(parseISO(day), "d. MMM", { locale: de }), count }));
  }, [leadSessions]);

  return (
    <div className="space-y-6">
      <ChartCard title="Leads pro Tag" height={260}>
        <BarChart data={daily}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="leads" fill={SIGNAL} name="Leads" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Lead-Trend" height={240}>
        <AreaChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Area type="monotone" dataKey="count" stroke={SIGNAL} fill={`${SIGNAL}33`} name="Leads" />
        </AreaChart>
      </ChartCard>
      <ChartCard title="Leads nach Bereich (URL-Segment)" height={240}>
        <BarChart data={byArea} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Leads" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
