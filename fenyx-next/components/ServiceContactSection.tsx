import Image from "next/image";
import HubSpotForm from "./HubSpotForm";

type ServiceContactSectionProps = {
  heading: string;
  subline?: string;
  email: string;
  phone: string;
  portraitSrc: string;
  portraitAlt: string;
  quote: string;
  name: string;
  role: string;
  /** Webflow: Formular links, Portrait rechts */
  layout?: "portraitFirst" | "formFirst";
};

/** Kontakt-Section mit konfigurierbarem Berater-Portrait (Leistungsunterseiten). */
export default function ServiceContactSection({
  heading,
  subline,
  email,
  phone,
  portraitSrc,
  portraitAlt,
  quote,
  name,
  role,
  layout = "portraitFirst",
}: ServiceContactSectionProps) {
  const portrait = (
    <div className="relative min-h-[420px] border border-white/10 overflow-hidden">
            <Image
              src={portraitSrc}
              alt={portraitAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <blockquote className="text-white text-sm sm:text-base leading-relaxed mb-4 font-medium">
                {quote}
              </blockquote>
              <div className="text-right">
                <p className="text-white font-bold text-sm">{name}</p>
                <p className="text-mist text-xs">{role}</p>
              </div>
            </div>
          </div>
  );

  const form = (
    <div>
      <h2
        id="service-kontakt-heading"
        className="text-white text-2xl sm:text-3xl lg:text-4xl font-heading tracking-[-0.02em] mb-6"
      >
        {heading}
      </h2>
      {subline ? (
        <p className="text-mist text-sm sm:text-base leading-relaxed mb-6">
          {subline}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 text-sm">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {email}
        </a>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {phone}
        </a>
      </div>

      <HubSpotForm />
    </div>
  );

  return (
    <section
      id="kontakt"
      className="bg-abyss-deep py-20 sm:py-28"
      aria-labelledby="service-kontakt-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {layout === "formFirst" ? (
            <>
              {form}
              {portrait}
            </>
          ) : (
            <>
              {portrait}
              {form}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
