import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";

export const metadata: Metadata = {
  title: "Standortauflösung VTG | Fenyx",
  description:
    "Standortauflösung mit Fenyx – professionelle Verwertung und besenreine Übergabe.",
};

export default function StandortauflosungVtgPage() {
  return (
    <BueroaufloesungPageContent
      heroHeading="Standortauflösung: Sparen Sie bis zu 50% auf Designer-Möbel"
      heroDescription="Professionelle Verwertung, Mitarbeiterverkauf und besenreine Übergabe aus einer Hand."
    />
  );
}
