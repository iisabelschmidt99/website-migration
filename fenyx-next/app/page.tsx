// Startseite (URL: "/").

import LogoGrid from "@/components/LogoGrid";
import LifecycleSection from "@/components/LifecycleSection";
import PressMarquee from "@/components/PressMarquee";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ContactSection from "@/components/ContactSection";
import CtaButton from "@/components/CtaButton";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/timeline/timeline.webp"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/assets/hero/Home Hero Video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#2a1f12]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/92 via-[#151a12]/78 to-[#0f1410]/30" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-0">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl">
            <h1
              id="hero-heading"
              className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-black leading-[1.08] tracking-[-0.03em] mb-5"
            >
              Nachhaltige Bürotransformationen aus einer Hand.
            </h1>
            <p className="text-white text-xs sm:text-[13px] lg:text-sm leading-snug mb-10 lg:whitespace-nowrap">
              Von digitalem Bestandsmanagement über die nachhaltige Verwertung
              zur schlüsselfertigen Einrichtung.
            </p>
            <CtaButton href="/#kontakt">Kontakt aufnehmen</CtaButton>
          </div>
        </div>
      </section>

      {/* ── Referenzen-Logogrid ──────────────────────────────────── */}
      <LogoGrid />

      {/* ── Leistungen / Lebenszyklus ────────────────────────────── */}
      <LifecycleSection />

      {/* ── Bekannt aus (Presse-Marquee) ─────────────────────────── */}
      <PressMarquee />

      {/* ── Referenz-Projekte (Case Studies) ─────────────────────── */}
      <ReferenceProjectsSection />

      {/* ── Kontakt ──────────────────────────────────────────────── */}
      <ContactSection />
    </>
  );
}
