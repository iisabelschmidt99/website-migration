"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/assets/hero/Home Hero Video.mp4";

/** Hero-Hintergrundvideo – ein einzelnes Video, kein separates Poster (vermeidet Bild-Flash). */
export default function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
