import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";

export const metadata: Metadata = {
  title: "Büroauflösung Österreich | Fenyx",
  description:
    "Professionelle Büroauflösung in Österreich. Höhere Erlöse, stressfreie Räumung, besenreine Übergabe.",
};

export default function BueroaufloesungAtPage() {
  return (
    <BueroaufloesungPageContent heroHeading="Österreichs Nr. 1 für Büroverwertung." />
  );
}
