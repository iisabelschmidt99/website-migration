import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { assertAnalyticsApiAuth } from "@/lib/admin/assertAnalyticsApiAuth";
import {
  CATEGORY_MAP,
  OPERATOR_MAP,
  buildCrawlerFilter,
  displayBotName,
  extractBotName,
  queryCloudflare,
} from "@/lib/cloudflare/analytics";

export const runtime = "nodejs";

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Service Role oder URL fehlt.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: "analytics" },
  });
}

function worstRobotsStatus(statusCounts: Map<number, number>): number {
  const byTier = (s: number) => (s >= 500 ? 5 : s >= 400 ? 4 : s >= 300 ? 3 : 2);
  let worst = 200;
  let worstTier = 2;
  let worstCount = 0;
  for (const [status, count] of statusCounts) {
    const tier = byTier(status);
    if (tier > worstTier || (tier === worstTier && count > worstCount)) {
      worst = status;
      worstTier = tier;
      worstCount = count;
    }
  }
  return worst;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await assertAnalyticsApiAuth();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!cloudflareToken || !zoneId) {
      return NextResponse.json({
        configured: false,
        message: "CLOUDFLARE_API_TOKEN oder CLOUDFLARE_ZONE_ID fehlt.",
      });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "overview";
    const from = searchParams.get("from") || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const to = searchParams.get("to") || new Date().toISOString();
    const crawler = searchParams.get("crawler") || undefined;
    const operator = searchParams.get("operator") || undefined;
    const host = searchParams.get("host") || undefined;
    const persist = searchParams.get("persist") === "1";

    if (action === "zone-overview") {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const until = new Date().toISOString().slice(0, 10);
      const query = `
        query ZoneOverview($zoneTag: string, $since: string, $until: string) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequests1dGroups(limit: 1, filter: { date_geq: $since, date_leq: $until }) {
                sum { requests bytes threats cachedRequests }
              }
            }
          }
        }
      `;

      const data = await queryCloudflare(zoneId, cloudflareToken, query, {
        zoneTag: zoneId,
        since,
        until,
      });

      const sum = data?.viewer?.zones?.[0]?.httpRequests1dGroups?.[0]?.sum ?? {};
      const requests = sum.requests ?? 0;
      const cached = sum.cachedRequests ?? 0;
      const row = {
        zone_id: zoneId,
        period_start: since,
        period_end: until,
        requests,
        threats: sum.threats ?? 0,
        bandwidth_bytes: sum.bytes ?? 0,
        cache_ratio: requests ? cached / requests : null,
      };

      if (persist) {
        const { error } = await serviceClient()
          .from("cloudflare_metrics")
          .insert({ ...row, raw_payload: { sum } });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ configured: true, ...row });
    }

    const crawlerFilter = buildCrawlerFilter(crawler, operator);
    const baseFilter: Record<string, unknown> = {
      ...crawlerFilter,
      datetime_geq: from,
      datetime_leq: to,
    };
    if (host) baseFilter.clientRequestHTTPHost = host;

    if (action === "overview") {
      const variables = { zoneTag: zoneId, filter: baseFilter };
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              allowed: httpRequestsAdaptiveGroups(filter: $filter, limit: 10000) {
                count
                dimensions { clientRequestPath userAgent edgeResponseStatus }
                sum { edgeResponseBytes }
              }
            }
          }
        }`,
        variables,
      );

      const allowedRows = data?.viewer?.zones?.[0]?.allowed ?? [];
      if (!allowedRows.length) {
        return NextResponse.json({
          totalRequests: 0,
          allowedRequests: 0,
          unsuccessfulRequests: 0,
          topPath: null,
          topPathCount: 0,
          topCrawler: null,
          topCrawlerCount: 0,
          crawlersByOperator: [],
        });
      }

      const totalCount = allowedRows.reduce((s: number, r: { count: number }) => s + r.count, 0);
      let allowedCount = 0;
      const pathCounts = new Map<string, number>();
      const crawlerCounts = new Map<string, number>();

      for (const row of allowedRows) {
        const status = row.dimensions?.edgeResponseStatus ?? 0;
        const isAllowed = status >= 200 && status < 400;
        if (isAllowed) {
          allowedCount += row.count;
          const path = row.dimensions?.clientRequestPath || "/";
          pathCounts.set(path, (pathCounts.get(path) || 0) + row.count);
          const ua = row.dimensions?.userAgent || "Unknown";
          crawlerCounts.set(ua, (crawlerCounts.get(ua) || 0) + row.count);
        }
      }

      const topPathEntry = [...pathCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const topCrawlerEntry = [...crawlerCounts.entries()].sort((a, b) => b[1] - a[1])[0];

      const byOperator = new Map<string, Array<{ name: string; allowed: number }>>();
      for (const [ua, count] of crawlerCounts.entries()) {
        const botName = displayBotName(extractBotName(ua));
        const op = OPERATOR_MAP[botName] || "Other";
        if (!byOperator.has(op)) byOperator.set(op, []);
        byOperator.get(op)!.push({ name: botName, allowed: count });
      }

      const crawlersByOperator = [...byOperator.entries()]
        .map(([op, bots]) => ({
          operator: op,
          bots: bots.sort((a, b) => b.allowed - a.allowed),
          totalAllowed: bots.reduce((s, b) => s + b.allowed, 0),
        }))
        .sort((a, b) => b.totalAllowed - a.totalAllowed)
        .map(({ operator: op, bots }) => ({ operator: op, bots }));

      return NextResponse.json({
        totalRequests: totalCount,
        allowedRequests: allowedCount,
        unsuccessfulRequests: totalCount - allowedCount,
        topPath: topPathEntry?.[0] ?? null,
        topPathCount: topPathEntry?.[1] ?? 0,
        topCrawler: topCrawlerEntry?.[0]
          ? displayBotName(extractBotName(topCrawlerEntry[0]))
          : null,
        topCrawlerCount: topCrawlerEntry?.[1] ?? 0,
        crawlersByOperator,
      });
    }

    if (action === "metrics-timeseries") {
      const variables = {
        zoneTag: zoneId,
        filter: { ...baseFilter, edgeResponseStatus_geq: 200, edgeResponseStatus_lt: 400 },
      };
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 10000) {
                count
                dimensions { datetimeHour userAgent }
                sum { edgeResponseBytes }
              }
            }
          }
        }`,
        variables,
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const byHour = new Map<string, Record<string, number>>();
      const byHourBytes = new Map<string, Record<string, number>>();

      for (const row of rows) {
        const hour = row.dimensions?.datetimeHour || "";
        const bot = displayBotName(extractBotName(row.dimensions?.userAgent || ""));
        const bytes = row.sum?.edgeResponseBytes || 0;
        if (!byHour.has(hour)) {
          byHour.set(hour, {});
          byHourBytes.set(hour, {});
        }
        const h = byHour.get(hour)!;
        const hb = byHourBytes.get(hour)!;
        h[bot] = (h[bot] || 0) + row.count;
        hb[bot] = (hb[bot] || 0) + bytes;
      }

      const series = [...byHour.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([datetimeHour, counts]) => ({ datetimeHour, ...counts }));
      const seriesBytes = [...byHourBytes.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([datetimeHour, counts]) => ({ datetimeHour, ...counts }));

      return NextResponse.json({ series, seriesBytes });
    }

    if (action === "metrics-status") {
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 10000) {
                count
                dimensions { datetimeHour edgeResponseStatus }
              }
            }
          }
        }`,
        { zoneTag: zoneId, filter: { ...baseFilter } },
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const byStatus: Record<string, number> = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
      const byHour: Record<string, Record<string, number>> = {};

      for (const row of rows) {
        const status = row.dimensions?.edgeResponseStatus;
        const bucket =
          status >= 200 && status < 300
            ? "2xx"
            : status >= 300 && status < 400
              ? "3xx"
              : status >= 400 && status < 500
                ? "4xx"
                : "5xx";
        byStatus[bucket] = (byStatus[bucket] || 0) + row.count;
        const hour = row.dimensions?.datetimeHour || "";
        if (!byHour[hour]) byHour[hour] = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
        byHour[hour][bucket] = (byHour[hour][bucket] || 0) + row.count;
      }

      const overTime = Object.entries(byHour)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([datetimeHour, counts]) => ({ datetimeHour, ...counts }));

      return NextResponse.json({ byStatus, overTime });
    }

    if (action === "paths") {
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 5000, orderBy: [count_DESC]) {
                count
                dimensions { clientRequestPath clientRequestHTTPHost }
              }
            }
          }
        }`,
        {
          zoneTag: zoneId,
          filter: { ...baseFilter, edgeResponseStatus_geq: 200, edgeResponseStatus_lt: 400 },
        },
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const items = rows.map(
        (r: {
          count: number;
          dimensions?: { clientRequestPath?: string; clientRequestHTTPHost?: string };
        }) => ({
          path: r.dimensions?.clientRequestPath || "/",
          host: r.dimensions?.clientRequestHTTPHost || "",
          allowedRequests: r.count,
        }),
      );

      return NextResponse.json({ items, total: items.length });
    }

    if (action === "crawlers") {
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 5000) {
                count
                dimensions { userAgent edgeResponseStatus }
                sum { edgeResponseBytes }
              }
            }
          }
        }`,
        { zoneTag: zoneId, filter: { ...baseFilter } },
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const byCrawler = new Map<string, { bytes: number; allowed: number; unsuccessful: number }>();

      for (const row of rows) {
        const ua = row.dimensions?.userAgent || "Unknown";
        const botName = displayBotName(extractBotName(ua));
        const status = row.dimensions?.edgeResponseStatus;
        const allowed = status >= 200 && status < 400;
        if (!byCrawler.has(botName)) {
          byCrawler.set(botName, { bytes: 0, allowed: 0, unsuccessful: 0 });
        }
        const c = byCrawler.get(botName)!;
        c.bytes += row.sum?.edgeResponseBytes || 0;
        if (allowed) c.allowed += row.count;
        else c.unsuccessful += row.count;
      }

      const items = [...byCrawler.entries()]
        .map(([userAgent, stats]) => ({
          userAgent,
          operator: OPERATOR_MAP[userAgent] || "Other",
          category: CATEGORY_MAP[userAgent] || "AI Crawler",
          bytes: stats.bytes,
          allowed: stats.allowed,
          unsuccessful: stats.unsuccessful,
        }))
        .sort((a, b) => b.bytes - a.bytes);

      return NextResponse.json({ items });
    }

    if (action === "robots-availability") {
      const fromMs = new Date(from).getTime();
      const toMs = new Date(to).getTime();
      const rangeMs = Math.min(toMs - fromMs, 23 * 60 * 60 * 1000);
      const clampedFrom = new Date(toMs - rangeMs).toISOString();

      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 5000) {
                count
                dimensions { clientRequestHTTPHost edgeResponseStatus }
              }
            }
          }
        }`,
        {
          zoneTag: zoneId,
          filter: {
            datetime_geq: clampedFrom,
            datetime_leq: to,
            clientRequestPath_like: "%robots.txt%",
          },
        },
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const byHost = new Map<
        string,
        { successful: number; unsuccessful: number; statusCounts: Map<number, number> }
      >();

      for (const row of rows) {
        const hostName = row.dimensions?.clientRequestHTTPHost || "unknown";
        const status = row.dimensions?.edgeResponseStatus ?? 0;
        const ok = status >= 200 && status < 400;
        if (!byHost.has(hostName)) {
          byHost.set(hostName, { successful: 0, unsuccessful: 0, statusCounts: new Map() });
        }
        const h = byHost.get(hostName)!;
        if (ok) h.successful += row.count;
        else h.unsuccessful += row.count;
        h.statusCounts.set(status, (h.statusCounts.get(status) ?? 0) + row.count);
      }

      const items = [...byHost.entries()].map(([hostname, stats]) => ({
        hostname,
        path: `https://${hostname}/robots.txt`,
        successful: stats.successful,
        unsuccessful: stats.unsuccessful,
        status: worstRobotsStatus(stats.statusCounts),
        contentSignals: "Not set",
      }));

      return NextResponse.json({ items });
    }

    if (action === "violations") {
      const data = await queryCloudflare(
        zoneId,
        cloudflareToken,
        `query($zoneTag: string!, $filter: HttpRequestsAdaptiveGroupsFilter_InputObject) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              httpRequestsAdaptiveGroups(filter: $filter, limit: 5000, orderBy: [count_DESC]) {
                count
                dimensions { clientRequestPath clientRequestHTTPHost userAgent edgeResponseStatus }
              }
            }
          }
        }`,
        { zoneTag: zoneId, filter: { ...baseFilter, edgeResponseStatus_geq: 400 } },
      );

      const rows = data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
      const items = rows.map(
        (r: {
          count: number;
          dimensions?: {
            clientRequestPath?: string;
            clientRequestHTTPHost?: string;
            userAgent?: string;
            edgeResponseStatus?: number;
          };
        }) => {
          const ua = r.dimensions?.userAgent || "Unknown";
          const botName = displayBotName(extractBotName(ua));
          return {
            path: r.dimensions?.clientRequestPath || "/",
            host: r.dimensions?.clientRequestHTTPHost || "",
            crawler: botName,
            operator: OPERATOR_MAP[botName] || "Other",
            count: r.count,
            status: r.dimensions?.edgeResponseStatus ?? 0,
          };
        },
      );

      return NextResponse.json({ items });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    console.error("Cloudflare analytics API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
