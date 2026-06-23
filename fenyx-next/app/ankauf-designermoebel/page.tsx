import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import FeatureRowSection from "@/components/FeatureRowSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getTestimonials } from "@/lib/testimonials";
import { verwertungContact } from "@/data/verwertung-contact";


export const metadata: Metadata = {
  title: "Designermöbel verkaufen | Fenyx Ankauf",
  description:
    "Designermöbel und hochwertige Büroausstattung verkaufen – Fenyx bewertet fair und kauft zum Bestpreis an.",
};

export const revalidate = 60;

export default async function AnkaufDesignermoebelPage() {
  const testimonials = await getTestimonials("auktionsplattform");

  return (
    <div className="inv-page">
      <ServiceHero
        heading="Designermöbel verkaufen zum Bestpreis"
        description="Hochwertige Designermöbel und Premiummarken bewerten wir individuell und kaufen zum fairen Marktpreis an."
        bullets={[
          "Spezialisiert auf Premiummarken",
          "Diskrete Abwicklung",
          "Europaweites Händlernetzwerk",
        ]}
        imageSrc={`/assets/cms/mitarbeiterverkauf-thumbnail.webp`}
        imageAlt="Designermöbel Ankauf"
      />

      <FeatureRowSection
        heading="Wert erkennen, fair verkaufen"
        body="Von Vitra bis USM – wir kennen den Markt für hochwertige Büromöbel und sorgen für eine professionelle Bewertung und Vermarktung Ihres Bestands."
        imageSrc={`/assets/cms/bueroaufloesung-thumbnail.webp`}
        imageAlt="Designermöbel"
        reverse
      />

      <TestimonialsSection testimonials={testimonials} />

      <ServiceContactSection {...verwertungContact} />
    </div>
  );
}
