"use client";

// Konzept D — Cinematic Hero
// Full-viewport, abyss-deep, cinematic background image with scroll-driven
// blur-to-sharp. Word-by-word mask-reveal headline. Scroll-progress line.
// Sub reuses <Reveal>. CTA via shared <CtaButton>.

import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { Reveal, WordReveal } from "./Reveal";

export default function HeroCinematic() {
  return (
    <section
      className="dd-hero dd-root"
      aria-labelledby="dd-hero-heading"
    >
      <div className="dd-hero__bg dd-img">
        <Image
          src="/assets/concepts/d/d-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="dd-hero__scrim" aria-hidden="true" />

      <div className="dd-hero__content">
        <p className="dd-hero__eyebrow">Nachhaltige Bürotransformation</p>
        <WordReveal
          tag="h1"
          text="Was schon da ist, ist nicht fertig."
          className="dd-hero__headline"
        />
        <Reveal
          tag="p"
          className="dd-hero__sub"
          delay={300}
        >
          Fenyx verwandelt Bürobestand in Werte. Digital erfasst, nachhaltig
          verwertet, schlüsselfertig eingerichtet — aus einer Hand.
        </Reveal>
        <Reveal className="dd-hero__cta-row" delay={500}>
          <CtaButton href="/d#kontakt">Kontakt aufnehmen</CtaButton>
        </Reveal>
      </div>

      <div className="dd-hero__progress" aria-hidden="true" />
    </section>
  );
}
