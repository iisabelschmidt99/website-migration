import { createClient } from "@supabase/supabase-js";

type AnalyticsDbClient = ReturnType<typeof createAnalyticsServiceClient>;

type Result = { ok: true; client: AnalyticsDbClient } | { ok: false; status: number; error: string };

function createAnalyticsServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: "analytics" },
  });
}

/** Service-Role-Client für Admin-Analytics-APIs (Schema analytics). */
export function getAnalyticsServiceClient(): Result {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    return {
      ok: false,
      status: 503,
      error: "NEXT_PUBLIC_SUPABASE_URL fehlt in den Server-Env-Variablen.",
    };
  }
  if (!key) {
    return {
      ok: false,
      status: 503,
      error:
        "SUPABASE_SERVICE_ROLE_KEY fehlt in den Netlify-Env-Variablen (Runtime, nicht nur Build). Admin-APIs können keine Snapshots schreiben.",
    };
  }

  return { ok: true, client: createAnalyticsServiceClient() };
}
