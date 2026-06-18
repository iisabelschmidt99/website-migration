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
      className={`case-card flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12 bg-abyss-deep p-8 sm:p-10 lg:p-12 shadow-[0_2px_5rem_rgba(2,4,5,0.2)] ${
        imageLeft ? "case-card--image-left" : ""
      }`}
    >
      <div className="case-card-content flex w-full flex-col justify-between lg:max-w-[50%] lg:flex-1">
        <div>
          <p className="mb-1.5 text-sm font-bold text-white/90">{eyebrow}</p>
          <h3 className="mb-3 font-heading text-xl tracking-[-0.02em] text-white sm:text-2xl">
            {heading}
          </h3>
          <div className="mb-4 inline-flex items-center self-start border border-white/20 px-3.5 py-1.5 text-[11px] text-white/85">
            {tag}
          </div>
        </div>

        <div>
          <p className="mb-4 max-w-[34rem] text-[13px] leading-relaxed text-mist">
            {body}
          </p>
          <div className="mb-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-lg leading-tight text-white sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-mist">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <Link
            href={href}
            className="inline-flex items-center justify-center self-start border border-signal px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-signal transition-colors duration-200 hover:bg-signal hover:text-black"
          >
            Zum Projekt
          </Link>
        </div>
      </div>

      <div className="case-card-image flex w-full items-center lg:max-w-[50%] lg:flex-1">
        <div className="case-card-image-frame relative aspect-[5/3] w-full overflow-hidden">
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
