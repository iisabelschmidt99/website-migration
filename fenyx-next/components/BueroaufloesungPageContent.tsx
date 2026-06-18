import VideoHero from "@/components/VideoHero";
import LogoGrid from "@/components/LogoGrid";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import ImageStepsTimeline from "@/components/ImageStepsTimeline";
import StatsGrid from "@/components/StatsGrid";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  heroContent,
  versprechenContent,
  schritteContent,
  statsContent,
  referenzenContent,
} from "@/data/bueroaufloesung";
import { verwertungContact } from "@/data/verwertung-contact";

type BueroaufloesungPageContentProps = {
  heroHeading?: string;
  heroDescription?: string;
};

/** Gemeinsame Büroauflösungs-Seite (DE/AT/CH/Kampagnen). */
export default function BueroaufloesungPageContent({
  heroHeading,
  heroDescription,
}: BueroaufloesungPageContentProps) {
  const hero = {
    ...heroContent,
    heading: heroHeading ?? heroContent.heading,
    description: heroDescription ?? heroContent.description,
  };

  return (
    <div className="inv-page">
      <VideoHero {...hero} />

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

      <ServiceContactSection {...verwertungContact} />
    </div>
  );
}
