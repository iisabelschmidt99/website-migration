// Konzept E – „Signal Quiet" (techy, aber leise; Dark-first). URL: /e
// Interne Design-Vorschau, nicht indexiert.
import "./concept.css";

import type { Metadata } from "next";
import { getHomepageReferenceProjects } from "@/lib/references";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import HeroSignal from "@/components/concepts/e/HeroSignal";
import LogoGridSignal from "@/components/concepts/e/LogoGridSignal";
import TimelineSignal from "@/components/concepts/e/TimelineSignal";
import ReferencesSignal from "@/components/concepts/e/ReferencesSignal";
import DebugEasterEgg from "@/components/concepts/e/DebugEasterEgg";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Konzept E – Signal Quiet | Fenyx",
  description:
    "Interne Design-Vorschau – dunkle, techy Signal-Quiet-Richtung der Fenyx-Startseite.",
  robots: { index: false, follow: false },
};

export default async function KonzeptEPage() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <>
      <HeroSignal />
      <LogoGridSignal />
      <TimelineSignal />

      {/* Wrapper liefern dem Debug-Overlay erkennbare Sektionsnamen. */}
      <div data-de-section="Presse">
        <PressMarquee />
      </div>

      <ReferencesSignal projects={referenceProjects} />

      <div data-de-section="Kontakt">
        <ContactSection />
      </div>

      {/* Global gemountetes Easter Egg – unsichtbar bis zum Konami-Code. */}
      <DebugEasterEgg />
    </>
  );
}
