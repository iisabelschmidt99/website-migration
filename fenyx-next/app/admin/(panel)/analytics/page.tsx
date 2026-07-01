import { Suspense } from "react";
import AnalyticsHub from "@/components/admin/analytics/AnalyticsHub";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const supabase = await createClient();
  const [eventsResult, funnelResult, journeysResult] = await Promise.all([
    supabase
      .schema("analytics")
      .from("website_analytics_events")
      .select(
        "session_hash,event_ts,event_type,page_path,page_type,service_area,traffic_source_category,device_type,country_code,region_code,event_data,quality_flags,bot_classification",
      )
      .order("event_ts", { ascending: false })
      .limit(8000),
    supabase
      .schema("analytics")
      .from("lead_funnel_session_data")
      .select(
        "session_hash,status,primary_service_area,traffic_source_category,device_type,country_code,region_code,bot_classification,page_views,cta_clicks,contact_form_views,leads",
      )
      .order("updated_at", { ascending: false })
      .limit(3000),
    supabase
      .schema("analytics")
      .from("website_journey_sessions")
      .select(
        "session_hash,landing_page,landing_time,original_referrer,utm_source,utm_medium,utm_campaign,gclid,fbclid,traffic_source_category,device_type,country_code,region_code,region,bot_classification,verified_bot,page_history,web_vitals,reached_lead,lead_surface,lead_service_area,consent_analytics,consent_marketing,edge_colo,edge_asn,updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(5000),
  ]);

  const loadError =
    eventsResult.error?.message ?? funnelResult.error?.message ?? journeysResult.error?.message;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Analytics</h1>
      <p className="text-mist text-sm mb-6">
        First-Party (System A), Third-Party (GTM/GA4) und Cloudflare — Lumeus-Parity Dashboard.
      </p>
      {loadError ? (
        <div className="mb-6 border border-system-warning/40 bg-system-warning/10 p-4 text-sm text-white">
          Analytics-Daten konnten nicht geladen werden: {loadError}
        </div>
      ) : null}
      <Suspense fallback={<p className="text-mist text-sm">Dashboard lädt…</p>}>
        <AnalyticsHub
          events={(eventsResult.data ?? []) as never}
          journeys={(journeysResult.data ?? []) as never}
          funnel={(funnelResult.data ?? []) as never}
          cruxConfigured={Boolean(process.env.GOOGLE_CWV_API_KEY || process.env.GOOGLE_CRUX_API_KEY)}
          gtmConfigured={Boolean(process.env.NEXT_PUBLIC_GTM_ID)}
          cloudflareConfigured={Boolean(process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ZONE_ID)}
        />
      </Suspense>
    </div>
  );
}
