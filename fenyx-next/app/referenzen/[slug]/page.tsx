import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReferenzCaseDetailSection, {
  RelatedReferenzenSection,
} from "@/components/ReferenzCaseDetailSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  getAllReferenzCaseSlugs,
  getReferenzCaseStudiesBySlugs,
  getReferenzCaseStudy,
} from "@/data/referenz-case-studies";

const detailContactContent = {
  heading: "Kostenlose Erstberatung buchen",
  email: "anina@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/anina-blatter.webp",
  portraitAlt: "Anina Blatter, Einrichtungsberaterin bei Fenyx Office",
  quote:
    '„Ich freue mich, Sie zur nachhaltigen Transformation Ihres Büros zu beraten."',
  name: "Anina Blatter",
  role: "Customer Support",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllReferenzCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getReferenzCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.meta.title,
    description: study.meta.description,
  };
}

export default async function ReferenzCasePage({ params }: PageProps) {
  const { slug } = await params;
  const study = getReferenzCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const related = getReferenzCaseStudiesBySlugs(study.relatedSlugs).filter(
    (item) => item.slug !== study.slug,
  );

  return (
    <div className="inv-page">
      <ReferenzCaseDetailSection study={study} />

      <RelatedReferenzenSection studies={related.slice(0, 3)} />

      <ServiceContactSection {...detailContactContent} />
    </div>
  );
}
