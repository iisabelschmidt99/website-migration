import type { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";
import { getLegalPage } from "@/data/legal";

export const metadata: Metadata = {
  title: getLegalPage("impressum").meta.title,
  description: getLegalPage("impressum").meta.description,
};

export default function ImpressumPage() {
  return (
    <div className="inv-page">
      <LegalPageContent page={getLegalPage("impressum")} />
    </div>
  );
}
