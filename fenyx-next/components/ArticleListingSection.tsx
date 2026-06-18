import Image from "next/image";
import Link from "next/link";

export type ArticleListingItem = {
  slug: string;
  title: string;
  excerpt: string;
  imageSrc: string;
  href: string;
  tag?: string;
  dateLabel?: string;
};

type ArticleListingSectionProps = {
  heading: string;
  description?: string;
  items: ArticleListingItem[];
};

/** Übersichtsseite für Ratgeber, Presse und Events. */
export default function ArticleListingSection({
  heading,
  description,
  items,
}: ArticleListingSectionProps) {
  return (
    <section className="article-listing py-20 sm:py-28 bg-abyss-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="article-listing__header">
          <h1 className="article-listing__title">{heading}</h1>
          {description ? (
            <p className="article-listing__description">{description}</p>
          ) : null}
        </header>

        <div className="article-listing__grid" role="list">
          {items.map((item) => (
            <article key={item.slug} role="listitem" className="article-listing__card">
              <Link href={item.href} className="article-listing__card-link">
                <div className="article-listing__card-image-wrap">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    width={480}
                    height={300}
                    className="article-listing__card-image"
                    loading="lazy"
                  />
                </div>
                <div className="article-listing__card-body">
                  {item.tag ? (
                    <span className="article-listing__card-tag">{item.tag}</span>
                  ) : null}
                  {item.dateLabel ? (
                    <span className="article-listing__card-date">{item.dateLabel}</span>
                  ) : null}
                  <h2 className="article-listing__card-title">{item.title}</h2>
                  <p className="article-listing__card-excerpt">{item.excerpt}</p>
                  <span className="article-listing__card-cta">Weiterlesen</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
