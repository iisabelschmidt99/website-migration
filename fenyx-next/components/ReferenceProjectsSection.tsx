import ReferenceScrollStack from "./ReferenceScrollStack";
import type { ReferenceProject } from "@/data/reference-projects";
import { referenceProjects } from "@/data/reference-projects";

type ReferenceProjectsSectionProps = {
  heading?: string;
  description?: string;
  projects?: ReferenceProject[];
  id?: string;
};

/** Referenz-Projekte mit Sticky-Scroll-Stack (vor Kontakt). */
export default function ReferenceProjectsSection({
  heading = "Unsere Kunden setzen neue Standards für Nachhaltigkeit.",
  description = "Führende Unternehmen aus diversen Branchen und mit individuellen Anforderungen setzen auf die Zusammenarbeit mit Fenyx.",
  projects = referenceProjects,
  id = "referenz-projekte",
}: ReferenceProjectsSectionProps) {
  return (
    <section
      id={id}
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="referenz-projekte-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <h2
            id="referenz-projekte-heading"
            className="text-h2 sm:text-3xl lg:text-[2.75rem] font-heading tracking-fenyx mb-5 text-black"
          >
            {heading}
          </h2>
          <p className="text-black text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <ReferenceScrollStack projects={projects} />
      </div>
    </section>
  );
}
