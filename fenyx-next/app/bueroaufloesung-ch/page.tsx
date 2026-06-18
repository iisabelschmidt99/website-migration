import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";

export const metadata: Metadata = {
  title: "Büroauflösung Schweiz | Fenyx",
  description:
    "Professionelle Büroauflösung in der Schweiz. Höhere Erlöse, stressfreie Räumung, besenreine Übergabe.",
};

export default function BueroaufloesungChPage() {
  return (
    <BueroaufloesungPageContent heroHeading="Nr. 1 in der Schweiz für Büroverwertung." />
  );
}
