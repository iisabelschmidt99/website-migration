"use client";

// Konzept I (Klon von F) — Timeline als 3 numbered Kapitel, alternating abyss/mist-soft.
// SpaceX-spec-rows mit scroll-linked signal Underline-Fill (Wow-Moment).
// Word-by-word mask-reveal Titel. Photorealistic architektonische Fotografie.

import Image from "next/image";
import Link from "next/link";
import { Reveal, WordReveal, SpecReveal } from "./Reveal";

type Chapter = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  specs: { label: string; value: string }[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  tone: "dark" | "light" | "deep";
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body: "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands — digital, präzise, nachverfolgbar.",
    specs: [
      { label: "Weiternutzung", value: "intern / extern" },
      { label: "Ankaufsangebote", value: "⌀ +42 %" },
      { label: "Wiederverwertung", value: "⌀ +29 %" },
    ],
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/f/f-timeline.png",
    imageAlt:
      "Architektonische Close-up einer modularen Büromöbel-System mit exploded view der Materialschichten.",
    tone: "light",
  },
  {
    index: "02",
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body: "Wir übernehmen die vollständige Verwertung — von der Erstbesichtigung bis zur lückenlosen ESG-Dokumentation.",
    specs: [
      { label: "Erstbesichtigung", value: "kostenlos" },
      { label: "Erlössteigerung", value: "bis +42 %" },
      { label: "Übergabe", value: "100 % sorgenfrei" },
    ],
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt: "Fenyx-Mitarbeiter besichtigt einen Büromöbel-Bestand vor Ort.",
    tone: "dark",
  },
  {
    index: "03",
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein.",
    specs: [
      { label: "Kostenersparnis", value: "⌀ −58 %" },
      { label: "CO₂ pro AP", value: "⌀ −125 kg" },
      { label: "Übergabe", value: "schlüsselfertig" },
    ],
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/concepts/f/f-refs.png",
    imageAlt:
      "Modulare Wandsystem in einem hellen Büro mit sorgfältig platzierten Pflanzen und Design-Objekten.",
    tone: "deep",
  },
];

export default function TimelineArchitectural() {
  return (
    <section
      className="di-timeline di-root"
      aria-label="Leistungen in drei Kapiteln"
    >
      {CHAPTERS.map((chapter) => (
        <article
          key={chapter.index}
          className={`di-tl-chapter di-tl-chapter--${chapter.tone}`}
          aria-labelledby={`di-tl-${chapter.index}-heading`}
        >
          <div className="di-tl-chapter__media di-img">
            <Image
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>

          <div className="di-tl-chapter__body">
            <p className="di-tl-chapter__index" aria-hidden="true">
              {chapter.index}
            </p>
            <p className="di-tl-chapter__eyebrow">{chapter.eyebrow}</p>
            <WordReveal
              tag="h2"
              text={chapter.title}
              className="di-tl-chapter__title"
              id={`di-tl-${chapter.index}-heading`}
            />
            <Reveal tag="p" className="di-tl-chapter__body-text" delay={400}>
              {chapter.body}
            </Reveal>
            <SpecReveal>
              {chapter.specs.map((spec, i) => (
                <div key={spec.label} className="di-spec__row">
                  <dt className="di-spec__label">{spec.label}</dt>
                  <dd
                    className="di-spec__value"
                    style={{ "--di-i": i } as React.CSSProperties}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </SpecReveal>
            <Reveal delay={700}>
              <Link
                href={chapter.href}
                className="di-tl-chapter__link"
              >
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
