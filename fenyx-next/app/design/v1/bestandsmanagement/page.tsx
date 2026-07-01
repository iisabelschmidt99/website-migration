// Design V1 Unterseite — Bestandsmanagement im „Belege“-Stil.
// URL: /design/v1/bestandsmanagement

import type { Metadata } from "next";
import LogoGrid from "@/components/LogoGrid";
import ContactSection from "@/components/ContactSection";
import DesignV1ProofRow from "@/components/design/v1/DesignV1ProofRow";
import DesignV1ServiceHero from "@/components/design/v1/DesignV1ServiceHero";
import DesignV1FeatureBand from "@/components/design/v1/DesignV1FeatureBand";
import DesignV1ReferencesSection from "@/components/design/v1/DesignV1ReferencesSection";
import { bestandsmanagementReferences } from "@/data/bestandsmanagement-references";

export const metadata: Metadata = {
  title: "Design V1 – Bestandsmanagement | Fenyx",
  description:
    "Redesign-Vorschlag: Bestandsmanagement-Unterseite im V1-Belege-Stil – kompakter Hero, Kennzahlen, Feature-Bänder, scrollbare Referenzen.",
  robots: { index: false, follow: false },
};

const assetBase = "/assets/leistungen/bestandsmanagement";

export default function DesignV1BestandsmanagementPage() {
  return (
    <>
      <DesignV1ServiceHero
        eyebrow="Digitales Bestandsmanagement"
        heading="Bestandsmanagement, das aus Kosten Wert macht."
        description="Wir erfassen, bewerten und nutzen Ihren Bürobestand wirtschaftlich – statt ihn abzuschreiben oder ungenutzt zu lagern."
        bullets={[
          "+50 % niedrigere Beschaffungskosten",
          "+125 kg CO₂-Einsparungen pro Arbeitsplatz",
          "Zeitlich flexible Umsetzung",
        ]}
        imageSrc={`${assetBase}/hero.png`}
        imageAlt="Fenyx-Mitarbeiter bei der digitalen Bestandserfassung"
        ctaHref="/design/v1/bestandsmanagement#kontakt"
      />

      <LogoGrid description="" />

      <DesignV1ProofRow />

      <DesignV1FeatureBand
        heading="Die Datengrundlage für Planung im Bestand."
        body="Wir liefern mehr als Software. Unsere geschulten Teams erfassen Ihren Bestand strukturiert, inklusive Bilddokumentation und aller relevanten Produktdaten. Das Ergebnis: eine präzise, digital nutzbare Bestandsübersicht."
        imageSrc={`${assetBase}/cta-datengrundlage.png`}
        imageAlt="Zwei Mitarbeiter im Gespräch in einem Büro"
      />

      <DesignV1FeatureBand
        heading="Vom Digitalen in die Realität."
        body="Neben der Innenmöblierung erfassen wir auch das Gebäude selbst als Teil der Bestandsaufnahme. Laufwege, Aufzugsmaße und logistische Rahmenbedingungen werden strukturiert dokumentiert."
        imageSrc={`${assetBase}/cta-realitaet.png`}
        imageAlt="Fenyx-Mitarbeiter dokumentiert Bestand vor Ort"
        reverse
        dark
        ctaLabel="Jetzt starten"
      />

      <DesignV1ReferencesSection
        projects={bestandsmanagementReferences}
        limit={4}
        heading="Bestandsmanagement in der Praxis."
        id="referenzen"
      />

      <ContactSection />
    </>
  );
}
