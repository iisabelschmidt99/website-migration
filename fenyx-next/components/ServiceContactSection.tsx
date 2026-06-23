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
};

/** Kontakt-Section: Portrait links (feste Größe), Formular rechts – wie Webflow section_contact. */
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
}: ServiceContactSectionProps) {
  return (
    <section
      id="kontakt"
      className="service-contact bg-gradient-to-b from-black-gradient to-abyss-deep"
      aria-labelledby="service-kontakt-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="service-contact__grid">
              <div className="service-contact__portrait">
                <Image
                  src={portraitSrc}
                  alt={portraitAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
                <div
                  className="service-contact__portrait-overlay"
                  aria-hidden="true"
                />
                <div className="service-contact__portrait-caption">
                  <p className="service-contact__quote">{quote}</p>
                  <div className="service-contact__person">
                    <p className="service-contact__name">{name}</p>
                    <p className="service-contact__role">{role}</p>
                  </div>
                </div>
              </div>

              <div className="service-contact__form">
            <h2
              id="service-kontakt-heading"
              className="wf-heading-h2 text-white mb-6"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
