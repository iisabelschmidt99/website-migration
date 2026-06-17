"use client";

import { useRef, useState } from "react";
import CtaButton from "./CtaButton";

type VideoFeatureSectionProps = {
  heading: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
  posterSrc: string;
  posterAlt: string;
  videoSrc: string;
};

/** Video links (1:1), Text rechts – Webflow section_video. */
export default function VideoFeatureSection({
  heading,
  body,
  ctaHref = "#kontakt",
  ctaLabel = "Kontakt aufnehmen",
  posterSrc,
  posterAlt,
  videoSrc,
}: VideoFeatureSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    if (!videoRef.current) return;
    void videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section
      className="py-20 sm:py-28 bg-white text-abyss-deep"
      aria-labelledby="video-feature-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-square bg-black/5 overflow-hidden">
            <video
              ref={videoRef}
              poster={posterSrc}
              controls={isPlaying}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              aria-label={posterAlt}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {!isPlaying ? (
              <button
                type="button"
                onClick={play}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                aria-label="Video abspielen"
              >
                <span className="w-16 h-16 rounded-full bg-signal flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-abyss-deep ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            ) : null}
          </div>

          <div>
            <h2
              id="video-feature-heading"
              className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-5"
            >
              {heading}
            </h2>
            <p className="text-base leading-relaxed text-black/75 mb-8">{body}</p>
            <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
