"use client";

import { useMemo } from "react";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import type { EventRow } from "@/lib/analytics/dashboardTypes";
import { buildUxSignalsData } from "@/lib/analytics/dashboardMetrics";

function shortPath(path: string): string {
  if (path.length <= 40) return path;
  return `…${path.slice(-38)}`;
}

export default function UxSignalsTab({ events }: { events: EventRow[] }) {
  const data = useMemo(() => buildUxSignalsData(events), [events]);

  return (
    <div className="space-y-6">
      <TabIntro
        title="UX Signals"
        description="Frustrations-Signale und Abgänge: wiederholte Klicks ohne Reaktion und Klicks auf externe Links."
        hint="Rage Clicks deuten auf UI-Probleme hin. Outbound Clicks zeigen, wohin Nutzer die Site verlassen."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.02] p-5">
          <p className="text-2xl font-heading text-white">{data.totalRage}</p>
          <p className="text-xs text-mist">Rage Clicks</p>
        </div>
        <div className="border border-white/10 bg-white/[0.02] p-5">
          <p className="text-2xl font-heading text-white">{data.totalOutbound}</p>
          <p className="text-xs text-mist">Outbound Clicks</p>
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Rage Clicks</h3>
        <p className="mb-4 text-xs text-mist">Elemente, die Nutzer wiederholt ohne Reaktion angeklickt haben.</p>
        {data.rageTable.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">Keine Rage Clicks — gutes Zeichen.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
                  <th className="pb-2 pr-4">CSS Selector</th>
                  <th className="pb-2 pr-4">Seite</th>
                  <th className="pb-2 text-right">Klicks</th>
                  <th className="pb-2 text-right">Vorkommen</th>
                </tr>
              </thead>
              <tbody>
                {data.rageTable.slice(0, 20).map((row) => (
                  <tr key={`${row.selector}-${row.page}`} className="border-b border-white/5">
                    <td className="max-w-[280px] truncate py-2 pr-4 font-mono text-xs text-mist-soft">
                      {row.selector}
                    </td>
                    <td className="max-w-[200px] truncate py-2 pr-4 font-mono text-xs text-mist-soft">
                      {shortPath(row.page)}
                    </td>
                    <td className="py-2 text-right text-white">{row.clickCount}</td>
                    <td className="py-2 text-right text-mist">{row.occurrences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Outbound Clicks</h3>
        <p className="mb-4 text-xs text-mist">Externe Links, die Nutzer von fenyx-office.com wegführen.</p>
        {data.outboundTable.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">Keine Outbound Clicks im Zeitraum.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
                  <th className="pb-2 pr-4">Host</th>
                  <th className="pb-2 text-right">Klicks</th>
                  <th className="pb-2 pl-4">Seiten</th>
                </tr>
              </thead>
              <tbody>
                {data.outboundTable.slice(0, 20).map((row) => (
                  <tr key={row.host} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-mist-soft">{row.host}</td>
                    <td className="py-2 text-right text-white">{row.count}</td>
                    <td className="py-2 pl-4 text-xs text-mist">
                      {row.pages.slice(0, 3).map(shortPath).join(" · ")}
                      {row.pages.length > 3 ? ` (+${row.pages.length - 3})` : ""}
                    </td>
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
