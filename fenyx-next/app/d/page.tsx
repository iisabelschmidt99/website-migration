// Konzept D – „Architectural Quiet" (interne Design-Vorschau, URL: /d)
// Nornorm × SpaceX: rasterbewusst, modular, ruhig, durch Material gewärmt.
// Server-Komponente, async – Referenzprojekte werden serverseitig geladen.

import "./concept.css";

import type { Metadata } from "next";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import HeroArchitectural from "@/components/concepts/d/HeroArchitectural";
import LogoGridArchitectural from "@/components/concepts/d/LogoGridArchitectural";
import TimelineArchitectural from "@/components/concepts/d/TimelineArchitectural";
import ReferencesArchitectural from "@/components/concepts/d/ReferencesArchitectural";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept D – Architectural Quiet | Fenyx",
  description:
    "Interne Design-Vorschau (Konzept D): rasterbewusste, modulare Startseite im Stil Architectural Quiet.",
  robots: { index: false, follow: false },
};

export default async function ConceptDPage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <div className="dd-root">
      <HeroArchitectural />
      <LogoGridArchitectural />
      <TimelineArchitectural />
      <PressMarquee />
      <ReferencesArchitectural projects={referenceProjects} />
      <ContactSection />
    </div>
  );
}
