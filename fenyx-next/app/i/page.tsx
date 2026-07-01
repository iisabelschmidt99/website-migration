// Konzept I — „Cinematic Depth Wall" (Klon von /f, nur Logo-Sektion neu)
// URL: /i
// Hero, Timeline, Referenzen 1:1 wie /f. Die Logo-Sektion wird zur
// atmosphärischen Kulisse: 3 große Reihen, weiße Sektion, opaker Scrim
// hinter dem Text, subtiler Scroll-Parallax für die ganze Wand.

import type { Metadata } from "next";
import HeroArchitectural from "@/components/concepts/i/HeroArchitectural";
import LogoWallHorizontal from "@/components/concepts/i/LogoWallHorizontal";
import TimelineArchitectural from "@/components/concepts/i/TimelineArchitectural";
import ReferencesArchitectural from "@/components/concepts/i/ReferencesArchitectural";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept I – Cinematic Depth Wall | Fenyx",
  description:
    "Homepage-Vorschau — Klon von Konzept F mit Logo-Tiefenwand (Scroll-Parallax, Bokeh-Scrim hinter dem Text) und Section-Overlap.",
  robots: { index: false, follow: false },
};

export default async function ConceptIPage() {
  const referenceProjects = await getHomepageReferenceProjects();
  return (
    <>
      <HeroArchitectural />
      <LogoWallHorizontal />
      <div className="di-timeline-overlap">
        <TimelineArchitectural />
      </div>
      <PressMarquee />
      <ReferencesArchitectural projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
