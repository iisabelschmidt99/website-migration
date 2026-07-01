// Konzept C – „Editorial Quiet" (interne Design-Vorschau, URL: /c).
// Eines von drei parallelen Homepage-Konzepten. Magazin-Anmutung,
// Papier-/Patina-Wärme, einspaltige Erzählung, langsame redaktionelle Fades.

import "./concept.css";

import type { Metadata } from "next";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import EditorialReveal from "@/components/concepts/c/EditorialReveal";
import HeroEditorial from "@/components/concepts/c/HeroEditorial";
import LogoGridEditorial from "@/components/concepts/c/LogoGridEditorial";
import TimelineEditorial from "@/components/concepts/c/TimelineEditorial";
import ReferencesEditorial from "@/components/concepts/c/ReferencesEditorial";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept C – Editorial Quiet | Fenyx",
  description:
    "Interne Design-Vorschau (Konzept C): editorial-ruhige Startseite – Magazin-Anmutung, Papierwärme, langsame Scroll-Reveals.",
  robots: { index: false, follow: false },
};

export default async function ConceptCPage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    // `.dc` scoped die Editorial-Variablen + die warme Papier-Grundfläche.
    <div className="dc">
      {/* Scroll-Reveal-Fallback (IntersectionObserver) für ältere Browser. */}
      <EditorialReveal />

      <HeroEditorial />
      <LogoGridEditorial />
      <TimelineEditorial />
      <PressMarquee />
      <ReferencesEditorial projects={referenceProjects} />
      <ContactSection />
    </div>
  );
}
