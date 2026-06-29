"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/tracker";

const VIDEO_SRC = "/assets/hero/Home Hero Video.mp4";

/** Hero-Hintergrundvideo – ein einzelnes Video, kein separates Poster (vermeidet Bild-Flash). */
export default function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
      onPlay={() => {
        if (startedRef.current) return;
        startedRef.current = true;
        trackEvent("video_start", { video_id: "home__hero", autoplay: true });
      }}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
