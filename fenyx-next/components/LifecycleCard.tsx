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

/** Einzelne Leistungs-Karte mit Hintergrundbild und schwarzem Inhaltsblock. */
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
  const contentAlign =
    align === "right"
      ? "ml-auto mr-0 lg:mr-8 xl:mr-16"
      : "mr-auto ml-0 lg:ml-8 xl:ml-16";

  return (
    <div
      id={id}
      className={`leistung-card relative mb-6 lg:mb-8 min-h-[420px] sm:min-h-[480px] flex items-center overflow-hidden ${className} ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1280px) 100vw, 1280px"
        loading="lazy"
      />
      <div
        className={`relative z-10 w-full max-w-lg m-4 sm:m-8 lg:m-12 bg-black-gradient p-8 sm:p-10 lg:p-12 border border-white/10 ${contentAlign}`}
      >
        <h3 className="text-white text-2xl sm:text-3xl font-heading tracking-[-0.02em] mb-4">
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
  );
}
