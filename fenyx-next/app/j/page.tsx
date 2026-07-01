// Konzept J — Mix-Version (Kopie von /g, mit H-Logo-Wand + H-Hero-Bild)
// URL: /j
// Hero:       Original-Video-Hero (wie g)
// Logos:      LogoWallColumns (h) – Depth Columns mit Scroll-Parallax
// Timeline:   TimelineCinematicG (g), überlappt die Logo-Wand (dh-timeline-overlap),
//             Bild „Schlüsselfertige Einrichtung" = H-Hero-Bild (f-hero.png)
// Press:      PressMarquee (shared)
// Referenzen: ReferencesArchitecturalG (g)
// Kontakt:    ContactSection

import type { Metadata } from "next";
import HomeHeroVideo from "@/components/HomeHeroVideo";
import CtaButton from "@/components/CtaButton";
import LogoWallColumns from "@/components/concepts/h/LogoWallColumns";
import TimelineCinematicG from "@/components/concepts/g/TimelineCinematicG";
import PressMarquee from "@/components/PressMarquee";
import ReferencesArchitecturalG from "@/components/concepts/g/ReferencesArchitecturalG";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "../d/concept.css";
import "../f/concept.css";
import "../g/concept.css";
import "../h/concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept J – Mix | Fenyx",
  description:
    "Mix-Vorschau: Video-Hero, Logo-Wand (h), Timeline mit Überlapp, Referenzen (g).",
  robots: { index: false, follow: false },
};

export default async function ConceptJPage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <div className="dg-page">
      {/* ── Hero: Original Video ───────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden"
        aria-labelledby="dj-hero-heading"
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
              <h1 id="dj-hero-heading" className="wf-heading-h1 text-white mb-5">
                Nachhaltige Bürotransformationen aus einer Hand.
              </h1>
              <p className="text-white wf-text-size-medium leading-snug mb-10">
                Von digitalem Bestandsmanagement über die nachhaltige Verwertung
                zur schlüsselfertigen Einrichtung.
              </p>
              <CtaButton href="/j#kontakt">Kontakt aufnehmen</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos: H-Depth-Wand ───────────────────────────────────── */}
      <LogoWallColumns />

      {/* ── Timeline (g) überlappt die Logo-Wand ──────────────────── */}
      <div className="dh-timeline-overlap">
        <TimelineCinematicG
          bestandImageSrc="/assets/concepts/g/bestandsmanagement-laptop.png"
          einrichtungImageSrc="/assets/concepts/f/f-hero.png"
        />
      </div>

      {/* ── Bekannt aus – Presse ──────────────────────────────────── */}
      <PressMarquee />

      {/* ── Referenzen: 6 Kacheln (g) ─────────────────────────────── */}
      <ReferencesArchitecturalG projects={referenceProjects} />

      {/* ── Kontakt ───────────────────────────────────────────────── */}
      <ContactSection />
    </div>
  );
}
