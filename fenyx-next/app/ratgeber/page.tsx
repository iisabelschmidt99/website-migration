import type { Metadata } from "next";
import ArticleListingSection from "@/components/ArticleListingSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { contactContent } from "@/data/referenzen";
import {
  getPublishedRatgeberPosts,
  getRatgeberExcerpt,
  ratgeberListingMeta,
} from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: ratgeberListingMeta.title,
  description:
    "Fenyx Ratgeber: Expertenwissen zu nachhaltiger Büroeinrichtung, Büroplanung, Ergonomie und Kreislaufwirtschaft.",
};

function formatPublishedDate(iso?: string) {
  if (!iso) return undefined;

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function RatgeberPage() {
  const posts = await getPublishedRatgeberPosts();

  const items = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: getRatgeberExcerpt(post),
    imageSrc: post.imageSrc,
    href: `/ratgeber/${post.slug}`,
    tag: post.category,
    dateLabel: formatPublishedDate(post.publishedAt),
  }));

  return (
    <div className="inv-page">
      <ArticleListingSection
        heading="Ratgeber"
        description="Expertenwissen zu nachhaltiger Büroeinrichtung, Büroplanung und Kreislaufwirtschaft."
        items={items}
      />
      <ServiceContactSection {...contactContent} />
    </div>
  );
}
