import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FenyxFuerSiePageContent from "@/components/FenyxFuerSiePageContent";
import { AUDIENCE_SLUGS, getAudiencePage } from "@/data/fenyx-fuer-sie";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return AUDIENCE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getAudiencePage(slug);
  if (!page) return {};

  return {
    title: page.meta.title,
    description: page.meta.description,
  };
}

export default async function FenyxFuerSiePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getAudiencePage(slug);

  if (!page) {
    notFound();
  }

  return <FenyxFuerSiePageContent page={page} />;
}
