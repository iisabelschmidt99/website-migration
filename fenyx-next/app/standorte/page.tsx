import type { Metadata } from "next";
import LocationsSection from "@/components/LocationsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { locationsSectionContent } from "@/data/standorte";
import { contactContent } from "@/data/referenzen";

export const metadata: Metadata = {
  title: "Standorte | Fenyx Office",
  description:
    "Fenyx ist europaweit für nachhaltige Bürotransformationen im Einsatz – mit Standorten in Deutschland, Österreich und der Schweiz.",
};

export default function StandortePage() {
  return (
    <div className="inv-page">
      <section className="bg-abyss-deep text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-heading tracking-[-0.03em] mb-4">
            Unsere Standorte
          </h1>
          <p className="text-mist text-base sm:text-lg max-w-2xl">
            Von Berlin bis Zürich – Fenyx begleitet Unternehmen europaweit bei
            Bürotransformation, Verwertung und Einrichtung.
          </p>
        </div>
      </section>

      <LocationsSection {...locationsSectionContent} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
