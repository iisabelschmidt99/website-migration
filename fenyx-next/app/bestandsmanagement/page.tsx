import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import LogoGrid from "@/components/LogoGrid";
import CtaButton from "@/components/CtaButton";
import LifecycleTrack from "@/components/LifecycleTrack";
import LeistungBleedCard from "@/components/LeistungBleedCard";
import FeatureRowSection from "@/components/FeatureRowSection";
import ReferenceRevealList from "@/components/ReferenceRevealList";
import FaqSection from "@/components/FaqSection";
import SurveyContactSection from "@/components/SurveyContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getTestimonials } from "@/lib/testimonials";
import { bestandsmanagementReferences } from "@/data/bestandsmanagement-references";
import { bestandsmanagementFaq } from "@/data/bestandsmanagement-faq";

export const metadata: Metadata = {
  title: "Büromöbel-Bestandsmanagement | Inventur & Verwertung | Fenyx",
  description:
    "Professionelles Büromöbel-Bestandsmanagement: Inventarisierung, Einlagerung & Aufbereitung aus einer Hand. Ø 50% Kosteneinsparung. Jetzt beraten lassen!",
};

const assetBase = "/assets/leistungen/bestandsmanagement";

export const revalidate = 60;

export default async function BestandsmanagementPage() {
  const testimonials = await getTestimonials("bestandsmanagement");

  return (
    <>
      <ServiceHero
        heading="Bestandsmanagement, das aus Kosten Wert macht."
        description="Wir erfassen, bewerten und nutzen Ihren Bürobestand wirtschaftlich – statt ihn abzuschreiben oder ungenutzt zu lagern."
        bullets={[
          "+50 % niedrigere Beschaffungskosten",
          "+125 kg CO₂-Einsparungen pro Arbeitsplatz",
          "Zeitlich flexible Umsetzung",
        ]}
        imageSrc={`${assetBase}/hero.png`}
        ctaHref="/bestandsmanagement#kontakt"
      />

      <LogoGrid description="" />

      <section
        className="leistung-timeline-section py-20 sm:py-28 bg-white overflow-hidden"
        aria-labelledby="wert-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2
              id="wert-heading"
              className="text-h2 sm:text-3xl lg:text-[2.75rem] font-heading tracking-fenyx mb-5 text-black"
            >
              Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
            </h2>
            <p className="text-black text-base sm:text-lg leading-relaxed">
              Nachhaltige Bürotransformation bedeutet mehr als
              Produktzertifikate. Mit Fenyx gewinnen Sie einen Partner, der
              Kosteneinsparungen messbar macht, Nachhaltigkeit transparent
              dokumentiert und Ihr Projekt strukturiert begleitet – von der
              Analyse bis zur Umsetzung.
            </p>
            <CtaButton href="/bestandsmanagement#kontakt" className="mt-8">
              Kontakt aufnehmen
            </CtaButton>
          </div>
        </div>

        <LifecycleTrack dotCount={4}>
          <LeistungBleedCard
            title="Digitale Inventarisierung."
            description="Maximieren Sie die Wiederverwertungsquote und den Verkaufserlös Ihres nicht mehr genötigten Bestands. Die Fenyx-Plattform garantiert die optimale Veräußerung, unabhängig von Hersteller, Kategorie und Zustand."
            imageSrc={`${assetBase}/timeline-inventarisierung.png`}
          />
          <LeistungBleedCard
            title="Flexible Einlagerung."
            description="Mit Fenyx erhalten Sie Zugang zum größten Büromöbel-Lager-Ökosystem in Europa. Nutzen Sie die flexiblen Angebote, um Ihren individuellen Bedarf an zusätzlicher Kapazität zu decken."
            imageSrc={`${assetBase}/timeline-einlagerung.png`}
            align="right"
          />
          <LeistungBleedCard
            title="Ganzheitliche Aufbereitung."
            description="Wir verlängern den Lebenszyklus Ihrer Bestände – strukturiert, fachgerecht und unabhängig vom Hersteller. Das Ergebnis: deutlich reduzierte Emissionen und Kosten."
            imageSrc={`${assetBase}/timeline-aufbereitung.png`}
            imageAlt="Aufbereitung von Büromöbeln vor Ort"
          />
          <LeistungBleedCard
            title="Messbare Transparenz."
            description="Was nicht sichtbar ist, lässt sich nicht steuern. Eine digitale, strukturierte Bestandsübersicht schafft Transparenz – und damit die Grundlage für weniger Kosten, weniger CO₂ und weniger Aufwand."
            imageSrc={`${assetBase}/timeline-transparenz.png`}
            imageAlt="Hand misst einen Bürotisch mit einem Maßband"
            align="right"
          />
        </LifecycleTrack>
      </section>

      <FeatureRowSection
        heading="Die Datengrundlage für Planung im Bestand."
        body="Wir liefern mehr als Software. Unsere geschulten Teams erfassen Ihren Bestand strukturiert, inklusive Bilddokumentation und aller relevanten Produktdaten. Das Ergebnis: eine präzise, digital nutzbare Bestandsübersicht – erweiterbar um Pläne und Dokumente wie DWG-Dateien."
        imageSrc={`${assetBase}/cta-datengrundlage.png`}
        imageAlt="Zwei Mitarbeiter im Gespräch in einem Büro"
        bgClassName="bg-[#f4f6f8]"
        ctaHref="/bestandsmanagement#kontakt"
      />

      <FeatureRowSection
        heading="Das Gerüst für weitere Entscheidungen."
        body="Auf das digitale Mengengerüst folgt eine strukturierte Qualitätsbewertung. Funktionalität, Zustand und optische Qualität werden anhand definierter Kriterien geprüft. So können konkrete Aufbereitungsangebote für einzelne Möbelstücke realistisch kalkuliert und transparent dargestellt werden."
        imageSrc={`${assetBase}/cta-geruest.png`}
        imageAlt="Fenyx-Mitarbeiterin bewertet Büromöbel vor Ort"
        reverse
        ctaHref="/bestandsmanagement#kontakt"
      />

      <FeatureRowSection
        heading="Vom Digitalen in die Realität."
        body="Neben der Innenmöblierung erfassen wir auch das Gebäude selbst als Teil der Bestandsaufnahme. Laufwege, Aufzugsmaße, Anfahrtsmöglichkeiten und weitere logistische Rahmenbedingungen werden strukturiert dokumentiert. So entstehen belastbare Grundlagen für Angebote zu Räumung und Umzug."
        imageSrc={`${assetBase}/cta-realitaet.png`}
        imageAlt="Fenyx-Mitarbeiter dokumentiert Bestand vor Ort"
        dark
        bgClassName="bg-abyss-deep"
        ctaLabel="Jetzt starten"
        ctaHref="/bestandsmanagement#kontakt"
      />

      <section
        className="py-20 sm:py-28 bg-white"
        aria-labelledby="praxis-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <h2
              id="praxis-heading"
              className="text-h2 sm:text-3xl lg:text-[2.75rem] font-heading tracking-fenyx mb-5 text-black"
            >
              Bestandsmanagement in der Praxis.
            </h2>
            <p className="text-black text-base sm:text-lg leading-relaxed">
              Werden auch Sie Vorreiter und erleben Sie die Zukunft der
              Büroeinrichtung.
            </p>
          </div>
          <ReferenceRevealList projects={bestandsmanagementReferences} />
        </div>
      </section>

      <FaqSection items={bestandsmanagementFaq} dark />

      <TestimonialsSection testimonials={testimonials} />

      <SurveyContactSection
        email="marius@fenyx-office.com"
        phone="+49 176 23820424"
        portraitSrc="/assets/kontakt/marius-gimm.webp"
        portraitAlt="Marius Gimm, Einrichtungsberater bei Fenyx"
        quote="„Ein nachhaltiges Büro beginnt nicht beim Neukauf, sondern bei der Wertschätzung dessen, was man bereits besitzt. Ich helfe Ihnen dabei, Transparenz in Ihren Bestand zu bringen.“"
        name="Marius Gimm"
        role="Einrichtungsberater für unseren Standort Berlin"
      />
    </>
  );
}
