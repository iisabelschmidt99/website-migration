// Design V1 — „Belege“ (proof-first, ruhig & vertrauensbildend).
// URL: /design/v1

import type { Metadata } from "next";
import LogoGrid from "@/components/LogoGrid";
import PressMarquee from "@/components/PressMarquee";
import ContactSection from "@/components/ContactSection";
import DesignV1Hero from "@/components/design/v1/DesignV1Hero";
import DesignV1ProofRow from "@/components/design/v1/DesignV1ProofRow";
import DesignV1Timeline from "@/components/design/v1/DesignV1Timeline";
import DesignV1ReferencesSection from "@/components/design/v1/DesignV1ReferencesSection";
import { getHomepageReferenceProjects } from "@/lib/references";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Design V1 – Belege | Fenyx",
  description:
    "Redesign V1: proof-first – Video-Hero, Kennzahlen nebeneinander, Full-Bleed-Timeline, kompakte Referenz-Kacheln.",
  robots: { index: false, follow: false },
};

export default async function DesignV1Page() {
  const referenceProjects = await getHomepageReferenceProjects();

  return (
    <>
      <DesignV1Hero />
      <LogoGrid description="" />
      <DesignV1ProofRow />
      <DesignV1Timeline />
      <PressMarquee />
      <DesignV1ReferencesSection projects={referenceProjects} />
      <ContactSection />
    </>
  );
}
