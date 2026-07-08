// Öffentliche Route: /einrichtung-standorte/<slug>
// Liest die Standort-Landingpage aus Supabase (Tabelle landing_locations,
// collection = 'einrichtung-standorte'). Pfad aus dem CMS-Schema-Markup abgeleitet.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import LocationLandingContent from "@/components/LocationLandingContent";
import { getTestimonials } from "@/lib/testimonials";

export const revalidate = 60;

const COLLECTION = "einrichtung-standorte";

type PageProps = { params: Promise<{ slug: string }> };

type LocationRow = {
  slug: string;
  title: string | null;
  h1: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  section1_html: string | null;
  section2_html: string | null;
  map_embed: string | null;
  schema_markup: string | null;
};

const SELECT =
  "slug,title,h1,hero_image_url,hero_image_alt,meta_title,meta_description,section1_html,section2_html,map_embed,schema_markup";

async function getPage(slug: string): Promise<LocationRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("landing_locations")
      .select(SELECT)
      .eq("collection", COLLECTION)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) return null;
    return (data as LocationRow | null) ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("landing_locations")
      .select("slug")
      .eq("collection", COLLECTION)
      .eq("published", true);
    return (data ?? []).map((r) => ({ slug: r.slug as string }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.meta_title || page.h1 || page.title || undefined,
    description: page.meta_description || undefined,
  };
}

export default async function EinrichtungStandortPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const testimonials = await getTestimonials("bueroeinrichtung");

  return (
    <LocationLandingContent
      h1={page.h1 || page.title || ""}
      subline={page.meta_description}
      heroImageSrc={page.hero_image_url}
      heroImageAlt={page.hero_image_alt}
      section1Html={page.section1_html}
      section2Html={page.section2_html}
      mapEmbed={page.map_embed}
      schemaMarkup={page.schema_markup}
      testimonials={testimonials}
    />
  );
}
