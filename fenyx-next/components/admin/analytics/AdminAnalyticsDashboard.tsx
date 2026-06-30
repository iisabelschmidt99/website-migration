"use client";

import { useMemo, useState } from "react";
import WorldMap from "react-svg-worldmap";
import AiCrawlerPanel from "@/components/admin/analytics/AiCrawlerPanel";
import CloudflareZonePanel from "@/components/admin/analytics/CloudflareZonePanel";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EventRow = {
  event_type: string;
  page_path: string;
  page_type: string | null;
  service_area: string | null;
  traffic_source_category: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  event_data: Record<string, unknown> | null;
  quality_flags?: Record<string, unknown> | null;
  bot_classification: string | null;
};

type FunnelRow = {
  session_hash: string;
  status: string;
  primary_service_area: string | null;
  traffic_source_category: string | null;
  device_type: string | null;
  country_code: string | null;
  region_code: string | null;
  bot_classification?: string | null;
  page_views: number;
  cta_clicks: number;
  contact_form_views: number;
  leads: number;
};

type Props = {
  events: EventRow[];
  funnel: FunnelRow[];
  cruxConfigured: boolean;
  gtmConfigured: boolean;
  cloudflareConfigured: boolean;
};

const TABS = [
  "Website",
  "Pages",
  "CTAs",
  "Leads",
  "Traffic Quality",
  "Performance",
  "Tracking Health",
  "GTM Health",
  "Cloudflare",
  "AI Crawler",
] as const;

function countBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item) || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-heading text-white">{value}</p>
    </div>
  );
}

export default function AdminAnalyticsDashboard({
  events,
  funnel,
  cruxConfigured,
  gtmConfigured,
  cloudflareConfigured,
}: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Website");
  const businessEvents = events.filter(
    (e) =>
      e.bot_classification !== "verified_bot" &&
      e.bot_classification !== "suspected_bot" &&
      e.quality_flags?.bot_suspected !== true,
  );
  const businessFunnel = funnel.filter(
    (f) => f.bot_classification !== "verified_bot" && f.bot_classification !== "suspected_bot",
  );
  const sessions = businessFunnel.length;
  const leads = businessFunnel.reduce((sum, row) => sum + row.leads, 0);
  const pageViews = businessEvents.filter((e) => e.event_type === "page_view").length;
  const engaged = businessFunnel.filter((f) => f.status !== "bounced").length;
  const leadRate = sessions ? `${Math.round((leads / sessions) * 1000) / 10}%` : "0%";

  const devices = useMemo(() => countBy(businessFunnel, (f) => f.device_type), [businessFunnel]);
  const sources = useMemo(() => countBy(businessFunnel, (f) => f.traffic_source_category), [businessFunnel]);
  const pages = useMemo(() => countBy(businessEvents.filter((e) => e.event_type === "page_view"), (e) => e.page_path), [businessEvents]);
  const ctas = useMemo(() => countBy(businessEvents.filter((e) => e.event_type === "cta_click"), (e) => String(e.event_data?.element_id ?? "unknown")), [businessEvents]);
  const leadSources = useMemo(() => countBy(businessFunnel.filter((f) => f.leads > 0), (f) => f.primary_service_area), [businessFunnel]);
  const countries = useMemo(() => countBy(businessFunnel, (f) => f.country_code?.toLowerCase()).filter((c) => c.name !== "unknown"), [businessFunnel]);
  const webVitals = businessEvents.filter((e) => e.event_type === "web_vital");
  const bots = countBy(events, (e) => e.bot_classification);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
              tab === item ? "bg-signal text-black" : "border border-white/10 text-mist"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Website" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Kpi label="Sessions" value={sessions} />
            <Kpi label="Page Views" value={pageViews} />
            <Kpi label="Engaged" value={engaged} />
            <Kpi label="Leads" value={leads} />
            <Kpi label="Lead Rate" value={leadRate} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartBox title="Traffic Sources">
              <BarChart data={sources.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
                <XAxis dataKey="name" tick={{ fill: "#8da4ba", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#c8ff00" />
              </BarChart>
            </ChartBox>
            <ChartBox title="Device Distribution">
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" outerRadius={90}>
                  {devices.map((_, index) => (
                    <Cell key={index} fill={["#c8ff00", "#8da4ba", "#dceaf5", "#3d5264"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartBox>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">Country Map</h2>
              {countries.length > 0 ? (
                <WorldMap
                  color="#c8ff00"
                  valueSuffix=" Sessions"
                  size="responsive"
                  data={countries.map((c) => ({
                    country: c.name.toLowerCase(),
                    value: c.value,
                  })) as never}
                />
              ) : (
                <p className="text-sm text-mist">Geo-Daten erscheinen nach Cloudflare-Worker-Deploy.</p>
              )}
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">DACH Regionen</h2>
              <SimpleTable rows={countBy(funnel, (f) => f.country_code === "DE" || f.country_code === "AT" || f.country_code === "CH" ? f.region_code : null).slice(0, 12)} />
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Pages" ? <SimpleTable rows={pages.slice(0, 25)} title="Top Page Paths" /> : null}
      {tab === "CTAs" ? <SimpleTable rows={ctas.slice(0, 25)} title="CTA Performance" /> : null}
      {tab === "Leads" ? <SimpleTable rows={leadSources.slice(0, 25)} title="Leads nach Service Area" /> : null}
      {tab === "Traffic Quality" ? <SimpleTable rows={bots} title="Bot / Human Breakdown" /> : null}
      {tab === "Performance" ? (
        <div className="space-y-4">
          <Kpi label="RUM Web-Vitals Samples" value={webVitals.length} />
          <SimpleTable rows={countBy(webVitals, (e) => String(e.event_data?.metric_name ?? "unknown"))} title="Metric Samples" />
          <p className="text-sm text-mist">
            CrUX Field Data: {cruxConfigured ? "konfiguriert" : "GOOGLE_CWV_API_KEY fehlt"}
          </p>
        </div>
      ) : null}
      {tab === "Tracking Health" ? <SimpleTable rows={countBy(events, (e) => e.event_type)} title="Event Breakdown" /> : null}
      {tab === "GTM Health" ? <Placeholder configured={gtmConfigured} label="GTM-Service-Account" /> : null}
      {tab === "Cloudflare" ? <CloudflareZonePanel configured={cloudflareConfigured} /> : null}
      {tab === "AI Crawler" ? <AiCrawlerPanel configured={cloudflareConfigured} /> : null}
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="h-80 border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">{title}</h2>
      <ResponsiveContainer width="100%" height="85%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function SimpleTable({ rows, title }: { rows: { name: string; value: number }[]; title?: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      {title ? <h2 className="mb-4 text-sm font-semibold text-white">{title}</h2> : null}
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-white/5">
              <td className="py-2 pr-4 text-mist">{row.name}</td>
              <td className="py-2 text-right text-white">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Placeholder({ configured, label }: { configured: boolean; label: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-2 text-sm font-semibold text-white">{label}</h2>
      <p className="text-sm text-mist">
        {configured ? "Konfiguriert — Abruf kann gestartet werden." : "Noch nicht konfiguriert. Tab bleibt als Vorbereitung sichtbar."}
      </p>
    </div>
  );
}
