import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetailSection from "@/components/ArticleDetailSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { getAllEventSlugs, getEvent } from "@/data/events";
import { contactContent } from "@/data/referenzen";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};

  return {
    title: event.meta.title || event.title,
    description: event.meta.description || event.description,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEvent(slug);

  if (!event) {
    notFound();
  }

  const paragraphs =
    event.paragraphs.length > 0
      ? event.paragraphs
      : [event.description, event.location].filter(Boolean);

  return (
    <div className="inv-page">
      <ArticleDetailSection
        title={event.title}
        imageSrc={event.imageSrc}
        paragraphs={paragraphs}
        backHref="/events"
        backLabel="Events"
        metaItems={[
          { label: "Datum", value: event.dateLabel },
          { label: "Ort", value: event.location },
          { label: "Kategorie", value: event.tag },
        ]}
      />
      <ServiceContactSection {...contactContent} />
    </div>
  );
}
