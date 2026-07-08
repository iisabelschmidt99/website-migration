// Öffentliche Route: /bueromoebel-mieten/<stadt> (kanonisch, Zielbild Agentur).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BueromoebelMietenPageContent from "@/components/BueromoebelMietenPageContent";
import {
  getAllStandortSlugs,
  getStandortPage,
} from "@/data/bueromoebel-mieten-standorte";

type PageProps = {
  params: Promise<{ stadt: string }>;
};

export function generateStaticParams() {
  return getAllStandortSlugs().map((stadt) => ({ stadt }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stadt } = await params;
  const page = getStandortPage(stadt);
  if (!page) return {};

  const description =
    page.meta.description ||
    `Jetzt Büromöbel mieten in ${page.city} – flexibel, schnell & kostengünstig. Hochwertige Markenmöbel auf Zeit für Ihr Büro. Unverbindlich anfragen!`;

  return {
    title: page.meta.title,
    description,
  };
}

export default async function BueromoebelMietenStadtPage({ params }: PageProps) {
  const { stadt } = await params;
  const standort = getStandortPage(stadt);

  if (!standort) {
    notFound();
  }

  return <BueromoebelMietenPageContent standort={standort} />;
}
