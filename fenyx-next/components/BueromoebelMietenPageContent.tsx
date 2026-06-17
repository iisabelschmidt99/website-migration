import VideoHero from "@/components/VideoHero";
import LogoGrid from "@/components/LogoGrid";
import ParallaxIntroSection from "@/components/ParallaxIntroSection";
import FeatureRowSection from "@/components/FeatureRowSection";
import PricingCardsSection from "@/components/PricingCardsSection";
import InventarisierungPhaseTabs from "@/components/InventarisierungPhaseTabs";
import ImageSliderSection from "@/components/ImageSliderSection";
import GreenBenefitsTabs from "@/components/GreenBenefitsTabs";
import VideoSection from "@/components/VideoSection";
import InvCrossSellSection from "@/components/InvCrossSellSection";
import ReferenceProjectsSection from "@/components/ReferenceProjectsSection";
import LocationsSection from "@/components/LocationsSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  heroContent,
  pricingContent,
  challengesContent,
  sliderContent,
  audienceContent,
  videoContent,
  crossSellContent,
  referenzenContent,
  contactContent,
} from "@/data/bueromoebel-mieten";
import {
  type StandortPageData,
  standortContactContent,
  standortSharedImages,
} from "@/data/bueromoebel-mieten-standorte";
import { locationsSectionContent } from "@/data/standorte";

type BueromoebelMietenPageContentProps = {
  standort?: StandortPageData;
};

export default function BueromoebelMietenPageContent({
  standort,
}: BueromoebelMietenPageContentProps) {
  const hero = standort
    ? {
        ...heroContent,
        heading: standort.heroHeading,
      }
    : heroContent;

  const contact = standort
    ? standortContactContent(standort)
    : contactContent;

  return (
    <div className="inv-page">
      <VideoHero {...hero} />

      <LogoGrid />

      {standort ? (
        <>
          <ParallaxIntroSection
            heading={standort.parallaxHeading}
            body={standort.parallaxBody}
            imageSrcs={standortSharedImages.parallax}
          />

          <FeatureRowSection
            heading={standort.section1Heading}
            body={standort.section1Body}
            imageSrc={standortSharedImages.section1}
            imageAlt={standort.section1Heading}
            reverse
          />

          <FeatureRowSection
            heading={standort.section2Heading}
            body={standort.section2Body}
            imageSrc={standortSharedImages.section2}
            imageAlt={standort.section2Heading}
          />
        </>
      ) : null}

      <PricingCardsSection {...pricingContent} />

      <InventarisierungPhaseTabs
        heading={challengesContent.heading}
        introBody={challengesContent.introBody}
        tabs={challengesContent.tabs}
      />

      <ImageSliderSection {...sliderContent} />

      <GreenBenefitsTabs {...audienceContent} />

      <VideoSection {...videoContent} />

      <InvCrossSellSection {...crossSellContent} />

      <ReferenceProjectsSection
        id="referenzen"
        heading={referenzenContent.heading}
        description={referenzenContent.description}
      />

      <LocationsSection {...locationsSectionContent} />

      <ServiceContactSection {...contact} />
    </div>
  );
}
