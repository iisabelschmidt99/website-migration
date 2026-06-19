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
      className="bg-white"
      aria-labelledby="referenz-projekte-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
        <div className="wf-padding-section-large">
        <div className="text-center wf-max-width-large wf-align-center">
          <h2
            id="referenz-projekte-heading"
            className="wf-heading-h2 mb-5 text-black"
          >
            {heading}
          </h2>
          <p className="text-black text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="wf-spacer-xxlarge" aria-hidden="true" />

        <ReferenceScrollStack projects={projects} />
        </div>
        </div>
      </div>
    </section>
  );
}
