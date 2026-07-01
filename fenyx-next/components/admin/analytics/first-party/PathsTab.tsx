"use client";

import { useMemo } from "react";
import TabIntro from "@/components/admin/analytics/ui/TabIntro";
import MetricRow from "@/components/admin/analytics/ui/MetricRow";
import EnhancedPathAnalysis from "./EnhancedPathAnalysis";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import {
  buildDropOffPages,
  buildEntryPageMetrics,
  countSinglePageSessions,
} from "@/lib/analytics/dashboardMetrics";

function shortPath(path: string): string {
  if (path.length <= 48) return path;
  return `…${path.slice(-46)}`;
}

export default function PathsTab({ sessions }: { sessions: CanonicalWebsiteSession[] }) {
  const entryPages = useMemo(() => buildEntryPageMetrics(sessions).slice(0, 15), [sessions]);
  const dropOffs = useMemo(() => buildDropOffPages(sessions).slice(0, 10), [sessions]);
  const singlePageCount = useMemo(() => countSinglePageSessions(sessions), [sessions]);
  const leadHashes = useMemo(
    () => new Set(sessions.filter((session) => session.reached_lead).map((session) => session.session_hash)),
    [sessions],
  );

  return (
    <div className="space-y-6">
      <TabIntro
        title="Pfade & Journeys"
        description="Welche Seitenfolgen führen zu Leads — und wo brechen Besucher ohne Lead ab?"
        hint="Nicht einzelne Seiten-Views (→ Pages), sondern Reihenfolgen über mehrere Seiten in einer Session."
      />

      <MetricRow
        items={[
          { label: "Sessions", value: sessions.length },
          { label: "Ein-Seiten (Bounce)", value: singlePageCount },
          { label: "Multi-Seiten", value: Math.max(0, sessions.length - singlePageCount) },
          {
            label: "Bounce-Rate",
            value: sessions.length
              ? `${Math.round((singlePageCount / sessions.length) * 1000) / 10}%`
              : "0%",
          },
          { label: "Mit Lead", value: sessions.filter((session) => session.reached_lead).length },
        ]}
      />

      <EnhancedPathAnalysis sessions={sessions} completedSessionHashes={leadHashes} />

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Drop-off Seiten</h3>
        <p className="mb-4 text-xs text-mist">Letzte Seite vor Session-Ende — ohne Lead und ohne Bounce.</p>
        {dropOffs.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">Noch keine Drop-off-Daten.</p>
        ) : (
          <div className="space-y-2">
            {dropOffs.map((row, idx) => (
              <div key={row.page} className="flex items-center gap-3 border border-white/5 bg-abyss-deep p-3">
                <span className="flex h-6 w-6 items-center justify-center bg-signal/15 text-xs font-bold text-signal">
                  {idx + 1}
                </span>
                <code className="min-w-0 flex-1 truncate border border-white/10 px-2 py-1 text-xs text-mist-soft">
                  {shortPath(row.page)}
                </code>
                <span className="text-sm font-semibold text-white">{row.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-1 text-sm font-semibold text-white">Einstiegsseiten</h3>
        <p className="mb-4 text-xs text-mist">Landing Pages mit Engagement- und Lead-Rate.</p>
        {entryPages.length === 0 ? (
          <p className="py-8 text-center text-sm text-mist">Noch keine Einstiegsdaten.</p>
        ) : (
          <div className="space-y-3">
            {entryPages.map((entry, idx) => (
              <div key={entry.page} className="border border-white/5 bg-abyss-deep p-3">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-signal/15 text-xs font-bold text-signal">
                    {idx + 1}
                  </span>
                  <code className="min-w-0 flex-1 truncate border border-white/10 px-2 py-1 text-xs text-mist-soft">
                    {shortPath(entry.page)}
                  </code>
                  <span className="text-sm font-semibold text-white">{entry.sessions} Sessions</span>
                </div>
                <div className="ml-9 flex flex-wrap gap-2 text-xs">
                  <span className="border border-white/10 px-2 py-1 text-mist">
                    Engaged {entry.engagedPct}%
                  </span>
                  <span className="border border-signal/40 bg-signal/10 px-2 py-1 text-signal">
                    Leads {entry.leads} ({entry.leadPct}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
