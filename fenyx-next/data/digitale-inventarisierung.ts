import type { FaqItem } from "@/components/FaqSection";

const inv = "/assets/leistungen/digitale-inventarisierung";

export const digitaleInventarisierungMeta = {
  title: "Digitale Inventarisierung Büromöbel | Fenyx GmbH",
  description:
    "Digitale Inventarisierung Ihrer Büromöbel: Strukturierte Erfassung, Zustandsbewertung & Handlungsempfehlung. Ø 42% höhere Verkaufspreise. Jetzt anfragen!",
};

export const heroContent = {
  heading: "Digitale Inventarisierung.",
  description:
    "Mit unserer digitalen Inventarisierung schaffen Sie die Grundlage für jede nachhaltige Bürotransformation. Ob Weiternutzung, Verkauf oder Aufbereitung: Sie erhalten volle Transparenz über Ihren Bestand, dessen Zustand und die erforderliche Logistik.",
  bullets: [
    "Interne Weiternutzung nach Aufbereitung",
    "⌀ 42 % höhere Ankaufsangebote",
    "⌀ 29 % bessere Wiederverwertungsrate",
  ],
  imageSrc: `${inv}/Home-Digitales-Bestandsmanagement.webp`,
  imageAlt: "Digitale Inventarisierung von Büromöbeln.",
  ctaHref: "#kontakt",
  ctaLabel: "Kontakt aufnehmen",
};

export const greenBenefitsContent = {
  heading: "Kosteneinsparung durch digitale Inventarisierung.",
  description:
    "Mit der Fenyx Software treffen Sie fundierte Entscheidungen auf Basis präziser Daten und fachlicher Bewertung.",
  tabs: [
    {
      id: "planen",
      title: "Planen Sie effizient mit Ihrem Bestand.",
      body: "Nutzen Sie Ihren Bestand gezielt für neue Konzepte und erhalten Sie bei Bedarf belastbare Angebote zur Aufbereitung.",
      imageSrc: `${inv}/miete-2.webp`,
      imageAlt:
        "Drei Männer, die an einem Tisch in einem hellen Büro zusammenarbeiten, wobei einer auf einem Notizblock schreibt und im Hintergrund ein Bildschirm mit Diagrammen zu sehen ist.",
    },
    {
      id: "verkauf",
      title: "Maximieren Sie den Verkaufswert.",
      body: "Erhalten Sie eine fundierte Marktwerteinschätzung Ihres Bestands und steigern Sie den Verkaufserlös durch eine vollständige und strukturierte Datenerfassung.",
      imageSrc: `${inv}/miete-herkunft-1.webp`,
      imageAlt:
        "Zwei Männer geben sich die Hand in einem hellen Büroraum, einer trägt ein schwarzes Fenyx-Shirt und der andere ein blaues Shirt mit Brille.",
    },
    {
      id: "verwertung",
      title: "Optimieren Sie die Verwertungsquote.",
      body: "Erhöhen Sie die Wiederverwendungsrate Ihres Bestands und reduzieren Sie Entsorgungskosten sowie CO₂-Emissionen deutlich.",
      imageSrc: `${inv}/re-1.webp`,
      imageAlt:
        "Drei Männer in einem modernen Konferenzraum, die sich Architektur- oder Designpläne auf einem großen Bildschirm ansehen.",
    },
  ],
};

export const klarheitContent = {
  heading: "Jede Transformation beginnt mit Klarheit.",
  paragraphs: [
    "Eine vollständige Inventarisierung bildet die Grundlage für gezielte Weiterverwendung, fundierte Investitionsentscheidungen und ESG-konforme Maßnahmen.",
    "Fenyx begleitet Sie vom ersten erfassten Möbelstück bis zur operativen Umsetzung. So vermeiden Sie Fehlkäufe, unnötige Entsorgung und Zeitverluste.",
  ],
  imageSrc: `${inv}/digitale-inventarisierung-2.webp`,
  imageAlt:
    "Junger Mann in einem schwarzen Fenyx-T-Shirt, der an einem weißen Bürotisch an einem silbernen Laptop arbeitet.",
};

export const challengesContent = {
  heading: "Bestand erfassen. Chancen erkennen.",
  introLead: "Unsere Software macht Ihren Bestand sichtbar und nutzbar.",
  introBody:
    "Sie planen mit vorhandenen Möbeln, beauftragen Aufbereitungen und bereiten Weiterverkäufe mit verkaufsstarken Exposés professionell vor – alles auf einer strukturierten Datenbasis. Für maximale Weiternutzung und minimale Wertverluste.",
  tabs: [
    {
      id: "produkterfassung",
      label: "Produkterfassung",
      title: "Transparenz über jedes Möbelstück.",
      body: "Wir erfassen Ihre Bestände systematisch mit Bilddokumentation, Standortdaten und allen relevanten Produktinformationen.\nOptional binden wir QR-Codes und bestehende Dokumente direkt ein.\nDas Ergebnis: eine zentrale, belastbare Inventarbasis – standortübergreifend nutzbar.",
      imageSrc: `${inv}/tab1.webp`,
      imageAlt:
        "Person, die ein Smartphone hält, auf dem ein Foto eines weißen Schreibtisches mit angewinkelten Beinen vor einer weißen Wand zu sehen ist.",
    },
    {
      id: "zustand",
      label: "Zustandsbewertung",
      title: "Qualität objektiv bewertet.",
      body: "Wir prüfen Ästhetik und Funktion jedes einzelnen Möbelstücks und klassifizieren den Zustand transparent und nachvollziehbar. So erkennen Sie sofort, welche Möbel weitergenutzt, aufbereitet oder ersetzt werden sollten. Die Aufbereitung erfolgt bedarfsgerecht - von Reparaturen über den Komponententausch bis zur professionellen Reinigung.",
      imageSrc: `${inv}/co-4.webp`,
      imageAlt:
        "Junger Mann mit lockigem Haar in einem dunkelblauen Fenyx-T-Shirt, der in einem hellen Flur auf einem Klemmbrett schreibt.",
    },
    {
      id: "logistik",
      label: "Logistik & Verwertung",
      title: "Planung, Umzug oder Verkauf.",
      body: "Wir erfassen die logistischen Rahmenbedingungen vor Ort – darunter Laufwege, Aufzugsmaße, Anlieferzonen und weitere relevante Faktoren.\n\nAuf dieser Basis erhalten Sie direkt belastbare Angebote unserer Partner für Räumung, Umzug oder Weiterverwertung.",
      imageSrc: `${inv}/co-3.webp`,
      imageAlt:
        "Drei Bürostühle, die von einem gelben Kranwagen auf einer Plattform neben einem Backsteingebäude mit dem GT-Logo angehoben werden.",
    },
  ],
};

export const ampelContent = {
  heading:
    "Unser Ampelsystem für eine konsequente Kategorisierung der Warenzustände.",
  intro:
    "Unser System dient als transparente Entscheidungsgrundlage für alle weiteren Prozesse.",
  cards: [
    {
      variant: "green" as const,
      title: "Grün.",
      body: "Artikel sind funktional vollständig intakt und weisen keine ästhetischen Mängel auf. Für die Weiterverwendung wird lediglich eine professionelle Reinigung empfohlen.",
    },
    {
      variant: "yellow" as const,
      title: "Gelb.",
      body: "Artikel sind funktional vollständig intakt und haben ästhetische Gebrauchsspuren. Für die Weiterverwendung sind eine professionelle Reinigung und vereinzelt Reparaturen notwendig.",
    },
    {
      variant: "red" as const,
      title: "Rot.",
      body: "Artikel sind (teilweise) funktional defekt und haben starke ästhetische Gebrauchsspuren. Für die Weiterverwendung sind umfassende Reinigungs-, Reparatur- und Aufarbeitungs-Schritte notwendig.",
    },
  ],
};

export const processSteps = [
  {
    num: "01",
    title: "Unverbindliche Erstberatung.",
    body: "Dieser Termin dient dazu, alle relevanten Aspekte Ihres Projekts zu erfassen, damit wir ein passgenaues Angebot für Ihre Bedürfnisse erstellen können. Ihre Angaben helfen uns, den Ablauf sowie die organisatorischen Rahmenbedingungen optimal vorzubereiten.",
    align: "right" as const,
    cta: { label: "Beratung anfragen", href: "#kontakt" },
  },
  {
    num: "02",
    title: "Angebot & Beauftragung.",
    body: "Unsere Experten erstellen auf Basis der Erstberatung und der Flächenpläne Ihrer Fläche oder Ihres Gebäudes ein passgenaues Angebot inklusive eines Vorschlags für die logistische Umsetzung. Unsere Kalkulation ist transparent und jederzeit nachvollziehbar.",
    align: "left" as const,
  },
  {
    num: "03",
    title: "Aufnahme.",
    body: "Wir sind innerhalb von zwei Wochen nach Beauftragung europaweit startbereit. Unsere Experten beginnen mit der systematischen Erfassung Ihres Inventars und achten dabei auf die korrekte Raumzuordnung sowie auf individuelle Anforderungen. Neben der fachgerechten Modellerkennung führt unser Team eine detaillierte Analyse von Funktionalität und Ästhetik durch.",
    align: "right" as const,
  },
  {
    num: "04",
    title: "Konsolidierung.",
    body: "Nach der Datenerfassung benötigen wir fünf Werktage zur Konsolidierung und Aufbereitung der Daten. So stellen wir sicher, dass das Ergebnis optimal für die geplanten Folgeschritte wie Umzug, Aufbereitung, Veräußerung oder Neuplanung vorbereitet ist.",
    align: "left" as const,
  },
  {
    num: "05",
    title: "Expertenempfehlung.",
    body: "Mit der Übergabe der Bestandsliste erhalten Sie in einem abschließenden Termin unsere Einschätzung zum Marktwert und zur Wiederverkaufswahrscheinlichkeit Ihres Bestands. Daraus lassen sich konkrete Handlungsempfehlungen ableiten.",
    align: "right" as const,
  },
  {
    num: "06",
    title: "Zentralisierte Einsicht & Steuerung.",
    body: "Alle relevanten Teams im Facility-Management, in der Planung, im Einkauf und im Controlling erhalten individuelle Zugänge mit anpassbaren Rollenrechten. In der Software können sie weitere Dienstleistungen wie Aufbereitung oder externe Veräußerung direkt beauftragen und so die nachhaltige Transformation aktiv steuern.\n\nIntuitive Funktionen wie der Export der Bestandsliste in verschiedenen Datenformaten stehen jederzeit zur Verfügung und gewährleisten maximale Flexibilität.",
    align: "left" as const,
  },
];

export const timelineBackground = {
  src: `${inv}/freepik__vertical-immersive-office-transparent-circulation-__581501.webp`,
  alt: "Beeindruckendes modernes Atrium eines Bürogebäudes mit mehreren Etagen, geschwungenen Balkonen, türkisfarbenem Sofa und Pflanzen im Erdgeschoss.",
};

export const crossSellContent = {
  heading: "Die Basis für den reibungslosen Verkauf an Mitarbeiter.",
  body: "Nutzen Sie die digitale Inventarisierung mit Fenyx, um hochwertige Möbel professionell und mit minimalem Aufwand an Ihre Mitarbeiter zu veräußern.",
  href: "/verwertung/mitarbeiterverkauf",
  cta: "Zum Mitarbeiterverkauf",
  imageSrc: `${inv}/6850292bf6f10af5a78aa660_fenyx-office-2025-296.webp`,
};

export const contactContent = {
  heading: "Lassen Sie uns sichtbar machen, was bereits da ist.",
  email: "marius@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/marius-gimm.webp",
  portraitAlt: "Bild von Marius Grimm, Einrichtungsberater bei Fenyx Office",
  quote:
    "„Ein nachhaltiges Büro beginnt nicht beim Neukauf, sondern bei der Wertschätzung dessen, was man bereits besitzt. Ich helfe Ihnen dabei, Transparenz in Ihren Bestand zu bringen.“",
  name: "Marius Gimm",
  role: "Einrichtungsberater für unseren Standort Berlin",
};

export const digitaleInventarisierungFaq: FaqItem[] = [
  {
    question: "Wie lange dauert eine Inventarisierung?",
    answer:
      "Die Dauer hängt von Standortgröße und Bestandsumfang ab. Nach der Erstberatung sind wir in der Regel innerhalb von zwei Wochen europaweit startbereit. Die Konsolidierung der Daten erfolgt innerhalb von fünf Werktagen nach Abschluss der Aufnahme.",
  },
  {
    question: "Was kostet eine digitale Inventarisierung?",
    answer:
      "Die Kosten richten sich nach Umfang, Standortanzahl und gewünschtem Leistungsumfang. Durch die strukturierte Datenerfassung senken Fenyx-Kunden ihre Beschaffungskosten im Schnitt um 50 % – die Investition amortisiert sich häufig bereits bei der nächsten Planungs- oder Beschaffungsentscheidung.",
  },
  {
    question: "Was ist Inventarisierung?",
    answer:
      "Inventarisierung bedeutet die systematische Erfassung und Dokumentation Ihres Büromobiliars und der zugehörigen Ausstattung – inklusive Standort, Zustand, Kategorie und relevanter Produktdaten. Sie schafft die Grundlage für Weiternutzung, Verkauf, Aufbereitung oder Neubeschaffung.",
  },
  {
    question: "Wie funktioniert digitale Inventarisierung?",
    answer:
      "Unsere Teams erfassen den Bestand vor Ort mit der Fenyx-App – inklusive Fotos, Kategorien und optional QR-Codes. Alle Daten werden zentral auf unserer Plattform konsolidiert, bewertet und für Export, Planung und Entscheidungen bereitgestellt.",
  },
  {
    question: "Warum ist digitale Inventarisierung sinnvoll?",
    answer:
      "Was nicht erfasst ist, lässt sich nicht steuern. Digitale Inventarisierung schafft Transparenz über Bestand und Zustand, senkt Kosten, verbessert Verwertungsquoten und bildet die Basis für nachhaltige, ESG-konforme Entscheidungen.",
  },
];
