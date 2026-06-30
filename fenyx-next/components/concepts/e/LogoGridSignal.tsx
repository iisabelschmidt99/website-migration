import Image from "next/image";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

/**
 * Logo-Grid „Signal Quiet" – Outline-Logos in einem Raster mit dünnen
 * Trennlinien. Hover hebt das Logo an und blendet einen Signal-Punkt ein.
 */
const LOGOS = (homepageLogos as Logo[]).slice(0, 21);

export default function LogoGridSignal() {
  return (
    <section
      className="de-logo-grid wf-padding-section-large"
      data-de-section="Vertrauen"
      aria-labelledby="de-logos-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <p className="de-eyebrow text-signal/60">Vertraut von</p>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>
          <h2 id="de-logos-heading" className="sr-only">
            Unternehmen, die auf Fenyx vertrauen
          </h2>

          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 border-t border-l border-white/10">
            {LOGOS.map((logo) => (
              <li
                key={logo.src}
                className="de-logo-cell flex items-center justify-center border-b border-r border-white/10 px-4 py-8"
              >
                <span className="de-logo-cell__dot" aria-hidden="true" />
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={128}
                  height={32}
                  loading="lazy"
                  className="de-logo-cell__img max-h-7 w-auto max-w-[7.5rem] object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
