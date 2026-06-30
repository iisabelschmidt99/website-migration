// Konzept D — „Cinematic Sequence" (SpaceX-dominant, dark-first)
// URL: /d
// POV: „Was schon da ist, ist nicht fertig."
// Wow: Scroll-getriebene Section-Crossfades, word-by-word mask Reveals,
// blur-to-sharp auf cinematic Visuals.

import type { Metadata } from "next";
import HeroCinematic from "@/components/concepts/d/HeroCinematic";
import LogoGridCinematic from "@/components/concepts/d/LogoGridCinematic";
import TimelineCinematic from "@/components/concepts/d/TimelineCinematic";
import ReferencesCinematic from "@/components/concepts/d/ReferencesCinematic";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept D – Cinematic Sequence | Fenyx",
  description:
    "Dunkle cineastische Homepage-Vorschau — scroll-getriebene Section-Crossfades, word-by-word Reveals, photorealistic Visuals.",
  robots: { index: false, follow: false },
};

export default async function ConceptDPage() {
  const referenceProjects = await getHomepageReferenceProjects();
  return (
    <>
      <HeroCinematic />
      <LogoGridCinematic />
      <TimelineCinematic />
      <PressMarquee />
      <ReferencesCinematic projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
