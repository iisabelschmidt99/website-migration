import AdminAnalyticsDashboard from "@/components/admin/analytics/AdminAnalyticsDashboard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const supabase = await createClient();
  const [eventsResult, funnelResult] = await Promise.all([
    supabase
      .schema("analytics")
      .from("website_analytics_events")
      .select(
        "event_type,page_path,page_type,service_area,traffic_source_category,device_type,country_code,region_code,event_data,quality_flags,bot_classification",
      )
      .order("event_ts", { ascending: false })
      .limit(5000),
    supabase
      .schema("analytics")
      .from("lead_funnel_session_data")
      .select(
        "session_hash,status,primary_service_area,traffic_source_category,device_type,country_code,region_code,bot_classification,page_views,cta_clicks,contact_form_views,leads",
      )
      .limit(2000),
  ]);

  const loadError = eventsResult.error?.message ?? funnelResult.error?.message;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Analytics</h1>
      <p className="text-mist text-sm mb-6">
        First-Party-Tracking, Lead-Funnel, Quellen, Länder, Performance und
        Tracking-Health.
      </p>
      {loadError ? (
        <div className="mb-6 border border-system-warning/40 bg-system-warning/10 p-4 text-sm text-white">
          Analytics-Daten konnten nicht geladen werden: {loadError}
        </div>
      ) : null}
      <AdminAnalyticsDashboard
        events={(eventsResult.data ?? []) as never}
        funnel={(funnelResult.data ?? []) as never}
        cruxConfigured={Boolean(process.env.GOOGLE_CWV_API_KEY || process.env.GOOGLE_CRUX_API_KEY)}
        gtmConfigured={Boolean(process.env.NEXT_PUBLIC_GTM_ID && process.env.GTM_SERVICE_ACCOUNT_JSON)}
        cloudflareConfigured={Boolean(process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ZONE_ID)}
      />
    </div>
  );
}
