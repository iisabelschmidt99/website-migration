"use client";

// Kundenstimmen-Slider „Erfahrungen mit Fenyx." (wie im Webflow-Original).
// Horizontaler Scroll-Snap-Track mit Vor/Zurück-Pfeilen (nur sichtbar ab 2
// Karten). Rendert nichts, wenn keine Stimmen übergeben werden.
import { useRef } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  heading?: string;
};

export default function TestimonialsSection({
  testimonials,
  heading = "Erfahrungen mit Fenyx.",
}: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (!testimonials || testimonials.length === 0) return null;

  const showNav = testimonials.length > 1;

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section
      className="section_testimonials bg-abyss-deep text-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="flex items-end justify-between gap-6 mb-10">
              <h2
                id="testimonials-heading"
                className="wf-heading-h2 max-w-2xl"
              >
                {heading}
              </h2>

              {showNav ? (
                <div className="hidden sm:flex gap-3 shrink-0">
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
              ref={trackRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((t) => (
                <li
                  key={t.slug}
                  className="snap-start shrink-0 w-[88%] sm:w-[460px] max-w-full bg-abyss border border-white/10 p-8 flex flex-col"
                >
                  <div
                    className="testimonial-quote text-mist-soft text-base leading-relaxed [&_p]:m-0 [&_p+p]:mt-3"
                    dangerouslySetInnerHTML={{ __html: t.quote }}
                  />

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
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
                      <p className="text-white font-semibold leading-tight">{t.name}</p>
                      {t.roleCompany ? (
                        <p className="text-mist text-sm leading-tight mt-0.5">{t.roleCompany}</p>
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
