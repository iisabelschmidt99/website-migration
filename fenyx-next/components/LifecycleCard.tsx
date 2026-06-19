import Image from "next/image";
import Link from "next/link";
import CheckList from "./CheckList";

export type LifecycleCardProps = {
  id?: string;
  title: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  href: string;
  align?: "left" | "right";
  className?: string;
};

/** Volle-Breite-Timeline-Karte (Webflow timeline_outter-row + timeline_img-wrapper). */
export default function LifecycleCard({
  id,
  title,
  description,
  bullets,
  imageSrc,
  imageAlt,
  href,
  align = "left",
  className = "",
}: LifecycleCardProps) {
  return (
    <div
      id={id}
      className={`leistung-card leistung-card--bleed ${
        align === "right" ? "leistung-card--align-end" : ""
      } ${className}`}
    >
      <div className="leistung-card__media" aria-hidden="true">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
        <div className="leistung-card__overlay" />
      </div>
      <div className="leistung-card__inner">
        <div className="leistung-card__panel">
          <h3 className="text-white text-xl sm:text-2xl font-heading tracking-[-0.02em] mb-4">
            {title}
          </h3>
          <p className="text-mist text-sm leading-relaxed mb-6">{description}</p>
          <CheckList
            items={bullets}
            className="text-white/85 mb-8"
            aria-label={`Vorteile ${title}`}
          />
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-signal text-[11px] font-bold uppercase tracking-[0.1em] hover:gap-3 transition-all duration-200"
          >
            Mehr erfahren
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
