"use client";

import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import type { PageHistoryEntry } from "@/lib/analytics/dashboardTypes";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function sessionDuration(session: CanonicalWebsiteSession): number {
  if (session.duration_seconds > 0) return session.duration_seconds;
  const span = new Date(session.last_activity_at).getTime() - new Date(session.landing_time).getTime();
  return span > 0 ? Math.round(span / 1000) : 0;
}

function maxScrollDepth(history: PageHistoryEntry[]): number {
  return history.reduce((max, page) => Math.max(max, page.scroll_depth ?? 0), 0);
}

function avgTimePerPage(history: PageHistoryEntry[]): number {
  if (!history.length) return 0;
  const total = history.reduce((sum, page) => sum + (page.time_on_page ?? 0), 0);
  return Math.round(total / history.length);
}

function totalClicks(history: PageHistoryEntry[]): number {
  return history.reduce((sum, page) => sum + (page.clicks?.length ?? 0), 0);
}

function scrollDepthTone(depth: number): string {
  if (depth >= 75) return "border-signal/50 bg-signal/10 text-signal";
  if (depth >= 50) return "border-signal-fade/50 bg-signal-fade/10 text-signal-fade";
  if (depth >= 25) return "border-mist/40 bg-white/[0.04] text-mist-soft";
  return "border-white/10 bg-white/[0.02] text-mist";
}

function pagePathLabel(path: string): string {
  return path.split("?")[0] || path;
}

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "signal" | "warning" | "muted";
};

function Badge({ children, tone = "default" }: BadgeProps) {
  const tones = {
    default: "border-white/20 text-mist-soft",
    signal: "border-signal/40 bg-signal/10 text-signal",
    warning: "border-system-warning-dark/60 bg-system-warning-dark/20 text-system-warning",
    muted: "border-white/10 text-mist",
  };
  return (
    <span className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

type Props = {
  session: CanonicalWebsiteSession;
};

export default function WebsiteSessionDetailPanel({ session }: Props) {
  const history = session.page_history;
  const duration = sessionDuration(session);
  const hasUtm = session.utm_source || session.utm_medium || session.utm_campaign;

  return (
    <div className="space-y-4 border border-white/10 bg-abyss-deep/60 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mist">Traffic-Quelle</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="signal">{session.traffic_source_label}</Badge>
            {session.referrer_host ? (
              <span className="text-xs text-mist">ref {session.referrer_host}</span>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mist">Einstieg</p>
          {history.length > 0 ? (
            <div className="space-y-1">
              <code className="block truncate border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-mist-soft" title={history[0].path}>
                {pagePathLabel(history[0].path)}
              </code>
              <span className="text-xs text-mist">
                {history.length} Seite{history.length !== 1 ? "n" : ""} besucht
              </span>
            </div>
          ) : (
            <code className="block truncate border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-mist-soft" title={session.landing_page}>
              {pagePathLabel(session.landing_page)}
            </code>
          )}
        </div>
      </div>

      {hasUtm ? (
        <div className="border-t border-white/10 pt-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-mist">UTM-Parameter</p>
          <div className="flex flex-wrap gap-1.5">
            {session.utm_source ? (
              <code className="border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-mist-soft">
                src: {session.utm_source}
              </code>
            ) : null}
            {session.utm_medium ? (
              <code className="border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-mist-soft">
                med: {session.utm_medium}
              </code>
            ) : null}
            {session.utm_campaign ? (
              <code className="border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-mist-soft">
                cmp: {session.utm_campaign}
              </code>
            ) : null}
            <code className="border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-mist-soft">
              cat: {session.traffic_source_category}
            </code>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10 pt-3">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-mist">Seitenverlauf</p>

        {history.length > 0 ? (
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max items-start gap-0">
              {history.map((page, index) => (
                <div key={`${page.path}-${page.timestamp}-${index}`} className="flex items-start">
                  <div className="flex w-[190px] flex-col items-center px-1">
                    <div className="flex w-full items-center">
                      {index > 0 ? <div className="h-px flex-1 bg-white/20" /> : <div className="flex-1" />}
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border-2 text-[9px] font-bold ${
                          index === 0
                            ? "border-signal bg-signal text-black"
                            : "border-white/30 bg-abyss-deep text-mist-soft"
                        }`}
                        title={`Schritt ${index + 1}`}
                      >
                        {index + 1}
                      </div>
                      {index < history.length - 1 ? <div className="h-px flex-1 bg-white/20" /> : <div className="flex-1" />}
                    </div>

                    <div className="mt-3 w-full space-y-2 border border-white/10 bg-white/[0.02] p-3">
                      <div className="space-y-1">
                        <code className="block truncate text-[11px] font-medium text-white" title={page.path}>
                          {pagePathLabel(page.path)}
                        </code>
                        <span className="text-[10px] text-mist">
                          {format(new Date(page.timestamp), "HH:mm:ss", { locale: de })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {page.time_on_page != null && page.time_on_page > 0 ? (
                          <Badge tone="muted">⏱ {formatDuration(page.time_on_page)}</Badge>
                        ) : null}
                        <span
                          className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${scrollDepthTone(page.scroll_depth ?? 0)}`}
                        >
                          ↓ {page.scroll_depth ?? 0}%
                        </span>
                      </div>

                      {page.clicks && page.clicks.length > 0 ? (
                        <div className="border-t border-white/10 pt-2">
                          <p className="mb-1 text-[10px] text-mist">
                            {page.clicks.length} Klick{page.clicks.length !== 1 ? "s" : ""}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {page.clicks.slice(0, 3).map((click) => (
                              <span
                                key={click}
                                className="border border-signal-soft/50 bg-signal-soft/10 px-1 py-0.5 text-[9px] text-signal-fade"
                                title={click}
                              >
                                {click}
                              </span>
                            ))}
                            {page.clicks.length > 3 ? (
                              <span className="border border-white/10 px-1 py-0.5 text-[9px] text-mist">
                                +{page.clicks.length - 3}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {index < history.length - 1 ? (
                    <span className="mt-5 shrink-0 px-1 text-mist" aria-hidden>
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-mist">Kein Seitenverlauf vorhanden.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 border-t border-white/10 pt-3 text-xs">
        <div>
          <span className="text-mist">Gesamtdauer: </span>
          <span className="font-medium text-white">{formatDuration(duration)}</span>
        </div>
        <div>
          <span className="text-mist">Ø Zeit/Seite: </span>
          <span className="font-medium text-white">{formatDuration(avgTimePerPage(history))}</span>
        </div>
        <div>
          <span className="text-mist">Max. Scroll: </span>
          <span className="font-medium text-white">{maxScrollDepth(history)}%</span>
        </div>
        <div>
          <span className="text-mist">Klicks: </span>
          <span className="font-medium text-white">{totalClicks(history) || session.cta_clicks}</span>
        </div>
        {session.country_code ? (
          <div>
            <span className="text-mist">Land: </span>
            <span className="font-medium text-white">
              {countryFlag(session.country_code)} {session.country_code}
            </span>
          </div>
        ) : null}
      </div>

      {session.is_bot ? (
        <div className="border-t border-white/10 pt-3">
          <Badge tone="warning">Bot: {session.bot_classification}</Badge>
        </div>
      ) : null}
    </div>
  );
}
