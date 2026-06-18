import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt | Fenyx Office",
  description:
    "Buchen Sie eine kostenlose Erstberatung für nachhaltige Bürotransformation, Verwertung oder Einrichtung.",
};

export default function KontaktPage() {
  return (
    <div className="inv-page">
      <section className="bg-abyss-deep text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-heading tracking-[-0.03em] mb-4">
            Kontakt
          </h1>
          <p className="text-mist text-base sm:text-lg max-w-2xl">
            Wir freuen uns auf Ihre Anfrage. Buchen Sie eine kostenlose
            Erstberatung oder schreiben Sie uns direkt.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
