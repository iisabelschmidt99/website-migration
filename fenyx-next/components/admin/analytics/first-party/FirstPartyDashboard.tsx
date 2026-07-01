"use client";

import { useMemo, useState } from "react";
import TabNav from "@/components/admin/analytics/ui/TabNav";
import OverviewTab from "./OverviewTab";
import WebsiteSessionExplorer from "./WebsiteSessionExplorer";
import PagesTab from "./PagesTab";
import PathsTab from "./PathsTab";
import CtasTab from "./CtasTab";
import TrafficTab from "./TrafficTab";
import LeadsTab from "./LeadsTab";
import PerformanceTab from "./PerformanceTab";
import UxSignalsTab from "./UxSignalsTab";
import type { AnalyticsHubProps } from "@/lib/analytics/dashboardTypes";
import { humanEvents } from "@/lib/analytics/dashboardMetrics";
import { buildCanonicalSessions, humanSessions } from "@/lib/analytics/websiteCanonicalAnalytics";

const FP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "pages", label: "Pages" },
  { id: "paths", label: "Paths" },
  { id: "ctas", label: "CTAs" },
  { id: "traffic", label: "Traffic" },
  { id: "leads", label: "Leads" },
  { id: "performance", label: "Performance" },
  { id: "ux", label: "UX Signals" },
] as const;

type FpTab = (typeof FP_TABS)[number]["id"];

export default function FirstPartyDashboard({
  events,
  journeys,
  funnel,
  cruxConfigured,
}: AnalyticsHubProps & { cruxConfigured: boolean }) {
  const [tab, setTab] = useState<FpTab>("overview");

  const humanEventRows = useMemo(() => humanEvents(events), [events]);

  const canonical = useMemo(
    () => humanSessions(buildCanonicalSessions(journeys, funnel)),
    [journeys, funnel],
  );

  return (
    <div className="space-y-6">
      <TabNav tabs={[...FP_TABS]} active={tab} onChange={setTab} />
      {tab === "overview" ? <OverviewTab sessions={canonical} /> : null}
      {tab === "sessions" ? <WebsiteSessionExplorer sessions={canonical} /> : null}
      {tab === "pages" ? <PagesTab events={humanEventRows} /> : null}
      {tab === "paths" ? <PathsTab sessions={canonical} /> : null}
      {tab === "ctas" ? <CtasTab events={humanEventRows} /> : null}
      {tab === "traffic" ? <TrafficTab sessions={canonical} events={humanEventRows} /> : null}
      {tab === "leads" ? <LeadsTab sessions={canonical} /> : null}
      {tab === "performance" ? (
        <PerformanceTab events={humanEventRows} sessions={canonical} cruxConfigured={cruxConfigured} />
      ) : null}
      {tab === "ux" ? <UxSignalsTab events={humanEventRows} /> : null}
    </div>
  );
}
