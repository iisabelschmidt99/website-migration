import type { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";

export const metadata: Metadata = {
  title: getLegalPage("datenschutz").meta.title,
  description: getLegalPage("datenschutz").meta.description,
};

export default function DatenschutzPage() {
  return (
    <div className="inv-page">
      <LegalPageContent page={getLegalPage("datenschutz")} />
    </div>
  );
}
