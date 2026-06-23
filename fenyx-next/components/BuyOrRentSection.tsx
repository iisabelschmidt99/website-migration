import Link from "next/link";
import CtaButton from "./CtaButton";

type BuyOrRentSectionProps = {
  heading: string;
  body: string;
  buyHref: string;
  rentHref: string;
};

/** Kauf- vs. Miet-Entscheidung (Co-Working-Seite). */
export default function BuyOrRentSection({
  heading,
  body,
  buyHref,
  rentHref,
}: BuyOrRentSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-white" aria-labelledby="buy-rent-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="buy-rent-heading"
          className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] text-black mb-6 text-balance"
        >
          {heading}
        </h2>
        <div className="text-base leading-relaxed text-black/75 space-y-4 mb-10">
          {body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CtaButton href={buyHref}>Kaufen</CtaButton>
          <Link
            href={rentHref}
            className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.12em] border border-black/20 text-black hover:border-signal hover:text-signal transition-all duration-200"
          >
            Mieten
          </Link>
        </div>
      </div>
    </section>
  );
}
