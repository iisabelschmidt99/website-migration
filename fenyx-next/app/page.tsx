// Startseite (URL: "/").

import type { Metadata } from "next";
import LogoGrid from "@/components/LogoGrid";
import LifecycleSection from "@/components/LifecycleSection";
import PressMarquee from "@/components/PressMarquee";
import ReferencesArchitecturalG from "@/components/concepts/g/ReferencesArchitecturalG";
import ContactSection from "@/components/ContactSection";
import CtaButton from "@/components/CtaButton";
import HomeHeroVideo from "@/components/HomeHeroVideo";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "@/app/d/concept.css";
import "@/app/g/concept.css";
import "@/app/home-j.css";

export const revalidate = 60;

// SEO-Metadaten der Startseite (echte Werte aus dem Webflow-Original)
export const metadata: Metadata = {
  title: "Nachhaltige Bürotransformation aus einer Hand | Fenyx GmbH",
  description:
    "Nachhaltige Bürotransformationen aus einer Hand: Digitales Bestandsmanagement, Verwertung & schlüsselfertige Einrichtung. CO2 sparen, Kosten senken mit Fenyx.",
};

export default async function HomePage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0">
          <HomeHeroVideo />
          <div className="absolute inset-0 bg-[#2a1f12]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/92 via-[#151a12]/78 to-[#0f1410]/30" />
        </div>

        <div className="relative w-full wf-padding-global py-28 sm:py-36 lg:py-0">
          <div className="wf-container-xlarge">
            <div className="wf-max-width-large wf-max-width-large--hero">
              <h1
                id="hero-heading"
                className="wf-heading-h1 text-white mb-5"
              >
                Nachhaltige Bürotransformationen aus einer Hand.
              </h1>
              <p className="text-white wf-text-size-medium leading-snug mb-10">
                Von digitalem Bestandsmanagement über die nachhaltige Verwertung
                zur schlüsselfertigen Einrichtung.
              </p>
              <CtaButton href="/#kontakt">Kontakt aufnehmen</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <div className="dg-page home-j">
        {/* ── Logos (wie /j) ─────────────────────────────────────── */}
        <LogoGrid />

        {/* ── Leistungen / Lebenszyklus (wie /j) ─────────────────── */}
        <div id="leistungen">
          <LifecycleSection />
        </div>

        {/* ── Bekannt aus (wie /j) ───────────────────────────────── */}
        <PressMarquee />

        {/* ── Referenzen (wie /j) ────────────────────────────────── */}
        <ReferencesArchitecturalG projects={referenceProjects} />
      </div>

      {/* ── Kontakt ──────────────────────────────────────────────── */}
      <ContactSection formVariant="B" />
    </>
  );
}
