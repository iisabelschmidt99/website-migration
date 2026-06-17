import type { Metadata } from "next";
import VideoHero from "@/components/VideoHero";
import LogoGrid from "@/components/LogoGrid";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import ImageStepsTimeline from "@/components/ImageStepsTimeline";
import PressMarquee from "@/components/PressMarquee";
import VideoFeatureSection from "@/components/VideoFeatureSection";
import GreenBenefitsTabs from "@/components/GreenBenefitsTabs";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  bueroeinrichtungMeta,
  heroContent,
  challengesContent,
  methodeContent,
  videoFeatureContent,
  garantienContent,
  referenzenContent,
  contactContent,
} from "@/data/bueroeinrichtung";

export const metadata: Metadata = {
  title: bueroeinrichtungMeta.title,
  description: bueroeinrichtungMeta.description,
};

export default function BueroeinrichtungPage() {
  return (
    <div className="inv-page">
      <VideoHero {...heroContent} />

      <LogoGrid />

      <InventarisierungPhaseTabs
        tabs={challengesContent.tabs}
        variant="light"
      />

      <ImageStepsTimeline
        id="leistungen"
        heading={methodeContent.heading}
        description={methodeContent.description}
        steps={methodeContent.steps}
      />

      <PressMarquee />

      <VideoFeatureSection {...videoFeatureContent} />

      <GreenBenefitsTabs {...garantienContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
