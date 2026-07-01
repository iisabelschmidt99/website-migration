"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateRangeSelector from "./DateRangeSelector";
import TabNav from "./ui/TabNav";
import FirstPartyDashboard from "./first-party/FirstPartyDashboard";
import ZoneOverviewPanel from "./cloudflare/ZoneOverviewPanel";
import AiCrawlControlDashboard from "./cloudflare/AiCrawlControlDashboard";
import GtmHealthPanel from "./third-party/GtmHealthPanel";
import TrackingHealthPanel from "./third-party/TrackingHealthPanel";
import type { AnalyticsHubProps } from "@/lib/analytics/dashboardTypes";

const GROUPS = [
  { id: "first-party", label: "First-Party", subtitle: "System A · cookielos" },
  { id: "third-party", label: "Third-Party", subtitle: "System B · Consent" },
  { id: "cloudflare", label: "Cloudflare", subtitle: "Edge · Zone & AI Crawler" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

const CF_TABS = [
  { id: "zone", label: "Zone Overview" },
  { id: "ai-crawl", label: "AI Crawl Control" },
] as const;

const TP_TABS = [
  { id: "gtm", label: "GTM Health" },
  { id: "tracking", label: "Tracking Health" },
] as const;

type CfTab = (typeof CF_TABS)[number]["id"];
type TpTab = (typeof TP_TABS)[number]["id"];

export default function AnalyticsHub(props: AnalyticsHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const group = (searchParams.get("group") as GroupId) || "first-party";
  const subTab = searchParams.get("tab") ?? "";

  const setGroup = useCallback(
    (g: GroupId, defaultTab?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("group", g);
      if (defaultTab) params.set("tab", defaultTab);
      else params.delete("tab");
      router.replace(`/admin/analytics?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setSubTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("group", group);
      params.set("tab", tab);
      router.replace(`/admin/analytics?${params.toString()}`);
    },
    [group, router, searchParams],
  );

  const cfTab = (subTab as CfTab) || "zone";
  const tpTab = (subTab as TpTab) || "gtm";

  const groupMeta = useMemo(() => GROUPS.find((g) => g.id === group) ?? GROUPS[0], [group]);

  return (
    <div className="space-y-6">
      <div className="border border-white/10 bg-abyss-deep p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal">{groupMeta.label}</p>
        <p className="mt-1 text-sm text-mist">{groupMeta.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id, g.id === "cloudflare" ? "zone" : g.id === "third-party" ? "gtm" : undefined)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
              group === g.id ? "bg-signal text-black" : "border border-white/10 text-mist hover:text-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {group === "first-party" ? (
        <>
          <DateRangeSelector />
          <FirstPartyDashboard {...props} cruxConfigured={props.cruxConfigured} />
        </>
      ) : null}

      {group === "third-party" ? (
        <div className="space-y-6">
          <p className="text-xs text-mist">
            Third-Party-Daten sind live (GTM API) bzw. ohne Zeitraum-Filter (Tracking Health · letzte Events).
          </p>
          <TabNav tabs={[...TP_TABS]} active={tpTab} onChange={setSubTab} />
          {tpTab === "gtm" ? <GtmHealthPanel configured={props.gtmConfigured} /> : null}
          {tpTab === "tracking" ? <TrackingHealthPanel events={props.events} /> : null}
        </div>
      ) : null}

      {group === "cloudflare" ? (
        <div className="space-y-6">
          <p className="text-xs text-mist">
            Cloudflare-Daten nutzen eigene Zeitfenster (Zone Overview: 24h Live-API).
          </p>
          <TabNav tabs={[...CF_TABS]} active={cfTab} onChange={setSubTab} />
          {cfTab === "zone" ? <ZoneOverviewPanel configured={props.cloudflareConfigured} /> : null}
          {cfTab === "ai-crawl" ? <AiCrawlControlDashboard configured={props.cloudflareConfigured} /> : null}
        </div>
      ) : null}
    </div>
  );
}
