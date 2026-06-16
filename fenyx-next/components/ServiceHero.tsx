import Image from "next/image";
import CheckList from "./CheckList";
import CtaButton from "./CtaButton";

type ServiceHeroProps = {
  heading: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

/** Vollbild-Hero für Leistungsunterseiten (Text auf Bild). */
export default function ServiceHero({
  heading,
  description,
  bullets,
  imageSrc,
  imageAlt = "",
  ctaHref = "/#kontakt",
  ctaLabel = "Kontakt aufnehmen",
}: ServiceHeroProps) {
  return (
    <section
      className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden text-white"
      aria-labelledby="service-hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss-deep/95 via-abyss-deep/78 to-abyss-deep/20" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-0">
        <div className="max-w-xl lg:max-w-2xl">
          <h1
            id="service-hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-heading tracking-[-0.03em] mb-5 leading-[1.08] text-white"
          >
            {heading}
          </h1>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8">
            {description}
          </p>
          <CheckList
            items={bullets}
            className="text-white/90 mb-10"
            aria-label="Vorteile"
          />
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </div>
      </div>
    </section>
  );
}
