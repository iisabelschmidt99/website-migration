import ServiceHero from "@/components/ServiceHero";
import GreenCardsSection from "@/components/GreenCardsSection";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import type { AudiencePage } from "@/data/fenyx-fuer-sie";


type FenyxFuerSiePageContentProps = {
  page: AudiencePage;
};

const contactContent = {
  heading: "Kostenlose Erstberatung buchen",
  email: "anina@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc:
    "/assets/cms/Marius.webp",
  portraitAlt: "Marius Grimm, Einrichtungsberater bei Fenyx Office",
  quote:
    '„Ich freue mich, Sie zur nachhaltigen Transformation Ihres Büros zu beraten."',
  name: "Marius Grimm",
  role: "Einrichtungsberater",
};

/** Zielgruppen-Seiten (Großunternehmen, Mittelstand, …). */
export default function FenyxFuerSiePageContent({ page }: FenyxFuerSiePageContentProps) {
  return (
    <div className="inv-page">
      <ServiceHero
        heading={page.hero.heading}
        description={page.hero.description}
        bullets={page.hero.bullets}
        imageSrc={page.hero.imageSrc}
        imageAlt={page.hero.heading}
        ctaLabel={page.hero.ctaLabel}
      />

      <GreenCardsSection heading="Ihre Vorteile mit Fenyx." cards={page.cards} />

      <InvCrossSellSection
        heading={page.cta.heading}
        body={page.cta.body}
        href="/#kontakt"
        cta="Kontakt aufnehmen"
        imageSrc={`/assets/cms/bueroaufloesung-thumbnail.webp`}
      />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
