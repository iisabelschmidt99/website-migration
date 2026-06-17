import type { Metadata } from "next";
import InventarisierungHero from "@/components/InventarisierungHero";
import LogoGrid from "@/components/LogoGrid";
import GreenCardsSection from "@/components/GreenCardsSection";
import FeatureRowSection from "@/components/FeatureRowSection";
import InventarisierungTimeline from "@/components/InventarisierungTimeline";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  workspaceAnalyticsMeta,
  heroContent,
  greenCardsContent,
  grundlagenContent,
  timelineContent,
  crossSellContent,
  erkenntnisseContent,
  potenzialContent,
  referenzenContent,
  contactContent,
} from "@/data/workspace-analytics";

export const metadata: Metadata = {
  title: workspaceAnalyticsMeta.title,
  description: workspaceAnalyticsMeta.description,
};

export default function WorkspaceAnalyticsPage() {
  return (
    <div className="inv-page">
      <InventarisierungHero {...heroContent} />

      <LogoGrid />

      <GreenCardsSection {...greenCardsContent} />

      <FeatureRowSection {...grundlagenContent} />

      <InventarisierungTimeline {...timelineContent} />

      <InvCrossSellSection {...crossSellContent} />

      <FeatureRowSection {...erkenntnisseContent} />

      <FeatureRowSection {...potenzialContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
