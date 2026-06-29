"use client";

import Image from "next/image";
import CtaButton from "./CtaButton";
import { trackToolUse } from "@/lib/analytics/events";

type PricingCard = {
  title: string;
  imageSrc: string;
  imageAlt: string;
};

type PricingCardsSectionProps = {
  heading: string;
  intro: string;
  cards: PricingCard[];
  ctaHref?: string;
  ctaLabel?: string;
};

/** Drei Bildkarten mit Overlay-Titel (Webflow section_pricing). */
export default function PricingCardsSection({
  heading,
  intro,
  cards,
  ctaHref = "#kontakt",
  ctaLabel = "Kostenlose Beratung",
}: PricingCardsSectionProps) {
  return (
    <section
      className="py-20 sm:py-28 bg-white text-abyss-deep"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-4"
          >
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-black/75">{intro}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className="pricing-card"
              onClick={() =>
                trackToolUse("pricing_card", "select", {
                  card_title: card.title,
                })
              }
            >
              <div className="pricing-card__media relative aspect-[4/5]">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="pricing-card__overlay" aria-hidden="true" />
                <h3 className="pricing-card__title">{card.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CtaButton href={ctaHref} trackId="bueromoebel_mieten__pricing__cta">
            {ctaLabel}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
