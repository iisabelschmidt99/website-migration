import Image from "next/image";
import Link from "next/link";

type ArticleDetailSectionProps = {
  title: string;
  imageSrc: string;
  paragraphs: string[];
  backHref: string;
  backLabel: string;
  metaItems?: { label: string; value: string }[];
};

/** CMS-Artikel (Ratgeber, Presse, Events). */
export default function ArticleDetailSection({
  title,
  imageSrc,
  paragraphs,
  backHref,
  backLabel,
  metaItems,
}: ArticleDetailSectionProps) {
  const filteredParagraphs = paragraphs.filter((p) => p.trim() && p !== "‍");

  return (
    <article className="article-detail bg-gradient-to-b from-abyss-deep to-black-gradient text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href={backHref} className="article-detail__back">
          ← {backLabel}
        </Link>

        <header className="article-detail__header">
          {metaItems && metaItems.length > 0 ? (
            <div className="article-detail__meta">
              {metaItems.map((item) => (
                <span key={item.label}>
                  <strong>{item.label}:</strong> {item.value}
                </span>
              ))}
            </div>
          ) : null}
          <h1 className="article-detail__title">{title}</h1>
        </header>

        <div className="article-detail__image-wrap">
          <Image
            src={imageSrc}
            alt={title}
            width={960}
            height={540}
            className="article-detail__image"
            priority
          />
        </div>

        <div className="article-detail__body">
          {filteredParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
