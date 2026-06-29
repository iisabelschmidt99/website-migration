import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { assertAnalyticsApiAuth } from "@/lib/admin/assertAnalyticsApiAuth";

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

export async function GET() {
  const auth = await assertAnalyticsApiAuth();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneTag = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zoneTag) {
    return NextResponse.json({
      configured: false,
      message: "CLOUDFLARE_API_TOKEN oder CLOUDFLARE_ZONE_ID fehlt.",
    });
  }

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

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { zoneTag, since, until } }),
  });

  if (!res.ok) {
    return NextResponse.json({ configured: true, error: await res.text() }, { status: 502 });
  }

  const payload = await res.json();
  const sum = payload.data?.viewer?.zones?.[0]?.httpRequests1dGroups?.[0]?.sum ?? {};
  const requests = sum.requests ?? 0;
  const cached = sum.cachedRequests ?? 0;
  const row = {
    zone_id: zoneTag,
    period_start: since,
    period_end: until,
    requests,
    threats: sum.threats ?? 0,
    bandwidth_bytes: sum.bytes ?? 0,
    cache_ratio: requests ? cached / requests : null,
    raw_payload: payload,
  };

  const { error } = await serviceClient().from("cloudflare_metrics").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, row });
}
