// Neue Homepage-Vorschau (Design V3 „Signal") – URL: /b
// Wiederverwendete V3-Komponenten aus dem Duplicate-Repo, Pfade auf /b angepasst.

import type { Metadata } from "next";
import LogoGrid from "@/components/LogoGrid";
import ContactSection from "@/components/ContactSection";
import DesignV3HeroCanvas from "@/components/design/v3/DesignV3HeroCanvas";
import DesignV3KpiSwitcher from "@/components/design/v3/DesignV3KpiSwitcher";
import DesignV3ServiceSection from "@/components/design/v3/DesignV3ServiceSection";
import DesignV3ImpactStrip from "@/components/design/v3/DesignV3ImpactStrip";
import DesignV3PressRow from "@/components/design/v3/DesignV3PressRow";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Neue Startseite (Vorschau) | Fenyx",
  description:
    "Interne Vorschau des neuen Homepage-Designs – Canvas-Hero, interaktive KPIs, Info-Sections.",
  robots: { index: false, follow: false },
};

export default function HomePreviewBPage() {
  return (
    <>
      <DesignV3HeroCanvas ctaHref="/b#kontakt" />

      <DesignV3KpiSwitcher />

      <LogoGrid
        heading="Diese Unternehmen vertrauen auf Fenyx."
        description=""
      />

      <DesignV3ServiceSection
        index="01"
        eyebrow="Digitales Bestandsmanagement"
        title="Voller Überblick. Digitale Präzision."
        body="Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands – digital, präzise, nachverfolgbar. Bevor irgendwas entsorgt oder neu bestellt wird."
        specs={[
          { label: "Weiternutzung nach Aufbereitung", value: "intern / extern" },
          { label: "Ankaufsangebote", value: "⌀ 42 % höher" },
          { label: "Wiederverwertungsrate", value: "⌀ 29 % besser" },
        ]}
        href="/bestandsmanagement"
        imageSrc="/assets/timeline/Home-Digitales-Bestandsmanagement.webp"
        imageAlt="Person inventarisiert Büromöbel mit einer App."
        imageRight
      />

      <DesignV3ServiceSection
        index="02"
        eyebrow="Ganzheitliche Verwertung"
        title="Maximaler Erlös. Null Aufwand."
        body="Wir übernehmen die vollständige Verwertung – von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht."
        specs={[
          { label: "Erstbesichtigung", value: "kostenlos vor Ort" },
          { label: "Erlössteigerung", value: "bis zu 42 %" },
          { label: "Übergabe", value: "100 % sorgenfrei" },
        ]}
        href="/verwertung/bueroaufloesung"
        imageSrc="/assets/verwertung-aussenlift.png"
        imageAlt="Büromöbel werden per Außenlift aus einem Gebäude transportiert."
        imageRight={false}
      />

      <DesignV3ServiceSection
        index="03"
        eyebrow="Schlüsselfertige Einrichtung"
        title="Ein Partner. Ein Prozess. Null Stress."
        body="Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein – termingerecht, budgetsicher, ESG-konform."
        specs={[
          { label: "Kostenersparnis", value: "⌀ 58 % durch Refurbished" },
          { label: "CO₂ eingespart", value: "⌀ 125 kg / Arbeitsplatz" },
          { label: "Übergabe", value: "schlüsselfertig" },
        ]}
        href="/einrichtung/bueroeinrichtung"
        imageSrc="/assets/einrichtung-buero-coworking.png"
        imageAlt="Schlüsselfertig eingerichtetes Büro in der Oranienstraße."
        imageRight
      />

      <DesignV3PressRow />

      <DesignV3ImpactStrip />

      <ContactSection />
    </>
  );
}
