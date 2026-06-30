"use client";

// Konzept D — Timeline als 3 cineastische Vollbild-Kapitel.
// Jedes Kapitel: Full-viewport cinematic Image + Text-Panel.
// Scroll-driven Crossfade zwischen Kapiteln (CSS animation-timeline: view()).
// Word-by-word mask-reveal Titel pro Kapitel.

import Image from "next/image";
import Link from "next/link";
import { WordReveal, Reveal } from "./Reveal";

type Chapter = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body: "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands — digital, präzise, nachverfolgbar. Bevor irgendwas entsorgt oder neu bestellt wird.",
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/d/d-timeline.png",
    imageAlt:
      "Hände arbeiten auf einem Tablet mit einer Möbel-Inventar-App, dazu Notizbuch und Maßband auf einem Schreibtisch.",
  },
  {
    index: "02",
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body: "Wir übernehmen die vollständige Verwertung — von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht.",
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt:
      "Fenyx-Mitarbeiter besichtigt einen Büromöbel-Bestand vor Ort und notiert auf einem Plan.",
  },
  {
    index: "03",
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein — termingerecht, budgetsicher, ESG-konform.",
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/concepts/d/d-refs.png",
    imageAlt:
      "Frisch eingerichtetes Büro in einer ehemaligen Industriehalle, goldenes Licht durch hohe Fenster.",
  },
];

export default function TimelineCinematic() {
  return (
    <section
      className="dd-timeline"
      aria-label="Leistungen in drei Kapiteln"
    >
      {CHAPTERS.map((chapter) => (
        <article
          key={chapter.index}
          className="dd-tl-chapter"
          aria-labelledby={`dd-tl-${chapter.index}-heading`}
        >
          <div className="dd-tl-chapter__bg dd-img">
            <Image
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              loading="lazy"
            />
          </div>
          <div className="dd-tl-chapter__scrim" aria-hidden="true" />

          <div className="dd-tl-chapter__content">
            <p className="dd-tl-chapter__index" aria-hidden="true">
              {chapter.index}
            </p>
            <p className="dd-tl-chapter__eyebrow">{chapter.eyebrow}</p>
            <WordReveal
              tag="h2"
              text={chapter.title}
              className="dd-tl-chapter__title"
              id={`dd-tl-${chapter.index}-heading`}
            />
            <Reveal tag="p" className="dd-tl-chapter__body" delay={400}>
              {chapter.body}
            </Reveal>
            <Reveal delay={600}>
              <Link href={chapter.href} className="dd-tl-chapter__link">
                Mehr erfahren
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </article>
      ))}
    </section>
  );
}
