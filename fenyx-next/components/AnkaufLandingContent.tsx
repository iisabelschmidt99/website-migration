// Rendering-Template für die Ankauf-Standort-Landingpages (/ankauf/[slug]).
// Reihenfolge wie im Original: Hero → Logos → 4 Kacheln → Stadt-Texte (weiß)
// → 5-Schritte-Timeline → Erlös-Berechnung → Kundenstimmen → Kontakt.
import Image from "next/image";
import ServiceHero from "./ServiceHero";
import LogoGrid from "./LogoGrid";
import AnkaufFeatureTiles from "./AnkaufFeatureTiles";
import AnkaufProzessTimeline from "./AnkaufProzessTimeline";
import AnkaufErloesRechnung from "./AnkaufErloesRechnung";
import TestimonialsSection from "./TestimonialsSection";
import ServiceContactSection from "./ServiceContactSection";
import type { Testimonial } from "@/lib/testimonials";
import { verwertungContact } from "@/data/verwertung-contact";

const CMS_ASSETS = "/assets/cms";

function stripEmoji(text: string): string {
  return text
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

const RTE_LIGHT =
  "[&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mb-5 " +
  "[&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mb-5 " +
  "[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-6 [&_h3]:mb-3 " +
  "[&_p]:text-black/75 [&_p]:leading-relaxed [&_p]:mb-4 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1 [&_li]:text-black/75 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 " +
  "[&_a]:text-signal [&_a]:underline [&_strong]:text-black [&_strong]:font-bold";

type AnkaufLandingContentProps = {
  h1: string;
  subline?: string | null;
  heroImageSrc?: string | null;
  heroImageAlt?: string | null;
  section1Html?: string | null;
  section2Html?: string | null;
  mapEmbed?: string | null;
  schemaMarkup?: string | null;
  testimonials?: Testimonial[];
};

/** Weiße Zwei-Spalten-Zeile: CMS-Text + Medium (Karte oder Bild). */
function LandingTextRow({
  html,
  media,
  mediaSide = "left",
}: {
  html: string;
  media: React.ReactNode;
  mediaSide?: "left" | "right";
}) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={mediaSide === "left" ? "lg:order-1" : "lg:order-2"}>
            {media}
          </div>
          <div
            className={`${mediaSide === "left" ? "lg:order-2" : "lg:order-1"} ${RTE_LIGHT}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </section>
  );
}

export default function AnkaufLandingContent({
  h1,
  subline,
  heroImageSrc,
  heroImageAlt,
  section1Html,
  section2Html,
  mapEmbed,
  schemaMarkup,
  testimonials = [],
}: AnkaufLandingContentProps) {
  const mapMedia = mapEmbed ? (
    <div
      className="relative w-full min-h-[22rem] overflow-hidden [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: mapEmbed }}
    />
  ) : (
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={`${CMS_ASSETS}/auflosung-besichtigung-angebotserstellung.webp`}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  const section2Media = (
    <div className="relative w-full aspect-[4/3]">
      <Image
        src="/assets/leistungen/ankauf/ankauf-section.webp"
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <div className="inv-page">
      {schemaMarkup ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: schemaMarkup }}
        />
      ) : null}

      {/* 1) Hero */}
      <ServiceHero
        heading={stripEmoji(h1)}
        description={
          subline?.trim() ||
          "Kostenlose Bestandsaufnahme, +90% nachhaltige Weiterverwendung, stressfreie besenreine Übergabe."
        }
        bullets={[
          "Faire Bewertung Ihres Bestands",
          "Schnelle, stressfreie Abwicklung",
          "Nachhaltige Weiterverwendung",
        ]}
        imageSrc={heroImageSrc || `${CMS_ASSETS}/bueroaufloesung-thumbnail.webp`}
        imageAlt={heroImageAlt || h1}
      />

      {/* 2) Logos */}
      <LogoGrid />

      {/* 3) Von der Bewertung bis zur Verwertung – 4 Kacheln */}
      <AnkaufFeatureTiles />

      {/* 4) Stadt-Texte (weiß): Büroauflösung + Büromöbelankauf */}
      {section1Html ? (
        <LandingTextRow html={section1Html} media={mapMedia} mediaSide="left" />
      ) : null}
      {section2Html ? (
        <LandingTextRow html={section2Html} media={section2Media} mediaSide="right" />
      ) : null}

      {/* 5) Prozess – 5-Schritte-Timeline (boxige Karten) */}
      <AnkaufProzessTimeline />

      {/* 6) Erlös-Berechnung */}
      <AnkaufErloesRechnung />

      {/* 7) Erfahrungen mit Fenyx (einzelne Stimme, zentriert) */}
      <TestimonialsSection testimonials={testimonials} centered />

      {/* 8) Kontakt */}
      <ServiceContactSection {...verwertungContact} />
    </div>
  );
}
