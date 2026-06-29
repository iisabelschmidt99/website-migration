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

  const containerId = process.env.NEXT_PUBLIC_GTM_ID;
  const serviceAccount = process.env.GTM_SERVICE_ACCOUNT_JSON;
  if (!containerId || !serviceAccount) {
    return NextResponse.json({
      configured: false,
      message: "NEXT_PUBLIC_GTM_ID oder GTM_SERVICE_ACCOUNT_JSON fehlt.",
    });
  }

  // Credential-specific GTM API wiring happens once the service account is supplied.
  const row = {
    container_id: containerId,
    status: "pending_credentials_wiring",
    raw_payload: { note: "Service account present; GTM API client wiring pending." },
  };

  const { error } = await serviceClient().from("gtm_health").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, row });
}
