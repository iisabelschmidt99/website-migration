import type { LegalPageData } from "@/data/legal";

type LegalPageContentProps = {
  page: LegalPageData;
};

/** Rechtstext-Seiten (Impressum, Datenschutz, AGB). */
export default function LegalPageContent({ page }: LegalPageContentProps) {
  return (
    <section className="legal-page py-20 sm:py-28 bg-white text-abyss-deep">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-10">
          {page.title}
        </h1>
        <div className="legal-page__content">
          {page.blocks.map((block, index) => {
            const key = `${block.type}-${index}-${block.text.slice(0, 24)}`;

            if (block.type === "h2") {
              return (
                <h2 key={key} className="legal-page__h2">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "h3") {
              return (
                <h3 key={key} className="legal-page__h3">
                  {block.text}
                </h3>
              );
            }
            if (block.type === "h4") {
              return (
                <h4 key={key} className="legal-page__h4">
                  {block.text}
                </h4>
              );
            }
            if (block.type === "li") {
              return (
                <p key={key} className="legal-page__li">
                  {block.text}
                </p>
              );
            }

            return (
              <p key={key} className="legal-page__p">
                {block.text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
