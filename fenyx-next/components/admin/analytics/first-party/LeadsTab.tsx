"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { dailySessionTrend } from "@/lib/analytics/dashboardMetrics";

export default function LeadsTab({ sessions }: { sessions: CanonicalWebsiteSession[] }) {
  const leadSessions = sessions.filter((s) => s.reached_lead || s.leads > 0);
  const daily = dailySessionTrend(leadSessions).map((d) => ({ day: d.day, leads: d.leads }));

  const bySurface = useMemo(() => {
    const map = new Map<string, number>();
    for (const session of leadSessions) {
      const key = session.lead_surface?.trim() || "Unbekannt";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [leadSessions]);

  const byServiceArea = useMemo(() => {
    const map = new Map<string, number>();
    for (const session of leadSessions) {
      const key = session.lead_service_area?.trim() || "Unbekannt";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [leadSessions]);

  return (
    <div className="space-y-6">
      <TabIntro
        title="Leads"
        description="Echte Lead-Ereignisse (Formular, Telefon, E-Mail) — nicht CTA-Klicks."
        hint="CTA-Engagement ohne Lead siehe Tab „CTAs“."
      />
      <ChartCard title="Leads pro Tag" height={260}>
        <BarChart data={daily}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="day" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="leads" fill={SIGNAL} name="Leads" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Leads nach Surface" height={240}>
        <BarChart data={bySurface} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Leads" />
        </BarChart>
      </ChartCard>
      <ChartCard title="Leads nach Service-Area" height={240}>
        <BarChart data={byServiceArea} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Leads" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
