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

export async function GET(req: Request) {
  const auth = await assertAnalyticsApiAuth();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const apiKey = process.env.GOOGLE_CWV_API_KEY || process.env.GOOGLE_CRUX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false, message: "GOOGLE_CWV_API_KEY fehlt." });
  }

  const url = new URL(req.url);
  const origin = url.searchParams.get("origin") || "https://www.fenyx-office.com";
  const formFactor = url.searchParams.get("formFactor") || "ALL_FORM_FACTORS";

  const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, formFactor }),
  });

  if (!res.ok) {
    return NextResponse.json({ configured: true, error: await res.text() }, { status: 502 });
  }

  const payload = await res.json();
  const metrics = payload.record?.metrics ?? {};
  const period = payload.record?.collectionPeriod ?? {};
  const row = {
    url: origin,
    form_factor: formFactor,
    lcp_p75: metrics.largest_contentful_paint?.percentiles?.p75 ?? null,
    inp_p75: metrics.interaction_to_next_paint?.percentiles?.p75 ?? null,
    cls_p75: metrics.cumulative_layout_shift?.percentiles?.p75 ?? null,
    ttfb_p75: metrics.experimental_time_to_first_byte?.percentiles?.p75 ?? null,
    fcp_p75: metrics.first_contentful_paint?.percentiles?.p75 ?? null,
    collection_period_start: period.firstDate
      ? `${period.firstDate.year}-${String(period.firstDate.month).padStart(2, "0")}-${String(period.firstDate.day).padStart(2, "0")}`
      : null,
    collection_period_end: period.lastDate
      ? `${period.lastDate.year}-${String(period.lastDate.month).padStart(2, "0")}-${String(period.lastDate.day).padStart(2, "0")}`
      : null,
    raw_payload: payload,
  };

  const { error } = await serviceClient().from("crux_snapshots").upsert(row, {
    onConflict: "url,form_factor,collection_period_end",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, row });
}
