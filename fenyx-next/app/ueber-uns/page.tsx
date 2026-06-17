import type { Metadata } from "next";
import VideoHero from "@/components/VideoHero";
import StatsGrid from "@/components/StatsGrid";
import ValuePromiseTabs from "@/components/ValuePromiseTabs";
import TeamGridSection from "@/components/TeamGridSection";
import LocationsSection from "@/components/LocationsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  ueberUnsMeta,
  heroContent,
  statsContent,
  valuePromiseContent,
  expertsContent,
  dachTeamContent,
  contactContent,
} from "@/data/ueber-uns";
import { locationsSectionContent } from "@/data/standorte";

export const metadata: Metadata = {
  title: ueberUnsMeta.title,
  description: ueberUnsMeta.description,
};

export default function UeberUnsPage() {
  return (
    <div className="inv-page">
      <VideoHero {...heroContent} />

      <StatsGrid {...statsContent} />

      <ValuePromiseTabs {...valuePromiseContent} />

      <TeamGridSection {...expertsContent} variant="experts" />

      <TeamGridSection {...dachTeamContent} variant="dach" />

      <LocationsSection {...locationsSectionContent} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
