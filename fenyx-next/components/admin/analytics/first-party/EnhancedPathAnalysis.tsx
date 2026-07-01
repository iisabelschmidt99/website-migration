"use client";

import { useMemo, useState } from "react";
import { collapseConsecutivePaths } from "@/lib/analytics/dashboardMetrics";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";

type FilterType = "all" | "converted" | "abandoned";

type PathMetrics = {
  pattern: string;
  paths: string[];
  count: number;
  percentage: number;
  avgScrollDepth: number;
  avgTimeSeconds: number;
  conversionRate: number;
  clicksPerSession: number;
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function shortPath(path: string): string {
  if (path.length <= 40) return path;
  return `…${path.slice(-38)}`;
}

export default function EnhancedPathAnalysis({
  sessions,
  completedSessionHashes,
}: {
  sessions: CanonicalWebsiteSession[];
  completedSessionHashes?: Set<string>;
}) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showAll, setShowAll] = useState(false);
  const displayCount = showAll ? 15 : 6;

  const pathMetrics = useMemo(() => {
    const patterns = new Map<
      string,
      {
        paths: string[];
        sessions: CanonicalWebsiteSession[];
        totalScrollDepth: number;
        scrollDepthCount: number;
        totalTimeMs: number;
        timeCount: number;
        conversions: number;
        totalClicks: number;
      }
    >();

    for (const session of sessions) {
      if (!session.page_history?.length) continue;

      const isConverted = completedSessionHashes
        ? completedSessionHashes.has(session.session_hash)
        : session.reached_lead;

      if (filter === "converted" && !isConverted) continue;
      if (filter === "abandoned" && isConverted) continue;

      const simplifiedPaths = collapseConsecutivePaths(
        session.page_history.slice(0, 5).map((page) => page.path),
      );
      if (simplifiedPaths.length < 2) continue;

      const patternKey = simplifiedPaths.join(" → ");

      if (!patterns.has(patternKey)) {
        patterns.set(patternKey, {
          paths: simplifiedPaths,
          sessions: [],
          totalScrollDepth: 0,
          scrollDepthCount: 0,
          totalTimeMs: 0,
          timeCount: 0,
          conversions: 0,
          totalClicks: 0,
        });
      }

      const data = patterns.get(patternKey)!;
      data.sessions.push(session);

      for (const page of session.page_history) {
        if (page.scroll_depth && page.scroll_depth > 0) {
          data.totalScrollDepth += page.scroll_depth;
          data.scrollDepthCount += 1;
        }
        if (page.clicks?.length) data.totalClicks += page.clicks.length;
      }

      const history = session.page_history;
      if (history.length >= 2) {
        const firstTime = new Date(history[0].timestamp).getTime();
        const lastTime = new Date(history[history.length - 1].timestamp).getTime();
        const durationMs = lastTime - firstTime;
        if (durationMs > 0 && durationMs < 30 * 60 * 1000) {
          data.totalTimeMs += durationMs;
          data.timeCount += 1;
        }
      }

      if (isConverted) data.conversions += 1;
    }

    const totalFiltered = [...patterns.values()].reduce((sum, entry) => sum + entry.sessions.length, 0);

    return [...patterns.entries()]
      .map(([pattern, data]): PathMetrics => ({
        pattern,
        paths: data.paths,
        count: data.sessions.length,
        percentage: totalFiltered > 0 ? Math.round((data.sessions.length / totalFiltered) * 100) : 0,
        avgScrollDepth:
          data.scrollDepthCount > 0 ? Math.round(data.totalScrollDepth / data.scrollDepthCount) : 0,
        avgTimeSeconds: data.timeCount > 0 ? Math.round(data.totalTimeMs / data.timeCount / 1000) : 0,
        conversionRate:
          data.sessions.length > 0 ? Math.round((data.conversions / data.sessions.length) * 100) : 0,
        clicksPerSession:
          data.sessions.length > 0 ? Math.round((data.totalClicks / data.sessions.length) * 10) / 10 : 0,
      }))
      .filter((metric) => metric.count >= 1)
      .sort((a, b) => b.count - a.count);
  }, [sessions, filter, completedSessionHashes]);

  if (sessions.length === 0) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-mist">
        Keine Pfad-Daten für diesen Zeitraum.
      </div>
    );
  }

  const displayedPaths = pathMetrics.slice(0, displayCount);
  const hasMore = pathMetrics.length > displayCount;

  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Pfad-Analyse</h3>
          <p className="text-xs text-mist">Häufigste Seitenfolgen (max. 5 Schritte pro Session)</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="border border-white/10 bg-abyss-deep px-3 py-2 text-xs text-white"
        >
          <option value="all">Alle Pfade</option>
          <option value="converted">Mit Lead</option>
          <option value="abandoned">Ohne Lead</option>
        </select>
      </div>

      <div className="space-y-3">
        {displayedPaths.map((path, idx) => (
          <div key={path.pattern} className="border border-white/10 bg-abyss-deep p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center bg-signal/15 text-xs font-bold text-signal">
                {idx + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {path.paths.map((segment, segmentIdx) => (
                  <span key={`${path.pattern}-${segmentIdx}`} className="flex items-center gap-1.5">
                    <code className="max-w-[180px] truncate border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-mist-soft">
                      {shortPath(segment)}
                    </code>
                    {segmentIdx < path.paths.length - 1 ? (
                      <span className="text-xs text-signal">→</span>
                    ) : null}
                  </span>
                ))}
              </div>
              <div className="text-right text-xs text-mist">
                <span className="font-semibold text-white">{path.count}</span> ({path.percentage}%)
              </div>
            </div>
            <div className="mb-2 h-1.5 bg-abyss">
              <div className="h-full bg-signal" style={{ width: `${path.percentage}%` }} />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-mist">
              {path.avgScrollDepth > 0 ? <span>Ø Scroll {path.avgScrollDepth}%</span> : null}
              {path.avgTimeSeconds > 0 ? <span>Ø {formatTime(path.avgTimeSeconds)}</span> : null}
              <span className={path.conversionRate >= 10 ? "text-signal" : "text-mist"}>
                Lead-Rate {path.conversionRate}%
              </span>
              {path.clicksPerSession > 0 ? <span>Ø {path.clicksPerSession} Klicks</span> : null}
            </div>
          </div>
        ))}
      </div>

      {pathMetrics.length === 0 ? (
        <p className="py-8 text-center text-sm text-mist">
          {filter !== "all"
            ? `Keine ${filter === "converted" ? "Lead-" : "Abbruch-"}Pfade im Filter.`
            : "Keine Pfad-Daten verfügbar."}
        </p>
      ) : null}

      {hasMore ? (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-4 w-full border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:text-white"
        >
          {showAll ? "Weniger anzeigen" : `${pathMetrics.length - displayCount} weitere anzeigen`}
        </button>
      ) : null}
    </div>
  );
}
