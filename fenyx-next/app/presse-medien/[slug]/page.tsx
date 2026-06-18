import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetailSection from "@/components/ArticleDetailSection";
import { getAllPresseNewsSlugs, getPresseNewsItem } from "@/data/presse-medien";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPresseNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getPresseNewsItem(slug);
  if (!item) return {};

  return {
    title: item.meta.title || item.title,
    description: item.meta.description,
  };
}

export default async function PresseMedienDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getPresseNewsItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <ArticleDetailSection
      title={item.title}
      imageSrc={item.imageSrc}
      paragraphs={item.paragraphs}
      backHref="/presse-medien"
      backLabel="News & Medien"
    />
  );
}
