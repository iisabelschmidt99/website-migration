// Konzept E — „Editorial Premium" (Patina-dominant + Nornorm-POV)
// URL: /e
// POV: „Möbel sind kein Inventar. Sie sind eine Haltung."
// Wow: Magazine-Spread-Komposition mit Fotografie als Subjekt, mask-reveal
// Headlines (wipe-up), scroll-linked image scale, word-by-word Reveals.

import type { Metadata } from "next";
import HeroEditorialPremium from "@/components/concepts/e/HeroEditorialPremium";
import LogoGridEditorialPremium from "@/components/concepts/e/LogoGridEditorialPremium";
import TimelineEditorialPremium from "@/components/concepts/e/TimelineEditorialPremium";
import ReferencesEditorialPremium from "@/components/concepts/e/ReferencesEditorialPremium";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept E – Editorial Premium | Fenyx",
  description:
    "Editoriale Homepage-Vorschau — Magazine-Spread, Fotografie als Subjekt, mask-reveal Headlines, scroll-linked image scale.",
  robots: { index: false, follow: false },
};

export default async function ConceptEPage() {
  const referenceProjects = await getHomepageReferenceProjects();
  return (
    <>
      <HeroEditorialPremium />
      <LogoGridEditorialPremium />
      <TimelineEditorialPremium />
      <PressMarquee />
      <ReferencesEditorialPremium projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
