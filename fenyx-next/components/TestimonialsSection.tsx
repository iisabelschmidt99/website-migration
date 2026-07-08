"use client";

// Kundenstimmen-Slider „Erfahrungen mit Fenyx." (wie im Webflow-Original).
import { useRef } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  heading?: string;
  /** true = einzelne Stimme zentriert (ohne Slider/Pfeile). */
  centered?: boolean;
};

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <li className="testimonial-card">
      <div
        className="testimonial-quote [&_p]:m-0 [&_p+p]:mt-3"
        dangerouslySetInnerHTML={{ __html: t.quote }}
      />

      <div className="testimonial-card__footer">
        {t.imageSrc ? (
          <Image
            src={t.imageSrc}
            alt={t.imageAlt}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover shrink-0"
            loading="lazy"
          />
        ) : null}
        <div className="min-w-0">
          <p className="testimonial-card__name">{t.name}</p>
          {t.roleCompany ? (
            <p className="testimonial-card__role">{t.roleCompany}</p>
          ) : null}
        </div>
        {t.logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.logoSrc}
            alt=""
            className="ml-auto max-h-8 w-auto object-contain opacity-80 shrink-0"
            loading="lazy"
          />
        ) : null}
      </div>
    </li>
  );
}

export default function TestimonialsSection({
  testimonials,
  heading = "Erfahrungen mit Fenyx.",
  centered = false,
}: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (!testimonials || testimonials.length === 0) return null;

  const useGrid = centered || testimonials.length <= 2;
  const showNav = testimonials.length > 2 && !centered;

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  }

  const gridClass =
    testimonials.length === 1
      ? "testimonials-grid testimonials-grid--single"
      : "testimonials-grid testimonials-grid--duo";

  return (
    <section
      className="section_testimonials bg-abyss-deep text-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="testimonials-header">
              <h2 id="testimonials-heading" className="wf-heading-h2">
                {heading}
              </h2>

              {showNav ? (
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollBy(-1)}
                    className="w-11 h-11 border border-white/20 flex items-center justify-center hover:border-signal hover:text-signal transition-colors"
                    aria-label="Vorherige Kundenstimme"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBy(1)}
                    className="w-11 h-11 border border-white/20 flex items-center justify-center hover:border-signal hover:text-signal transition-colors"
                    aria-label="Nächste Kundenstimme"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>

            <ul
              ref={useGrid ? undefined : trackRef}
              className={useGrid ? gridClass : "testimonials-track"}
            >
              {testimonials.map((t) => (
                <TestimonialCard key={t.slug} t={t} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
