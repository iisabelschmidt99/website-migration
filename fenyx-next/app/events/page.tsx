import type { Metadata } from "next";
import Image from "next/image";
import ArticleListingSection from "@/components/ArticleListingSection";
import ServiceContactSection from "@/components/ServiceContactSection";
import { eventsHero, eventsMeta } from "@/data/events";
import { getAllEvents } from "@/lib/events";
import { contactContent } from "@/data/referenzen";

export const metadata: Metadata = {
  title: eventsMeta.title,
  description:
    "Seminare, Site Visits und Networking-Events für Architekten, HR und Facility Manager.",
};

// Events kommen aus Supabase (mit statischem Fallback).
export const revalidate = 60;

export default async function EventsPage() {
  const eventsList = await getAllEvents();
  const items = eventsList.map((event) => ({
    slug: event.slug,
    title: event.title,
    excerpt: event.description,
    imageSrc: event.imageSrc,
    href: `/events/${event.slug}`,
    tag: event.tag,
    dateLabel: event.dateLabel,
  }));

  return (
    <div className="inv-page">
      <section className="events-hero relative min-h-[70vh] flex items-end bg-abyss-deep text-white overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={eventsHero.posterSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-deep via-abyss-deep/70 to-abyss-deep/30" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <h1 className="text-3xl sm:text-5xl font-heading tracking-[-0.03em] mb-4 whitespace-pre-line">
            {eventsHero.heading}
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl whitespace-pre-line">
            {eventsHero.description}
          </p>
        </div>
      </section>

      <ArticleListingSection heading="Alle Events" items={items} />

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
