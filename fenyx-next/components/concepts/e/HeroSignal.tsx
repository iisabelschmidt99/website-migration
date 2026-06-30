"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CtaButton from "@/components/CtaButton";

/**
 * Hero „Signal Quiet" – vollflächiger Dark-Hero mit Scan-Line-Bild,
 * feinem Signal-Raster, gestaffelten Headline-Zeilen, Versions-Tag und
 * 1px-Scroll-Fortschritt unten rechts. Subtiler Parallax über den Zustand.
 */
export default function HeroSignal() {
  const bgRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Scroll-getriebener Fortschritt nativ via CSS, sonst JS-Fallback.
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()");

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        setScrollPct(Math.round(progress * 100));

        if (!supportsScrollTimeline && fillRef.current) {
          fillRef.current.style.setProperty("--de-scroll", String(progress));
        }

        // Subtiler Parallax auf dem Hintergrundbild (nur ohne Reduced Motion).
        if (!reduceMotion && bgRef.current) {
          bgRef.current.style.transform = `translateY(${
            Math.min(window.scrollY, window.innerHeight) * 0.12
          }px)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="de-hero" data-de-section="Hero" aria-labelledby="de-hero-heading">
      <div ref={bgRef} className="de-hero__bg" aria-hidden="true">
        <Image
          src="/assets/concepts/e/e-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="de-hero__overlay" aria-hidden="true" />
      <div className="de-hero__grid" aria-hidden="true" />

      <span className="de-hero__tag de-eyebrow">FENYX / v0.E</span>

      <div className="de-hero__content wf-padding-global">
        <div className="wf-container-large">
          <h1 id="de-hero-heading" className="de-hero__headline font-heading">
            <span className="de-hero__line">Nachhaltige</span>
            <span className="de-hero__line">Bürotransformationen</span>
            <span className="de-hero__line">aus einer Hand.</span>
          </h1>
          <p className="de-hero__sub text-mist">
            Von digitalem Bestandsmanagement über die nachhaltige Verwertung
            zur schlüsselfertigen Einrichtung.
          </p>
          <CtaButton href="/e#kontakt">Kontakt aufnehmen</CtaButton>
        </div>
      </div>

      <div className="de-hero__progress" aria-hidden="true">
        <span className="de-hero__progress-label de-eyebrow">
          {String(scrollPct).padStart(2, "0")}%
        </span>
        <span className="de-hero__progress-track">
          <span ref={fillRef} className="de-hero__progress-fill" />
        </span>
      </div>
    </section>
  );
}
