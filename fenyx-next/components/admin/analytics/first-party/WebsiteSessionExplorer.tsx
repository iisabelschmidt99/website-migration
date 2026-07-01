"use client";

import { useMemo, useState } from "react";
import type { CanonicalWebsiteSession } from "@/lib/analytics/websiteCanonicalAnalytics";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import WebsiteSessionDetailPanel, { countryFlag, formatDuration } from "./WebsiteSessionDetailPanel";

const PAGE_SIZE = 20;

type Props = {
  sessions: CanonicalWebsiteSession[];
};

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "signal" | "warning" | "lead" | "engaged" | "cta";
};

function Badge({ children, tone = "default" }: BadgeProps) {
  const tones = {
    default: "border-white/20 text-mist-soft",
    signal: "border-signal/40 bg-signal/10 text-signal",
    warning: "border-system-warning-dark/60 bg-system-warning-dark/20 text-system-warning",
    lead: "border-signal/50 bg-signal/15 text-signal",
    engaged: "border-mist-soft/30 bg-white/[0.04] text-mist-soft",
    cta: "border-signal-fade/50 bg-signal-soft/20 text-signal-fade",
  };
  return (
    <span className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

function hasLead(session: CanonicalWebsiteSession): boolean {
  return session.reached_lead || session.leads > 0;
}

function isEngaged(session: CanonicalWebsiteSession): boolean {
  return session.status !== "bounced";
}

function hasCta(session: CanonicalWebsiteSession): boolean {
  return session.cta_clicks > 0;
}

function sessionDuration(session: CanonicalWebsiteSession): number {
  if (session.duration_seconds > 0) return session.duration_seconds;
  const span = new Date(session.last_activity_at).getTime() - new Date(session.landing_time).getTime();
  return span > 0 ? Math.round(span / 1000) : 0;
}

function pagePathLabel(path: string): string {
  return path.split("?")[0] || path;
}

function botLabel(session: CanonicalWebsiteSession): string {
  if (session.bot_classification === "verified_bot") return "Bot";
  if (session.bot_classification === "suspected_bot") return "Verdächtig";
  return session.bot_classification;
}

function matchesSourceFilter(category: string, filter: string): boolean {
  if (filter === "direct") return category === "direct";
  if (filter === "organic") return category.startsWith("organic_");
  if (filter === "paid") return category.startsWith("paid_");
  if (filter === "social") return category.includes("social");
  if (filter === "email") return category === "email";
  if (filter === "referral") return category.includes("referral");
  return true;
}

const selectClass =
  "border border-white/10 bg-abyss-deep px-2 py-1.5 text-xs text-white focus:border-signal/50 focus:outline-none";

export default function WebsiteSessionExplorer({ sessions }: Props) {
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [excludeBots, setExcludeBots] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => new Date(b.landing_time).getTime() - new Date(a.landing_time).getTime(),
      ),
    [sessions],
  );

  const filteredSessions = useMemo(() => {
    const query = pageFilter.trim().toLowerCase();

    return sortedSessions.filter((session) => {
      if (deviceFilter !== "all" && (session.device_type ?? "unknown") !== deviceFilter) return false;

      if (sourceFilter !== "all") {
        const category = session.traffic_source_category || "unknown";
        if (!matchesSourceFilter(category, sourceFilter)) return false;
      }

      if (query) {
        const paths = session.page_history.length
          ? session.page_history.map((p) => p.path.toLowerCase())
          : [session.landing_page.toLowerCase()];
        if (!paths.some((path) => path.includes(query))) return false;
      }

      if (leadFilter === "yes" && !hasLead(session)) return false;
      if (leadFilter === "no" && hasLead(session)) return false;

      if (excludeBots && session.is_bot) return false;

      return true;
    });
  }, [sortedSessions, deviceFilter, sourceFilter, pageFilter, leadFilter, excludeBots]);

  const visibleSessions = filteredSessions.slice(0, visibleCount);
  const hasMore = filteredSessions.length > visibleCount;

  const hasActiveFilters =
    deviceFilter !== "all" ||
    sourceFilter !== "all" ||
    pageFilter.trim() !== "" ||
    leadFilter !== "all" ||
    excludeBots;

  const clearFilters = () => {
    setDeviceFilter("all");
    setSourceFilter("all");
    setPageFilter("");
    setLeadFilter("all");
    setExcludeBots(false);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Session Explorer</h3>
            <p className="mt-1 text-xs text-mist">
              {filteredSessions.length.toLocaleString("de-DE")} Sessions
              {filteredSessions.length !== sessions.length
                ? ` (gefiltert von ${sessions.length.toLocaleString("de-DE")})`
                : ""}
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="border border-white/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-mist hover:border-signal/40 hover:text-signal"
            >
              Filter zurücksetzen
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={deviceFilter}
            onChange={(e) => {
              setDeviceFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={selectClass}
            aria-label="Gerät filtern"
          >
            <option value="all">Alle Geräte</option>
            <option value="mobile">Mobil</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Desktop</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={selectClass}
            aria-label="Traffic-Quelle filtern"
          >
            <option value="all">Alle Quellen</option>
            <option value="direct">Direkt</option>
            <option value="organic">Organic</option>
            <option value="paid">Paid</option>
            <option value="social">Social</option>
            <option value="email">E-Mail</option>
            <option value="referral">Referral</option>
          </select>

          <input
            type="search"
            value={pageFilter}
            onChange={(e) => {
              setPageFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Seite suchen…"
            className="min-w-[140px] border border-white/10 bg-abyss-deep px-2 py-1.5 text-xs text-white placeholder:text-mist focus:border-signal/50 focus:outline-none"
          />

          <select
            value={leadFilter}
            onChange={(e) => {
              setLeadFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={selectClass}
            aria-label="Lead filtern"
          >
            <option value="all">Alle Leads</option>
            <option value="yes">Mit Lead</option>
            <option value="no">Ohne Lead</option>
          </select>

          <label className="flex cursor-pointer select-none items-center gap-2 px-1 text-xs text-mist-soft">
            <input
              type="checkbox"
              checked={excludeBots}
              onChange={(e) => {
                setExcludeBots(e.target.checked);
                setVisibleCount(PAGE_SIZE);
              }}
              className="h-3.5 w-3.5 accent-signal"
            />
            Bots ausblenden
          </label>
        </div>
      </div>

      <div className="p-5">
        {filteredSessions.length > 0 ? (
          <div className="space-y-2">
            <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
              {visibleSessions.map((session) => {
                const isExpanded = expandedSession === session.session_hash;
                const entryPath =
                  session.page_history[0]?.path ?? session.landing_page;

                return (
                  <div key={session.session_hash} className="border border-white/10 bg-white/[0.02]">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSession(isExpanded ? null : session.session_hash)
                      }
                      className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="mt-0.5 w-4 shrink-0 text-mist" aria-hidden>
                        {isExpanded ? "▾" : "▸"}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-medium text-white">
                            {format(new Date(session.landing_time), "dd.MM.yyyy HH:mm", { locale: de })}
                          </span>

                          {session.country_code ? (
                            <Badge tone="default">
                              {countryFlag(session.country_code)} {session.country_code}
                            </Badge>
                          ) : null}

                          {session.is_bot ? (
                            <Badge tone="warning">🤖 {botLabel(session)}</Badge>
                          ) : (
                            <Badge tone="default">Besucher</Badge>
                          )}

                          <Badge tone="signal">{session.traffic_source_label}</Badge>

                          {session.utm_source ? (
                            <Badge tone="default">src: {session.utm_source}</Badge>
                          ) : null}
                          {session.utm_medium ? (
                            <Badge tone="default">med: {session.utm_medium}</Badge>
                          ) : null}
                          {session.utm_campaign ? (
                            <Badge tone="default">cmp: {session.utm_campaign}</Badge>
                          ) : null}

                          {hasLead(session) ? <Badge tone="lead">Lead</Badge> : null}
                          {isEngaged(session) ? <Badge tone="engaged">Engaged</Badge> : null}
                          {hasCta(session) ? <Badge tone="cta">CTA</Badge> : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-mist">
                          <span>{session.page_views} Seiten</span>
                          <span>{formatDuration(sessionDuration(session))}</span>
                          {session.referrer_host ? (
                            <span className="truncate">ref {session.referrer_host}</span>
                          ) : null}
                          <code className="border border-white/10 bg-abyss-deep px-1 text-[10px] text-mist-soft">
                            {pagePathLabel(entryPath)}
                          </code>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-mist">
                        {session.device_type ?? "—"}
                      </span>
                    </button>

                    {isExpanded ? (
                      <div className="border-t border-white/10 px-3 pb-3 pt-2">
                        <WebsiteSessionDetailPanel session={session} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {hasMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="w-full border border-white/10 py-2 text-xs font-bold uppercase tracking-wide text-mist hover:border-signal/40 hover:text-signal"
              >
                Weitere {Math.min(PAGE_SIZE, filteredSessions.length - visibleCount).toLocaleString("de-DE")} laden
                <span className="ml-2 font-normal normal-case tracking-normal text-mist-ash">
                  ({visibleCount.toLocaleString("de-DE")} von {filteredSessions.length.toLocaleString("de-DE")})
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-mist">Keine Sessions gefunden</p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 text-xs font-bold uppercase tracking-wide text-signal hover:underline"
              >
                Filter zurücksetzen
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
