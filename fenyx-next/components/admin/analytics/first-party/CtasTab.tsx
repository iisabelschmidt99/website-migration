"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import type { EventRow } from "@/lib/analytics/dashboardTypes";

export default function CtasTab({ events }: { events: EventRow[] }) {
  const rows = [...events
    .filter((e) => e.event_type === "cta_click")
    .reduce((m, e) => {
      const id = String(e.event_data?.element_id ?? "unknown");
      m.set(id, (m.get(id) ?? 0) + 1);
      return m;
    }, new Map<string, number>())]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <TabIntro
        title="CTA Performance"
        description="Klicks auf getrackte Call-to-Action-Elemente — Intent-Signale, keine Formular-Leads."
        hint="Echte Leads (Formular, Telefon, E-Mail) siehe Tab „Leads“."
      />
      <ChartCard title="CTA Performance" height={320}>
        <BarChart data={rows.slice(0, 12)} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis type="number" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#8da4ba", fontSize: 10 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} name="Klicks" />
        </BarChart>
      </ChartCard>
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
              <th className="pb-2">Element</th>
              <th className="pb-2 text-right">Klicks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-white/5">
                <td className="py-2 text-mist-soft">{r.name}</td>
                <td className="py-2 text-right text-white">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
