import standorteRaw from "./bueromoebel-mieten-standorte.generated.json";
import { getStandortBySlug } from "./standorte";

export type StandortPageData = {
  slug: string;
  city: string;
  meta: { title: string; description: string };
  heroHeading: string;
  parallaxHeading: string;
  parallaxBody: string;
  section1Heading: string;
  section1Body: string;
  section2Heading: string;
  section2Body: string;
  contactHeading: string;
  contactEmail: string;
  contactName: string;
  contactRole: string;
  contactQuote: string;
};

const CMS = "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f";

export const STANDORT_PAGES = standorteRaw as StandortPageData[];

export function getStandortPage(slug: string): StandortPageData | undefined {
  return STANDORT_PAGES.find((p) => p.slug === slug);
}

export function getAllStandortSlugs() {
  return STANDORT_PAGES.map((p) => p.slug);
}

const DEFAULT_CONTACT_QUOTE =
  "„Ein nachhaltiges Büro beginnt nicht beim Neukauf, sondern bei der Wertschätzung dessen, was man bereits besitzt. Ich helfe Ihnen dabei, Transparenz in Ihren Bestand zu bringen.“";

export function standortContactContent(page: StandortPageData) {
  const standort = getStandortBySlug(page.slug);
  const city = standort?.city ?? page.city;

  return {
    heading:
      page.contactHeading ||
      `Dein Ansprechpartner für unseren Standort in ${city}`,
    email: page.contactEmail || "marius@fenyx-office.com",
    phone: "+49 176 23820424",
    portraitSrc: `${CMS}/6993440dadc6b370203d5c41_698d9039a6c253ec309fc4b4_Marius.avif`,
    portraitAlt: "Bild von Marius Grimm, Einrichtungsberater bei Fenyx Office",
    quote: page.contactQuote || DEFAULT_CONTACT_QUOTE,
    name: page.contactName || "Marius Grimm",
    role: page.contactRole || "Einrichtungsberater",
  };
}

const IMG = "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d7e6";

export const standortSharedImages = {
  parallax: [
    `${IMG}/6988d9ea184c3a10bc10d8c6_Animation-5.webp`,
    `${IMG}/6988d9ea184c3a10bc10d8c5_Animation-4.webp`,
  ],
  section1: `${IMG}/6988d9ea184c3a10bc10d8c3_Animation-2.webp`,
  section2: `${IMG}/6988d9ea184c3a10bc10d8c7_White-Chair-White-Table.webp`,
};
