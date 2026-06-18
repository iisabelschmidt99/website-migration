import caseStudiesRaw from "./referenz-case-studies.generated.json";
import type { ReferenzMapEntry } from "./referenzen-entries";
import type { ReferenceStat } from "@/data/reference-projects";

export type ReferenzCaseHighlight = {
  heading: string;
  body: string;
};

export type ReferenzCaseStudy = {
  slug: string;
  company: string;
  title: string;
  categoryLabel: string;
  city: string;
  year: string;
  meta: { title: string; description: string };
  heroImageSrc: string;
  heroImageAlt: string;
  intro: string[];
  heroStats: ReferenceStat[];
  metaRows: { label: string; value: string }[];
  highlights: ReferenzCaseHighlight[];
  relatedSlugs: string[];
};

/** Nur noch für Fallback ohne Supabase-Konfiguration. */
export const REFERENZ_CASE_STUDIES = caseStudiesRaw as ReferenzCaseStudy[];

/** Verknüpfung Karten-Einträge auf der Referenzen-Übersicht mit Detailseiten. */
export const REFERENZ_ENTRY_SLUGS: Record<string, string> = {
  "bm-1": "internationalesconsultingunternehmen",
  "bm-2": "aufarbeitung-fur-ein-nachhaltiges-arbeitsplatzkonzept",
  "bm-3": "aufbereitung-fur-zwei-europaische-unternehmensstandorte",
  "vw-1": "circular-office-exit-fur-das-berliner-soundcloud-headquarter",
  "vw-2": "continentale",
  "vw-3": "ernst-klett-verlag",
  "vw-4": "nachhaltige-standortauflosung-bei-otto",
  "vw-5": "signal-iduna",
  "vw-6": "tuv-sud",
  "vw-7": "universal-studios",
  "vw-8": "kpmg",
  "vw-9": "unibail-rodamco-westfield",
  "ei-1": "nachhaltige-buroausstattung-im-mietmodell",
  "ei-2": "bildungsanbieter",
  "ei-3": "the-nunatak-group",
  "ei-4": "refurbished-buromoblierung-im-mietmodell",
  "ei-5": "w3-hub-berlin",
  "ei-6": "automobilhersteller",
  "ei-7": "ivy",
  "ei-8": "varm",
  "ei-9": "reneo-group",
  "ei-10": "spacebase",
  "ei-11": "the-delta-campus",
  "ei-12": "kurzfristige-moblierung-fur-dynamisches-wachstum",
  "ei-13": "flexible-buromoblierung-zur-miete",
};

export function referenzEntryHref(entry: Pick<ReferenzMapEntry, "id" | "slug">) {
  if (entry.slug) return `/referenzen/${entry.slug}`;
  const mapped = REFERENZ_ENTRY_SLUGS[entry.id];
  return mapped ? `/referenzen/${mapped}` : undefined;
}
