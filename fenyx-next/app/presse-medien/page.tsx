import type { Metadata } from "next";
import ArticleListingSection from "@/components/ArticleListingSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import {
  getPresseExcerpt,
  presseMedienMeta,
  presseNewsItems,
} from "@/data/presse-medien";
import { contactContent } from "@/data/referenzen";

export const metadata: Metadata = {
  title: presseMedienMeta.title,
  description: presseMedienMeta.description,
};

export default function PresseMedienPage() {
  const items = presseNewsItems.map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: getPresseExcerpt(item),
    imageSrc: item.imageSrc,
    href: `/presse-medien/${item.slug}`,
    tag: "News",
  }));

  return (
    <div className="inv-page">
      <ArticleListingSection
        heading="News & Medien"
        description="Aktuelle News, Presseberichte und Medienressourcen von Fenyx Office."
        items={items}
      />
      <ServiceContactSection {...contactContent} />
    </div>
  );
}
