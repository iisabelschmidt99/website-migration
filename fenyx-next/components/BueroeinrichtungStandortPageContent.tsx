import ServiceHero from "@/components/ServiceHero";
import FeatureRowSection from "@/components/FeatureRowSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { heroContent as bueroeinrichtungHero } from "@/data/bueroeinrichtung";
import {
  type BueroeinrichtungStandortData,
  standortEinrichtungContact,
} from "@/data/bueroeinrichtung-standorte";

const be = "/assets/leistungen/bueroeinrichtung";

type BueroeinrichtungStandortPageContentProps = {
  standort: BueroeinrichtungStandortData;
};

/** Stadt-Landingpages für Büroeinrichtung. */
export default function BueroeinrichtungStandortPageContent({
  standort,
}: BueroeinrichtungStandortPageContentProps) {
  const contact = standortEinrichtungContact(standort.slug);

  return (
    <div className="inv-page">
      <ServiceHero
        heading={standort.heroHeading}
        description={standort.heroSubline}
        bullets={[
          "Datenbasierte Büroplanung",
          "Refurbished Premiummöbel",
          "Schlüsselfertige Umsetzung",
        ]}
        imageSrc={bueroeinrichtungHero.posterSrc}
        imageAlt={standort.heroHeading}
      />

      {standort.citySections.map((section, index) => (
        <FeatureRowSection
          key={section.heading}
          heading={section.heading}
          body={section.body}
          imageSrc={
            index % 2 === 0
              ? `${be}/challenge-kosten.webp`
              : `${be}/challenge-umsetzung.webp`
          }
          imageAlt={section.heading}
          reverse={index % 2 === 1}
          bgClassName={index % 2 === 0 ? "bg-white" : "bg-mist-soft"}
        />
      ))}

      <ServiceContactSection {...contact} />
    </div>
  );
}
