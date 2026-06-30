"use client";

// Konzept F — Architectural-Pov Hero.
// Split: Architektur-Bild links, POV-Typografie rechts auf mist-soft.
// Numbered Eyebrow (01 / 03), word-by-word mask-reveal Headline.

import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { Reveal, WordReveal } from "./Reveal";

export default function HeroArchitectural() {
  return (
    <section
      className="df-hero df-root"
      aria-labelledby="df-hero-heading"
    >
      <div className="df-hero__media df-img">
        <Image
          src="/assets/concepts/f/f-hero.png"
          alt="Architektonische Innenraumphotografie eines modernen strukturierten Büros mit warmen Materialien."
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="df-hero__copy">
        <div className="df-hero__meta" aria-hidden="true">
          <span className="df-hero__meta-tag">Fenyx · Konzept F</span>
          <span>Architectural POV</span>
        </div>
        <p className="df-hero__index">
          <span className="df-hero__index-num">01 / 03</span>
          <span>Nachhaltige Bürotransformation</span>
        </p>
        <WordReveal
          tag="h1"
          text="Büromöbel sind keine Ausgabe. Sie sind eine Entscheidung."
          className="df-hero__headline"
        />
        <Reveal tag="p" className="df-hero__sub" delay={400}>
          Fenyx verwandelt Bestände in messbaren Wert — inventarisiert,
          aufbereitet, wiederverwertet. Aus einer Hand, mit klaren Zahlen.
        </Reveal>
        <Reveal className="df-hero__cta-row" delay={600}>
          <CtaButton href="/f#kontakt">Kontakt aufnehmen</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
