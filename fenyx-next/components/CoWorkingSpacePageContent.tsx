import ServiceHero from "@/components/ServiceHero";
import LogoGrid from "@/components/LogoGrid";
import GreenCardsSection from "@/components/GreenCardsSection";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import BuyOrRentSection from "@/components/BuyOrRentSection";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import Link from "next/link";
import { getTestimonials } from "@/lib/testimonials";
import {
  benefitsContent,
  buyOrRentContent,
  contactContent,
  crossSellContent,
  differentiationContent,
  faqItems,
  fallbackTestimonial,
  heroContent,
  logoGridContent,
} from "@/data/co-working-space";

/** Zielgruppen-Seite Co-Working Space – vollständiges Layout wie Webflow-Original. */
export default async function CoWorkingSpacePageContent() {
  const loaded = await getTestimonials("co-working-space");
  const testimonials = loaded.length > 0 ? loaded : [fallbackTestimonial];

  return (
    <div className="inv-page">
      <ServiceHero
        heading={heroContent.heading}
        description={heroContent.description}
        bullets={heroContent.bullets}
        imageSrc={heroContent.imageSrc}
        imageAlt={heroContent.heading}
        ctaLabel={heroContent.ctaLabel}
      />

      <LogoGrid {...logoGridContent} />

      <GreenCardsSection
        heading={benefitsContent.heading}
        intro={benefitsContent.intro}
        cards={benefitsContent.cards}
        variant="dark"
      />

      <InventarisierungPhaseTabs
        heading={differentiationContent.heading}
        introBody={differentiationContent.intro}
        tabs={differentiationContent.tabs}
        variant="dark"
      />

      <BuyOrRentSection {...buyOrRentContent} />

      <InvCrossSellSection {...crossSellContent} />

      <TestimonialsSection testimonials={testimonials} />

      <FaqSection items={faqItems} dark />

      <section className="bg-abyss-deep py-10 text-center">
        <p className="text-mist text-sm">
          Sie haben noch Fragen?{" "}
          <Link href="/#kontakt" className="text-signal hover:underline">
            Kontakt
          </Link>
        </p>
      </section>

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
