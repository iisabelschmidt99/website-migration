import Image from "next/image";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

type LogoGridProps = {
  heading?: string;
  description?: string;
  logos?: Logo[];
};

/** Kundenlogo-Raster (Social Proof) – 14 Spalten Desktop, responsiv kleiner. */
export default function LogoGrid({
  heading = "Diese und viele weitere Unternehmen vertrauen bereits auf Fenyx.",
  description = "Führende Unternehmen aus verschiedenen Branchen haben sich für nachhaltige Bürolösungen von Fenyx entschieden und profitieren von messbaren Kosteneinsparungen und zertifizierbarer Nachhaltigkeit.",
  logos = homepageLogos,
}: LogoGridProps) {
  return (
    <section className="py-20 sm:py-28 bg-white" aria-labelledby="logo-grid-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
        <div className="text-center wf-max-width-large wf-align-center mb-14 sm:mb-20">
          <h2
            id="logo-grid-heading"
            className="wf-heading-h2 mb-5 text-black"
          >
            {heading}
          </h2>
          {description ? (
            <p className="text-black text-base sm:text-lg leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>

        <div
          className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-x-4 gap-y-8 sm:gap-x-7 sm:gap-y-11"
          role="list"
          aria-label="Kundenlogos"
        >
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center h-9 px-2"
              role="listitem"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={68}
                height={36}
                className="w-full h-full max-w-[4.25rem] object-contain object-center"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
