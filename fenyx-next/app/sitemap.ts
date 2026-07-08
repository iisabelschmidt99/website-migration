import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getAllStandortSlugs } from "@/data/bueromoebel-mieten-standorte";

const BASE = "https://www.fenyx-office.com";

// Wichtige statische Seiten (kanonische Pfade).
const STATIC_PATHS = [
  "",
  "/ueber-uns",
  "/referenzen",
  "/ratgeber",
  "/kontakt",
  "/events",
  "/standorte",
  "/presse-medien",
  "/in-house-events",
  "/bestandsmanagement",
  "/bestandsmanagement/digitale-inventarisierung",
  "/bestandsmanagement/projektmanagement",
  "/verwertung/bueroaufloesung",
  "/verwertung/mitarbeiterverkauf",
  "/verwertung/aufbereitung",
  "/verwertung/spende",
  "/einrichtung/bueroeinrichtung",
  "/einrichtung/workspace-analytics",
  "/bueromoebel-mieten",
  "/bueromoebel-ankauf-verkauf",
  "/bueroplanung",
  "/impressum",
  "/datenschutz",
  "/agb",
];

// landing_locations: Collection -> URL-Präfix (kanonisch)
const LOCATION_PREFIX: Record<string, string> = {
  ankauf: "/bueromoebel-ankauf-verkauf",
  "einrichtung-standorte": "/bueroeinrichtung-standort",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls = new Set<string>();

  for (const p of STATIC_PATHS) urls.add(BASE + p);

  // Miet-Stadtseiten (statische Daten)
  try {
    for (const stadt of getAllStandortSlugs()) urls.add(`${BASE}/bueromoebel-mieten/${stadt}`);
  } catch {
    /* ignore */
  }

  // Dynamische CMS-Seiten aus Supabase (nur veröffentlichte)
  try {
    const supabase = createPublicClient();
    const [refs, blog, locations, topics] = await Promise.all([
      supabase.from("references").select("slug").eq("published", true),
      supabase.from("blog_posts").select("slug").eq("published", true),
      supabase.from("landing_locations").select("collection, slug").eq("published", true),
      supabase.from("landing_topics").select("collection, slug").eq("published", true),
    ]);

    for (const r of refs.data ?? []) urls.add(`${BASE}/referenzen/${r.slug}`);
    for (const r of blog.data ?? []) urls.add(`${BASE}/ratgeber/${r.slug}`);
    for (const r of locations.data ?? []) {
      const prefix = LOCATION_PREFIX[r.collection as string];
      if (prefix) urls.add(`${BASE}${prefix}/${r.slug}`);
    }
    for (const r of topics.data ?? []) {
      urls.add(`${BASE}/${r.collection}/${r.slug}`);
    }
  } catch {
    /* ohne Supabase nur die statischen URLs */
  }

  return Array.from(urls).map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: url === BASE ? 1 : 0.7,
  }));
}
