import ReferencesArchitecturalG from "@/components/concepts/g/ReferencesArchitecturalG";
import type { ReferenceProject } from "@/data/reference-projects";
import { referenceProjects } from "@/data/reference-projects";

type ReferenceProjectsSectionProps = {
  heading?: string;
  description?: string;
  projects?: ReferenceProject[];
  id?: string;
};

/** Referenz-Bento (wie Homepage / Konzept G) – global einheitlich. */
export default function ReferenceProjectsSection({
  heading,
  description,
  projects = referenceProjects,
  id = "referenz-projekte",
}: ReferenceProjectsSectionProps) {
  return (
    <ReferencesArchitecturalG
      id={id}
      projects={projects}
      heading={heading}
      description={description}
    />
  );
}
