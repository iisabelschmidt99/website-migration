import type { Metadata } from "next";
import LogoGrid from "@/components/LogoGrid";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenzenInteractiveSection from "@/components/ReferenzenInteractiveSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  referenzenMeta,
  logoSectionContent,
  casesSectionContent,
  crossSellContent,
  contactContent,
} from "@/data/referenzen";

import { getReferenzenMapEntries } from "@/lib/references";

export const revalidate = 60;

export const metadata: Metadata = {
  title: referenzenMeta.title,
  description: referenzenMeta.description,
};

export default async function ReferenzenPage() {
  const mapEntries = await getReferenzenMapEntries();

  return (
    <div className="inv-page">
      <LogoGrid {...logoSectionContent} />

      <ReferenzenInteractiveSection {...casesSectionContent} entries={mapEntries} />

      <InvCrossSellSection {...crossSellContent} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
