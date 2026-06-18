import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BueroeinrichtungStandortPageContent from "@/components/BueroeinrichtungStandortPageContent";
import {
  getAllBueroeinrichtungStandortSlugs,
  getBueroeinrichtungStandort,
} from "@/data/bueroeinrichtung-standorte";

type PageProps = {
  params: Promise<{ stadt: string }>;
};

export function generateStaticParams() {
  return getAllBueroeinrichtungStandortSlugs().map((stadt) => ({ stadt }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stadt } = await params;
  const page = getBueroeinrichtungStandort(stadt);
  if (!page) return {};

  return {
    title: page.meta.title,
    description:
      page.meta.description ||
      `${page.heroHeading} – nachhaltige Büroplanung und Einrichtung mit Fenyx.`,
  };
}

export default async function BueroeinrichtungStandortPage({ params }: PageProps) {
  const { stadt } = await params;
  const standort = getBueroeinrichtungStandort(stadt);

  if (!standort) {
    notFound();
  }

  return <BueroeinrichtungStandortPageContent standort={standort} />;
}
