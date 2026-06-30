"use client";

// Konzept E — Editorial-Premium Hero (Magazine-Spread).
// Links: oversized Telegraf POV-Headline (word-by-word mask-reveal).
// Rechts: full-bleed photographische Skulptur als SUBJEKT (scroll-linked scale).
// Mist-soft Hintergrund, abyss ink, signal accent.

import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { Reveal, WordReveal } from "./Reveal";

export default function HeroEditorialPremium() {
  return (
    <section
      className="de-hero de-root"
      aria-labelledby="de-hero-heading"
    >
      <div className="de-hero__copy">
        <p className="de-hero__eyebrow">Nachhaltige Bürotransformation</p>
        <WordReveal
          tag="h1"
          text="Möbel sind kein Inventar. Sie sind eine Haltung."
          className="de-hero__headline"
        />
        <Reveal tag="p" className="de-hero__sub" delay={400}>
          Fenyx verwandelt Büromöbel in Werte — durch Bestand, Aufbereitung
          und neue Konzepte. Aus einer Hand, mit messbarem Ergebnis.
        </Reveal>
        <Reveal className="de-hero__cta-row" delay={600}>
          <CtaButton href="/e#kontakt">Kontakt aufnehmen</CtaButton>
        </Reveal>
      </div>

      <div className="de-hero__media de-img">
        <Image
          src="/assets/concepts/e/e-hero.png"
          alt="Skulpturaler aufbereiteter Bürostuhl als museales Subjekt vor hellblauem Studio-Hintergrund."
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
