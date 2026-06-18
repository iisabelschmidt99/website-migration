import {
  REFERENZ_CASE_STUDIES,
  type ReferenzCaseStudy,
} from "@/data/referenz-case-studies";

export type ReferenceStat = {
  value: string;
  label: string;
};

export type ReferenceProject = {
  eyebrow: string;
  heading: string;
  tag: string;
  body: string;
  stats: ReferenceStat[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
};

const HOMEPAGE_REFERENZ_SLUGS = [
  "reneo-group",
  "signal-iduna",
  "the-nunatak-group",
  "universal-studios",
  "the-delta-campus",
] as const;

function caseToReferenceProject(
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
    body: study.intro[study.intro.length - 1] ?? study.intro[0],
    stats: study.heroStats.slice(0, 3),
    href: `/referenzen/${study.slug}`,
    imageSrc: study.heroImageSrc,
    imageAlt: study.heroImageAlt,
    imageLeft,
  };
}

/** Homepage-Referenzprojekte (Inhalte aus Live-Seite / Webflow-Vorlage). */
export const referenceProjects: ReferenceProject[] = HOMEPAGE_REFERENZ_SLUGS.map(
  (slug, index) => {
    const study = REFERENZ_CASE_STUDIES.find((item) => item.slug === slug);
    if (!study) {
      throw new Error(`Referenz-Case-Study fehlt: ${slug}`);
    }
    return caseToReferenceProject(study, index % 2 === 1);
  },
);
