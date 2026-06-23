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
import { getTeamSections } from "@/lib/team";

export const metadata: Metadata = {
  title: ueberUnsMeta.title,
  description: ueberUnsMeta.description,
};

// Team-Mitglieder kommen aus Supabase (mit statischem Fallback) -> regelmäßig
// neu generieren, damit Änderungen im Backend zeitnah erscheinen.
export const revalidate = 60;

export default async function UeberUnsPage() {
  const team = await getTeamSections();

  return (
    <div className="inv-page">
      <VideoHero {...heroContent} />

      <StatsGrid {...statsContent} />

      <ValuePromiseTabs {...valuePromiseContent} />

      <TeamGridSection
        heading={expertsContent.heading}
        members={team.experts}
        variant="experts"
      />

      <TeamGridSection
        heading={dachTeamContent.heading}
        members={team.dach}
        variant="dach"
      />

      <LocationsSection {...locationsSectionContent} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
