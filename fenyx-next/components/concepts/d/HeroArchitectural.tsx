"use client";

// Konzept D – Hero „Architectural Quiet"
// Split-Layout: links axonometrisches Bild (full-bleed), rechts Text auf warmem
// hellem Grund. Bild bekommt sanfte Scroll-Parallaxe (max. 8 %), der Text
// blendet mit 200 ms Verzögerung ein. prefers-reduced-motion deaktiviert beides.

import Image from "next/image";
import { useEffect, useRef } from "react";
import CtaButton from "@/components/CtaButton";

export default function HeroArchitectural() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Text-Einblendung aktivieren (Klasse erst per JS, damit ohne JS sichtbar)
    section.classList.add("dd-js");
    requestAnimationFrame(() => section.classList.add("dd-in"));

    if (reduced || !img) return;

    function onFrame() {
      tickingRef.current = false;
      const rect = section!.getBoundingClientRect();
      const vh = window.innerHeight;
      // Fortschritt: -1 (über dem Viewport) … 1 (darunter)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, progress));
      // max. 8 % der Bildhöhe verschieben
      const shift = clamped * 8;
      img!.style.transform = `translate3d(0, ${shift}%, 0)`;
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(onFrame);
      }
    }

    onFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="dd-hero"
      aria-labelledby="dd-hero-heading"
    >
      <div className="dd-hero__grid">
        {/* Linke Hälfte: axonometrisches Architektur-Bild */}
        <div className="dd-hero__media order-1 lg:order-none">
          <Image
            ref={imgRef}
            src="/assets/concepts/d/d-hero.png"
            alt="Axonometrische Darstellung einer nachhaltig eingerichteten Bürolandschaft."
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="dd-hero__img"
          />
        </div>

        {/* Rechte Hälfte: Text auf warmem hellem Grund */}
        <div className="dd-hero__copy order-2 lg:order-none">
          <div className="wf-padding-global">
            <div className="px-0 py-16 sm:py-20 lg:py-24 lg:pl-12 xl:pl-20">
              <div className="dd-hero__reveal max-w-[34rem]">
                <div className="dd-rule mb-6" aria-hidden="true" />
                <p className="dd-eyebrow text-abyss/70">
                  <span className="dd-eyebrow__num">01 / 03</span>
                  <span aria-hidden="true">—</span>
                  <span>Nachhaltige Bürotransformation</span>
                </p>

                <h1
                  id="dd-hero-heading"
                  className="mt-8 font-heading text-h1 tracking-fenyx text-abyss text-[2.6rem] leading-[1.05] sm:text-[3.4rem] lg:text-h1"
                >
                  Nachhaltige Bürotransformationen aus einer Hand.
                </h1>

                <p className="dd-measure mt-6 font-sans text-base leading-relaxed text-abyss/75">
                  Von der digitalen Bestandsaufnahme über die ganzheitliche
                  Verwertung bis zur schlüsselfertigen Einrichtung – strukturiert,
                  ESG-konform und ohne Schnittstellenverlust.
                </p>

                <div className="mt-10">
                  <CtaButton href="/d#kontakt" trackId="concept_d__hero__cta">
                    Kontakt aufnehmen
                  </CtaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
