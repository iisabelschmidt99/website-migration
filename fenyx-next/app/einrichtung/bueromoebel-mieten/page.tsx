import type { Metadata } from "next";
import VideoHero from "@/components/VideoHero";
import LogoGrid from "@/components/LogoGrid";
import PricingCardsSection from "@/components/PricingCardsSection";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import ImageSliderSection from "@/components/ImageSliderSection";
import GreenBenefitsTabs from "@/components/GreenBenefitsTabs";
import VideoSection from "@/components/VideoSection";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  bueromoebelMietenMeta,
  heroContent,
  pricingContent,
  challengesContent,
  sliderContent,
  audienceContent,
  videoContent,
  crossSellContent,
  referenzenContent,
  contactContent,
} from "@/data/bueromoebel-mieten";

export const metadata: Metadata = {
  title: bueromoebelMietenMeta.title,
  description: bueromoebelMietenMeta.description,
};

export default function BueromoebelMietenPage() {
  return (
    <div className="inv-page">
      <VideoHero {...heroContent} />

      <LogoGrid />

      <PricingCardsSection {...pricingContent} />

      <InventarisierungPhaseTabs
        heading={challengesContent.heading}
        introBody={challengesContent.introBody}
        tabs={challengesContent.tabs}
      />

      <ImageSliderSection {...sliderContent} />

      <GreenBenefitsTabs {...audienceContent} />

      <VideoSection {...videoContent} />

      <InvCrossSellSection {...crossSellContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
