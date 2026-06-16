import Image from "next/image";
import HubSpotForm from "./HubSpotForm";

/** Kontakt-Section mit HubSpot-Formular und Anina-Blatter-Portrait. */
export default function ContactSection() {
  return (
    <section
      id="kontakt"
      className="bg-gradient-to-b from-black-gradient to-abyss-deep py-20 sm:py-28"
      aria-labelledby="kontakt-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Formular + Überschrift (links) */}
          <div>
            <h2
              id="kontakt-heading"
              className="text-white text-2xl sm:text-3xl lg:text-h2 font-heading tracking-[-0.02em] mb-6"
            >
              Buchen Sie eine kostenlose Erstberatung.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 text-sm">
              <a
                href="mailto:anina@fenyx-office.com"
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
                anina@fenyx-office.com
              </a>
              <a
                href="tel:+4917623820424"
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
                +49 176 23820424
              </a>
            </div>

            <HubSpotForm />
          </div>

          {/* Portrait Anina Blatter (rechts) */}
          <div className="relative min-h-[420px] lg:min-h-full border border-white/10 overflow-hidden">
            <Image
              src="/assets/kontakt/anina-blatter.webp"
              alt="Bild von Anina Blatter, Einrichtungsberaterin bei Fenyx Office"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <blockquote className="text-sm sm:text-base leading-relaxed mb-4 font-medium">
                „Gerne begleite ich Sie auf dem Weg zu einer nachhaltigen
                Transformation Ihres Büros.“
              </blockquote>
              <div className="text-right">
                <p className="font-bold text-sm">Anina Blatter</p>
                <p className="text-mist text-xs">Einrichtungsberaterin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
