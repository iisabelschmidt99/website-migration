"use client";

import { useMemo } from "react";
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
import type { DateRange } from "@/components/admin/analytics/DateRangeSelector";
import { filterByDateRange } from "@/components/admin/analytics/DateRangeSelector";
import type { AnalyticsHubProps } from "@/lib/analytics/dashboardTypes";
import { buildCanonicalSessions, humanSessions } from "@/lib/analytics/websiteCanonicalAnalytics";
import { useState } from "react";

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
  dateRange,
  cruxConfigured,
}: AnalyticsHubProps & { dateRange: DateRange; cruxConfigured: boolean }) {
  const [tab, setTab] = useState<FpTab>("overview");

  const filteredEvents = useMemo(
    () => filterByDateRange(events, dateRange, "event_ts"),
    [events, dateRange],
  );
  const filteredJourneys = useMemo(
    () => filterByDateRange(journeys, dateRange, "updated_at"),
    [journeys, dateRange],
  );

  const canonical = useMemo(
    () => humanSessions(buildCanonicalSessions(filteredJourneys, funnel)),
    [filteredJourneys, funnel],
  );

  return (
    <div className="space-y-6">
      <TabNav tabs={[...FP_TABS]} active={tab} onChange={setTab} />
      {tab === "overview" ? <OverviewTab sessions={canonical} /> : null}
      {tab === "sessions" ? <WebsiteSessionExplorer sessions={canonical} /> : null}
      {tab === "pages" ? <PagesTab events={filteredEvents} /> : null}
      {tab === "paths" ? <PathsTab sessions={canonical} /> : null}
      {tab === "ctas" ? <CtasTab events={filteredEvents} /> : null}
      {tab === "traffic" ? <TrafficTab sessions={canonical} events={filteredEvents} /> : null}
      {tab === "leads" ? <LeadsTab sessions={canonical} /> : null}
      {tab === "performance" ? (
        <PerformanceTab events={filteredEvents} sessions={canonical} cruxConfigured={cruxConfigured} />
      ) : null}
      {tab === "ux" ? <UxSignalsTab events={filteredEvents} /> : null}
    </div>
  );
}
