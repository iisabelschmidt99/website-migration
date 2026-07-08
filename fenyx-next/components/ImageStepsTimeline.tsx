import Image from "next/image";
import CheckList from "./CheckList";
import CtaButton from "./CtaButton";

export type ImageTimelineStep = {
  title: string;
  intro?: string;
  bullets: string[];
  details?: string;
  imageSrc: string;
  imageAlt: string;
  imageAlign: "left" | "right";
};

type ImageStepsTimelineProps = {
  id?: string;
  heading: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  steps: ImageTimelineStep[];
  /** "rows" = Text-Bild-Zeilen (Standard). "overlay" = Foto mit schwarzer Karte + grüner Timeline-Linie. */
  variant?: "rows" | "overlay";
};

/** Timeline mit Vollbild-Zeilen und Bild (Webflow Büroauflösung). */
export default function ImageStepsTimeline({
  id = "leistungen",
  heading,
  description,
  ctaHref = "#kontakt",
  ctaLabel = "Kontakt aufnehmen",
  steps,
  variant = "rows",
}: ImageStepsTimelineProps) {
  // ── Variante „overlay": Foto mit schwarzer Karte + grüner Timeline-Linie ──
  if (variant === "overlay") {
    return (
      <section
        id={id}
        className="bg-abyss-deep text-white"
        aria-labelledby="ba-timeline-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 text-center">
          <h2
            id="ba-timeline-heading"
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-heading tracking-[-0.03em] text-signal mb-5"
          >
            {heading}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-white/75 mb-8">
            {description}
          </p>
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* grüne Timeline-Linie (Desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-24 w-px -translate-x-1/2 bg-signal/40"
            aria-hidden="true"
          />
          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, i) => {
              const cardRight = i % 2 === 0;
              return (
                <div key={step.title} className="relative">
                  {/* Punkt auf der Linie */}
                  <div
                    className="hidden lg:block absolute left-1/2 top-10 h-3 w-3 -translate-x-1/2 rounded-full bg-signal"
                    aria-hidden="true"
                  />
                  <div className="relative min-h-[24rem] lg:min-h-[28rem] overflow-hidden">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
                    <div
                      className={`relative flex min-h-[24rem] lg:min-h-[28rem] items-center p-4 sm:p-8 ${
                        cardRight ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="w-full max-w-md bg-black/85 p-8 sm:p-10">
                        <h3 className="text-2xl sm:text-3xl font-heading tracking-[-0.02em] mb-5">
                          {step.title}
                        </h3>
                        {step.intro ? (
                          <p className="text-sm sm:text-base leading-relaxed text-white/75 mb-5">
                            {step.intro}
                          </p>
                        ) : null}
                        <CheckList items={step.bullets} className="text-white/85" />
                        {step.details ? (
                          <details className="mt-5 text-signal text-sm">
                            <summary className="cursor-pointer font-bold uppercase tracking-[0.08em]">
                              Mehr erfahren
                            </summary>
                            <p className="mt-2 text-white/70">{step.details}</p>
                          </details>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className="ba-timeline bg-white text-abyss-deep"
      aria-labelledby="ba-timeline-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 text-center">
        <h2
          id="ba-timeline-heading"
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-heading tracking-[-0.03em] text-signal mb-5"
        >
          {heading}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-black/75 mb-8">
          {description}
        </p>
        <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
      </div>

      <div className="ba-timeline__steps">
        {steps.map((step) => (
          <article
            key={step.title}
            className={`ba-timeline__row ba-timeline__row--image-${step.imageAlign}`}
          >
            <div className="ba-timeline__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <h3 className="text-xl sm:text-2xl font-heading tracking-[-0.02em] mb-4">
                {step.title}
              </h3>
              {step.intro ? (
                <p className="text-sm sm:text-base leading-relaxed text-black/75 mb-5">
                  {step.intro}
                </p>
              ) : null}
              <CheckList items={step.bullets} className="mb-6 text-black/80" />
              {step.details ? (
                <details className="ba-timeline__details">
                  <summary>Mehr erfahren</summary>
                  <p>{step.details}</p>
                </details>
              ) : null}
            </div>
            <div className="ba-timeline__media relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]">
              <Image
                src={step.imageSrc}
                alt={step.imageAlt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                loading="lazy"
              />
              <div className="ba-timeline__media-overlay" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
