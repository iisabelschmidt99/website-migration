import pagesRaw from "./fenyx-fuer-sie.generated.json";

export type AudienceCard = {
  title: string;
  body: string;
};

export type AudiencePage = {
  meta: { title: string; description: string };
  hero: {
    heading: string;
    description: string;
    bullets: string[];
    imageSrc: string;
    ctaLabel: string;
  };
  cards: AudienceCard[];
  cta: { heading: string; body: string };
};

export const AUDIENCE_SLUGS = [
  "grossunternehmen",
  "mittelstand",
  "start-up-scale-up",
  "co-working-space",
] as const;

export type AudienceSlug = (typeof AUDIENCE_SLUGS)[number];

const pages = pagesRaw as Record<AudienceSlug, AudiencePage>;

export function getAudiencePage(slug: string) {
  if (!AUDIENCE_SLUGS.includes(slug as AudienceSlug)) return undefined;
  return pages[slug as AudienceSlug];
}
