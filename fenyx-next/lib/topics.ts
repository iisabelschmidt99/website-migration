// Öffentliche Datenanbindung für die Themen-Landingpages (Tabelle landing_topics).
import { createPublicClient } from "@/lib/supabase/public";
import type { FaqItem } from "@/components/FaqSection";

export type TopicRow = {
  slug: string;
  title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  main_image_url: string | null;
  main_image_alt: string | null;
  post_summary: string | null;
  author: string | null;
  body_html: string | null;
  faq_title: string | null;
  faq_description: string | null;
  faq: FaqItem[] | null;
  schema_markup: string | null;
};

const SELECT =
  "slug,title,meta_title,meta_description,main_image_url,main_image_alt,post_summary,author,body_html,faq_title,faq_description,faq,schema_markup";

export async function getTopicPage(
  collection: string,
  slug: string,
): Promise<TopicRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("landing_topics")
      .select(SELECT)
      .eq("collection", collection)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) return null;
    return (data as TopicRow | null) ?? null;
  } catch {
    return null;
  }
}

export async function getTopicSlugs(collection: string): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("landing_topics")
      .select("slug")
      .eq("collection", collection)
      .eq("published", true);
    return (data ?? []).map((r) => r.slug as string);
  } catch {
    return [];
  }
}
