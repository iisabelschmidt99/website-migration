import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

type CaseCardProps = ReferenceProject;

/** Einzelne Referenz-Karte (Text + Bild, alternierend links/rechts). */
export default function CaseCard({
  eyebrow,
  heading,
  tag,
  body,
  stats,
  href,
  imageSrc,
  imageAlt,
  imageLeft = false,
}: CaseCardProps) {
  return (
    <article
      className={`case-card grid grid-cols-1 lg:grid-cols-2 min-h-[22rem] lg:h-[28rem] lg:min-h-[28rem] lg:max-h-[28rem] overflow-hidden bg-abyss-deep items-stretch ${
        imageLeft ? "case-card--image-left" : ""
      }`}
    >
      <div className="case-card-content flex flex-col justify-center p-7 sm:p-9 lg:p-11 lg:h-[28rem] lg:overflow-hidden">
        <p className="text-xs font-bold text-white/90 mb-1.5">{eyebrow}</p>
        <h3 className="text-white text-xl sm:text-2xl font-heading tracking-[-0.02em] mb-3">
          {heading}
        </h3>
        <div className="inline-flex self-start items-center mb-4 px-3.5 py-1.5 border border-white/20 text-[11px] text-white/85">
          {tag}
        </div>
        <p className="text-mist text-[13px] leading-relaxed mb-4 max-w-[34rem]">
          {body}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-4 pt-4 border-t border-white/10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-white text-lg sm:text-xl font-heading leading-tight">
                {stat.value}
              </p>
              <p className="text-mist text-[10px] leading-snug mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <Link
          href={href}
          className="inline-flex self-start items-center justify-center px-5 py-2.5 border border-signal text-signal text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-signal hover:text-black transition-colors duration-200"
        >
          Zum Projekt
        </Link>
      </div>

      <div className="case-card-image relative aspect-[16/10] min-h-[14rem] lg:aspect-auto lg:h-[28rem] p-7 sm:p-9 lg:py-11 lg:pl-7 lg:pr-11 bg-abyss-deep overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          loading="lazy"
        />
      </div>
    </article>
  );
}
