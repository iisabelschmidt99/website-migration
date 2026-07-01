import homepageLogos from "@/data/homepage-logos.json";

export type Logo = { alt: string; src: string };

// Eine Handvoll Asset-Dateien fehlt im Repo (z. B. "Bamboo Artists"); diese
// rendern sonst als leere Kästen. Hier hart herausfiltern, damit die
// Konzept-Grids nur valide Logos zeigen.
const MISSING_SRC = new Set<string>([
  "/assets/logos/6988d9ea184c3a10bc10dbef_%2C.avif",
]);

/** Alle Logos mit existierender Asset-Datei (84 Roh, 83 nach Filter). */
export const validHomepageLogos: Logo[] = (homepageLogos as Logo[]).filter(
  (logo) => !MISSING_SRC.has(logo.src),
);

/** Kuratierte Auswahl fürs Logo-Grid (erste n valide Logos). */
export function curatedLogos(count: number): Logo[] {
  return validHomepageLogos.slice(0, count);
}

/** Alphabetisch nach alt sortiert – für editoriales Index-Layout (/c). */
export function alphabeticalLogos(): Logo[] {
  return [...validHomepageLogos].sort((a, b) =>
    a.alt.localeCompare(b.alt, "de", { sensitivity: "base" }),
  );
}

// Deterministischer Shuffle (mulberry32) — gleiche Reihenfolge auf Server
// und Client, sonst droht ein React-Hydration-Mismatch im Ticker-Layout (/f).
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
* Deterministisch gemischte Logos – für Ticker-Layouts (/f), damit die Reihen
* nicht wie das Roh-JSON aussehen, aber SSR/CSR identisch bleiben.
*/
export function shuffledLogos(seed = 20260701): Logo[] {
  const rng = mulberry32(seed);
  const arr = [...validHomepageLogos];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Logo-Liste in n annähernd gleich große Reihen splitten (für Ticker /f). */
export function splitRows<T>(items: T[], rows: number): T[][] {
  const out: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => out[i % rows].push(item));
  return out;
}
