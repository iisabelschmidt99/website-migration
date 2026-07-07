import Image from "next/image";
import ContactFormAb from "./ContactFormAb";

export type SurveyContactSectionProps = {
  heading: string;
  email: string;
  phone: string;
  portraitSrc: string;
  portraitAlt: string;
  quote: string;
  name: string;
  role: string;
};

/** @deprecated Nutze ServiceContactSection – gleiches Layout mit A/B-Formular. */
export default function SurveyContactSection({
  heading,
  email,
  phone,
  portraitSrc,
  portraitAlt,
  quote,
  name,
  role,
}: SurveyContactSectionProps) {
  const trackIdBase = name.toLowerCase().replace(/\s+/g, "_");

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
                  className="object-cover"
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

              <ContactFormAb
                heading={heading}
                email={email}
                phone={phone}
                headingId="service-kontakt-heading"
                trackSurface="service_contact"
                trackEmailId={`service_contact__email__${trackIdBase}`}
                trackPhoneId={`service_contact__phone__${trackIdBase}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
