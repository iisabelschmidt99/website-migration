"use client";

// Konzept I — Cinematic Depth Wall (Klon von F, nur Hero-Assets identisch).
// Split: Architektur-Bild links, POV-Typografie rechts auf mist-soft.
// Numbered Eyebrow (01 / 03), word-by-word mask-reveal Headline.

import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { Reveal, WordReveal } from "./Reveal";

export default function HeroArchitectural() {
  return (
    <section
      className="di-hero di-root"
      aria-labelledby="di-hero-heading"
    >
      <div className="di-hero__media di-img">
        <Image
          src="/assets/concepts/f/f-hero.png"
          alt="Architektonische Innenraumphotografie eines modernen strukturierten Büros mit warmen Materialien."
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="di-hero__copy">
        <p className="di-hero__index">
          <span className="di-hero__index-num">01 / 03</span>
          <span>Nachhaltige Bürotransformation</span>
        </p>
        <WordReveal
          tag="h1"
          text="Büromöbel sind keine Ausgabe. Sie sind eine Entscheidung."
          className="di-hero__headline"
        />
        <Reveal tag="p" className="di-hero__sub" delay={400}>
          Fenyx verwandelt Bestände in messbaren Wert — inventarisiert,
          aufbereitet, wiederverwertet. Aus einer Hand, mit klaren Zahlen.
        </Reveal>
        <Reveal className="di-hero__cta-row" delay={600}>
          <CtaButton href="/i#kontakt">Kontakt aufnehmen</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
