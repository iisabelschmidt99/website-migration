import Image from "next/image";
import HubSpotForm from "./HubSpotForm";

/** Kontakt-Section Homepage: Portrait links, Formular rechts. */
export default function ContactSection() {
  return (
    <section
      id="kontakt"
      className="service-contact bg-gradient-to-b from-black-gradient to-abyss-deep"
      aria-labelledby="kontakt-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="service-contact__grid">
              <div className="service-contact__portrait">
                <Image
                  src="/assets/kontakt/anina-blatter.webp"
                  alt="Bild von Anina Blatter, Einrichtungsberaterin bei Fenyx Office"
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
                  <p className="service-contact__quote">
                    „Gerne begleite ich Sie auf dem Weg zu einer nachhaltigen
                    Transformation Ihres Büros.“
                  </p>
                  <div className="service-contact__person">
                    <p className="service-contact__name">Anina Blatter</p>
                    <p className="service-contact__role">Einrichtungsberaterin</p>
                  </div>
                </div>
              </div>

              <div className="service-contact__form">
                <h2
                  id="kontakt-heading"
                  className="wf-heading-h2 text-white mb-6"
                >
                  Buchen Sie eine kostenlose Erstberatung.
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 text-sm">
                  <a
                    href="mailto:anina@fenyx-office.com"
                    className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
                    data-track-surface="contact_section"
                    data-track-id="contact_section__email__anina"
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
                    anina@fenyx-office.com
                  </a>
                  <a
                    href="tel:+4917623820424"
                    className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
                    data-track-surface="contact_section"
                    data-track-id="contact_section__phone"
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
                    +49 176 23820424
                  </a>
                </div>

                <HubSpotForm leadSurface="contact_section" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
