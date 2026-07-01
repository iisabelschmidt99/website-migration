"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatBytes } from "@/lib/cloudflare/analytics";

const API_BASE = "/api/cloudflare-analytics";

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

const RANGE_HOURS = [
  { label: "24 Std", hours: 24 },
  { label: "7 Tage", hours: 24 * 7 },
  { label: "30 Tage", hours: 24 * 30 },
];

type OverviewData = {
  totalRequests: number;
  allowedRequests: number;
  unsuccessfulRequests: number;
  topPath: string | null;
  topPathCount: number;
  topCrawler: string | null;
  topCrawlerCount: number;
  crawlersByOperator: Array<{ operator: string; bots: Array<{ name: string; allowed: number }> }>;
};

type CrawlerItem = {
  userAgent: string;
  operator: string;
  category: string;
  bytes: number;
  allowed: number;
  unsuccessful: number;
};

type PathItem = {
  path: string;
  host: string;
  allowedRequests: number;
};

type RobotsItem = {
  hostname: string;
  path: string;
  successful: number;
  unsuccessful: number;
  status: number;
};

type ViolationItem = {
  path: string;
  host: string;
  crawler: string;
  operator: string;
  count: number;
  status: number;
};

type ActiveTab = "overview" | "crawlers" | "paths" | "robots";

type Props = {
  configured: boolean;
};

export default function AiCrawlerPanel({ configured }: Props) {
  const [rangeHours, setRangeHours] = useState(24);
  const [hostFilter, setHostFilter] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [crawlers, setCrawlers] = useState<CrawlerItem[]>([]);
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [robots, setRobots] = useState<RobotsItem[]>([]);
  const [violations, setViolations] = useState<ViolationItem[]>([]);

  const dateRange = useMemo(() => {
    const to = new Date();
    const from = new Date(Date.now() - rangeHours * 60 * 60 * 1000);
    return { from, to };
  }, [rangeHours]);

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
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      return json;
    },
    [dateRange, hostFilter, operatorFilter],
  );

  const fetchAll = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const [ov, cr, pt, rb, v] = await Promise.all([
        fetchQuery("overview"),
        fetchQuery("crawlers"),
        fetchQuery("paths"),
        fetchQuery("robots-availability"),
        fetchQuery("violations").catch(() => ({ items: [] })),
      ]);
      setOverview(ov);
      setCrawlers(cr.items || []);
      setPaths(pt.items || []);
      setRobots(rb.items || []);
      setViolations(v?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Abruf fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [configured, fetchQuery]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (!configured) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-2 text-sm font-semibold text-white">AI Crawler Analytics</h2>
        <p className="text-sm text-mist">Cloudflare API Token und Zone-ID erforderlich.</p>
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "overview", label: "Übersicht" },
    { id: "crawlers", label: "Crawler" },
    { id: "paths", label: "Pfade" },
    { id: "robots", label: "robots.txt" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">AI Crawl Control</h2>
          <p className="mt-1 text-xs text-mist">
            GPTBot, PerplexityBot, ClaudeBot, Googlebot u.a. — Cloudflare GraphQL
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAll}
          disabled={loading}
          className="border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:border-signal hover:text-signal disabled:opacity-50"
        >
          {loading ? "Lädt…" : "Aktualisieren"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={hostFilter}
          onChange={(e) => setHostFilter(e.target.value)}
          className="border border-white/10 bg-abyss-deep px-3 py-2 text-sm text-mist"
        >
          {HOST_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
          className="border border-white/10 bg-abyss-deep px-3 py-2 text-sm text-mist"
        >
          {OPERATOR_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {RANGE_HOURS.map((r) => (
          <button
            key={r.hours}
            type="button"
            onClick={() => setRangeHours(r.hours)}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
              rangeHours === r.hours ? "bg-signal text-black" : "border border-white/10 text-mist"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="border border-system-error/40 bg-system-error/10 p-4 text-sm text-system-error">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
              activeTab === t.id ? "bg-signal text-black" : "border border-white/10 text-mist"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && !overview ? (
        <p className="py-12 text-center text-sm text-mist">Daten werden geladen…</p>
      ) : null}

      {activeTab === "overview" && overview ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Requests gesamt" value={overview.totalRequests} />
            <Kpi label="Erfolgreich (2xx/3xx)" value={overview.allowedRequests} />
            <Kpi label="Fehlgeschlagen (4xx/5xx)" value={overview.unsuccessfulRequests} />
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-mist">Summary</h3>
            <ul className="space-y-2 text-sm text-mist-soft">
              <li>
                Cloudflare erkannte <strong className="text-white">{overview.totalRequests}</strong> AI-Crawler-Requests.
              </li>
              {overview.topPath ? (
                <li>
                  Top-Pfad: <code className="text-signal">{overview.topPath}</code> ({overview.topPathCount} Requests)
                </li>
              ) : null}
              {overview.topCrawler ? (
                <li>
                  Top-Crawler: <strong className="text-white">{overview.topCrawler}</strong> ({overview.topCrawlerCount})
                </li>
              ) : null}
            </ul>
          </div>
          {overview.crawlersByOperator.length > 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-mist">Nach Operator</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overview.crawlersByOperator.map(({ operator, bots }) => (
                  <div key={operator} className="border border-white/5 p-3">
                    <p className="text-sm font-semibold text-white">{operator}</p>
                    <ul className="mt-2 space-y-1 text-xs text-mist">
                      {bots.slice(0, 5).map((b) => (
                        <li key={b.name} className="flex justify-between">
                          <span>{b.name}</span>
                          <span className="text-mist-soft">{b.allowed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {violations.length > 0 ? (
            <DataTable
              title="Verletzungen (4xx/5xx)"
              columns={["Pfad", "Crawler", "Status", "Anzahl"]}
              rows={violations.slice(0, 15).map((v) => [
                v.path,
                v.crawler,
                String(v.status),
                String(v.count),
              ])}
            />
          ) : null}
        </div>
      ) : null}

      {activeTab === "crawlers" ? (
        <DataTable
          title="Crawler"
          columns={["Bot", "Operator", "Kategorie", "Bytes", "OK", "Fehler"]}
          rows={crawlers.slice(0, 50).map((c) => [
            c.userAgent,
            c.operator,
            c.category,
            formatBytes(c.bytes),
            String(c.allowed),
            String(c.unsuccessful),
          ])}
        />
      ) : null}

      {activeTab === "paths" ? (
        <DataTable
          title="Top Pfade (erlaubte Crawls)"
          columns={["Host", "Pfad", "Requests"]}
          rows={paths.slice(0, 50).map((p) => [p.host, p.path, String(p.allowedRequests)])}
        />
      ) : null}

      {activeTab === "robots" ? (
        <DataTable
          title="robots.txt Verfügbarkeit"
          columns={["Host", "Status", "OK", "Fehler"]}
          rows={robots.map((r) => [
            r.hostname,
            String(r.status),
            String(r.successful),
            String(r.unsuccessful),
          ])}
        />
      ) : null}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-heading text-white">{value.toLocaleString("de-DE")}</p>
    </div>
  );
}

function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  if (!rows.length) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm text-mist">Keine Daten im gewählten Zeitraum.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-mist">
              {columns.map((col) => (
                <th key={col} className="pb-2 pr-4 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                {row.map((cell, j) => (
                  <td key={j} className="py-2 pr-4 text-mist-soft">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
