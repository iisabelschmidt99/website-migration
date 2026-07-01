// Konzept G — Mix-Version
// URL: /g
// Hero:       Original-Video-Hero
// Logos:      LogoGridArchitectural (f)
// Timeline:   TimelineCinematic (d)
// Press:      PressMarquee (shared)
// Referenzen: ReferencesArchitecturalG (g, basiert auf f) – 6 Kacheln, dunkler BG
// Kontakt:    ContactSection auf weißem Hintergrund

import type { Metadata } from "next";
import HomeHeroVideo from "@/components/HomeHeroVideo";
import CtaButton from "@/components/CtaButton";
import LogoGridArchitecturalG from "@/components/concepts/g/LogoGridArchitecturalG";
import TimelineCinematicG from "@/components/concepts/g/TimelineCinematicG";
import PressMarquee from "@/components/PressMarquee";
import ReferencesArchitecturalG from "@/components/concepts/g/ReferencesArchitecturalG";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "../d/concept.css";
import "../f/concept.css";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept G – Mix | Fenyx",
  description: "Mix-Vorschau: Video-Hero, Logos (f), Timeline (d), Referenzen (f).",
  robots: { index: false, follow: false },
};

export default async function ConceptGPage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <div className="dg-page">
      {/* ── Hero: Original Video ───────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden"
        aria-labelledby="dg-hero-heading"
      >
        <div className="absolute inset-0">
          <HomeHeroVideo />
          <div className="absolute inset-0 bg-[#2a1f12]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/92 via-[#151a12]/78 to-[#0f1410]/30" />
          <div className="dg-hero-fade" aria-hidden="true" />
        </div>
        <div className="relative w-full wf-padding-global py-28 sm:py-36 lg:py-0">
          <div className="wf-container-xlarge">
            <div className="wf-max-width-large wf-max-width-large--hero">
              <h1 id="dg-hero-heading" className="wf-heading-h1 text-white mb-5">
                Nachhaltige Bürotransformationen aus einer Hand.
              </h1>
              <p className="text-white wf-text-size-medium leading-snug mb-10">
                Von digitalem Bestandsmanagement über die nachhaltige Verwertung
                zur schlüsselfertigen Einrichtung.
              </p>
              <CtaButton href="/g#kontakt">Kontakt aufnehmen</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos (g) ─────────────────────────────────────────────── */}
      <LogoGridArchitecturalG />

      {/* ── Intro vor Timeline: weiß ──────────────────────────────── */}
      <section className="dg-intro" aria-labelledby="dg-intro-heading">
        <div className="dg-intro__inner wf-padding-global">
          <div className="wf-container-large">
            <h2 id="dg-intro-heading" className="dg-intro__heading">
              Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
            </h2>
            <p className="dg-intro__body">
              Nachhaltige Bürotransformation bedeutet mehr als Produktzertifikate.
              Mit Fenyx gewinnen Sie einen Partner, der Kosteneinsparungen messbar macht,
              Nachhaltigkeit transparent dokumentiert und Ihr Projekt strukturiert begleitet
              – von der Analyse bis zur Umsetzung.
            </p>
            <a href="/g#kontakt" className="dg-intro__cta">
              Kontakt aufnehmen <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Timeline (g) ──────────────────────────────────────────── */}
      <TimelineCinematicG />

      {/* ── Bekannt aus – Presse ──────────────────────────────────── */}
      <PressMarquee />

      {/* ── Referenzen: 6 Kacheln, schwarz (g) ───────────────────── */}
      <ReferencesArchitecturalG projects={referenceProjects} />

      {/* ── Kontakt ───────────────────────────────────────────────── */}
      <ContactSection />
    </div>
  );
}
