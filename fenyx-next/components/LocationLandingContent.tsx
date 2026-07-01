// Rendering-Template für „Standort"-Landingpages (Einrichtung LPs, Ankauf LPs).
// Volle Sektions-Abfolge wie die echte Büroeinrichtungs-Seite; die CMS-Felder
// (H1, Hero-Bild, 2 RTE-Texte, Karte) werden eingespeist.
import Image from "next/image";
import ServiceHero from "./ServiceHero";
import LogoGrid from "./LogoGrid";
import InventarisierungPhaseTabs from "./InventarisierungPhaseTabs";
import LifecycleTrack from "./LifecycleTrack";
import LifecycleCard from "./LifecycleCard";
import PressMarquee from "./PressMarquee";
import VideoFeatureSection from "./VideoFeatureSection";
import GreenBenefitsTabs from "./GreenBenefitsTabs";
import ReferenceProjectsSection from "./ReferenceProjectsSection";
import TestimonialsSection from "./TestimonialsSection";
import ServiceContactSection from "./ServiceContactSection";
import type { Testimonial } from "@/lib/testimonials";
import {
  heroContent as bueroeinrichtungHero,
  challengesContent,
  methodeContent,
  videoFeatureContent,
  garantienContent,
  referenzenContent,
  contactContent,
} from "@/data/bueroeinrichtung";

const BE_ASSETS = "/assets/leistungen/bueroeinrichtung";

// Emojis/Symbole aus Überschriften entfernen (kommen teils aus dem CMS).
function stripEmoji(text: string): string {
  return text
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Styling für CMS-Rich-Text auf hellem Hintergrund (dunkle Schrift).
const RTE_LIGHT =
  "[&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mb-5 " +
  "[&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mb-5 " +
  "[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-6 [&_h3]:mb-3 " +
  "[&_p]:text-black/75 [&_p]:leading-relaxed [&_p]:mb-4 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1 [&_li]:text-black/75 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 " +
  "[&_a]:text-signal [&_a]:underline [&_strong]:text-black [&_strong]:font-bold";

type LocationLandingContentProps = {
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
function LocationTextRow({
  html,
  media,
  mediaSide = "left",
  bgClassName = "bg-white",
}: {
  html: string;
  media: React.ReactNode;
  mediaSide?: "left" | "right";
  bgClassName?: string;
}) {
  return (
    <section className={`${bgClassName} py-16 sm:py-24`}>
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

export default function LocationLandingContent({
  h1,
  subline,
  heroImageSrc,
  heroImageAlt,
  section1Html,
  section2Html,
  mapEmbed,
  schemaMarkup,
  testimonials = [],
}: LocationLandingContentProps) {
  const mapMedia = mapEmbed ? (
    <div
      className="relative w-full min-h-[22rem] overflow-hidden [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: mapEmbed }}
    />
  ) : (
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={`${BE_ASSETS}/challenge-kosten.webp`}
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
        src={`${BE_ASSETS}/challenge-umsetzung.webp`}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <div className="inv-page">
      {/* JSON-LD Schema-Markup (unverändert aus dem CMS) */}
      {schemaMarkup ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: schemaMarkup }}
        />
      ) : null}

      <ServiceHero
        heading={stripEmoji(h1)}
        description={
          subline?.trim() ||
          "Datenbasierte Büroplanung und schlüsselfertige Büroeinrichtung – nachhaltig und aus einer Hand."
        }
        bullets={[
          "Datenbasierte Büroplanung",
          "Refurbished Premiummöbel",
          "Schlüsselfertige Umsetzung",
        ]}
        imageSrc={heroImageSrc || bueroeinrichtungHero.posterSrc}
        imageAlt={heroImageAlt || h1}
      />

      {/* CMS Sektion 1 (z.B. „Büroplanung Aachen") – Karte links, Text rechts */}
      {section1Html ? (
        <LocationTextRow html={section1Html} media={mapMedia} mediaSide="left" />
      ) : null}

      {/* CMS Sektion 2 (z.B. „Büroeinrichtung Aachen") – Text links, Bild rechts */}
      {section2Html ? (
        <LocationTextRow html={section2Html} media={section2Media} mediaSide="right" />
      ) : null}

      <LogoGrid />

      <InventarisierungPhaseTabs
        tabs={challengesContent.tabs}
        variant="dark"
        scrollDriven
      />

      {/* Methode-Timeline wie auf der Homepage: grüne Linie + vollbildliche Karten */}
      <section
        id="leistungen"
        className="wf-padding-section-medium bg-white overflow-hidden"
        style={{ paddingBottom: 0 }}
      >
        <div className="wf-padding-global">
          <div className="wf-container-large">
            <div className="text-center wf-max-width-large wf-align-center">
              <h2 className="wf-heading-h2 mb-5 text-black">
                {methodeContent.heading}
              </h2>
              <p className="text-black text-base sm:text-lg leading-relaxed">
                {methodeContent.description}
              </p>
            </div>
          </div>
        </div>

        <div className="wf-spacer-xxlarge" aria-hidden="true" />

        <LifecycleTrack dotCount={methodeContent.steps.length}>
          {methodeContent.steps.map((step) => (
            <LifecycleCard
              key={step.title}
              title={step.title}
              description=""
              bullets={step.bullets}
              imageSrc={step.imageSrc}
              imageAlt={step.imageAlt}
              href="/#kontakt"
              align={step.imageAlign}
            />
          ))}
        </LifecycleTrack>
      </section>

      <PressMarquee />

      <VideoFeatureSection {...videoFeatureContent} />

      <GreenBenefitsTabs {...garantienContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <TestimonialsSection testimonials={testimonials} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
