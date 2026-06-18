import type { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";

export const metadata: Metadata = {
  title: getLegalPage("agb").meta.title,
  description: getLegalPage("agb").meta.description,
};

export default function AgbPage() {
  return (
    <div className="inv-page">
      <LegalPageContent page={getLegalPage("agb")} />
    </div>
  );
}
