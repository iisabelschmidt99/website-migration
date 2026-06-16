import type { ImageTimelineStep } from "@/components/ImageStepsTimeline";

const ba = "/assets/leistungen/bueroaufloesung";

export const bueroaufloesungMeta = {
  title: "Büroauflösung | Besenrein, +42% Erlöse | Fenyx",
  description:
    "Professionelle Büroauflösung ab 50 Arbeitsplätze. +42% höhere Erlöse, besenreine Übergabe zum Wunschtermin. Jetzt kostenlose Besichtigung buchen!",
};

export const heroContent = {
  heading: "Deutschlands Nr. 1 für Büroauflösung.",
  description: "⌀ 42% höhere Erlöse. Stressfreie Räumung. Besenreine Übergabe.",
  videoSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/feca9420-9f85-4d6a-93f0-672aec4b8a85/play_720p.mp4",
  posterSrc: `${ba}/hero-poster.webp`,
  ctaHref: "#kontakt",
  ctaLabel: "Kontakt aufnehmen",
};

export const versprechenContent = {
  heading:
    "Über 150 Facility-Manager vertrauen auf Fenyx. Verlässlichkeit ist unser größtes Kapital.",
  tabs: [
    {
      id: "erloes",
      label: "Maximaler Erlös",
      title: "Im Durchschnitt 42% höherer Verkaufserlös für Ihre Bestandsmöbel.",
      body: "Feynx kauft Ihre Bestmöbel zum Bestpreis fix an und veräußert diese anschließend im größten Händlernetzwerk Europas. Restbestände werden gespendet und wenn nicht anders möglich, materialgerecht entsorgt. Auf Wunsch können wir ebenfalls einen steuerlich risikofreien Mitarbeiterverkauf organisieren.",
      imageSrc: `${ba}/versprechen-erloes.webp`,
      imageAlt:
        "Mann mit Tattoos und schwarzen Handschuhen, der hinter einem Bürostuhl vor einem Holzlatten-Wandhintergrund steht.",
    },
    {
      id: "uebergabe",
      label: "Besenreine Übergabe",
      title: "100% stressfreie, besenreine Übergabe zum Wunschtag.",
      body: "Fenyx verantwortet die gesamte Umsetzung – von der Gebäudeorganisation bis zur Logistik. Termingerecht, abgestimmt, professionell koordiniert.",
      imageSrc: `${ba}/versprechen-uebergabe.webp`,
      imageAlt:
        "Geräumiges leeres Büro mit Betonböden, freiliegenden Decken, verglassten Trennwänden und Leuchtstofflampen.",
    },
    {
      id: "pm",
      label: "Projektmanagement",
      title: "Unser belastbares Projektmanagement für die Räumung Ihres Standorts.",
      body: "Fenyx koordiniert bei Bedarf alle Gewerke und gewährleistet Rückbaumaßnahmen, Umzug, (De-)Montage von EDV mit DIN-zertifizierter Datenlöschung und der Einbringung von Neumöbeln.",
      imageSrc: `${ba}/versprechen-projektmanagement.jpg`,
      imageAlt:
        "Junger Mann in gestreiftem Hemd und schwarzer Patagonia-Weste mit Fenyx-Logo, der lächelnd telefoniert und einen MacBook-Laptop in einer kleinen Bürokabine benutzt.",
    },
  ],
};

export const schritteContent = {
  heading: "In 3 Schritten: Büroauflösung ab 50 Arbeitsplätze.",
  description:
    "Transparenz von Anfang an: Mit Prozesserfahrung aus +150 Projekten machen wir aus Ihrer Büroauflösung einen planbaren und profitablen Erfolg. Jede Phase ist klar strukturiert, zeitlich definiert und liefert messbare Ergebnisse, damit Sie jederzeit wissen, wo Sie stehen und was Sie erwartet.",
  steps: [
    {
      title: "1. Besichtigung & Angebotserstellung.",
      bullets: [
        "Transparentes Ankaufsangebot für alle Bestandsmöbel",
        "Belastbare Räumungsplanung",
        "Auf Wunsch innerhalb von 5 Werktagen",
      ],
      details:
        "Unser Team kommt zu Ihnen vor Ort und erfasst – bei Bedarf – sämtliche zu räumenden Bürogegenstände: von Möbeln über IT bis hin zu Küchen. Dabei analysieren wir auch die logistischen Gegebenheiten und entwickeln ein strukturiertes Räumungskonzept. Das Ergebnis: ein belastbares Ankaufangebot und ein detaillierter Umsetzungsplan.",
      imageSrc: `${ba}/step-besichtigung.webp`,
      imageAlt:
        "Zwei Männer geben sich die Hand in einem hellen Büroraum, einer trägt ein schwarzes Fenyx-Shirt und der andere ein blaues Shirt mit Brille.",
      imageAlign: "right",
    },
    {
      title: "2. Planung der Räumung.",
      intro:
        "Maximieren Sie die Wiederverwertungsquote und den Verkaufserlös Ihres nicht mehr gebrauchten Bestands. Die Fenyx Plattform garantiert die optimale Veräußerung, unabhängig von Hersteller, Kategorie und Zustand.",
      bullets: [
        "Übernahme der Abstimmung mit der Hausverwaltung",
        "Durchführung von Vorbereitungsschritten (z.B. Halteverbotszone)",
        "Ausführung nach Ihren Vorgaben (bspw. Am Wochenende)",
      ],
      details:
        "Fenyx übernimmt die vollständige Planung und Koordination - von der Einrichtung der Halteverbotszonen über die Sicherung von Aufzügen und Laufwegen bis hin zur Abstimmung mit allen beteiligten Parteien. Auf Wunsch organisieren wir einen digitalen Mitarbeiterverkauf vor der Räumung und übernehmen das Spendenmanagement. Ziel ist eine maximale Wiederverwertung bei minimaler Entsorgung.",
      imageSrc: `${ba}/step-planung.jpg`,
      imageAlt:
        "Junger Mann mit lockigem Haar in einem schwarzen Fenyx-T-Shirt, der in einem Flur auf einem Klemmbrett schreibt.",
      imageAlign: "left",
    },
    {
      title: "3. Räumung & besenreine Übergabe.",
      intro:
        "Maximieren Sie die Wiederverwertungsquote und den Verkaufserlös Ihres nicht mehr gebrauchten Bestands. Die Fenyx Plattform garantiert die optimale Veräußerung, unabhängig von Hersteller, Kategorie und Zustand.",
      bullets: [
        "Projektleitung vor Ort",
        "Transparente Abwicklung",
        "Verlässliche Zeitplanung",
      ],
      details:
        "Unser Logistik-Team übernimmt die fachgerechte Demontage und den Transport sämtlicher Gegenstände. Besonderes Augenmerk legen wir auf die zertifizierte Datenlöschung nach DIN-66399-Standard. Abschließend sorgen wir für eine besenreine Übergabe und bereiten die Immobilie optimal für die protokollierte Abnahme durch den Vermieter vor. Zusätzlich erhalten Sie einen ESG-Report über die eingesparten CO₂-Emissionen.",
      imageSrc: `${ba}/step-raeumung.webp`,
      imageAlt:
        "Junger Mann in einem grünen T-Shirt mit dem Aufdruck „fenyx“, der sich über einen Tisch mit Aufklebern und Papieren beugt und mit einer anderen Person interagiert.",
      imageAlign: "right",
    },
  ] satisfies ImageTimelineStep[],
};

export const statsContent = {
  heading: "In 2025 hat Fenyx erfolgreich…",
  items: [
    { prefix: "+", value: "15.000", label: "Arbeitsplätze geräumt." },
    { prefix: "+", value: "82.500", label: "Bürogegenstände verwertet." },
    { value: "100", suffix: "%", label: "aller Projekte termingerecht übergeben." },
  ],
};

export const referenzenContent = {
  heading: "Unsere Kunden setzen neue Standards für Nachhaltigkeit.",
  description:
    "Unternehmen, die Verantwortung ernst nehmen, arbeiten mit Fenyx.",
};

export const contactContent = {
  heading: "Jetzt eine kostenlose Vor-Ort-Besichtigung buchen.",
  subline: "Ihr Full-Service-Partner für die Verwertung ab 50 Arbeitsplätzen.",
  email: "thomas@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/thomas-mielke.webp",
  portraitAlt: "Bild von Thomas Mielke, Projektleiter bei Fenyx Office",
  quote:
    "„Mit über 20 Jahren Erfahrung im Gebrauchtmöbelmarkt freue ich mich, Ihr Projektleiter sein zu dürfen.“",
  name: "Thomas Mielke",
  role: "Projektleiter",
};
