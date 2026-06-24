import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

type CaseCardProps = ReferenceProject;

/** Einzelne Referenz-Karte (Text + Bild, alternierend links/rechts) – 1:1 zu Webflow `cases_item`. */
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
      className={`case-card flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-20 bg-abyss-deep p-8 lg:p-12 shadow-[0_2px_5rem_rgba(2,4,5,0.2)] ${
        imageLeft ? "case-card--image-left" : ""
      }`}
    >
      <div className="case-card-content flex w-full flex-col justify-between lg:max-w-[50%] lg:flex-1">
        <div>
          <p className="mb-1.5 text-sm font-bold text-white/90">{eyebrow}</p>
          <h3 className="mb-3 font-heading text-[2rem] font-bold leading-tight text-white">
            {heading}
          </h3>
          <div className="mb-4 inline-flex items-center self-start rounded-2xl border border-white/10 bg-abyss-deep/70 px-[9px] py-[3px] text-xs font-normal text-white">
            {tag}
          </div>
        </div>

        <div>
          <p className="mb-6 max-w-[34rem] text-sm leading-relaxed text-white/90">
            {body}
          </p>
          <div className="case-card-stats mb-6">
            <div className="flex gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1">
                  <p className="font-heading text-xl font-normal leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[0.625rem] leading-snug text-white">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Link
            href={href}
            className="inline-flex items-center justify-center self-start border border-signal px-7 py-3 text-sm font-bold uppercase text-signal transition-colors duration-200 hover:bg-signal hover:text-black"
          >
            Zum Projekt
          </Link>
        </div>
      </div>

      <div className="case-card-image flex w-full items-center lg:max-w-[50%] lg:flex-1">
        <div className="case-card-image-frame relative aspect-[3/1.8] w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40vw"
            loading="lazy"
          />
        </div>
      </div>
    </article>
  );
}
