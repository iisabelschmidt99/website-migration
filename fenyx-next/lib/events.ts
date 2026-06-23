// Öffentliche Event-Daten: liest veröffentlichte Events aus Supabase
// (Tabelle `events`) und fällt ohne Supabase-Konfiguration auf die statischen
// Inhalte aus data/events.ts zurück. Muster wie lib/references.ts.
import { createPublicClient } from "@/lib/supabase/public";
import type { EventItem } from "@/data/events";
import {
  eventsList as STATIC_EVENTS,
  getEvent as getStaticEvent,
  getAllEventSlugs as getStaticEventSlugs,
} from "@/data/events";

type EventRow = {
  slug: string;
  title: string;
  hero_image_url: string | null;
  intro: string | null;
  intro_info: string | null;
  tags: string[] | null;
  event_date: string | null;
  time_label: string | null;
  location: string | null;
  category: string | null;
  h2_paragraph: string | null;
  published: boolean;
};

const EVENT_COLUMNS =
  "slug, title, hero_image_url, intro, intro_info, tags, event_date, time_label, location, category, h2_paragraph, published";

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function formatDateLabel(row: EventRow): string {
  if (!row.event_date) return row.time_label ?? "";
  const date = new Date(row.event_date);
  if (Number.isNaN(date.getTime())) return row.time_label ?? "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapEventRow(row: EventRow): EventItem {
  const tag = capitalize(row.tags?.[0] ?? row.category ?? "");
  const description = row.intro ?? "";
  const paragraphs = [row.intro, row.h2_paragraph].filter(
    (p): p is string => Boolean(p && p.trim()),
  );

  return {
    slug: row.slug,
    href: `/events/${row.slug}`,
    title: row.title,
    dateLabel: formatDateLabel(row),
    description,
    location: row.location ?? "",
    tag,
    imageSrc: row.hero_image_url ?? "",
    meta: {
      title: row.title,
      description: description || row.intro_info || row.title,
    },
    paragraphs,
  };
}

async function fetchPublishedEventRows(): Promise<EventRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("published", true)
    .order("event_date", { ascending: false });

  if (error) {
    throw new Error(`Events aus Supabase laden fehlgeschlagen: ${error.message}`);
  }

  return (data ?? []) as EventRow[];
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (!hasSupabaseConfig()) {
    return STATIC_EVENTS;
  }

  const rows = await fetchPublishedEventRows();
  if (rows.length === 0) return STATIC_EVENTS;
  return rows.map(mapEventRow);
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  if (!hasSupabaseConfig()) {
    return getStaticEvent(slug) ?? null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Event „${slug}“ laden fehlgeschlagen: ${error.message}`);
  }

  return data ? mapEventRow(data as EventRow) : null;
}

export async function getAllEventSlugs(): Promise<string[]> {
  if (!hasSupabaseConfig()) {
    return getStaticEventSlugs();
  }

  const events = await getAllEvents();
  return events.map((event) => event.slug);
}
