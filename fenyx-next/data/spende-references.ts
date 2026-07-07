import type { ReferenceProject } from "./reference-projects";

/** Einzige Referenz auf der Spende-Seite (Webflow CMS). */
export const spendeReferences: ReferenceProject[] = [
  {
    eyebrow: "Spende",
    heading: "Ernst Klett Verlag",
    tag: "Ganzheitliche Verwertung",
    body: "Möbel, die sich nicht verkaufen ließen, wurden gespendet oder umweltgerecht entsorgt. Ergebnis: eine CO₂-optimierte Bilanz und 40 % Spendenquote vom nicht verwertbaren Bestand",
    stats: [
      { value: "14 Gebäude", label: "Besenrein übergeben" },
      { value: "765", label: "Möbel gespendet" },
      { value: "19.000 kg", label: "CO₂-Emissionen gespart" },
    ],
    href: "/referenzen/ernst-klett-verlag",
    imageSrc: "/assets/referenzen/ernst-klett-verlag.webp",
    imageAlt: "Moderner Bürobereich nach der Spenden-Verwertung bei Ernst Klett Verlag",
  },
];
