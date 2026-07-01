"use client";

// Konzept H — Depth Columns (Klon von F, nur Hero-Assets identisch).
// Split: Architektur-Bild links, POV-Typografie rechts auf mist-soft.
// Numbered Eyebrow (01 / 03), word-by-word mask-reveal Headline.

import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { Reveal, WordReveal } from "./Reveal";

export default function HeroArchitectural() {
  return (
    <section
      className="dh-hero dh-root"
      aria-labelledby="dh-hero-heading"
    >
      <div className="dh-hero__media dh-img">
        <Image
          src="/assets/concepts/f/f-hero.png"
          alt="Architektonische Innenraumphotografie eines modernen strukturierten Büros mit warmen Materialien."
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="dh-hero__copy">
        <p className="dh-hero__index">
          <span className="dh-hero__index-num">01 / 03</span>
          <span>Nachhaltige Bürotransformation</span>
        </p>
        <WordReveal
          tag="h1"
          text="Büromöbel sind keine Ausgabe. Sie sind eine Entscheidung."
          className="dh-hero__headline"
        />
        <Reveal tag="p" className="dh-hero__sub" delay={400}>
          Fenyx verwandelt Bestände in messbaren Wert — inventarisiert,
          aufbereitet, wiederverwertet. Aus einer Hand, mit klaren Zahlen.
        </Reveal>
        <Reveal className="dh-hero__cta-row" delay={600}>
          <CtaButton href="/h#kontakt">Kontakt aufnehmen</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
