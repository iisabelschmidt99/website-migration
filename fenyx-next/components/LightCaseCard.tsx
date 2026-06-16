import Image from "next/image";
import Link from "next/link";

type LightCaseCardProps = {
  eyebrow: string;
  heading: string;
  body: string;
  stats: { value: string; label: string }[];
  href: string;
  imageSrc: string;
  imageAlt: string;
};

/** Helle Referenz-Karte (Digitale Inventarisierung). */
export default function LightCaseCard({
  eyebrow,
  heading,
  body,
  stats,
  href,
  imageSrc,
  imageAlt,
}: LightCaseCardProps) {
  return (
    <article className="inv-case-card">
      <div className="inv-case-card__inner">
        <div className="inv-case-card__content">
          <p className="text-xs font-bold uppercase tracking-wider text-black/55 mb-2">
            {eyebrow}
          </p>
          <h3 className="text-xl sm:text-2xl font-heading tracking-[-0.02em] mb-4 text-black">
            {heading}
          </h3>
          <p className="text-sm leading-relaxed text-black/75 mb-6">{body}</p>
          <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-black/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-heading text-black">{stat.value}</p>
                <p className="text-[0.625rem] leading-snug text-black/55 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <Link
            href={href}
            className="inline-flex items-center px-6 py-3 border border-signal text-signal text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-signal hover:text-black transition-colors"
          >
            Zum Projekt
          </Link>
        </div>
        <div className="inv-case-card__image relative min-h-[14rem] lg:min-h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            loading="lazy"
          />
        </div>
      </div>
    </article>
  );
}
