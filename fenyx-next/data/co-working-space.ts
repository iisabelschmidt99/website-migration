import type { FaqItem } from "@/components/FaqSection";
import homepageLogos from "./homepage-logos.json";
import type { Testimonial } from "@/lib/testimonials";

const cms = "/assets/cms";

export const coWorkingSpaceMeta = {
  title: "Co-Working Space Einrichtung nachhaltig & günstig | Fenyx",
  description:
    "Mit Fenyx gestalten und betreiben Sie Ihren Co-Working-Space nachhaltig, effizient und flexibel.",
};

export const heroContent = {
  heading: "Fenyx für Co-Working Spaces.",
  description:
    "Mit Fenyx gestalten und betreiben Sie Ihren Co-Working-Space nachhaltig, effizient und flexibel. Änderungen an Ausstattung und Einrichtung lassen sich schnell und ohne operative Reibung umsetzen.",
  bullets: [
    "⌀ 52% niedrigere Beschaffungskosten",
    "Flexible Ausstattung für wechselnde Anforderungen",
    "Nachhaltiger Betrieb mit zertifizierbarer Wirkung",
  ],
  imageSrc: `${cms}/co-1.webp`,
  ctaLabel: "Kostenanalyse anfragen",
};

export const logoGridContent = {
  description:
    "Führende Co-Working Spaces in Europa haben sich für Fenyx entschieden – und profitieren von messbaren Kosteneinsparungen und zertifizierbarer Nachhaltigkeit.",
  logos: homepageLogos,
};

export const benefitsContent = {
  heading: "Vorteile von Fenyx.",
  intro: "Nachhaltige Ausstattung als Wettbewerbsvorteil im Co-Working-Markt.",
  cards: [
    {
      title: "Mehr Wirtschaftlichkeit",
      body: "Senken Sie Ihre Beschaffungskosten und beschleunigen Sie den Ausbau Ihrer Standorte durch den gezielten Einsatz von refurbished Büromöbeln und flexiblen Mietmodellen.",
    },
    {
      title: "Differenziertes Angebot",
      body: "Heben Sie sich vom Wettbewerb ab, indem Sie potenziellen Mietern einen reibungslosen Umzug sowie die Möglichkeit zur individuellen Gestaltung ihrer Flächen bieten.",
    },
    {
      title: "Zertifizierbare Nachhaltigkeit",
      body: "Reduzieren Sie Ihre CO₂-Emissionen, indem Sie refurbished Möbel einsetzen, Bestände aufbereiten lassen oder weiterverkaufen und so eine Entsorgung vermeiden.",
    },
  ],
};

export const differentiationContent = {
  heading: "Differenzierung für Ihre Mieter.",
  intro:
    "Mit den Bürolösungen von Fenyx bieten Sie potenziellen und bestehenden Mietern innovative und nachhaltige Services, die die Akquise erleichtern und die langfristige Bindung stärken.",
  tabs: [
    {
      id: "verwertung",
      label: "Ganzheitliche Verwertung",
      title:
        "Ermöglichen Sie Ihren Kunden den Verkauf nicht mehr benötigter Inneneinrichtung vor dem Einzug in Ihren Standort.",
      body: "Mit der Fenyx-Plattform bieten Sie potenziellen Kunden die Möglichkeit, ihren nicht mehr benötigten Bestand mit hoher Wiederverwertungsquote und attraktivem Verkaufserlös zu veräußern. So lösen Sie ein zentrales Problem, mit dem viele gewerbliche Mieter im Zuge eines Umzugs konfrontiert sind.",
      imageSrc: `${cms}/co-5.webp`,
      imageAlt:
        "Mann in schwarzer Jacke, der einen Bürostuhl durch einen verglasten Korridor schiebt.",
    },
    {
      id: "umzug",
      label: "Professioneller Umzug",
      title: "Organisieren Sie den Umzug in Ihre Fläche als exklusiven Check-in-Service.",
      body: "Mit Fenyx gewinnen Sie einen professionellen Partner, der sämtliche Herausforderungen rund um den Umzug übernimmt und Ihnen so die bestmöglichen Voraussetzungen für einen reibungslosen Akquiseprozess schafft.",
      imageSrc: `${cms}/co-3.webp`,
      imageAlt:
        "Drei Bürostühle, die von einem gelben Kranwagen auf einer Plattform neben einem Backsteingebäude angehoben werden.",
    },
    {
      id: "individualisierung",
      label: "Individualisierung der Fläche",
      title: "Bieten Sie Ihren Kunden die Möglichkeit, ihre Mietfläche zu personalisieren.",
      body: "Mit der Fenyx-Plattform erhalten Sie Zugriff auf ein breites Portfolio an refurbished Büromöbeln, das Sie Ihren Kunden zur flexiblen Miete anbieten können. So reagieren Sie gezielt auf individuelle Anforderungen und schaffen zusätzliche Mehrwerte.",
      imageSrc: `${cms}/co-4.webp`,
      imageAlt:
        "Junger Mann mit lockigem Haar in einem dunkelblauen Fenyx-T-Shirt, der in einem hellen Flur auf einem Klemmbrett schreibt.",
    },
  ],
};

export const buyOrRentContent = {
  heading: "Sollten Sie Ihre Einrichtung lieber kaufen oder mieten?",
  body: "Entscheidend sind Faktoren wie der geplante Nutzungszeitraum, das Möbelvolumen, Ihre finanzielle Situation sowie Ihr Konzept gegenüber Ihren Mietern.\n\nGerne beraten wir Sie in einem persönlichen Gespräch. Informieren Sie sich über unsere Kauf- und Mietmodelle und nehmen Sie Kontakt mit unseren Experten auf.",
  buyHref: "/#kontakt",
  rentHref: "/einrichtung/bueromoebel-mieten",
};

export const crossSellContent = {
  heading: "Neuer Standort geplant?",
  body: "Unser Team begleitet Sie ganzheitlich bei der Planung und Umsetzung Ihrer neuen Fläche. Im Mittelpunkt steht der ressourcenschonende Einsatz von Zeit, Kapital und CO₂ – durch gezielte Optimierung und effiziente Prozesse.",
  href: "/einrichtung/bueroeinrichtung",
  cta: "Büroeinrichtung",
  imageSrc: `${cms}/6850292bf6f10af5a78aa660_fenyx-office-2025-296.webp`,
};

export const fallbackTestimonial: Testimonial = {
  slug: "sebastian-brehm-delta-campus",
  name: "Sebastian Brehm",
  roleCompany: "Head Of Campus (The Delta Campus)",
  quote:
    "<p>„Die Zusammenarbeit war reibungslos und effizient. Die 324 refurbished Stühle passen perfekt zu unserer Vision eines nachhaltigen und modernen Co-Working-Spaces. Unsere Mitglieder sind begeistert von der Qualität und dem Komfort der Stühle!“</p>",
  categories: ["co-working-space"],
  imageSrc: "/assets/logos/6988d9ea184c3a10bc10dbdc_Delta%20Campus%201.avif",
  imageAlt: "Sebastian Brehm, The Delta Campus",
  logoSrc: "",
};

export const faqItems: FaqItem[] = [
  {
    question: "Wie läuft der Bürogestaltungsprozess bei Fenyx ab?",
    answer:
      "Unser Bürogestaltungsprozess ist in drei Phasen unterteilt: Analyse – wir beginnen mit einer umfassenden Bedarfsanalyse, bei der wir Ihre Arbeitsprozesse, Ihre Unternehmenskultur und die Anforderungen Ihrer Mitarbeiter berücksichtigen. Konzeption – auf Basis dieser Analyse entwerfen wir ein maßgeschneidertes Designkonzept, das sowohl funktional als auch ästhetisch überzeugt. Wir integrieren hierbei bereits vorhandene Bestandsmöbel in die Planung. Umsetzung und Kauf – im letzten Schritt sorgen wir für die Auswahl der passenden Möbel und die reibungslose Umsetzung des Konzepts. Dabei bieten wir eine große Auswahl an hochwertigen, refurbished Büromöbeln.",
  },
  {
    question:
      'Was bedeutet „refurbished“ und welche Vorteile bietet eine nachhaltige Büroeinrichtung?',
    answer:
      "Refurbished Möbel sind gebrauchte Möbel, die professionell aufgearbeitet wurden, um wieder wie neu auszusehen und einwandfrei zu funktionieren. Der Kauf von nachhaltiger Büroeinrichtung bietet zahlreiche Vorteile: Kostenersparnis – Sie erhalten hochwertige Einrichtung zu einem Bruchteil des Neupreises. Nachhaltigkeit – durch die Wiederverwendung von Möbeln tragen Sie aktiv zum Umweltschutz bei. Qualität – refurbished Möbel werden sorgfältig geprüft und instand gesetzt, sodass sie langlebig und funktional bleiben.",
  },
  {
    question:
      "Welche Risiken gibt es bei der Bürogestaltung und wie hilft Fenyx, diese zu minimieren?",
    answer:
      "Die größten Risiken bei der Bürogestaltung liegen in der fehlerhaften Planung, die zu ineffizienter Raumnutzung, schlechter Ergonomie und unnötigen Kosten führen kann. Fenyx minimiert diese Risiken durch eine fundierte Beratung und Planung, die auf Ihre individuellen Bedürfnisse zugeschnitten ist. Unsere erfahrenen Designer und Planer berücksichtigen Ergonomie, Flexibilität und Funktionalität, um eine langfristige, zukunftssichere Lösung zu schaffen.",
  },
  {
    question: "Bietet Fenyx Garantien auf die gekauften Möbel?",
    answer:
      "Ja, auch auf unsere refurbished Möbel bieten wir eine Garantie. Wir arbeiten ausschließlich mit Produkten renommierter Hersteller, die eine hohe Qualität sicherstellen. Sollte es dennoch zu einem Problem kommen, bieten wir schnelle und unkomplizierte Lösungen an. Die genauen Garantiebedingungen können je nach Möbelstück variieren, werden jedoch immer transparent im Kaufprozess kommuniziert.",
  },
  {
    question: "Wie wird die Qualität der refurbished Möbel bei Fenyx sichergestellt?",
    answer:
      "Bei Fenyx durchlaufen alle refurbished Möbel einen strengen Qualitäts- und Aufbereitungsprozess. Jedes Möbelstück wird sorgfältig geprüft, gereinigt und, falls notwendig, repariert oder neu lackiert. Dabei achten wir besonders auf Funktionalität, Stabilität und optische Mängel. Nur Möbel, die unseren hohen Standards entsprechen, werden in unsere Kollektion aufgenommen.",
  },
];

export const contactContent = {
  heading: "Kostenlose Erstberatung buchen",
  email: "anina@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/anina-blatter.webp",
  portraitAlt: "Anina Blatter, Customer Support bei Fenyx Office",
  quote:
    "„Ich freue mich, Sie zur nachhaltigen Transformation Ihres Büros zu beraten.“",
  name: "Anina Blatter",
  role: "Customer Support",
};
