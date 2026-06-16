import type { Metadata } from "next";
import InventarisierungHero from "@/components/InventarisierungHero";
import LogoGrid from "@/components/LogoGrid";
import VideoSection from "@/components/VideoSection";
import GreenCardsSection from "@/components/GreenCardsSection";
import FeatureRowSection from "@/components/FeatureRowSection";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import InventarisierungTimeline from "@/components/InventarisierungTimeline";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { verwertungContact } from "@/data/verwertung-contact";
import {
  aufbereitungMeta,
  heroContent,
  videoContent,
  greenCardsContent,
  revitalisierenContent,
  bereicheContent,
  timelineContent,
  crossSellContent,
  referenzenContent,
} from "@/data/aufbereitung";

export const metadata: Metadata = {
  title: aufbereitungMeta.title,
  description: aufbereitungMeta.description,
};

export default function AufbereitungPage() {
  return (
    <div className="inv-page">
      <InventarisierungHero {...heroContent} />

      <LogoGrid />

      <VideoSection {...videoContent} />

      <GreenCardsSection {...greenCardsContent} />

      <FeatureRowSection {...revitalisierenContent} />

      <InventarisierungPhaseTabs
        heading={bereicheContent.heading}
        introLead={bereicheContent.introLead}
        tabs={bereicheContent.tabs}
      />

      <InventarisierungTimeline {...timelineContent} />

      <InvCrossSellSection {...crossSellContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...verwertungContact} layout="formFirst" />
    </div>
  );
}
