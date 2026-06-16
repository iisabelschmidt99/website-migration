import type { Metadata } from "next";
import InventarisierungHero from "@/components/InventarisierungHero";
import FeatureRowSection from "@/components/FeatureRowSection";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { verwertungContact } from "@/data/verwertung-contact";
import {
  spendeMeta,
  heroContent,
  netzwerkContent,
  crossSellContent,
  referenzenContent,
} from "@/data/spende";

export const metadata: Metadata = {
  title: spendeMeta.title,
  description: spendeMeta.description,
};

export default function SpendePage() {
  return (
    <div className="inv-page">
      <InventarisierungHero {...heroContent} />

      <FeatureRowSection {...netzwerkContent} />

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
