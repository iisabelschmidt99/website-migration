// Konzept F — „Architectural POV" (Nornorm-dominant + Augustus-restraint + SpaceX-spec)
// URL: /f
// POV: „Büromöbel sind keine Ausgabe. Sie sind eine Entscheidung."
// Wow: Strong POV-Headline, numbered sections, scroll-linked spec-fill
// (Underline wächst pro Spec-Row beim Scrollen), alternating abyss/mist-soft.

import type { Metadata } from "next";
import HeroArchitectural from "@/components/concepts/f/HeroArchitectural";
import LogoGridArchitectural from "@/components/concepts/f/LogoGridArchitectural";
import TimelineArchitectural from "@/components/concepts/f/TimelineArchitectural";
import ReferencesArchitectural from "@/components/concepts/f/ReferencesArchitectural";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept F – Architectural POV | Fenyx",
  description:
    "Architektonische Homepage-Vorschau — POV-Headline, numbered sections, scroll-linked spec-fill, alternating abyss/mist-soft.",
  robots: { index: false, follow: false },
};

export default async function ConceptFPage() {
  const referenceProjects = await getHomepageReferenceProjects();
  return (
    <>
      <HeroArchitectural />
      <LogoGridArchitectural />
      <TimelineArchitectural />
      <PressMarquee />
      <ReferencesArchitectural projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
