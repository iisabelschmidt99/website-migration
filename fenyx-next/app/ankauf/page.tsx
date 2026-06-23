import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import FeatureRowSection from "@/components/FeatureRowSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getTestimonials } from "@/lib/testimonials";
import { verwertungContact } from "@/data/verwertung-contact";


export const metadata: Metadata = {
  title: "Büromöbel verkaufen | Ankauf zum Bestpreis | Fenyx",
  description:
    "Büromöbel verkaufen zum Bestpreis – Fenyx kauft Ihren Bestand an und vermarktet über Europas größtes Händlernetzwerk.",
};

export const revalidate = 60;

export default async function AnkaufPage() {
  const testimonials = await getTestimonials("auktionsplattform");

  return (
    <div className="inv-page">
      <ServiceHero
        heading="Büromöbel verkaufen – Ankauf mit Top-Preisen"
        description="Fenyx kauft Ihre Büromöbel zum Bestpreis an und vermarktet diese über Europas größtes Händlernetzwerk."
        bullets={[
          "Faire Bewertung Ihres Bestands",
          "Schnelle Abwicklung",
          "Nachhaltige Weiterverwendung",
        ]}
        imageSrc={`/assets/cms/bueroaufloesung-thumbnail.webp`}
        imageAlt="Büromöbel Ankauf"
      />

      <FeatureRowSection
        heading="Maximaler Erlös für Ihren Bestand"
        body="Wir bewerten Ihren Bestand professionell, kaufen hochwertige Möbel direkt an und vermarkten den Rest über unser Händlernetzwerk – für den bestmöglichen Erlös."
        imageSrc="/assets/cms/auflosung-besichtigung-angebotserstellung.webp"
        imageAlt="Bestandsaufnahme"
        ctaHref="/verwertung/aufbereitung"
        ctaLabel="Mehr zur Aufbereitung"
      />

      <TestimonialsSection testimonials={testimonials} />

      <ServiceContactSection {...verwertungContact} />
    </div>
  );
}
