import type { Metadata } from "next";
import Image from "next/image";
import InventarisierungHero from "@/components/InventarisierungHero";
import LogoGrid from "@/components/LogoGrid";
import GreenBenefitsTabs from "@/components/GreenBenefitsTabs";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import InventarisierungTimeline from "@/components/InventarisierungTimeline";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import FaqSection from "@/components/FaqSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import CtaButton from "@/components/CtaButton";
import {
  digitaleInventarisierungMeta,
  heroContent,
  greenBenefitsContent,
  klarheitContent,
  challengesContent,
  ampelContent,
  processSteps,
  timelineBackground,
  crossSellContent,
  contactContent,
  digitaleInventarisierungFaq,
} from "@/data/digitale-inventarisierung";

export const metadata: Metadata = {
  title: digitaleInventarisierungMeta.title,
  description: digitaleInventarisierungMeta.description,
};

export default function DigitaleInventarisierungPage() {
  return (
    <div className="inv-page">
      <InventarisierungHero {...heroContent} />

      <LogoGrid />

      <GreenBenefitsTabs {...greenBenefitsContent} />

      <section
        className="py-20 sm:py-28 inv-section--dark inv-klarheit"
        aria-labelledby="klarheit-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2
                id="klarheit-heading"
                className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-5 text-white"
              >
                {klarheitContent.heading}
              </h2>
              <div className="text-mist text-base leading-relaxed space-y-4 mb-8">
                {klarheitContent.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
              <CtaButton href="#kontakt">Kontakt aufnehmen</CtaButton>
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src={klarheitContent.imageSrc}
                alt={klarheitContent.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <InventarisierungPhaseTabs
        heading={challengesContent.heading}
        introLead={challengesContent.introLead}
        introBody={challengesContent.introBody}
        tabs={challengesContent.tabs}
      />

      <section
        className="py-20 sm:py-28 inv-section--dark"
        aria-labelledby="ampel-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              id="ampel-heading"
              className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-5 text-white"
            >
              {ampelContent.heading}
            </h2>
            <p className="text-mist text-base leading-relaxed">
              {ampelContent.intro}
            </p>
          </div>
          <div className="ampel-grid">
            {ampelContent.cards.map((card) => (
              <article
                key={card.title}
                className={`ampel-card ampel-card--${card.variant}`}
              >
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InventarisierungTimeline
        heading="In 6 Schritten zur digitalen Übersicht."
        steps={processSteps}
        backgroundSrc={timelineBackground.src}
        backgroundAlt={timelineBackground.alt}
      />

      <InvCrossSellSection {...crossSellContent} />

      <ReferenceProjectsSection />

      <FaqSection items={digitaleInventarisierungFaq} dark />

      <ServiceContactSection {...contactContent} layout="formFirst" />
    </div>
  );
}
