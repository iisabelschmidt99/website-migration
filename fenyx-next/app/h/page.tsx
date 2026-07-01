// Konzept H — „Depth Columns" (Klon von /f, nur Logo-Sektion neu)
// URL: /h
// Hero, Timeline, Referenzen 1:1 wie /f. Die Logo-Sektion wird zur
// atmosphärischen Kulisse: 6 vertikale Spalten, gestaffelt nach Tiefenebene
// (Blur/Deckkraft/Tempo), Überschrift scharf im Vordergrund. Beim
// Weiterscrollen gleitet die Timeline dramatisch über die gepinnte Wand.
// Vergleichsvariante zu /g (horizontale Reihen statt vertikaler Spalten).

import type { Metadata } from "next";
import HeroArchitectural from "@/components/concepts/h/HeroArchitectural";
import LogoWallColumns from "@/components/concepts/h/LogoWallColumns";
import TimelineArchitectural from "@/components/concepts/h/TimelineArchitectural";
import ReferencesArchitectural from "@/components/concepts/h/ReferencesArchitectural";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import { getHomepageReferenceProjects } from "@/lib/references";
import "@/components/concepts/shared/anim.css";
import "./concept.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept H – Depth Columns | Fenyx",
  description:
    "Homepage-Vorschau — Klon von Konzept F mit gepinnter Logo-Tiefenwand aus 6 vertikalen Spalten (Bokeh, Parallax-Tempo) und dramatischem Section-Overlap.",
  robots: { index: false, follow: false },
};

export default async function ConceptHPage() {
  const referenceProjects = await getHomepageReferenceProjects();
  return (
    <>
      <HeroArchitectural />
      <LogoWallColumns />
      <div className="dh-timeline-overlap">
        <TimelineArchitectural />
      </div>
      <PressMarquee />
      <ReferencesArchitectural projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
