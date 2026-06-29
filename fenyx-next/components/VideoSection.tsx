"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracker";

type VideoSectionProps = {
  heading: string;
  posterSrc: string;
  posterAlt: string;
  videoSrc?: string;
  dark?: boolean;
};

/** Einfache Video-Section mit Poster (Webflow section_full-video). */
export default function VideoSection({
  heading,
  posterSrc,
  posterAlt,
  videoSrc,
  dark = false,
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    if (!videoRef.current || !videoSrc) return;
    void videoRef.current.play();
    setIsPlaying(true);
    trackEvent("video_start", { video_id: heading.toLowerCase().replace(/\s+/g, "_") });
  };

  return (
    <section
      className={`py-20 sm:py-28 ${dark ? "bg-abyss-deep text-white" : "bg-white text-abyss-deep"}`}
      aria-labelledby="video-section-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="video-section-heading"
          className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-10 sm:mb-12"
        >
          {heading}
        </h2>
        <div className="relative aspect-video bg-black/10 overflow-hidden">
          {videoSrc ? (
            <video
              ref={videoRef}
              poster={posterSrc}
              controls={isPlaying}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterSrc}
              alt={posterAlt}
              className="w-full h-full object-cover"
            />
          )}
          {videoSrc && !isPlaying ? (
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors"
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
      </div>
    </section>
  );
}
