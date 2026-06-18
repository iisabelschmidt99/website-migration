import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import type { ReferenzCaseStudy } from "@/data/referenz-case-studies";

type ReferenzCaseDetailSectionProps = {
  study: ReferenzCaseStudy;
};

/** Case-Study Hero + Kennzahlen + Text (Webflow section_case). */
export default function ReferenzCaseDetailSection({
  study,
}: ReferenzCaseDetailSectionProps) {
  return (
    <section className="referenz-case" aria-labelledby="referenz-case-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="referenz-case__hero">
          <p className="referenz-case__company">{study.company}</p>
          <h1 id="referenz-case-title" className="referenz-case__title">
            {study.title}
          </h1>

          <div className="referenz-case__hero-stats">
            {study.heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`referenz-case__hero-stat${
                  index === study.heroStats.length - 1 ? " is-last" : ""
                }`}
              >
                <p className="referenz-case__hero-stat-value">{stat.value}</p>
                <p className="referenz-case__hero-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="referenz-case__hero-image-wrap">
          <Image
            src={study.heroImageSrc}
            alt={study.heroImageAlt}
            width={1280}
            height={720}
            className="referenz-case__hero-image"
            priority
          />
        </div>

        <div className="referenz-case__layout">
          <aside className="referenz-case__sidebar" aria-label="Projektdaten">
            {study.metaRows.map((row, index) => (
              <div
                key={row.label}
                className={`referenz-case__meta-row${
                  index === study.metaRows.length - 1 ? " is-last" : ""
                }`}
              >
                <span className="referenz-case__meta-label">{row.label}</span>
                <span className="referenz-case__meta-value">{row.value}</span>
              </div>
            ))}
          </aside>

          <div className="referenz-case__content">
            {study.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="referenz-case__intro">
                {paragraph}
              </p>
            ))}

            {study.highlights.map((highlight) => (
              <div key={highlight.heading} className="referenz-case__highlight">
                <h2 className="referenz-case__highlight-heading">
                  {highlight.heading}
                </h2>
                <p className="referenz-case__highlight-body">{highlight.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type RelatedReferenzenSectionProps = {
  heading?: string;
  studies: ReferenzCaseStudy[];
};

function LocationPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="referenzen-cases__pin"
      aria-hidden="true"
    >
      <path
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ähnliche Kundenprojekte (Webflow section_cases-overview auf Detailseite). */
export function RelatedReferenzenSection({
  heading = "Ähnliche Kundenprojekte",
  studies,
}: RelatedReferenzenSectionProps) {
  if (!studies.length) return null;

  return (
    <section
      className="referenzen-cases referenzen-cases--related"
      aria-labelledby="related-referenzen-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="referenzen-cases__related-header">
          <h2 id="related-referenzen-heading" className="referenzen-cases__heading">
            {heading}
          </h2>
          <CtaButton href="/referenzen" className="text-sm tracking-[0.08em] px-7 py-3">
            Alle Kundenprojekte
          </CtaButton>
        </div>

        <div className="referenzen-cases__grid referenzen-cases__grid--related">
          {studies.map((study) => (
            <Link
              key={study.slug}
              href={`/referenzen/${study.slug}`}
              className="referenzen-cases__card referenzen-cases__card--link"
            >
              <div className="referenzen-cases__card-image-wrap">
                <Image
                  src={study.heroImageSrc}
                  alt={study.heroImageAlt}
                  width={480}
                  height={320}
                  className="referenzen-cases__card-image"
                  loading="lazy"
                />
              </div>
              <div className="referenzen-cases__card-body">
                <span className="referenzen-cases__card-tag">{study.company}</span>
                <h3 className="referenzen-cases__card-title">{study.title}</h3>
                <p className="referenzen-cases__card-city">
                  <LocationPinIcon />
                  {study.city}
                </p>
                <p className="referenzen-cases__card-category">{study.categoryLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
