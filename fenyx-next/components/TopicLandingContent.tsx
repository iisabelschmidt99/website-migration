// Rendering-Template für die Themen-Landingpages (Büroauflösungen, Büroeinrichtungen,
// Büromöbel kaufen, Büroplanung). Artikelartig: Hero-Bild + Titel + Rich-Text + FAQ + Kontakt.
import Image from "next/image";
import FaqSection from "./FaqSection";
import ServiceContactSection from "./ServiceContactSection";
import type { FaqItem } from "./FaqSection";
import { contactContent } from "@/data/referenzen";

type TopicLandingContentProps = {
  title: string;
  postSummary?: string | null;
  author?: string | null;
  mainImageSrc?: string | null;
  mainImageAlt?: string | null;
  bodyHtml?: string | null;
  faqTitle?: string | null;
  faqDescription?: string | null;
  faq?: FaqItem[];
  schemaMarkup?: string | null;
};

export default function TopicLandingContent({
  title,
  postSummary,
  author,
  mainImageSrc,
  mainImageAlt,
  bodyHtml,
  faqTitle,
  faqDescription,
  faq = [],
  schemaMarkup,
}: TopicLandingContentProps) {
  return (
    <>
      {schemaMarkup ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: schemaMarkup }}
        />
      ) : null}

      <article className="bg-gradient-to-b from-abyss-deep to-black-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <header className="mb-8">
            <h1 className="wf-heading-h1 mb-5">{title}</h1>
            {postSummary ? (
              <p className="text-mist-soft text-lg leading-relaxed">{postSummary}</p>
            ) : null}
            {author ? (
              <p className="text-mist text-sm mt-4">Von {author}</p>
            ) : null}
          </header>

          {mainImageSrc ? (
            <div className="relative w-full aspect-[16/9] overflow-hidden mb-12">
              <Image
                src={mainImageSrc}
                alt={mainImageAlt ?? title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 56rem"
                priority
              />
            </div>
          ) : null}

          {bodyHtml ? (
            <div
              className="article-detail__content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
        </div>
      </article>

      {/* FAQ */}
      {faq.length > 0 ? (
        <section className="bg-abyss-deep text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            {faqDescription ? (
              <p className="text-mist text-center leading-relaxed mb-2">
                {faqDescription}
              </p>
            ) : null}
          </div>
          <FaqSection heading={faqTitle || "Häufige Fragen"} items={faq} />
        </section>
      ) : null}

      {/* Kontakt */}
      <ServiceContactSection
        {...contactContent}
        heading="Kostenlose Erstberatung buchen."
      />
    </>
  );
}
