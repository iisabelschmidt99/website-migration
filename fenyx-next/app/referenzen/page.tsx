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

export const metadata: Metadata = {
  title: referenzenMeta.title,
  description: referenzenMeta.description,
};

export default function ReferenzenPage() {
  return (
    <div className="inv-page">
      <LogoGrid {...logoSectionContent} />

      <ReferenzenInteractiveSection {...casesSectionContent} />

      <InvCrossSellSection {...crossSellContent} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
