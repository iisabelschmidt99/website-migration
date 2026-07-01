import { NextResponse } from "next/server";
import { assertAnalyticsApiAuth } from "@/lib/admin/assertAnalyticsApiAuth";
import { getAnalyticsServiceClient } from "@/lib/admin/analyticsServiceClient";

export const runtime = "nodejs";

export async function GET() {
  try {
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

    const row = {
      container_id: containerId,
      status: "pending_credentials_wiring",
      raw_payload: { note: "Service account present; GTM API client wiring pending." },
    };

    const db = getAnalyticsServiceClient();
    if (!db.ok) {
      return NextResponse.json({ configured: true, row, persistWarning: db.error }, { status: db.status });
    }

    const { error } = await db.client.from("gtm_health").insert(row);
    if (error) {
      return NextResponse.json(
        { configured: true, row, persistWarning: error.message },
        { status: 200 },
      );
    }

    return NextResponse.json({ configured: true, row });
  } catch (err) {
    console.error("GTM health API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
