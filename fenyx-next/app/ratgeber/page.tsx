import type { Metadata } from "next";
import ArticleListingSection from "@/components/ArticleListingSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  getRatgeberExcerpt,
  ratgeberArticles,
  ratgeberMeta,
} from "@/data/ratgeber";
import { contactContent } from "@/data/referenzen";

export const metadata: Metadata = {
  title: ratgeberMeta.title,
  description:
    "Fenyx Ratgeber: Expertenwissen zu nachhaltiger Büroeinrichtung, Büroplanung, Ergonomie und Kreislaufwirtschaft.",
};

export default function RatgeberPage() {
  const items = ratgeberArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: getRatgeberExcerpt(article),
    imageSrc: article.imageSrc,
    href: `/ratgeber/${article.slug}`,
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
