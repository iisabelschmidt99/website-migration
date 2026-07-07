import Image from "next/image";
import ContactFormAb from "./ContactFormAb";
import type { ContactFormVariant } from "@/lib/contact-form-variant";

type ContactSectionProps = {
  /** Feste Variante (z. B. Homepage = B). Ohne Angabe: 50/50 pro Besucher. */
  formVariant?: ContactFormVariant;
};

/** Kontakt-Section: Portrait links, Formular rechts (A/B-Test). */
export default function ContactSection({ formVariant }: ContactSectionProps) {
  return (
    <section
      id="kontakt"
      className="service-contact bg-white"
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
                  className="object-cover"
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

              <ContactFormAb
                forcedVariant={formVariant}
                heading="Buchen Sie eine kostenlose Erstberatung."
                email="anina@fenyx-office.com"
                phone="+49 176 23820424"
                headingId="kontakt-heading"
                trackSurface="contact_section"
                trackEmailId="contact_section__email__anina"
                trackPhoneId="contact_section__phone"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
