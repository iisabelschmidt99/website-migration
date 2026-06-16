import type { Metadata } from "next";
import InventarisierungHero from "@/components/InventarisierungHero";
import FeatureRowSection from "@/components/FeatureRowSection";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  projektmanagementMeta,
  heroContent,
  standortContent,
  kreislaufContent,
  ressourcenCtaContent,
  referenzenContent,
  contactContent,
} from "@/data/projektmanagement";

export const metadata: Metadata = {
  title: projektmanagementMeta.title,
  description: projektmanagementMeta.description,
};

export default function ProjektmanagementPage() {
  return (
    <div className="inv-page">
      <InventarisierungHero {...heroContent} />

      <FeatureRowSection
        heading={standortContent.heading}
        body={standortContent.body}
        imageSrc={standortContent.imageSrc}
        imageAlt={standortContent.imageAlt}
        ctaHref={standortContent.ctaHref}
        ctaLabel={standortContent.ctaLabel}
      />

      <InventarisierungPhaseTabs
        heading={kreislaufContent.heading}
        introBody={kreislaufContent.introBody}
        tabs={kreislaufContent.tabs}
      />

      <InvCrossSellSection {...ressourcenCtaContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
