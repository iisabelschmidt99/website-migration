import { createPublicClient } from "@/lib/supabase/public";
import caseStudiesRaw from "@/data/referenz-case-studies.generated.json";
import type { ReferenzCaseStudy } from "@/data/referenz-case-studies";
import {
  REFERENZEN_MAP_ENTRIES,
  REFERENZEN_PARTNER_ENTRIES,
  type ReferenzCategory,
  type ReferenzMapEntry,
} from "@/data/referenzen-entries";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferenceRow = {
  slug: string;
  company: string;
  title: string;
  category_label: string | null;
  city: string | null;
  year: string | null;
  meta_title: string | null;
  meta_description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  intro: string[] | null;
  hero_stats: { value: string; label: string }[] | null;
  meta_rows: { label: string; value: string }[] | null;
  highlights: { heading: string; body: string }[] | null;
  related_slugs: string[] | null;
  published: boolean;
  sort_order: number;
};

const STATIC_REFERENZ_CASE_STUDIES = caseStudiesRaw as ReferenzCaseStudy[];

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function mapReferenceRow(row: ReferenceRow): ReferenzCaseStudy {
  return {
    slug: row.slug,
    company: row.company,
    title: row.title,
    categoryLabel: row.category_label ?? "",
    city: row.city ?? "",
    year: row.year ?? "",
    meta: {
      title: row.meta_title ?? row.title,
      description: row.meta_description ?? "",
    },
    heroImageSrc: row.hero_image_url ?? "",
    heroImageAlt: row.hero_image_alt ?? row.title,
    intro: row.intro ?? [],
    heroStats: row.hero_stats ?? [],
    metaRows: row.meta_rows ?? [],
    highlights: row.highlights ?? [],
    relatedSlugs: row.related_slugs ?? [],
  };
}

async function fetchPublishedReferenceRows(): Promise<ReferenceRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("references")
    .select(
      "slug, company, title, category_label, city, year, meta_title, meta_description, hero_image_url, hero_image_alt, intro, hero_stats, meta_rows, highlights, related_slugs, published, sort_order",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Referenzen aus Supabase laden fehlgeschlagen: ${error.message}`);
  }

  return (data ?? []) as ReferenceRow[];
}

export async function getPublishedReferenzCaseStudies(): Promise<ReferenzCaseStudy[]> {
  if (!hasSupabaseConfig()) {
    return STATIC_REFERENZ_CASE_STUDIES;
  }

  const rows = await fetchPublishedReferenceRows();
  return rows.map(mapReferenceRow);
}

export async function getReferenzCaseStudy(
  slug: string,
): Promise<ReferenzCaseStudy | null> {
  if (!hasSupabaseConfig()) {
    return STATIC_REFERENZ_CASE_STUDIES.find((study) => study.slug === slug) ?? null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("references")
    .select(
      "slug, company, title, category_label, city, year, meta_title, meta_description, hero_image_url, hero_image_alt, intro, hero_stats, meta_rows, highlights, related_slugs, published, sort_order",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Referenz „${slug}“ laden fehlgeschlagen: ${error.message}`);
  }

  return data ? mapReferenceRow(data as ReferenceRow) : null;
}

export async function getAllReferenzCaseSlugs(): Promise<string[]> {
  const studies = await getPublishedReferenzCaseStudies();
  return studies.map((study) => study.slug);
}

export async function getReferenzCaseStudiesBySlugs(
  slugs: string[],
): Promise<ReferenzCaseStudy[]> {
  if (slugs.length === 0) return [];

  if (!hasSupabaseConfig()) {
    return slugs
      .map((slug) => STATIC_REFERENZ_CASE_STUDIES.find((study) => study.slug === slug))
      .filter((study): study is ReferenzCaseStudy => Boolean(study));
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("references")
    .select(
      "slug, company, title, category_label, city, year, meta_title, meta_description, hero_image_url, hero_image_alt, intro, hero_stats, meta_rows, highlights, related_slugs, published, sort_order",
    )
    .in("slug", slugs)
    .eq("published", true);

  if (error) {
    throw new Error(`Verwandte Referenzen laden fehlgeschlagen: ${error.message}`);
  }

  const bySlug = new Map(
    ((data ?? []) as ReferenceRow[]).map((row) => [row.slug, mapReferenceRow(row)]),
  );

  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((study): study is ReferenzCaseStudy => Boolean(study));
}

const HOMEPAGE_REFERENZ_SLUGS = [
  "reneo-group",
  "signal-iduna",
  "the-nunatak-group",
  "universal-studios",
  "the-delta-campus",
] as const;

function mapCategoryLabel(
  label: string,
): Exclude<ReferenzCategory, "partner"> {
  const normalized = label.toLowerCase();
  if (
    normalized.includes("inventaris") ||
    normalized.includes("aufbereitung") ||
    normalized.includes("bestands")
  ) {
    return "bestandsmanagement";
  }
  if (
    normalized.includes("verwertung") ||
    normalized.includes("mitarbeiter") ||
    normalized.includes("spende") ||
    normalized.includes("exit") ||
    normalized.includes("circular") ||
    normalized.includes("auflösung") ||
    normalized.includes("auflosung")
  ) {
    return "verwertung";
  }
  return "einrichtung";
}

function caseStudyToMapEntry(study: ReferenzCaseStudy): ReferenzMapEntry {
  return {
    id: study.slug,
    slug: study.slug,
    type: "project",
    category: mapCategoryLabel(study.categoryLabel),
    company: study.company,
    title: study.title,
    city: study.city || "Deutschland",
    imageSrc: study.heroImageSrc || undefined,
  };
}

export async function getReferenzenMapEntries(): Promise<ReferenzMapEntry[]> {
  if (!hasSupabaseConfig()) {
    return REFERENZEN_MAP_ENTRIES;
  }

  const studies = await getPublishedReferenzCaseStudies();
  return [
    ...studies.map(caseStudyToMapEntry),
    ...REFERENZEN_PARTNER_ENTRIES,
  ];
}

function caseStudyToReferenceProject(
  study: ReferenzCaseStudy,
  imageLeft = false,
): ReferenceProject {
  return {
    eyebrow: study.categoryLabel,
    heading: study.company,
    tag:
      study.categoryLabel.includes("Verwertung") ||
      study.categoryLabel.includes("Mitarbeiter")
        ? "Ganzheitliche Verwertung"
        : "Schlüsselfertige Einrichtung",
    body: study.intro[study.intro.length - 1] ?? study.intro[0] ?? "",
    stats: study.heroStats.slice(0, 3),
    href: `/referenzen/${study.slug}`,
    imageSrc: study.heroImageSrc,
    imageAlt: study.heroImageAlt,
    imageLeft,
  };
}

export async function getHomepageReferenceProjects(): Promise<ReferenceProject[]> {
  const studies = await getReferenzCaseStudiesBySlugs([...HOMEPAGE_REFERENZ_SLUGS]);
  const bySlug = new Map(studies.map((study) => [study.slug, study]));

  return HOMEPAGE_REFERENZ_SLUGS.map((slug, index) => {
    const study = bySlug.get(slug);
    if (!study) {
      throw new Error(`Referenz-Case-Study fehlt: ${slug}`);
    }
    return caseStudyToReferenceProject(study, index % 2 === 1);
  });
}
