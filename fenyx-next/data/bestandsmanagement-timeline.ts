import type { TimelineCinematicChapter } from "@/components/concepts/g/TimelineCinematicG";

const assetBase = "/assets/leistungen/bestandsmanagement";

export const bestandsmanagementTimelineChapters: TimelineCinematicChapter[] = [
  {
    index: "01",
    eyebrow: "Digitale Inventarisierung.",
    title: "Verwertung optimieren. Erlös steigern.",
    body: "Maximieren Sie die Wiederverwertungsquote und den Verkaufserlös Ihres nicht mehr genötigten Bestands. Die Fenyx-Plattform garantiert die optimale Veräußerung, unabhängig von Hersteller, Kategorie und Zustand.",
    href: "/bestandsmanagement/digitale-inventarisierung",
    imageSrc: `${assetBase}/timeline-inventarisierung.jpg`,
    imageAlt: "Digitales Inventar-Dashboard in einem Loft-Büro.",
  },
  {
    index: "02",
    eyebrow: "Flexible Einlagerung.",
    title: "Kapazität on demand.",
    body: "Mit Fenyx erhalten Sie Zugang zum größten Büromöbel-Lager-Ökosystem in Europa. Nutzen Sie die flexiblen Angebote, um Ihren individuellen Bedarf an zusätzlicher Kapazität zu decken.",
    href: "/bestandsmanagement#kontakt",
    imageSrc: `${assetBase}/timeline-einlagerung.png`,
    imageAlt: "Flexible Einlagerung von Büromöbeln.",
  },
  {
    index: "03",
    eyebrow: "Ganzheitliche Aufbereitung.",
    title: "Lebenszyklen verlängern.",
    body: "Wir verlängern den Lebenszyklus Ihrer Bestände – strukturiert, fachgerecht und unabhängig vom Hersteller. Das Ergebnis: deutlich reduzierte Emissionen und Kosten.",
    href: "/verwertung/aufbereitung",
    imageSrc: `${assetBase}/timeline-aufbereitung.png`,
    imageAlt: "Aufbereitete Bürostühle in der Fenyx-Werkstatt.",
  },
  {
    index: "04",
    eyebrow: "Messbare Transparenz.",
    title: "Steuern statt schätzen.",
    body: "Was nicht sichtbar ist, lässt sich nicht steuern. Eine digitale, strukturierte Bestandsübersicht schafft Transparenz – und damit die Grundlage für weniger Kosten, weniger CO₂ und weniger Aufwand.",
    href: "/bestandsmanagement/digitale-inventarisierung",
    imageSrc: `${assetBase}/timeline-transparenz.png`,
    imageAlt: "Hand misst einen Bürotisch mit einem Maßband.",
  },
];
