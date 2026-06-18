import standorteRaw from "./bueroeinrichtung-standorte.generated.json";
import { getStandortBySlug } from "./standorte";

export type BueroeinrichtungStandortData = {
  slug: string;
  meta: { title: string; description: string };
  heroHeading: string;
  heroSubline: string;
  citySections: { heading: string; body: string }[];
};

export const BUEROEINRICHTUNG_STANDORTE =
  standorteRaw as BueroeinrichtungStandortData[];

export function getBueroeinrichtungStandort(slug: string) {
  return BUEROEINRICHTUNG_STANDORTE.find((page) => page.slug === slug);
}

export function getAllBueroeinrichtungStandortSlugs() {
  return BUEROEINRICHTUNG_STANDORTE.map((page) => page.slug);
}

const DEFAULT_QUOTE =
  "„Ein nachhaltiges Büro beginnt nicht beim Neukauf, sondern bei der Wertschätzung dessen, was man bereits besitzt.";

export function standortEinrichtungContact(slug: string) {
  const standort = getStandortBySlug(slug);
  const city = standort?.city ?? slug;

  return {
    heading: `Ihr Ansprechpartner für Büroeinrichtung in ${city}`,
    email: "marius@fenyx-office.com",
    phone: "+49 176 23820424",
    portraitSrc:
      "/assets/cms/Marius.webp",
    portraitAlt: "Marius Grimm, Einrichtungsberater bei Fenyx Office",
    quote: DEFAULT_QUOTE,
    name: "Marius Grimm",
    role: "Einrichtungsberater",
  };
}
