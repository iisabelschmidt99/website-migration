import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import LogoGrid from "@/components/LogoGrid";
import VideoSection from "@/components/VideoSection";
import GreenCardsSection from "@/components/GreenCardsSection";
import FeatureRowSection from "@/components/FeatureRowSection";
import Co2Calculator from "@/components/Co2Calculator";
import InventarisierungTimeline from "@/components/InventarisierungTimeline";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getTestimonials } from "@/lib/testimonials";
import { verwertungContact } from "@/data/verwertung-contact";
import {
  mitarbeiterverkaufMeta,
  heroContent,
  logoGridContent,
  videoContent,
  greenCardsContent,
  eventContent,
  co2CalculatorContent,
  timelineContent,
  crossSellContent,
  referenzenContent,
} from "@/data/mitarbeiterverkauf";

export const metadata: Metadata = {
  title: mitarbeiterverkaufMeta.title,
  description: mitarbeiterverkaufMeta.description,
};

export const revalidate = 60;

export default async function MitarbeiterverkaufPage() {
  const testimonials = await getTestimonials("mitarbeiterverkauf");

  return (
    <div className="inv-page">
      <ServiceHero {...heroContent} />

      <LogoGrid {...logoGridContent} />

      <VideoSection {...videoContent} />

      <GreenCardsSection {...greenCardsContent} />

      <FeatureRowSection {...eventContent} />

      <Co2Calculator {...co2CalculatorContent} />

      <InventarisierungTimeline {...timelineContent} />

      <InvCrossSellSection {...crossSellContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <TestimonialsSection testimonials={testimonials} />

      <ServiceContactSection {...verwertungContact} />
    </div>
  );
}
