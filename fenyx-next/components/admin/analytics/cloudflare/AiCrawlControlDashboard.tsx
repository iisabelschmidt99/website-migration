"use client";

/**
 * AI Crawl Control Dashboard — Cloudflare AI-Crawler-Analytics im Fenyx-Admin-Design.
 * Daten via /api/cloudflare-analytics (Session-Cookies, credentials: include).
 */

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  Info,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldOff,
  Target,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import DateRangeSelector, {
  type DateRange,
  getDefaultDateRange,
} from "@/components/admin/analytics/DateRangeSelector";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import MetricRow from "@/components/admin/analytics/ui/MetricRow";
import MiniSparkline from "@/components/admin/analytics/ui/MiniSparkline";
import TabNav from "@/components/admin/analytics/ui/TabNav";
import { CHART_COLORS, GRID, MIST, SIGNAL } from "@/components/admin/analytics/ui/chartTheme";
import { formatBytes } from "@/lib/cloudflare/analytics";

const API_BASE = "/api/cloudflare-analytics";
const CRAWLER_ACTION_BASE = "/api/cloudflare-crawler-action";

const HOST_OPTIONS = [
  { value: "", label: "Alle Hosts" },
  { value: "fenyx-office.com", label: "fenyx-office.com" },
  { value: "www.fenyx-office.com", label: "www.fenyx-office.com" },
  { value: "fenyx-office.netlify.app", label: "Staging (Netlify)" },
];

const OPERATOR_OPTIONS = [
  { value: "", label: "Alle Operatoren" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "Anthropic", label: "Anthropic" },
  { value: "Perplexity", label: "Perplexity" },
  { value: "Google", label: "Google" },
  { value: "Microsoft", label: "Microsoft" },
  { value: "ByteDance", label: "ByteDance" },
  { value: "Common Crawl", label: "Common Crawl" },
  { value: "Meta", label: "Meta" },
];

interface OverviewData {
  totalRequests: number;
  allowedRequests: number;
  unsuccessfulRequests: number;
  topPath: string | null;
  topPathCount: number;
  topCrawler: string | null;
  topCrawlerCount: number;
  crawlersByOperator: Array<{
    operator: string;
    bots: Array<{ name: string; allowed: number }>;
  }>;
}

interface MetricsTimeseriesData {
  series: Array<Record<string, string | number>>;
  seriesBytes?: Array<Record<string, string | number>>;
}

interface MetricsStatusData {
  byStatus: Record<string, number>;
  overTime: Array<Record<string, string | number>>;
}

interface PathItem {
  path: string;
  host: string;
  allowedRequests: number;
}

interface CrawlerItem {
  userAgent: string;
  operator: string;
  category: string;
  bytes: number;
  allowed: number;
  unsuccessful: number;
}

interface RobotsAvailabilityItem {
  hostname: string;
  path: string;
  successful: number;
  unsuccessful: number;
  status: number;
  contentSignals: string;
}

interface ViolationItem {
  path: string;
  host: string;
  crawler: string;
  operator: string;
  count: number;
  status: number;
}

type ActiveTab = "overview" | "metrics" | "crawlers" | "robots";

const TAB_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "metrics", label: "Metriken" },
  { id: "crawlers", label: "Crawler" },
  { id: "robots", label: "robots.txt" },
];

const TAB_HEADINGS: Record<ActiveTab, string> = {
  overview: "Übersicht",
  metrics: "Metriken",
  crawlers: "Crawler",
  robots: "robots.txt",
};

function formatHour(v: string): string {
  try {
    const d = new Date(v);
    return d.toLocaleDateString("de-DE", { month: "short", day: "numeric", hour: "2-digit" });
  } catch {
    return v;
  }
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TablePagination({
  page,
  perPage,
  total,
  onChange,
}: {
  page: number;
  perPage: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-mist">
      <span>
        {from}–{to} von {total}
      </span>
      <div className="flex items-center gap-1">
        <span className="mr-2">
          Seite {page} von {totalPages}
        </span>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="p-1 hover:text-signal disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="p-1 hover:text-signal disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function BotBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-mist-soft">
      {name}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center border border-white/10 bg-abyss-deep px-2 py-0.5 text-xs text-mist-soft">
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: number }) {
  const ok = status >= 200 && status < 400;
  const label =
    status === 200 ? "200 OK" : status === 525 ? "525 SSL Handshake Failed" : `${status}`;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium",
        ok ? "bg-system-success/20 text-system-success" : "bg-white/10 text-mist-soft",
      )}
    >
      {label}
    </span>
  );
}

function FenyxTable({
  head,
  children,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-mist">
            {head}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 font-semibold", className)}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-white/5 px-4 py-3 text-mist-soft", className)}>{children}</td>;
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-white/[0.02]">{children}</tr>;
}

export default function AiCrawlControlDashboard({ configured }: { configured: boolean }) {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostFilter, setHostFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [metricsTimeseries, setMetricsTimeseries] = useState<MetricsTimeseriesData | null>(null);
  const [metricsStatus, setMetricsStatus] = useState<MetricsStatusData | null>(null);
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [crawlers, setCrawlers] = useState<CrawlerItem[]>([]);
  const [robotsAvailability, setRobotsAvailability] = useState<RobotsAvailabilityItem[]>([]);
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [blockedCrawlers, setBlockedCrawlers] = useState<Set<string>>(new Set());
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [crawlerActionEnabled, setCrawlerActionEnabled] = useState(false);

  const [showInactive, setShowInactive] = useState(true);
  const [pathsPage, setPathsPage] = useState(1);
  const [robotsPage, setRobotsPage] = useState(1);
  const [pathsView, setPathsView] = useState<"paths" | "patterns">("paths");
  const [metricsMetric, setMetricsMetric] = useState<"requests" | "bytes">("requests");
  const [metricsGroupBy, setMetricsGroupBy] = useState<"Crawler" | "Category" | "Operator" | "Host">(
    "Crawler",
  );
  const [legendExpanded, setLegendExpanded] = useState(false);

  const PATHS_PER_PAGE = 10;
  const ROBOTS_PER_PAGE = 5;

  const toPathPattern = (path: string): string => {
    if (!path || path === "/") return path;
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "/";
    const last = parts[parts.length - 1];
    if (/^[a-f0-9]{16,}\.(js|css)$/i.test(last) || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(last)) {
      return `/${parts.slice(0, -1).join("/")}/*`;
    }
    return path;
  };

  const fetchQuery = useCallback(
    async (action: string) => {
      const params = new URLSearchParams({
        action,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      });
      if (hostFilter) params.set("host", hostFilter);
      if (operatorFilter) params.set("operator", operatorFilter);
      const res = await fetch(`${API_BASE}?${params}`, { credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.hint ? `${err.error}: ${err.hint}` : err.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    [dateRange, hostFilter, operatorFilter],
  );

  const probeCrawlerAction = useCallback(async () => {
    try {
      const res = await fetch(CRAWLER_ACTION_BASE, { credentials: "include" });
      setCrawlerActionEnabled(res.status !== 404 && res.status !== 503);
      if (res.ok) {
        const { blocked } = await res.json();
        setBlockedCrawlers(new Set(blocked ?? []));
      }
    } catch {
      setCrawlerActionEnabled(false);
    }
  }, []);

  const fetchBlocked = useCallback(async () => {
    if (!crawlerActionEnabled) return;
    const res = await fetch(CRAWLER_ACTION_BASE, { credentials: "include" });
    if (res.ok) {
      const { blocked } = await res.json();
      setBlockedCrawlers(new Set(blocked ?? []));
    }
  }, [crawlerActionEnabled]);

  const setCrawlerAction = useCallback(
    async (crawler: string, action: "allow" | "block") => {
      if (!crawlerActionEnabled) return;
      setActionPending(crawler);
      try {
        const res = await fetch(CRAWLER_ACTION_BASE, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crawler, action }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        setBlockedCrawlers((prev) => {
          const next = new Set(prev);
          if (action === "block") next.add(crawler);
          else next.delete(crawler);
          return next;
        });
      } finally {
        setActionPending(null);
      }
    },
    [crawlerActionEnabled],
  );

  const fetchAll = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const [ov, ts, st, pt, cr, rb, v] = await Promise.all([
        fetchQuery("overview"),
        fetchQuery("metrics-timeseries"),
        fetchQuery("metrics-status"),
        fetchQuery("paths"),
        fetchQuery("crawlers"),
        fetchQuery("robots-availability"),
        fetchQuery("violations").catch(() => ({ items: [] })),
      ]);
      setOverview(ov);
      setMetricsTimeseries(ts);
      setMetricsStatus(st);
      setPaths(pt.items || []);
      setCrawlers(cr.items || []);
      setRobotsAvailability(rb.items || []);
      setViolations(v?.items || []);
      await fetchBlocked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [configured, fetchQuery, fetchBlocked]);

  useEffect(() => {
    probeCrawlerAction();
  }, [probeCrawlerAction]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setPathsPage(1);
    setRobotsPage(1);
  }, [dateRange, hostFilter, operatorFilter]);

  useEffect(() => {
    setPathsPage(1);
  }, [pathsView]);

  const aggregateSparkline = (metricsTimeseries?.series ?? []).map((row) => ({
    v: Object.entries(row)
      .filter(([k]) => k !== "datetimeHour")
      .reduce((s, [, val]) => s + (Number(val) || 0), 0),
  }));

  const visibleCrawlers = showInactive
    ? crawlers
    : crawlers.filter((c) => c.allowed > 0 || c.unsuccessful > 0);

  const pathsOrPatterns =
    pathsView === "patterns"
      ? (() => {
          const byPattern = new Map<string, { path: string; host: string; allowedRequests: number }>();
          for (const p of paths) {
            const pattern = toPathPattern(p.path);
            const key = `${pattern}\0${p.host}`;
            const existing = byPattern.get(key);
            if (existing) existing.allowedRequests += p.allowedRequests;
            else byPattern.set(key, { path: pattern, host: p.host, allowedRequests: p.allowedRequests });
          }
          return [...byPattern.values()].sort((a, b) => b.allowedRequests - a.allowedRequests);
        })()
      : paths;

  const pagedPaths = pathsOrPatterns.slice((pathsPage - 1) * PATHS_PER_PAGE, pathsPage * PATHS_PER_PAGE);
  const pagedRobots = robotsAvailability.slice(
    (robotsPage - 1) * ROBOTS_PER_PAGE,
    robotsPage * ROBOTS_PER_PAGE,
  );

  const rawSeries = metricsTimeseries?.series ?? [];
  const rawSeriesBytes = metricsTimeseries?.seriesBytes ?? [];
  const crawlerToCategory: Record<string, string> = {
    GPTBot: "AI Crawler",
    ClaudeBot: "AI Crawler",
    PerplexityBot: "AI Search",
    Bytespider: "AI Crawler",
    CCBot: "AI Crawler",
    Googlebot: "Search Engine",
    BingBot: "Search Engine",
    Amazonbot: "AI Crawler",
    Applebot: "AI Search",
    PetalBot: "AI Crawler",
    "Meta-ExternalAgent": "AI Crawler",
  };
  const crawlerToOperator: Record<string, string> = {
    GPTBot: "OpenAI",
    ClaudeBot: "Anthropic",
    PerplexityBot: "Perplexity",
    Bytespider: "ByteDance",
    CCBot: "Common Crawl",
    Googlebot: "Google",
    BingBot: "Microsoft",
    Amazonbot: "Amazon",
    Applebot: "Apple",
    PetalBot: "Huawei",
    "Meta-ExternalAgent": "Meta",
  };

  const useBytes = metricsMetric === "bytes";
  const series = useBytes ? rawSeriesBytes : rawSeries;

  const groupByKey = (key: string) =>
    metricsGroupBy === "Category"
      ? (crawlerToCategory[key] ?? "Other")
      : metricsGroupBy === "Operator"
        ? (crawlerToOperator[key] ?? "Other")
        : metricsGroupBy === "Host"
          ? key
          : key;

  const groupedSeries =
    metricsGroupBy === "Crawler"
      ? series
      : (() => {
          const out: Array<Record<string, string | number>> = [];
          const hourToIdx = new Map<string, number>();
          for (const row of series) {
            const datetimeHour = String(row.datetimeHour ?? "");
            if (!hourToIdx.has(datetimeHour)) {
              hourToIdx.set(datetimeHour, out.length);
              out.push({ datetimeHour });
            }
            const idx = hourToIdx.get(datetimeHour)!;
            for (const k of Object.keys(row)) {
              if (k === "datetimeHour") continue;
              const group = groupByKey(k);
              const val = Number(row[k]) || 0;
              (out[idx] as Record<string, number>)[group] =
                ((out[idx] as Record<string, number>)[group] || 0) + val;
            }
          }
          return out;
        })();

  const groupedCrawlerKeys = new Set<string>();
  for (const row of groupedSeries) {
    for (const k of Object.keys(row)) {
      if (k !== "datetimeHour") groupedCrawlerKeys.add(k);
    }
  }
  const crawlerTotals = [...groupedCrawlerKeys]
    .map((key) => ({
      key,
      total: groupedSeries.reduce((s, r) => s + (Number(r[key]) || 0), 0),
    }))
    .sort((a, b) => b.total - a.total);
  const crawlerKeys = crawlerTotals.map(({ key }) => key);

  const crawlerColorByKey: Record<string, string> = {};
  crawlerTotals.forEach(({ key }, i) => {
    crawlerColorByKey[key] = CHART_COLORS[i % CHART_COLORS.length];
  });

  const statusColors: Record<string, string> = {
    "4xx": "#3b82f6",
    "3xx": "#f59e0b",
    "2xx": SIGNAL,
    "5xx": "#ef4444",
  };
  const byStatus = metricsStatus?.byStatus ?? {};
  const overTime = metricsStatus?.overTime ?? [];

  const selectClass =
    "border border-white/10 bg-abyss-deep px-3 py-2 text-sm text-mist focus:border-signal focus:outline-none";

  const FilterBar = () => (
    <div className="flex flex-wrap items-center gap-2">
      <select value={hostFilter} onChange={(e) => setHostFilter(e.target.value)} className={selectClass}>
        {HOST_OPTIONS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={operatorFilter}
        onChange={(e) => setOperatorFilter(e.target.value)}
        className={selectClass}
      >
        {OPERATOR_OPTIONS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
        <button
          type="button"
          onClick={fetchAll}
          disabled={loading}
          className="border border-white/10 p-2 text-mist hover:border-signal hover:text-signal disabled:opacity-50"
          title="Aktualisieren"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>
    </div>
  );

  const MetricsSummaryRow = ({ onNav }: { onNav?: () => void }) => (
    <div
      className={cn("border border-white/10 bg-white/[0.02]", onNav && "cursor-pointer hover:bg-white/[0.04]")}
      onClick={onNav}
      onKeyDown={onNav ? (e) => e.key === "Enter" && onNav() : undefined}
      role={onNav ? "button" : undefined}
      tabIndex={onNav ? 0 : undefined}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-sm font-semibold text-white">Metriken</span>
        {onNav ? <ArrowRight className="h-4 w-4 text-mist" /> : null}
      </div>
      <MetricRow
        items={[
          {
            label: "Requests gesamt",
            value: overview?.totalRequests ?? 0,
            sparkline: aggregateSparkline,
          },
          {
            label: "Erfolgreiche Requests",
            value: overview?.allowedRequests ?? 0,
            sparkline: aggregateSparkline,
          },
          {
            label: "Fehlgeschlagene Requests",
            value: overview?.unsuccessfulRequests ?? 0,
            sparkline: aggregateSparkline,
          },
        ]}
      />
    </div>
  );

  if (!configured) {
    return (
      <div className="border border-white/10 bg-abyss-deep p-6">
        <h1 className="text-xl font-heading text-white">AI Crawl Control</h1>
        <p className="mt-2 text-sm text-mist">
          Cloudflare API Token und Zone-ID erforderlich (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID).
        </p>
      </div>
    );
  }

  if (loading && !overview) {
    return (
      <div className="flex flex-col gap-4 bg-abyss-deep p-6">
        <div>
          <h1 className="text-xl font-heading text-white">AI Crawl Control</h1>
          <p className="mt-1 text-sm text-mist">
            Analysieren und steuern, wie AI-Crawler auf Ihre Inhalte zugreifen.
          </p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-7 w-7 animate-spin text-mist" />
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-4">
      <FilterBar />

      {error ? (
        <div className="flex items-center gap-3 border border-system-error/40 bg-system-error/10 p-3 text-sm text-system-error">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchAll}
            className="ml-auto border border-system-error/40 px-3 py-1 text-xs uppercase tracking-[0.1em] hover:bg-system-error/10"
          >
            Erneut versuchen
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-mist">Zusammenfassung</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm text-mist-soft">
              <Search className="mt-0.5 h-4 w-4 shrink-0 text-mist" />
              <span>
                Cloudflare erkannte <strong className="text-white">{overview?.totalRequests}</strong> Requests von
                AI-Crawlern.
              </span>
            </div>
            {(overview?.unsuccessfulRequests ?? 0) > 0 ? (
              <div className="flex items-start gap-2 text-sm text-mist-soft">
                <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-mist" />
                <span>
                  <strong className="text-white">{overview?.unsuccessfulRequests}</strong> Crawls erhielten eine
                  HTTP-4xx/5xx-Antwort.
                </span>
              </div>
            ) : null}
            {overview?.topPath ? (
              <div className="flex items-start gap-2 text-sm text-mist-soft">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-mist" />
                <span>
                  <strong className="text-signal">{overview.topPath}</strong> ist der am häufigsten gecrawlte Pfad
                  mit <strong className="text-white">{overview.topPathCount}</strong> erfolgreichen Requests.
                </span>
              </div>
            ) : null}
            {overview?.topCrawler ? (
              <div className="flex items-start gap-2 text-sm text-mist-soft">
                <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-mist" />
                <span>
                  <strong className="text-white">{overview.topCrawlerCount}</strong> Requests stammten von{" "}
                  <strong className="text-white">{overview.topCrawler}</strong>.
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-mist">Schnellaktionen</p>
          <div className="mt-3 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Managed robots.txt</span>
                <span className="bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-mist">Beta</span>
              </div>
              <p className="mt-1 text-xs text-mist">
                Cloudflare kann robots.txt pflegen, um AI-Training zu signalisieren — Konfiguration im Cloudflare
                Dashboard.
              </p>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              title="In Cloudflare konfigurieren"
              className="relative mt-1 h-5 w-9 shrink-0 border border-white/20 bg-white/5"
            >
              <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-mist-soft shadow" />
            </a>
          </div>
        </div>
      </div>

      <MetricsSummaryRow onNav={() => setActiveTab("metrics")} />

      <div className="border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-sm font-semibold text-white">Crawler</span>
          <button type="button" onClick={() => setActiveTab("crawlers")} className="text-mist hover:text-signal">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {overview?.crawlersByOperator.map(({ operator, bots }) => (
            <div key={operator} className="border border-white/10 bg-abyss-deep p-3">
              <p className="text-sm font-semibold text-white">{operator}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {bots.slice(0, 1).map((b) => (
                  <BotBadge key={b.name} name={b.name} />
                ))}
                {bots.length > 1 ? <BotBadge name={`+${bots.length - 1}`} /> : null}
              </div>
              <p className="mt-2 text-xs text-mist">Erfolgreiche Requests</p>
              <p className="text-xl font-heading text-signal">{bots.reduce((s, b) => s + b.allowed, 0)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MetricsTab = () => (
    <div className="space-y-4">
      <FilterBar />
      <MetricsSummaryRow />

      <div className="border border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Erfolgreiche Requests über Zeit</p>
            <p className="text-xs text-mist">Erfolgreiche AI-Crawler-Requests im gewählten Zeitraum.</p>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs text-mist">
            <span>Metrik:</span>
            {(["requests", "bytes"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetricsMetric(m)}
                className={cn(
                  "px-2 py-0.5 uppercase tracking-[0.08em]",
                  metricsMetric === m ? "bg-signal text-black" : "border border-white/10 hover:text-white",
                )}
              >
                {m === "requests" ? "Requests" : "Bytes"}
              </button>
            ))}
            <span className="ml-2">Gruppierung:</span>
            {(["Crawler", "Category", "Operator", "Host"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setMetricsGroupBy(g)}
                className={cn(
                  "px-2 py-0.5",
                  metricsGroupBy === g ? "bg-signal text-black" : "border border-white/10 hover:text-white",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 border-b border-white/10 px-4 py-3">
          {(legendExpanded ? crawlerTotals : crawlerTotals.slice(0, 5)).map(({ key, total }) => (
            <div key={key} className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5" style={{ background: crawlerColorByKey[key] }} />
              <span className="font-medium text-white">{key.split(/[/\s]/)[0]}</span>
              <span className="text-mist">
                {useBytes
                  ? total >= 1e6
                    ? `${(total / 1e6).toFixed(1)} MB`
                    : total >= 1e3
                      ? `${(total / 1e3).toFixed(1)} KB`
                      : total
                  : total}
              </span>
            </div>
          ))}
          {crawlerKeys.length > 5 && !legendExpanded ? (
            <button
              type="button"
              onClick={() => setLegendExpanded(true)}
              className="text-sm text-mist hover:text-signal"
            >
              +{crawlerKeys.length - 5} weitere
            </button>
          ) : null}
          {legendExpanded && crawlerKeys.length > 5 ? (
            <button type="button" onClick={() => setLegendExpanded(false)} className="text-sm text-mist hover:text-signal">
              Weniger anzeigen
            </button>
          ) : null}
        </div>
        <div className="p-4">
          {groupedSeries.length > 0 ? (
            <ChartCard title="" height={220} className="border-0 bg-transparent p-0">
              <LineChart data={groupedSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="datetimeHour" tickFormatter={formatHour} tick={{ fontSize: 10, fill: MIST }} />
                <YAxis
                  tick={{ fontSize: 10, fill: MIST }}
                  tickFormatter={(v) =>
                    useBytes
                      ? v >= 1e6
                        ? `${(v / 1e6).toFixed(1)}M`
                        : v >= 1e3
                          ? `${(v / 1e3).toFixed(0)}K`
                          : v
                      : v
                  }
                />
                <Tooltip content={<FenyxTooltip />} />
                {crawlerKeys.map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={crawlerColorByKey[key] ?? CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray={i >= 5 ? "4 2" : undefined}
                  />
                ))}
              </LineChart>
            </ChartCard>
          ) : (
            <p className="py-8 text-center text-sm text-mist">Keine Daten für den gewählten Zeitraum.</p>
          )}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-sm font-semibold text-white">Statuscode-Verteilung</p>
          <p className="text-xs text-mist">HTTP-Statuscodes für AI-Crawler-Requests über Zeit.</p>
        </div>
        <div className="flex flex-wrap gap-6 border-b border-white/10 px-4 py-3">
          {Object.entries(byStatus).map(([bucket, count]) => (
            <div key={bucket} className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5" style={{ background: statusColors[bucket] ?? MIST }} />
              <span className="font-medium text-mist">{bucket}</span>
              <span className="font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
        <div className="p-4">
          {overTime.length > 0 ? (
            <ChartCard title="" height={200} className="border-0 bg-transparent p-0">
              <LineChart data={overTime} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="datetimeHour" tickFormatter={formatHour} tick={{ fontSize: 10, fill: MIST }} />
                <YAxis tick={{ fontSize: 10, fill: MIST }} />
                <Tooltip content={<FenyxTooltip />} />
                {Object.keys(statusColors).map((bucket) => (
                  <Line
                    key={bucket}
                    type="monotone"
                    dataKey={bucket}
                    stroke={statusColors[bucket]}
                    strokeWidth={1.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ChartCard>
          ) : (
            <p className="py-8 text-center text-sm text-mist">Keine Daten für den gewählten Zeitraum.</p>
          )}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Meist gecrawlte Pfade</p>
            <p className="text-xs text-mist">Top-Pfade nach erfolgreichen AI-Crawler-Requests.</p>
          </div>
          <div className="flex gap-1 text-xs">
            {(["paths", "patterns"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPathsView(v)}
                className={cn(
                  "px-2 py-0.5 uppercase tracking-[0.08em]",
                  pathsView === v ? "bg-signal text-black" : "border border-white/10 text-mist hover:text-white",
                )}
              >
                {v === "paths" ? "Pfade" : "Muster"}
              </button>
            ))}
          </div>
        </div>
        <FenyxTable
          head={
            <>
              <Th>Pfad</Th>
              <Th>Host</Th>
              <Th className="text-right">↓ Erfolgreiche Requests</Th>
            </>
          }
        >
          {pagedPaths.map((item, i) => (
            <Tr key={i}>
              <Td className="font-mono text-xs text-signal">{item.path}</Td>
              <Td className="text-sm">{item.host}</Td>
              <Td className="text-right text-sm text-white">{item.allowedRequests}</Td>
            </Tr>
          ))}
        </FenyxTable>
        {pathsOrPatterns.length > PATHS_PER_PAGE ? (
          <TablePagination
            page={pathsPage}
            perPage={PATHS_PER_PAGE}
            total={pathsOrPatterns.length}
            onChange={setPathsPage}
          />
        ) : null}
      </div>
    </div>
  );

  const CrawlersTab = () => (
    <div className="space-y-4">
      <FilterBar />
      {!crawlerActionEnabled ? (
        <p className="border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-mist">
          Blockieren/Erlauben ist deaktiviert (Cloudflare-Crawler-Action-API nicht verfügbar oder nicht konfiguriert).
        </p>
      ) : null}
      <div className="border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
          <label className="flex items-center gap-2 text-sm text-mist">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 border-white/20 bg-abyss-deep"
            />
            Inaktive Crawler anzeigen
            <Info className="h-3.5 w-3.5" />
          </label>
        </div>
        <FenyxTable
          head={
            <>
              <Th className="w-8" />
              <Th>Crawler</Th>
              <Th>Kategorie</Th>
              <Th>Bytes übertragen</Th>
              <Th>Requests</Th>
              <Th>
                <span className="flex items-center gap-1">
                  Aktion <Info className="h-3 w-3" />
                </span>
              </Th>
            </>
          }
        >
          {visibleCrawlers.map((c, i) => (
            <Tr key={i}>
              <Td>
                <input type="checkbox" className="h-4 w-4 border-white/20 bg-abyss-deep" />
              </Td>
              <Td>
                <p className="font-medium text-white">{c.userAgent}</p>
                <p className="text-xs text-mist">{c.operator}</p>
              </Td>
              <Td>
                <CategoryBadge category={c.category} />
              </Td>
              <Td className="text-sm">{formatBytes(c.bytes)}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-16">
                    <MiniSparkline
                      data={series.map((r) => ({
                        v: Number(r[c.userAgent] ?? r[c.userAgent.split(/[/\s]/)[0]] ?? 0),
                      }))}
                      height={30}
                    />
                  </div>
                  <div className="text-xs text-mist">
                    <div>Erfolgreich: {c.allowed}</div>
                    <div>Fehlgeschlagen: {c.unsuccessful}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCrawlerAction(c.userAgent, "allow")}
                    disabled={!crawlerActionEnabled || actionPending === c.userAgent}
                    title={!crawlerActionEnabled ? "Aktion nicht verfügbar" : undefined}
                    className={cn(
                      "inline-flex h-7 items-center border px-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40",
                      blockedCrawlers.has(c.userAgent)
                        ? "border-white/10 text-mist-soft hover:border-signal hover:text-signal"
                        : "border-signal text-signal hover:bg-signal/10",
                    )}
                  >
                    {actionPending === c.userAgent ? "…" : "Erlauben"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrawlerAction(c.userAgent, "block")}
                    disabled={!crawlerActionEnabled || actionPending === c.userAgent}
                    title={!crawlerActionEnabled ? "Aktion nicht verfügbar" : undefined}
                    className={cn(
                      "inline-flex h-7 items-center border px-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40",
                      blockedCrawlers.has(c.userAgent)
                        ? "border-signal text-signal hover:bg-signal/10"
                        : "border-white/10 text-mist-soft hover:border-signal hover:text-signal",
                    )}
                  >
                    {actionPending === c.userAgent ? "…" : "Blockieren"}
                  </button>
                  <a
                    href="https://dash.cloudflare.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-signal"
                    title="In Cloudflare öffnen"
                  >
                    <MoreHorizontal className="h-4 w-4 text-mist" />
                  </a>
                </div>
              </Td>
            </Tr>
          ))}
        </FenyxTable>
        {visibleCrawlers.length === 0 && !loading ? (
          <p className="py-8 text-center text-sm text-mist">Keine Crawler-Daten für den gewählten Zeitraum.</p>
        ) : null}
      </div>
    </div>
  );

  const RobotsTab = () => (
    <div className="space-y-6">
      <FilterBar />

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-mist">Robots.txt-Richtlinie</p>
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Cloudflare Managed</span>
                <span className="bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-mist">Beta</span>
              </div>
              <p className="mt-1 text-xs text-mist">
                Cloudflare kann robots.txt pflegen, um AI-Training zu signalisieren — Konfiguration im Cloudflare
                Dashboard.
              </p>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              title="In Cloudflare konfigurieren"
              className="relative mt-1 h-5 w-9 shrink-0 border border-white/20 bg-white/5"
            >
              <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-mist-soft shadow" />
            </a>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white">Verfügbarkeit</span>
          <Info className="h-3.5 w-3.5 text-mist" />
        </div>
        <p className="mb-3 text-xs text-mist">
          Request-Häufigkeit und Gesundheitsstatus von robots.txt-Dateien überwachen.
        </p>
        <div className="border border-white/10 bg-white/[0.02]">
          <FenyxTable
            head={
              <>
                <Th>
                  <span className="flex items-center gap-1">
                    Hostname <Info className="h-3 w-3" />
                  </span>
                </Th>
                <Th>
                  <span className="flex items-center gap-1">
                    Requests <Info className="h-3 w-3" />
                  </span>
                </Th>
                <Th>Status</Th>
                <Th>
                  <span className="flex items-center gap-1">
                    Content Signals <Info className="h-3 w-3" />
                  </span>
                </Th>
              </>
            }
          >
            {pagedRobots.map((item, i) => (
              <Tr key={i}>
                <Td>
                  <p className="font-medium text-white">{item.hostname.replace(/\..+$/, "")}</p>
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-signal hover:underline"
                  >
                    {item.path}
                  </a>
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-16">
                      <MiniSparkline data={aggregateSparkline} height={30} />
                    </div>
                    <div className="text-xs text-mist">
                      <div>Erfolgreich: {item.successful}</div>
                      <div>Fehlgeschlagen: {item.unsuccessful}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={item.status} />
                </Td>
                <Td>
                  <span className="border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-mist">
                    {item.contentSignals}
                  </span>
                </Td>
              </Tr>
            ))}
          </FenyxTable>
          {robotsAvailability.length > ROBOTS_PER_PAGE ? (
            <TablePagination
              page={robotsPage}
              perPage={ROBOTS_PER_PAGE}
              total={robotsAvailability.length}
              onChange={setRobotsPage}
            />
          ) : null}
          {robotsAvailability.length === 0 && !loading ? (
            <p className="py-8 text-center text-sm text-mist">Keine robots.txt-Daten für den gewählten Zeitraum.</p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white">Verletzungen</span>
          <Info className="h-3.5 w-3.5 text-mist" />
        </div>
        <p className="mb-3 text-xs text-mist">
          AI-Crawler, die Pfade anfragen, die laut robots.txt nicht erlaubt sind — gefiltert nach Crawler, Operator
          oder Hostname.
        </p>
        <div className="overflow-hidden border border-white/10 bg-white/[0.02]">
          {violations.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-mist">
              Keine Verletzungen mit den aktuellen Filtern.
            </div>
          ) : (
            <FenyxTable
              head={
                <>
                  <Th>Pfad</Th>
                  <Th>Crawler</Th>
                  <Th>Operator</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Anzahl</Th>
                </>
              }
            >
              {violations.slice(0, 20).map((v, i) => (
                <Tr key={`${v.path}-${v.crawler}-${i}`}>
                  <Td className="max-w-[200px] truncate font-mono text-xs">{v.path || "/"}</Td>
                  <Td>
                    <BotBadge name={v.crawler} />
                  </Td>
                  <Td>{v.operator}</Td>
                  <Td>
                    <StatusBadge status={v.status} />
                  </Td>
                  <Td className="text-right text-white">{v.count}</Td>
                </Tr>
              ))}
            </FenyxTable>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-abyss-deep p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h1 className="text-xl font-heading text-white">AI Crawl Control</h1>
          </div>
          <p className="mt-0.5 text-sm text-mist">
            Analysieren und steuern, wie AI-Crawler auf Ihre Inhalte zugreifen.
          </p>
        </div>
        <a
          href="https://developers.cloudflare.com/bots/concepts/ai-bots/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-sm text-mist hover:border-signal hover:text-signal"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Dokumentation
        </a>
      </div>

      <TabNav tabs={TAB_ITEMS} active={activeTab} onChange={setActiveTab} />

      <h2 className="text-lg font-heading text-white">{TAB_HEADINGS[activeTab]}</h2>

      {activeTab === "overview" ? <OverviewTab /> : null}
      {activeTab === "metrics" ? <MetricsTab /> : null}
      {activeTab === "crawlers" ? <CrawlersTab /> : null}
      {activeTab === "robots" ? <RobotsTab /> : null}
    </div>
  );
}
