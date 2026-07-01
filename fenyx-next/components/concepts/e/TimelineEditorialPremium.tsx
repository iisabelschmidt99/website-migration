"use client";

// Konzept E — Timeline als Magazine-Spread-Kapitel.
// Jedes Kapitel: 4:5-Portrait-Fotografie (Subjekt) + editorialer Textblock.
// Römische Numerale (I, II, III) als Marker. Scroll-linked image scale.
// Word-by-word mask-reveal Titel. Alternierend links/rechts auf Desktop.

import Image from "next/image";
import Link from "next/link";
import { Reveal, WordReveal } from "./Reveal";

type Chapter = {
  numeral: string;
  eyebrow: string;
  title: string;
  body: string;
  stats: { value: string; label: string }[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

const CHAPTERS: Chapter[] = [
  {
    numeral: "I",
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body: "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands — digital, präzise, nachverfolgbar.",
    stats: [
      { value: "+42%", label: "höhere Ankaufsangebote" },
      { value: "+29%", label: "bessere Wiederverwertungsrate" },
    ],
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/e/e-timeline.png",
    imageAlt:
      "Offenes Leder-Notizbuch mit handgezeichneten Möbel-Skizzen, Maßband und Vintage-Stift auf einem hellblauen Untergrund.",
  },
  {
    numeral: "II",
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body: "Wir übernehmen die vollständige Verwertung — von der kostenlosen Erstbesichtigung bis zur lückenlosen ESG-Dokumentation.",
    stats: [
      { value: "+42%", label: "höherer Erlös" },
      { value: "100%", label: "sorgenfreie Übergabe" },
    ],
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt:
      "Fenyx-Mitarbeiter besichtigt einen Büromöbel-Bestand vor Ort.",
    reverse: true,
  },
  {
    numeral: "III",
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein.",
    stats: [
      { value: "−58%", label: "Kosten durch Refurbished" },
      { value: "−125kg", label: "CO₂ pro Arbeitsplatz" },
    ],
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/timeline/Einrichtung-Header-Dropdown-Bild.webp",
    imageAlt:
      "Moderner Büroarbeitsplatz mit ergonomischen Stühlen und grünen Akustikpaneelen.",
  },
];

export default function TimelineEditorialPremium() {
  return (
    <section
      className="de-timeline"
      aria-label="Leistungen in drei Kapiteln"
    >
      {CHAPTERS.map((chapter) => (
        <article
          key={chapter.numeral}
          className={`de-tl-chapter ${chapter.reverse ? "de-tl-chapter--reverse" : ""}`}
          aria-labelledby={`de-tl-${chapter.numeral}-heading`}
        >
          <div className="de-tl-chapter__media de-img">
            <Image
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>

          <div className="de-tl-chapter__body">
            <p className="de-tl-chapter__numeral">{chapter.numeral}</p>
            <p className="de-tl-chapter__eyebrow">{chapter.eyebrow}</p>
            <WordReveal
              tag="h2"
              text={chapter.title}
              className="de-tl-chapter__title"
              id={`de-tl-${chapter.numeral}-heading`}
            />
            <Reveal tag="p" className="de-tl-chapter__body-text" delay={400}>
              {chapter.body}
            </Reveal>
            <Reveal className="de-tl-chapter__stats" delay={600}>
              {chapter.stats.map((stat) => (
                <div key={stat.label} className="de-tl-chapter__stat">
                  <span className="de-tl-chapter__stat-value">
                    {stat.value}
                  </span>
                  <span className="de-tl-chapter__stat-label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </Reveal>
            <Reveal delay={800}>
              <Link href={chapter.href} className="de-tl-chapter__link">
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
