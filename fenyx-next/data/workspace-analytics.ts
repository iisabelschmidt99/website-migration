const wa = "/assets/leistungen/workspace-analytics";

export const workspaceAnalyticsMeta = {
  title: "Workspace Analyse & Bürokonzept | Datenbasiert | Fenyx",
  description:
    "Datenbasierte Workspace Analyse: Mitarbeiterbefragung, Raumnutzungsanalyse & fundiertes Bürokonzept. Optimierte Flächennutzung. Jetzt Erstberatung buchen!",
};

export const heroContent = {
  heading: "Workspace Analytics & Bürokonzept.",
  description:
    "Mit unserer Arbeitsplatzanalyse erfassen wir, wie Ihre Flächen wirklich genutzt werden und was Ihre Teams wirklich brauchen. Daraus entwickeln wir transparente, nachhaltige und kostenbewusste Raumkonzepte, die sich an Ihrer Vision orientieren – nicht an Standardlösungen.",
  bullets: [
    "Büroplanung auf datenbasierter Anforderungsanalyse",
    "Auswertung von Raumnutzung und Arbeitsgewohnheiten",
    "Nachhaltige und Mitarbeiterorientierte Handlungsfelder als Ergebnis",
  ],
  imageSrc: `${wa}/hero.webp`,
  imageAlt: "Workspace Analytics & Bürokonzept.",
  ctaHref: "#kontakt",
  ctaLabel: "Analyse-Gespräch vereinbaren",
  showLearnMore: false,
  variant: "gradient" as const,
  uppercase: false,
};

export const greenCardsContent = {
  heading: "Nachhaltigkeit entsteht durch Nutzung.",
  intro:
    "So gestalten Sie Flächen effizienter, fördern Produktivität und schaffen ein Arbeitsumfeld, das nachhaltig, wirtschaftlich und mitarbeiterorientiert ist.",
  cards: [
    {
      title: "Optimierte Flächennutzung",
      body: "Unterschätzte Potenziale in Ihrer Bürofläche werden sichtbar, Laufwege werden kürzer, Räume werden effektiver gestaltet: Platz für das schaffen, was wirklich wichtig ist.",
    },
    {
      title: "Nachhaltigkeit braucht Leben",
      body: "Ein Büro ist erst nachhaltig, wenn es aktiv und effizient genutzt wird. Ein leerer Arbeitsplatz ist auch dann nicht nachhaltig, wenn er refurbished beschafft wird.",
    },
    {
      title: "Kosteneffizienz durch Daten",
      body: "Gezielte Analysen ermöglichen es, Überkapazitäten zu vermeiden und signifikante Einsparungen bei der Flächen- und Möblierungsplanung zu realisieren.",
    },
  ],
};

export const grundlagenContent = {
  heading: "Klare Grundlagen smarter Büroentscheidungen.",
  body: "Workspace Analytics bei Fenyx bedeutet: Datenbasiertes Verstehen anstelle von Bauchgefühl. Wir analysieren, wie Ihre Teams wirklich arbeiten – basierend auf der Raumnutzung, Ihren Arbeitsmodellen und der allgemeinen Unternehmenskultur.\n\nDaraus leiten wir konkrete Handlungsempfehlungen für Flächennutzung, Möblierung und zukünftige Raumstrategien ab und stellen Szenarien hinsichtlich der Kosten und Ihres CO₂-Fußabdrucks auf.",
  imageSrc: `${wa}/grundlagen.webp`,
  imageAlt:
    "Drei Männer, die an einem Tisch in einem hellen Büro zusammenarbeiten, wobei einer auf einem Notizblock schreibt und im Hintergrund ein Bildschirm mit Diagrammen zu sehen ist.",
  ctaLabel: "Jetzt beraten lassen",
  ctaHref: "#kontakt",
  reverse: true,
  bgClassName: "bg-[#f4f6f8]",
};

export const timelineContent = {
  heading: "In 6 Schritten zum Fundament Ihrer Arbeitsplatzstrategie.",
  variant: "light" as const,
  backgroundSrc: `${wa}/timeline-bg.webp`,
  backgroundAlt:
    "Moderner Büroflur mit schwarzen Stahlrahmen-Glaswänden, grüner Deckenverkleidung und Blick auf einen Loungebereich am Ende des Gangs.",
  steps: [
    {
      num: "01",
      title: "Unverbindliche Beratung.",
      body: "Wir klären gemeinsam im kostenlosen Erstgespräch Rahmenbedingungen und Ziele. Nutzen Sie die Möglichkeit, alle Fragen und Sonderwünsche mit unserem Experten-Team zu erörtern.",
      align: "right" as const,
    },
    {
      num: "02",
      title: "Projektplan.",
      body: "Auf Basis unserer Gespräche, der Eindrücke vor Ort und der Erfahrung aus +150 Projekten entwickeln wir eine maßgeschneiderte Projektskizze – virtuell oder vor Ort.\n\nDas Ergebnis ist ein realistisches, datenbasiertes Zielbild für die Flächennutzung.",
      align: "left" as const,
    },
    {
      num: "03",
      title: "Datenerfassung.",
      body: "Nach Projektstart erheben wir die relevanten Daten in Workshops und anonymisierten Mitarbeiterbefragungen.\n\nDaraus leiten wir klare Anforderungen ab und bewerten geeignete Lösungen nach Nachhaltigkeit, Budget, Lieferfähigkeit und Design. So entsteht ein transparenter, tragfähiger Plan für Ihre langfristige Büroentwicklung.",
      align: "right" as const,
    },
    {
      num: "04",
      title: "Datenanalyse und Vorstellung.",
      body: "Wir analysieren alle Datenpunkte und stellen Ihnen die wichtigsten Erkenntnisse vor. Auf Grundlage dieser Ergebnisse können optional weitere Daten erfasst werden, um offene Fragen zielgerichtet zu beantworten.",
      align: "left" as const,
    },
    {
      num: "05",
      title: "Handlungsfelder.",
      body: "Wir übersetzen Ihre Daten in konkrete Anforderungen und Handlungsempfehlungen – passend zu Ihrer Vision, Mission und Kultur. Ergänzend entwickeln wir verschiedene Szenarien für Ihr weiteres Vorgehen und vergleichen diese auf relevante Metriken wie die verbundenen Kosten und den CO₂-Fußabdruck.",
      align: "right" as const,
    },
    {
      num: "06",
      title: "Endergebnis.",
      body: "Alle erfassten Daten, Analysen, und die daraus resultierenden Anforderungen und Handlungsempfehlungen werden in einer Präsentation aufbereitet und Ihnen zur Verfügung gestellt.",
      align: "left" as const,
    },
  ],
};

export const crossSellContent = {
  heading: "Sie kennen bereits Ihre Anforderungen?",
  body: "Lernen Sie unser refurbished Portfolio kennen und schauen Sie, inwiefern qualitativ hochwertige Möbel aus dem Zweitmarkt Ihre Bedürfnisse erfüllen können.",
  href: "#kontakt",
  cta: "Plattform Zugang erfragen",
  imageSrc: `${wa}/cta-bg.webp`,
};

export const erkenntnisseContent = {
  heading: "Erkenntnisse, die Ihre Arbeitswelt verändern und Mitarbeiter binden.",
  body: "Eine Zusammenarbeit mit Fenyx im Bereich Workspace Analytics führt zu greifbaren Verbesserungen: Sie nutzen Ihre Flächen effizienter, sparen Kosten und schaffen ein Umfeld, das Mitarbeitende motiviert und bindet.\n\nDurch abgestimmte Raumstrukturen werden Produktivität und Fokus gefördert, während individuelle Anforderungen der Mitarbeitenden berücksichtigt werden.\n\nDas Ergebnis: nachhaltige Strukturen, die Ihr Unternehmen zukunftssicher machen.",
  imageSrc: `${wa}/erkenntnisse.webp`,
  imageAlt:
    "Zwei Männer, die an einem weißen Konferenztisch sitzen und auf einen großen Bildschirm mit architektonischen Grundrissen und Designlayouts schauen.",
  ctaLabel: "Kontakt aufnehmen",
  ctaHref: "#kontakt",
};

export const potenzialContent = {
  heading: "Lassen Sie Ihr Potenzial nicht ungenutzt.",
  body: "Wer Büroflächen ohne fundierte Daten gestaltet, riskiert Leerstand, ineffiziente Prozesse und hohe Folgekosten. Ohne Workspace Analytics fehlen die Grundlagen für Entscheidungen, die wirklich wirken. Fenyx liefert die nötige Transparenz – für Arbeitsumgebungen, die funktionieren.",
  imageSrc: `${wa}/potenzial.jpg`,
  imageAlt:
    "Junger Mann mit lockigem Haar in einem schwarzen Fenyx-T-Shirt, der in einem Flur auf einem Klemmbrett schreibt.",
  ctaLabel: "Jetzt beraten lassen",
  ctaHref: "#kontakt",
  reverse: true,
  bgClassName: "bg-[#f4f6f8]",
};

export const referenzenContent = {
  heading: "Workspace Analytics in der Praxis.",
  description:
    "Einblicke in datenbasierte Arbeitswelten, die wirklich funktionieren.",
};

export const contactContent = {
  heading: "Kostenlose Erstberatung buchen.",
  email: "anina@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/anina-blatter.webp",
  portraitAlt: "Bild von Anina Blatter, Einrichtungsberaterin bei Fenyx Office",
  quote:
    "„Ich freue mich, Sie zur nachhaltigen Transformation Ihres Büros zu beraten.“",
  name: "Anina Blatter",
  role: "Einrichtungsberaterin",
};
