"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import CtaButton from "./CtaButton";

type Slide = {
  src: string;
  alt: string;
};

type ImageSliderSectionProps = {
  heading: string;
  intro: string;
  slides: Slide[];
  ctaHref?: string;
  ctaLabel?: string;
};

/** Horizontaler Bild-Slider (Webflow section_img-slider). */
export default function ImageSliderSection({
  heading,
  intro,
  slides,
  ctaHref = "/referenzen",
  ctaLabel = "Zu den Referenzen",
}: ImageSliderSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="py-20 sm:py-28 bg-white text-abyss-deep"
      aria-labelledby="img-slider-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2
            id="img-slider-heading"
            className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-4"
          >
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-black/75">{intro}</p>
        </div>

        <div className="img-slider">
          <div ref={trackRef} className="img-slider__track" tabIndex={0}>
            {slides.map((slide) => (
              <div key={slide.src} className="img-slider__slide">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={720}
                  height={480}
                  className="img-slider__image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="img-slider__nav">
            <button
              type="button"
              className="img-slider__btn"
              onClick={() => scroll("prev")}
              aria-label="Vorheriges Bild"
            >
              <svg viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
                <path d="M17.0019 3.80378C16.5119 3.31378 15.7219 3.31378 15.2319 3.80378L6.92189 12.1138C6.53189 12.5038 6.53189 13.1338 6.92189 13.5238L15.2319 21.8338C15.7219 22.3238 16.5119 22.3238 17.0019 21.8338C17.4919 21.3438 17.4919 20.5538 17.0019 20.0638L9.76189 12.8138L17.0119 5.56378C17.4919 5.08378 17.4919 4.28378 17.0019 3.80378Z" />
              </svg>
            </button>
            <button
              type="button"
              className="img-slider__btn"
              onClick={() => scroll("next")}
              aria-label="Nächstes Bild"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.99811 21.0151C7.48811 21.5051 8.27811 21.5051 8.76811 21.0151L17.0781 12.7051C17.4681 12.3151 17.4681 11.6851 17.0781 11.2951L8.7681 2.98507C8.2781 2.49507 7.4881 2.49507 6.9981 2.98507C6.5081 3.47507 6.5081 4.26507 6.9981 4.75507L14.2381 12.0051L6.98811 19.2551C6.50811 19.7351 6.5081 20.5351 6.99811 21.0151Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          {ctaHref.startsWith("/") ? (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-signal text-abyss-deep text-[11px] font-bold uppercase tracking-[0.1em] hover:brightness-105 transition"
            >
              {ctaLabel}
            </Link>
          ) : (
            <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
