// Öffentliche Route: /bueroplanung/<slug> (Themen-Collection).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicLandingContent from "@/components/TopicLandingContent";
import { getTopicPage, getTopicSlugs } from "@/lib/topics";

export const revalidate = 60;

const COLLECTION = "bueroplanung";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getTopicSlugs(COLLECTION)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTopicPage(COLLECTION, slug);
  if (!page) return {};
  return {
    title: page.meta_title || page.title || undefined,
    description: page.meta_description || undefined,
    alternates: { canonical: `/${COLLECTION}/${slug}` },
  };
}

export default async function BueroplanungTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getTopicPage(COLLECTION, slug);
  if (!page) notFound();

  return (
    <TopicLandingContent
      title={page.title || ""}
      postSummary={page.post_summary}
      author={page.author}
      mainImageSrc={page.main_image_url}
      mainImageAlt={page.main_image_alt}
      bodyHtml={page.body_html}
      faqTitle={page.faq_title}
      faqDescription={page.faq_description}
      faq={page.faq || []}
      schemaMarkup={page.schema_markup}
    />
  );
}
