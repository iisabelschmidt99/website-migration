import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";

export const metadata: Metadata = {
  title: "Standortauflösung Luzern | Fenyx",
  description:
    "Standortauflösung in Luzern mit Fenyx – Verwertung, Mitarbeiterverkauf und B2C-Verkauf aus einer Hand.",
};

export default function StandortaufloesungLuzernPage() {
  return (
    <BueroaufloesungPageContent
      heroHeading="Standortauflösung in Luzern."
      heroDescription="Verwertung, Mitarbeiterverkauf und B2C-Verkauf – professionell koordiniert von Fenyx."
    />
  );
}
