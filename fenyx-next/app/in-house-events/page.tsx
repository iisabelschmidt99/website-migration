import type { Metadata } from "next";
import Link from "next/link";
import ServiceContactSection from "@/components/ServiceContactSection";
import { contactContent } from "@/data/referenzen";

export const metadata: Metadata = {
  title: "In-House-Events | Fenyx",
  description:
    "Fenyx kuratiert Inhouse-Sessions für Teams ab 8 Personen – zu nachhaltiger Bürogestaltung und Kreislaufwirtschaft.",
};

export default function InHouseEventsPage() {
  return (
    <div className="inv-page">
      <section className="bg-abyss-deep text-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-heading tracking-[-0.03em] mb-6">
            Wir kuratieren Inhouse-Sessions für Teams ab 8 Personen.
          </h1>
          <p className="text-mist text-base sm:text-lg leading-relaxed mb-8">
            Ob Workshop, Site Visit oder Impulsvortrag – wir bringen Expertenwissen
            zu nachhaltiger Bürogestaltung direkt in Ihr Unternehmen.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-6 py-3 border border-signal text-signal text-sm font-bold uppercase tracking-[0.08em] hover:bg-signal hover:text-black transition-colors"
          >
            Öffentliche Events entdecken
          </Link>
        </div>
      </section>

      <ServiceContactSection {...contactContent} />
    </div>
  );
}
