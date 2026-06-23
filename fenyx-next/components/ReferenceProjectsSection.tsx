import CaseCard from "./CaseCard";
import type { ReferenceProject } from "@/data/reference-projects";
import { referenceProjects } from "@/data/reference-projects";

type ReferenceProjectsSectionProps = {
  heading?: string;
  description?: string;
  projects?: ReferenceProject[];
  id?: string;
};

/** Referenz-Projekte als gestapelte Kartenliste (vor Kontakt). */
export default function ReferenceProjectsSection({
  heading = "Unsere Kunden setzen neue Standards für Nachhaltigkeit.",
  description = "Führende Unternehmen aus diversen Branchen und mit individuellen Anforderungen setzen auf die Zusammenarbeit mit Fenyx.",
  projects = referenceProjects,
  id = "referenz-projekte",
}: ReferenceProjectsSectionProps) {
  return (
    <section
      id={id}
      className="bg-[linear-gradient(180deg,#0b171f,#020405)]"
      aria-labelledby="referenz-projekte-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="text-center wf-max-width-large wf-align-center">
              <h2
                id="referenz-projekte-heading"
                className="wf-heading-h2 mb-5 text-white"
              >
                {heading}
              </h2>
              <p className="text-mist text-base sm:text-lg leading-relaxed">
                {description}
              </p>
            </div>

            <div className="wf-spacer-xxlarge" aria-hidden="true" />

            <div className="flex flex-col gap-20">
              {projects.map((project) => (
                <CaseCard key={project.href} {...project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
