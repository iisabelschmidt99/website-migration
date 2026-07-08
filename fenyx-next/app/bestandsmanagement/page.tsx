import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import LogoGrid from "@/components/LogoGrid";
import TimelineCinematicG from "@/components/concepts/g/TimelineCinematicG";
import FeatureRowSection from "@/components/FeatureRowSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import FaqSection from "@/components/FaqSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getTestimonials } from "@/lib/testimonials";
import { bestandsmanagementReferences } from "@/data/bestandsmanagement-references";
import { bestandsmanagementFaq } from "@/data/bestandsmanagement-faq";
import { bestandsmanagementTimelineChapters } from "@/data/bestandsmanagement-timeline";
import "@/components/concepts/shared/anim.css";
import "@/app/d/concept.css";
import "@/app/g/concept.css";
import "@/app/home-j.css";

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

      <div className="dg-page home-j">
        <section className="dg-intro" aria-labelledby="wert-heading">
          <div className="dg-intro__inner wf-padding-global">
            <div className="wf-container-large">
              <h2 id="wert-heading" className="dg-intro__heading">
                Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
              </h2>
              <p className="dg-intro__body">
                Nachhaltige Bürotransformation bedeutet mehr als Produktzertifikate.
                Mit Fenyx gewinnen Sie einen Partner, der Kosteneinsparungen messbar macht,
                Nachhaltigkeit transparent dokumentiert und Ihr Projekt strukturiert begleitet
                – von der Analyse bis zur Umsetzung.
              </p>
              <a href="/bestandsmanagement#kontakt" className="dg-intro__cta">
                Kontakt aufnehmen <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <TimelineCinematicG
          chapters={bestandsmanagementTimelineChapters}
          ariaLabel="Bestandsmanagement in vier Kapiteln"
        />
      </div>

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

      <ReferenceProjectsSection
        id="referenzen"
        heading="Bestandsmanagement in der Praxis."
        description="Werden auch Sie Vorreiter und erleben Sie die Zukunft der Büroeinrichtung."
        projects={bestandsmanagementReferences}
      />

      <FaqSection items={bestandsmanagementFaq} dark />

      <TestimonialsSection testimonials={testimonials} />

      <ServiceContactSection
        heading="Buchen Sie eine kostenlose Erstberatung."
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
