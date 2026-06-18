import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetailSection from "@/components/ArticleDetailSection";
import {
  getAllRatgeberSlugs,
  getRatgeberExcerpt,
  getRatgeberPost,
} from "@/lib/blog";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllRatgeberSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getRatgeberPost(slug);
  if (!article) return {};

  return {
    title: article.meta.title || article.title,
    description: article.meta.description || getRatgeberExcerpt(article),
  };
}

export default async function RatgeberArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getRatgeberPost(slug);

  if (!article) {
    notFound();
  }

  const metaItems = [
    article.author ? { label: "Autor", value: article.author } : null,
    article.category ? { label: "Kategorie", value: article.category } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <ArticleDetailSection
      title={article.title}
      imageSrc={article.imageSrc}
      imageAlt={article.imageAlt}
      bodyHtml={article.bodyHtml}
      paragraphs={
        !article.bodyHtml && article.paragraphs && article.paragraphs.length > 0
          ? article.paragraphs
          : !article.bodyHtml
            ? [getRatgeberExcerpt(article)]
            : undefined
      }
      metaItems={metaItems.length > 0 ? metaItems : undefined}
      backHref="/ratgeber"
      backLabel="Ratgeber"
    />
  );
}
