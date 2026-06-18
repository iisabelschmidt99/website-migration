import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";

export const metadata: Metadata = {
  title: "Kosteneffiziente Büroauflösung | Fenyx",
  description:
    "Büroauflösung mit maximalen Erlösen und minimalen Kosten – professionell koordiniert von Fenyx.",
};

export default function BueroaufloesungKosteneffizientPage() {
  return (
    <BueroaufloesungPageContent
      heroHeading="Kosteneffiziente Büroauflösung."
      heroDescription="⌀ 42% höhere Erlöse. Weniger Aufwand. Besenreine Übergabe."
    />
  );
}
