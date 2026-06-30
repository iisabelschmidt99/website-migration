import homepageLogos from "@/data/homepage-logos.json";

export type Logo = { alt: string; src: string };

// Eine Handvoll Asset-Dateien fehlt im Repo (z. B. "Bamboo Artists"); diese
// rendern sonst als leere Kästen. Hier hart herausfiltern, damit die
// Konzept-Grids nur valide Logos zeigen.
const MISSING_SRC = new Set<string>([
  "/assets/logos/6988d9ea184c3a10bc10dbef_%2C.avif",
]);

export const validHomepageLogos: Logo[] = (homepageLogos as Logo[]).filter(
  (logo) => !MISSING_SRC.has(logo.src),
);

/** Kuratierte Auswahl fürs Logo-Grid (erste n valide Logos). */
export function curatedLogos(count: number): Logo[] {
  return validHomepageLogos.slice(0, count);
}
