// Öffentliche Kundenstimmen: liest veröffentlichte Testimonials aus Supabase
// (Tabelle `testimonials`). Es gibt keinen statischen Fallback-Datensatz –
// ohne Supabase-Konfiguration wird ein leeres Array geliefert (die Sektion
// rendert dann nichts). Muster wie lib/references.ts.
import { createPublicClient } from "@/lib/supabase/public";

export type Testimonial = {
  slug: string;
  name: string;
  roleCompany: string;
  quote: string; // enthält HTML (<p>…</p>)
  categories: string[];
  imageSrc: string;
  imageAlt: string;
  logoSrc: string;
};

type TestimonialRow = {
  slug: string;
  name: string;
  role_company: string | null;
  quote: string | null;
  categories: string[] | null;
  image_url: string | null;
  image_alt: string | null;
  logo_url: string | null;
  sort_order: number;
  published: boolean;
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function mapTestimonialRow(row: TestimonialRow): Testimonial {
  return {
    slug: row.slug,
    name: row.name,
    roleCompany: row.role_company ?? "",
    quote: row.quote ?? "",
    categories: row.categories ?? [],
    imageSrc: row.image_url ?? "",
    imageAlt: row.image_alt ?? row.name,
    logoSrc: row.logo_url ?? "",
  };
}

async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "slug, name, role_company, quote, categories, image_url, image_alt, logo_url, sort_order, published",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Kundenstimmen aus Supabase laden fehlgeschlagen: ${error.message}`);
  }

  return ((data ?? []) as TestimonialRow[]).map(mapTestimonialRow);
}

/**
 * Liefert veröffentlichte Kundenstimmen, optional nach Kategorie gefiltert.
 * Findet eine Kategorie keine (oder zu wenige) Treffer, werden alle
 * veröffentlichten Stimmen zurückgegeben, damit die Sektion nie leer wirkt.
 */
export async function getTestimonials(category?: string): Promise<Testimonial[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const all = await fetchPublishedTestimonials();
  if (!category) return all;

  const filtered = all.filter((t) => t.categories.includes(category));
  return filtered.length > 0 ? filtered : all;
}
