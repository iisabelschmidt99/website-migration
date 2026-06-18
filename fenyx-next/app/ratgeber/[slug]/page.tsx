import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetailSection from "@/components/ArticleDetailSection";
import { getAllRatgeberSlugs, getRatgeberArticle, getRatgeberExcerpt } from "@/data/ratgeber";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllRatgeberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getRatgeberArticle(slug);
  if (!article) return {};

  return {
    title: article.meta.title || article.title,
    description: article.meta.description || getRatgeberExcerpt(article),
  };
}

export default async function RatgeberArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getRatgeberArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticleDetailSection
      title={article.title}
      imageSrc={article.imageSrc}
      paragraphs={
        article.paragraphs.length > 0
          ? article.paragraphs
          : [getRatgeberExcerpt(article)]
      }
      backHref="/ratgeber"
      backLabel="Ratgeber"
    />
  );
}
