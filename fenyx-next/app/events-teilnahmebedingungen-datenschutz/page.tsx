import type { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";
import { eventsLegalPage } from "@/data/events-legal";

export const metadata: Metadata = {
  title: eventsLegalPage.meta.title,
  description: eventsLegalPage.meta.description,
};

export default function EventsTeilnahmebedingungenPage() {
  return (
    <div className="inv-page">
      <LegalPageContent page={eventsLegalPage} />
    </div>
  );
}
