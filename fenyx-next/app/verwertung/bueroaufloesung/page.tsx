import type { Metadata } from "next";
import VideoHero from "@/components/VideoHero";
import LogoGrid from "@/components/LogoGrid";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import ImageStepsTimeline from "@/components/ImageStepsTimeline";
import StatsGrid from "@/components/StatsGrid";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  bueroaufloesungMeta,
  heroContent,
  versprechenContent,
  schritteContent,
  statsContent,
  referenzenContent,
} from "@/data/bueroaufloesung";
import { verwertungContact } from "@/data/verwertung-contact";

export const metadata: Metadata = {
  title: bueroaufloesungMeta.title,
  description: bueroaufloesungMeta.description,
};

export default function BueroaufloesungPage() {
  return (
    <div className="inv-page">
      <VideoHero {...heroContent} />

      <LogoGrid />

      <InventarisierungPhaseTabs
        heading={versprechenContent.heading}
        tabs={versprechenContent.tabs}
      />

      <ImageStepsTimeline {...schritteContent} />

      <StatsGrid {...statsContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...verwertungContact} layout="formFirst" />
    </div>
  );
}
