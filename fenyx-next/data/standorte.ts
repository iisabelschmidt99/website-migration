const CDN = "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d7e6";

export type Standort = {
  slug: string;
  city: string;
  top: number;
  left: number;
};

export const STANDORT_MAP_SRC = `${CDN}/69ef30d779a0f0d70c7ae2b1_map.svg`;

/** Koordinaten aus dem Webflow-Original (Prozent auf der Europakarte). */
export const STANDORTE: Standort[] = [
  { slug: "berlin", city: "Berlin", top: 30, left: 63 },
  { slug: "bonn", city: "Bonn", top: 48.5, left: 18 },
  { slug: "braunschweig", city: "Braunschweig", top: 32, left: 43 },
  { slug: "bremen", city: "Bremen", top: 24, left: 30 },
  { slug: "dortmund", city: "Dortmund", top: 41.5, left: 21 },
  { slug: "dresden", city: "Dresden", top: 43.5, left: 65.5 },
  { slug: "duesseldorf", city: "Düsseldorf", top: 44, left: 16.5 },
  { slug: "essen", city: "Essen", top: 41.8, left: 18 },
  { slug: "frankfurt", city: "Frankfurt", top: 53, left: 29 },
  { slug: "hamburg", city: "Hamburg", top: 19, left: 38 },
  { slug: "hannover", city: "Hannover", top: 31, left: 36.5 },
  { slug: "karlsruhe", city: "Karlsruhe", top: 63.5, left: 26.5 },
  { slug: "koeln", city: "Köln", top: 46.4, left: 17 },
  { slug: "leipzig", city: "Leipzig", top: 40, left: 56.5 },
  { slug: "mainz", city: "Mainz", top: 54, left: 25 },
  { slug: "mannheim", city: "Mannheim", top: 58, left: 27 },
  { slug: "muenchen", city: "München", top: 73, left: 52 },
  { slug: "nuernberg", city: "Nürnberg", top: 59, left: 47 },
  { slug: "stuttgart", city: "Stuttgart", top: 67, left: 33 },
  { slug: "wien", city: "Wien", top: 71, left: 89 },
  { slug: "zuerich", city: "Zürich", top: 80, left: 29 },
];

export function standortHref(slug: string) {
  return `/einrichtung/bueromoebel-mieten/${slug}`;
}

export function getStandortBySlug(slug: string) {
  return STANDORTE.find((s) => s.slug === slug);
}

export const locationsSectionContent = {
  heading: "Unsere Standorte",
  mapSrc: STANDORT_MAP_SRC,
  locations: STANDORTE.map((s) => ({
    slug: s.slug,
    city: s.city,
    href: standortHref(s.slug),
    top: s.top,
    left: s.left,
  })),
};
