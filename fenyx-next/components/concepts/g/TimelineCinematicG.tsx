"use client";

// Konzept G — Timeline wie d/TimelineCinematic, aber:
// eyebrow (klein, grün) = kurzer Titel z.B. "Maximaler Erlös. Null Aufwand."
// heading (groß)        = Service-Name z.B. "Ganzheitliche Verwertung"
// Indexzahlen entfernt.

import Image from "next/image";
import Link from "next/link";
import { WordReveal, Reveal } from "@/components/concepts/d/Reveal";

type Chapter = {
  index: string;
  eyebrow: string;  // → wird zur großen Überschrift
  title: string;    // → wird zum kleinen grünen Eyebrow
  body: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type TimelineCinematicChapter = Chapter;

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body: "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands — digital, präzise, nachverfolgbar. Bevor irgendwas entsorgt oder neu bestellt wird.",
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/d/d-timeline.png",
    imageAlt: "Hände arbeiten auf einem Tablet mit einer Möbel-Inventar-App.",
  },
  {
    index: "02",
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body: "Wir übernehmen die vollständige Verwertung — von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht.",
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt: "Fenyx-Mitarbeiter besichtigt einen Büromöbel-Bestand vor Ort.",
  },
  {
    index: "03",
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein — termingerecht, budgetsicher, ESG-konform.",
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/concepts/d/d-refs.png",
    imageAlt: "Frisch eingerichtetes Büro in einer ehemaligen Industriehalle.",
  },
];

export default function TimelineCinematicG({
  chapters: chaptersProp,
  ariaLabel = "Leistungen in drei Kapiteln",
  einrichtungImageSrc = "/assets/concepts/d/d-refs.png",
  bestandImageSrc = "/assets/concepts/d/d-timeline.png",
  verwertungImageSrc = "/assets/timeline/verwertung-besichtigung.webp",
}: {
  /** Eigene Kapitel (z. B. Bestandsmanagement mit 4 Schritten). */
  chapters?: TimelineCinematicChapter[];
  ariaLabel?: string;
  /** Optional: überschreibt das Bild des dritten Kapitels (Schlüsselfertige Einrichtung). */
  einrichtungImageSrc?: string;
  /** Optional: überschreibt das Bild des ersten Kapitels (Digitales Bestandsmanagement). */
  bestandImageSrc?: string;
  /** Optional: überschreibt das Bild des zweiten Kapitels (Ganzheitliche Verwertung). */
  verwertungImageSrc?: string;
} = {}) {
  const chapters = chaptersProp
    ? chaptersProp
    : CHAPTERS.map((c, i) => {
        if (i === 0) return { ...c, imageSrc: bestandImageSrc };
        if (i === 1) return { ...c, imageSrc: verwertungImageSrc };
        if (i === 2) return { ...c, imageSrc: einrichtungImageSrc };
        return c;
      });
  return (
    <section className="dd-timeline" aria-label={ariaLabel}>
      {chapters.map((chapter) => (
        <article
          key={chapter.index}
          className="dd-tl-chapter"
          aria-labelledby={`dg-tl-${chapter.index}-heading`}
        >
          <div className="dd-tl-chapter__bg dd-img">
            <Image
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
              loading="lazy"
            />
          </div>
          <div className="dd-tl-chapter__scrim" aria-hidden="true" />

          <div className="dd-tl-chapter__content">
            {/* Klein + grün: kurzer Slogan */}
            <p className="dd-tl-chapter__eyebrow dg-tl__slogan">{chapter.title}</p>
            {/* Groß: Service-Name */}
            <WordReveal
              tag="h2"
              text={chapter.eyebrow}
              className="dd-tl-chapter__title dg-tl__service-name"
              id={`dg-tl-${chapter.index}-heading`}
            />
            <Reveal tag="p" className="dd-tl-chapter__body" delay={400}>
              {chapter.body}
            </Reveal>
            <Reveal delay={600}>
              <Link href={chapter.href} className="dd-tl-chapter__link">
                Mehr erfahren
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={1.6}
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </article>
      ))}
    </section>
  );
}
