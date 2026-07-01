import Image from "next/image";
import CtaButton from "@/components/CtaButton";

type DesignV1ServiceHeroProps = {
  eyebrow: string;
  heading: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

/** V1 Leistungs-Hero: kompakter Dark-Hero mit Bild und Proof-Bullets. */
export default function DesignV1ServiceHero({
  eyebrow,
  heading,
  description,
  bullets,
  imageSrc,
  imageAlt = "",
  ctaHref = "#kontakt",
  ctaLabel = "Kontakt aufnehmen",
}: DesignV1ServiceHeroProps) {
  return (
    <section
      className="dv1-service-hero relative flex min-h-[92svh] items-center overflow-hidden bg-abyss-deep"
      aria-labelledby="dv1-service-hero-heading"
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
        <div className="absolute inset-0 bg-abyss-deep/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss-deep/90 via-abyss-deep/65 to-abyss-deep/20" />
      </div>

      <div className="relative w-full wf-padding-global py-24 sm:py-32 lg:py-28">
        <div className="wf-container-large max-w-3xl">
          <span className="dv1-hero__eyebrow">{eyebrow}</span>
          <h1
            id="dv1-service-hero-heading"
            className="dv1-hero__title text-[clamp(2.25rem,6vw,3.75rem)]"
          >
            {heading}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist-soft sm:text-lg">
            {description}
          </p>
          <ul className="dv1-service-hero__bullets" aria-label="Kernvorteile">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <CtaButton href={ctaHref} className="mt-8">
            {ctaLabel}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
