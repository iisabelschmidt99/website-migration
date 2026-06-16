import Image from "next/image";
import CtaButton from "./CtaButton";

type TimelineStep = {
  num: string;
  title: string;
  body: string;
  align: "left" | "right";
  cta?: { label: string; href: string };
};

type InventarisierungTimelineProps = {
  heading: string;
  steps: TimelineStep[];
  backgroundSrc?: string;
  backgroundAlt?: string;
  variant?: "dark" | "light";
};

/** 6-Schritte-Timeline mit Hintergrundbild (Webflow section_timeline). */
export default function InventarisierungTimeline({
  heading,
  steps,
  backgroundSrc,
  backgroundAlt = "",
  variant = "dark",
}: InventarisierungTimelineProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`inv-timeline${isDark ? "" : " inv-timeline--light"}`}
      aria-labelledby="inv-timeline-heading"
    >
      {backgroundSrc ? (
        <div className="inv-timeline__bg" aria-hidden="true">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            loading="lazy"
          />
          <div className="inv-timeline__bg-overlay" />
        </div>
      ) : null}

      <div className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h2
          id="inv-timeline-heading"
          className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] text-center text-signal mb-14 sm:mb-20"
        >
          {heading}
        </h2>

        <div className="inv-timeline__track">
          <div className="inv-timeline__line" aria-hidden="true" />

          <ol className="inv-timeline__list">
            {steps.map((step) => (
              <li
                key={step.num}
                className={`inv-timeline__row inv-timeline__row--${step.align}`}
              >
                <div className="inv-timeline__spacer" aria-hidden="true" />
                <div className="inv-timeline__dot-wrap" aria-hidden="true">
                  <span className="inv-timeline__dot" />
                </div>
                <article className="inv-timeline__card">
                  <h3 className="inv-timeline__card-title">
                    {step.num}. {step.title}
                  </h3>
                  {step.body.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="inv-timeline__card-body">
                      {paragraph.split("\n").map((line, i, arr) => (
                        <span key={line.slice(0, 20)}>
                          {line}
                          {i < arr.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  ))}
                  {step.cta ? (
                    <div className="mt-6">
                      <CtaButton
                        href={step.cta.href}
                        variant="outline"
                        className="border-signal text-signal hover:border-signal hover:text-signal"
                      >
                        {step.cta.label}
                      </CtaButton>
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
