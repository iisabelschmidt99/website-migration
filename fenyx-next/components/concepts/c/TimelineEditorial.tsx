import Image from "next/image";
import Link from "next/link";

/**
 * Konzept C – Editoriale Timeline (Scrollytelling).
 *
 * Drei Kapitel als einspaltige Erzählung. Römische Ziffern (I, II, III) als
 * redaktionelle Marker ersetzen die grüne SVG-Lebenszyklus-Linie des Originals.
 * Jedes Kapitel: full-bleed-Bild mit Unterzeile, Versalien-Eyebrow, große
 * Telegraf-Überschrift, Fließtext und drei Inline-Statistiken als Text.
 *
 * Server-Komponente: das Reveal beim Eintritt ins Viewport wird global über
 * CSS (.dc-reveal) + EditorialReveal-Fallback gesteuert – kein lokales JS nötig.
 */

type Chapter = {
  numeral: string;
  eyebrow: string;
  title: string;
  body: string;
  stats: string[];
  imageSrc: string;
  imageAlt: string;
  caption: string;
  href: string;
  linkLabel: string;
};

const chapters: Chapter[] = [
  {
    numeral: "I",
    eyebrow: "Kapitel I — Bestand",
    title: "Digitales Bestandsmanagement",
    body: "Bevor irgendetwas entsorgt oder neu bestellt wird, erfassen, bewerten und klassifizieren wir jeden Möbelgegenstand Ihres Bestands – digital, präzise und nachverfolgbar. Aus einer Bestandsaufnahme wird eine Entscheidungsgrundlage.",
    stats: [
      "intern / extern weiternutzbar",
      "⌀ 42 % höhere Ankaufsangebote",
      "⌀ 29 % bessere Wiederverwertung",
    ],
    imageSrc: "/assets/concepts/c/c-timeline.png",
    imageAlt: "Analoges Notizbuch mit handgezeichneten Möbelskizzen.",
    caption: "Notizbuch & Bestandsskizzen — die Inventur beginnt von Hand, endet digital.",
    href: "/bestandsmanagement",
    linkLabel: "Mehr zum Bestandsmanagement",
  },
  {
    numeral: "II",
    eyebrow: "Kapitel II — Verwertung",
    title: "Ganzheitliche Verwertung",
    body: "Wir übernehmen die vollständige Verwertung – von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht. Maximaler Erlös bei minimalem Aufwand für Sie.",
    stats: [
      "kostenlose Erstbesichtigung",
      "bis zu 42 % mehr Erlös",
      "100 % sorgenfreie Übergabe",
    ],
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt: "Fenyx-Mitarbeiter bei der Erstbesichtigung eines Büros vor Ort.",
    caption: "Erstbesichtigung vor Ort — jede Verwertung beginnt mit einem genauen Blick.",
    href: "/verwertung/bueroaufloesung",
    linkLabel: "Mehr zur Verwertung",
  },
  {
    numeral: "III",
    eyebrow: "Kapitel III — Einrichtung",
    title: "Schlüsselfertige Einrichtung",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein – termingerecht, budgetsicher und ESG-konform. Ein Partner, ein Prozess, ein fertiges Büro.",
    stats: [
      "⌀ 58 % günstiger durch Refurbished",
      "⌀ 125 kg CO₂ je Arbeitsplatz",
      "schlüsselfertige Übergabe",
    ],
    imageSrc: "/assets/timeline/Einrichtung-Header-Dropdown-Bild.webp",
    imageAlt: "Schlüsselfertig eingerichtetes, nachhaltiges Büro von Fenyx.",
    caption: "Schlüsselfertige Übergabe — Bestand, Refurbished und Neu in einem Raum.",
    href: "/einrichtung/bueroeinrichtung",
    linkLabel: "Mehr zur Einrichtung",
  },
];

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
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
  );
}

export default function TimelineEditorial() {
  return (
    <section
      className="dc-timeline"
      aria-labelledby="dc-timeline-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dc-timeline-heading" className="sr-only">
            Der Fenyx-Lebenszyklus in drei Kapiteln
          </h2>

          {chapters.map((chapter, index) => (
            <article
              key={chapter.numeral}
              className="dc-reveal flex min-h-[80vh] flex-col justify-center py-24 sm:py-28"
            >
              <div className="mb-10 flex items-baseline gap-6">
                <span className="dc-numeral" aria-hidden="true">
                  {chapter.numeral}
                </span>
                <span className="dc-eyebrow">{chapter.eyebrow}</span>
              </div>

              <h3 className="dc-chapter-title mb-7 max-w-[18ch]">
                {chapter.title}
              </h3>

              <p className="dc-body mb-10">{chapter.body}</p>

              {/* Inline-Statistiken als Fließtext (keine separaten Stat-Blöcke). */}
              <p className="dc-stats mb-12 max-w-[60ch]">
                {chapter.stats.map((stat, i) => (
                  <span key={stat}>
                    {i > 0 && <span className="dc-stats__sep" aria-hidden="true">/</span>}
                    <span className="dc-stats__value">{stat}</span>
                  </span>
                ))}
              </p>

              {/* Full-bleed-Bild mit Unterzeile (editorial, kein Karten-Overlay). */}
              <figure className="mb-8">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={chapter.imageSrc}
                    alt={chapter.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 90rem"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                <figcaption className="dc-caption mt-4">
                  {chapter.caption}
                </figcaption>
              </figure>

              <div>
                <Link href={chapter.href} className="dc-link">
                  {chapter.linkLabel}
                  <ArrowRight />
                </Link>
              </div>

              {index < chapters.length - 1 && (
                <hr className="dc-rule mt-24" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
