import Image from "next/image";

type LeistungBleedCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  align?: "left" | "right";
};

/** Volle-Breite-Timeline-Karte mit Hintergrundbild (Leistungsunterseiten). */
export default function LeistungBleedCard({
  title,
  description,
  imageSrc,
  imageAlt = "",
  align = "left",
}: LeistungBleedCardProps) {
  return (
    <div
      className={`leistung-card leistung-card--bleed ${
        align === "right" ? "leistung-card--align-end" : ""
      }`}
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
      </div>
      <div className="leistung-card__inner">
        <div className="leistung-card__panel">
          <h3 className="text-white text-2xl sm:text-3xl font-heading tracking-[-0.02em] mb-4">
            {title}
          </h3>
          <p className="text-mist text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
