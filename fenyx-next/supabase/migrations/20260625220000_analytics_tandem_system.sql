-- ============================================================================
-- Fenyx Analytics Tandem-System
-- ----------------------------------------------------------------------------
-- System A: cookieless first-party analytics (direct DB ingress)
-- System B: consent-gated GTM health / vendor tracking prep
-- ============================================================================

create schema if not exists analytics;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'analytics_ingress') then
    create role analytics_ingress nologin;
  end if;
end $$;

grant usage on schema analytics to authenticated, service_role, analytics_ingress;
grant analytics_ingress to authenticator;
alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, analytics';

create table if not exists analytics.website_analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_hash text not null,
  page_visit_id text,
  event_type text not null check (
    event_type in (
      'page_view',
      'scroll_depth',
      'time_on_page',
      'cta_click',
      'contact_form_view',
      'generate_lead',
      'phone_click',
      'email_click',
      'outbound_click',
      'video_start',
      'faq_open',
      'tool_use',
      'location_select',
      'select_item',
      'view_item_list',
      'rage_click',
      'web_vital',
      'consent_update',
      'gtm_loaded'
    )
  ),
  page_path text not null,
  page_title text,
  page_type text,
  service_area text,
  audience text,
  city text,
  contact_person text,
  element_id text,
  event_data jsonb not null default '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  referrer_host text,
  original_referrer text,
  traffic_source_category text,
  device_type text not null default 'unknown' check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  quality_flags jsonb not null default '{}'::jsonb,
  country_code varchar(2),
  country_source text,
  region_code text,
  region text,
  visitor_type text,
  verified_bot boolean,
  verified_bot_category text,
  bot_classification text check (
    bot_classification is null or bot_classification in ('human', 'verified_bot', 'suspected_bot', 'synthetic_monitoring', 'unknown')
  ),
  edge_colo text,
  edge_asn integer,
  edge_ray text,
  http_protocol text,
  tls_version text,
  user_agent text,
  event_ts timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists website_analytics_events_session_idx
  on analytics.website_analytics_events (session_hash);
create index if not exists website_analytics_events_event_ts_idx
  on analytics.website_analytics_events (event_ts desc);
create index if not exists website_analytics_events_page_idx
  on analytics.website_analytics_events (page_path, page_type);
create index if not exists website_analytics_events_type_idx
  on analytics.website_analytics_events (event_type);
create index if not exists website_analytics_events_country_idx
  on analytics.website_analytics_events (country_code, region_code);

create table if not exists analytics.website_journey_sessions (
  id uuid primary key default gen_random_uuid(),
  session_hash text not null unique,
  landing_page text,
  landing_time timestamptz,
  original_referrer text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  traffic_source_category text,
  device_type text,
  country_code varchar(2),
  country_source text,
  region_code text,
  region text,
  visitor_type text,
  verified_bot boolean,
  verified_bot_category text,
  bot_classification text,
  edge_colo text,
  edge_asn integer,
  user_agent text,
  page_history jsonb not null default '[]'::jsonb,
  web_vitals jsonb not null default '[]'::jsonb,
  outbound_clicks jsonb not null default '[]'::jsonb,
  reached_lead boolean not null default false,
  lead_type text,
  lead_surface text,
  lead_service_area text,
  contact_person text,
  consent_analytics boolean,
  consent_marketing boolean,
  consent_preferences boolean,
  consent_version text,
  consent_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists website_journey_sessions_updated_idx
  on analytics.website_journey_sessions (updated_at desc);
create index if not exists website_journey_sessions_source_idx
  on analytics.website_journey_sessions (traffic_source_category);

create table if not exists analytics.lead_funnel_session_data (
  session_hash text primary key references analytics.website_journey_sessions (session_hash) on delete cascade,
  landing_page text,
  primary_service_area text,
  traffic_source_category text,
  device_type text,
  country_code varchar(2),
  region_code text,
  bot_classification text,
  page_views integer not null default 0,
  cta_clicks integer not null default 0,
  contact_form_views integer not null default 0,
  leads integer not null default 0,
  has_engagement boolean not null default false,
  has_contact_view boolean not null default false,
  has_lead boolean not null default false,
  status text not null default 'bounced' check (status in ('bounced', 'engaged', 'intent', 'lead')),
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists analytics.crux_snapshots (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  form_factor text not null default 'ALL_FORM_FACTORS',
  lcp_p75 numeric,
  inp_p75 numeric,
  cls_p75 numeric,
  ttfb_p75 numeric,
  fcp_p75 numeric,
  collection_period_start date,
  collection_period_end date,
  raw_payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  unique (url, form_factor, collection_period_end)
);

create table if not exists analytics.gtm_health (
  id uuid primary key default gen_random_uuid(),
  container_id text,
  container_name text,
  version text,
  tag_count integer,
  trigger_count integer,
  variable_count integer,
  status text not null default 'unknown',
  consent_grant_rate numeric,
  client_loaded_count integer,
  raw_payload jsonb not null default '{}'::jsonb,
  checked_at timestamptz not null default now()
);

create table if not exists analytics.cloudflare_metrics (
  id uuid primary key default gen_random_uuid(),
  zone_id text,
  period_start timestamptz,
  period_end timestamptz,
  requests bigint,
  bot_requests bigint,
  verified_bot_requests bigint,
  threats bigint,
  cache_ratio numeric,
  bandwidth_bytes bigint,
  top_paths jsonb not null default '[]'::jsonb,
  top_crawlers jsonb not null default '[]'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now()
);

create or replace function analytics.safe_bool(val text)
returns boolean
language sql
immutable
as $$
  select case
    when val is null or btrim(val) = '' then null
    when lower(btrim(val)) in ('true', 't', '1', 'yes', 'on') then true
    when lower(btrim(val)) in ('false', 'f', '0', 'no', 'off') then false
    else null
  end;
$$;

create or replace function analytics.safe_int(val text)
returns integer
language plpgsql
immutable
as $$
begin
  if val is null or btrim(val) = '' then
    return null;
  end if;
  return btrim(val)::integer;
exception
  when others then
    return null;
end;
$$;

create or replace function analytics.safe_timestamptz(val text)
returns timestamptz
language plpgsql
immutable
as $$
begin
  if val is null or btrim(val) = '' then
    return null;
  end if;
  return btrim(val)::timestamptz;
exception
  when others then
    return null;
end;
$$;

create or replace function analytics.project_website_event()
returns trigger
language plpgsql
security definer
set search_path = analytics, public
as $$
declare
  current_history jsonb;
  page_entry jsonb;
  lead_data jsonb;
  funnel_status text;
begin
  select js.page_history into current_history
  from analytics.website_journey_sessions js
  where js.session_hash = new.session_hash;

  if new.event_type = 'page_view' then
    page_entry := jsonb_build_object(
      'path', new.page_path,
      'title', new.page_title,
      'page_type', new.page_type,
      'service_area', new.service_area,
      'timestamp', new.event_ts
    );
    current_history := coalesce(current_history, '[]'::jsonb) || jsonb_build_array(page_entry);
  else
    current_history := coalesce(current_history, '[]'::jsonb);
  end if;

  if new.event_type = 'generate_lead' then
    lead_data := new.event_data;
  else
    lead_data := '{}'::jsonb;
  end if;

  insert into analytics.website_journey_sessions (
    session_hash,
    landing_page,
    landing_time,
    original_referrer,
    referrer_host,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    traffic_source_category,
    device_type,
    country_code,
    country_source,
    region_code,
    region,
    visitor_type,
    verified_bot,
    verified_bot_category,
    bot_classification,
    edge_colo,
    edge_asn,
    user_agent,
    page_history,
    web_vitals,
    outbound_clicks,
    reached_lead,
    lead_type,
    lead_surface,
    lead_service_area,
    contact_person,
    consent_analytics,
    consent_marketing,
    consent_preferences,
    consent_version,
    consent_updated_at
  )
  values (
    new.session_hash,
    case when new.event_type = 'page_view' then new.page_path else null end,
    case when new.event_type = 'page_view' then new.event_ts else null end,
    new.original_referrer,
    new.referrer_host,
    new.utm_source,
    new.utm_medium,
    new.utm_campaign,
    new.utm_content,
    new.utm_term,
    new.gclid,
    new.fbclid,
    new.traffic_source_category,
    new.device_type,
    new.country_code,
    new.country_source,
    new.region_code,
    new.region,
    new.visitor_type,
    new.verified_bot,
    new.verified_bot_category,
    new.bot_classification,
    new.edge_colo,
    new.edge_asn,
    new.user_agent,
    current_history,
    case when new.event_type = 'web_vital' then jsonb_build_array(new.event_data) else '[]'::jsonb end,
    case when new.event_type = 'outbound_click' then jsonb_build_array(new.event_data) else '[]'::jsonb end,
    new.event_type = 'generate_lead',
    lead_data ->> 'lead_type',
    lead_data ->> 'lead_surface',
    coalesce(new.service_area, lead_data ->> 'service_area'),
    coalesce(new.contact_person, lead_data ->> 'contact_person'),
    (analytics.safe_bool(new.event_data ->> 'consent_analytics')),
    (analytics.safe_bool(new.event_data ->> 'consent_marketing')),
    (analytics.safe_bool(new.event_data ->> 'consent_preferences')),
    new.event_data ->> 'consent_version',
    analytics.safe_timestamptz(new.event_data ->> 'consent_updated_at')
  )
  on conflict (session_hash) do update set
    page_history = current_history,
    landing_page = coalesce(
      analytics.website_journey_sessions.landing_page,
      case when new.event_type = 'page_view' then new.page_path else null end
    ),
    landing_time = coalesce(
      analytics.website_journey_sessions.landing_time,
      case when new.event_type = 'page_view' then new.event_ts else null end
    ),
    web_vitals = case
      when new.event_type = 'web_vital' then analytics.website_journey_sessions.web_vitals || jsonb_build_array(new.event_data)
      else analytics.website_journey_sessions.web_vitals
    end,
    outbound_clicks = case
      when new.event_type = 'outbound_click' then analytics.website_journey_sessions.outbound_clicks || jsonb_build_array(new.event_data)
      else analytics.website_journey_sessions.outbound_clicks
    end,
    reached_lead = analytics.website_journey_sessions.reached_lead or new.event_type = 'generate_lead',
    lead_type = coalesce(analytics.website_journey_sessions.lead_type, lead_data ->> 'lead_type'),
    lead_surface = coalesce(analytics.website_journey_sessions.lead_surface, lead_data ->> 'lead_surface'),
    lead_service_area = coalesce(analytics.website_journey_sessions.lead_service_area, new.service_area, lead_data ->> 'service_area'),
    contact_person = coalesce(analytics.website_journey_sessions.contact_person, new.contact_person, lead_data ->> 'contact_person'),
    traffic_source_category = coalesce(analytics.website_journey_sessions.traffic_source_category, new.traffic_source_category),
    country_code = coalesce(analytics.website_journey_sessions.country_code, new.country_code),
    region_code = coalesce(analytics.website_journey_sessions.region_code, new.region_code),
    region = coalesce(analytics.website_journey_sessions.region, new.region),
    device_type = coalesce(analytics.website_journey_sessions.device_type, new.device_type),
    bot_classification = coalesce(analytics.website_journey_sessions.bot_classification, new.bot_classification),
    updated_at = now();

  select case
    when count(*) filter (where event_type = 'generate_lead') > 0 then 'lead'
    when count(*) filter (where event_type = 'contact_form_view') > 0 then 'intent'
    when count(*) filter (
      where event_type in ('cta_click', 'tool_use', 'select_item')
         or (event_type = 'scroll_depth' and coalesce(analytics.safe_int(event_data ->> 'percent'), 0) >= 50)
         or (event_type = 'time_on_page' and coalesce(analytics.safe_int(event_data ->> 'seconds'), 0) >= 30)
    ) > 0 then 'engaged'
    else 'bounced'
  end
  into funnel_status
  from analytics.website_analytics_events e
  where e.session_hash = new.session_hash;

  insert into analytics.lead_funnel_session_data (
    session_hash,
    landing_page,
    primary_service_area,
    traffic_source_category,
    device_type,
    country_code,
    region_code,
    bot_classification,
    page_views,
    cta_clicks,
    contact_form_views,
    leads,
    has_engagement,
    has_contact_view,
    has_lead,
    status,
    first_seen_at,
    last_seen_at
  )
  select
    new.session_hash,
    min(e.page_path) filter (where e.event_type = 'page_view'),
    coalesce(max(e.service_area) filter (where e.service_area is not null), new.service_area),
    max(e.traffic_source_category),
    max(e.device_type),
    max(e.country_code),
    max(e.region_code),
    max(e.bot_classification),
    count(*) filter (where e.event_type = 'page_view')::int,
    count(*) filter (where e.event_type = 'cta_click')::int,
    count(*) filter (where e.event_type = 'contact_form_view')::int,
    count(*) filter (where e.event_type = 'generate_lead')::int,
    funnel_status in ('engaged', 'intent', 'lead'),
    funnel_status in ('intent', 'lead'),
    funnel_status = 'lead',
    funnel_status,
    min(e.event_ts),
    max(e.event_ts)
  from analytics.website_analytics_events e
  where e.session_hash = new.session_hash
  on conflict (session_hash) do update set
    primary_service_area = excluded.primary_service_area,
    traffic_source_category = excluded.traffic_source_category,
    device_type = excluded.device_type,
    country_code = excluded.country_code,
    region_code = excluded.region_code,
    bot_classification = excluded.bot_classification,
    page_views = excluded.page_views,
    cta_clicks = excluded.cta_clicks,
    contact_form_views = excluded.contact_form_views,
    leads = excluded.leads,
    has_engagement = excluded.has_engagement,
    has_contact_view = excluded.has_contact_view,
    has_lead = excluded.has_lead,
    status = excluded.status,
    last_seen_at = excluded.last_seen_at,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_project_website_event on analytics.website_analytics_events;
create trigger trg_project_website_event
  after insert on analytics.website_analytics_events
  for each row execute function analytics.project_website_event();

create materialized view if not exists analytics.website_session_attribution as
select
  js.session_hash,
  js.landing_page,
  js.landing_time,
  js.traffic_source_category,
  js.utm_source,
  js.utm_medium,
  js.utm_campaign,
  js.referrer_host,
  js.device_type,
  js.country_code,
  js.region_code,
  js.region,
  js.bot_classification,
  js.verified_bot,
  lf.primary_service_area,
  lf.page_views,
  lf.cta_clicks,
  lf.contact_form_views,
  lf.leads,
  lf.status,
  lf.has_lead,
  js.updated_at
from analytics.website_journey_sessions js
left join analytics.lead_funnel_session_data lf on lf.session_hash = js.session_hash
where coalesce(js.verified_bot, false) = false
  and coalesce(js.bot_classification, 'human') <> 'verified_bot';

create unique index if not exists website_session_attribution_session_idx
  on analytics.website_session_attribution (session_hash);
create index if not exists website_session_attribution_country_idx
  on analytics.website_session_attribution (country_code, region_code);

alter table analytics.website_analytics_events enable row level security;
alter table analytics.website_journey_sessions enable row level security;
alter table analytics.lead_funnel_session_data enable row level security;
alter table analytics.crux_snapshots enable row level security;
alter table analytics.gtm_health enable row level security;
alter table analytics.cloudflare_metrics enable row level security;

drop policy if exists "analytics events: admin select" on analytics.website_analytics_events;
create policy "analytics events: admin select" on analytics.website_analytics_events
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "analytics events: ingress insert" on analytics.website_analytics_events;
create policy "analytics events: ingress insert" on analytics.website_analytics_events
  for insert to analytics_ingress with check (true);

drop policy if exists "analytics events: service insert" on analytics.website_analytics_events;
create policy "analytics events: service insert" on analytics.website_analytics_events
  for insert to service_role with check (true);

drop policy if exists "journeys: admin select" on analytics.website_journey_sessions;
create policy "journeys: admin select" on analytics.website_journey_sessions
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "lead funnel: admin select" on analytics.lead_funnel_session_data;
create policy "lead funnel: admin select" on analytics.lead_funnel_session_data
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "crux: admin select" on analytics.crux_snapshots;
create policy "crux: admin select" on analytics.crux_snapshots
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "crux: service write" on analytics.crux_snapshots;
create policy "crux: service write" on analytics.crux_snapshots
  for all using (current_user = 'service_role') with check (current_user = 'service_role');

drop policy if exists "gtm health: admin select" on analytics.gtm_health;
create policy "gtm health: admin select" on analytics.gtm_health
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "gtm health: service write" on analytics.gtm_health;
create policy "gtm health: service write" on analytics.gtm_health
  for all using (current_user = 'service_role') with check (current_user = 'service_role');

drop policy if exists "cloudflare metrics: admin select" on analytics.cloudflare_metrics;
create policy "cloudflare metrics: admin select" on analytics.cloudflare_metrics
  for select using (public.has_admin_permission(auth.uid(), 'feature.analytics'));

drop policy if exists "cloudflare metrics: service write" on analytics.cloudflare_metrics;
create policy "cloudflare metrics: service write" on analytics.cloudflare_metrics
  for all using (current_user = 'service_role') with check (current_user = 'service_role');

grant insert on analytics.website_analytics_events to analytics_ingress;
revoke all on all tables in schema analytics from authenticated;
grant select on analytics.website_analytics_events to authenticated;
grant select on analytics.website_journey_sessions to authenticated;
grant select on analytics.lead_funnel_session_data to authenticated;
grant select on analytics.crux_snapshots to authenticated;
grant select on analytics.gtm_health to authenticated;
grant select on analytics.cloudflare_metrics to authenticated;
grant all on all tables in schema analytics to service_role;
grant usage, select on all sequences in schema analytics to service_role;

create or replace function analytics.refresh_session_attribution()
returns void
language sql
security definer
set search_path = analytics, public
as $$
  refresh materialized view concurrently analytics.website_session_attribution;
$$;

revoke all on function analytics.refresh_session_attribution() from public;
grant execute on function analytics.refresh_session_attribution() to service_role;

revoke all on analytics.website_session_attribution from public, anon, authenticated;
grant select on analytics.website_session_attribution to service_role;

comment on schema analytics is 'Cookieless first-party analytics + consent-gated tracking health for Fenyx.';
comment on table analytics.website_analytics_events is 'Raw cookieless website events, including RUM web_vital events.';
comment on materialized view analytics.website_session_attribution is 'Session attribution view for dashboards and geo maps.';

notify pgrst, 'reload config';
notify pgrst, 'reload schema';
