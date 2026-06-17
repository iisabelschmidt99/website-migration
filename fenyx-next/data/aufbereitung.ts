const ab = "/assets/leistungen/aufbereitung";

export const aufbereitungMeta = {
  title: "Büromöbel aufbereiten & refurbished | Fenyx GmbH",
  description:
    "Büromöbel professionell aufbereiten statt neu kaufen: Bis 60% Kostenersparnis, maximale CO₂-Einsparung, Werterhalt. Jetzt Aufbereitung anfragen!",
};

export const heroContent = {
  heading: "Aufbereitung von Büromöbeln.",
  description:
    "Sie besitzen hochwertige Büromöbel, die in die Jahre gekommen sind oder nicht mehr zum aktuellen Design passen? Entdecken Sie die intelligente und nachhaltige Lösung: Büromöbel aufbereiten mit Fenyx.",
  pills: [
    "⌀ 90% CO₂-Einsparungen im Vergleich zum Neukauf",
    "⌀ 80% Kostenersparnis im Vergleich zum Neukauf",
    "Ersatzteile direkt vom Hersteller",
  ],
  imageSrc: `${ab}/hero.webp`,
  imageAlt: "Aufbereitung von Büromöbeln.",
  ctaHref: "#kontakt",
  ctaLabel: "Aufbereitung anfragen",
  showLearnMore: false,
};

export const videoContent = {
  heading: "Wie aus Bestand wieder Qualität wird.",
  posterSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/288dce2e-c063-4ac2-9b3d-85fc2c00ae8a/thumbnail_6ebc3170.jpg",
  posterAlt: "Wie aus Bestand wieder Qualität wird.",
  videoSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/288dce2e-c063-4ac2-9b3d-85fc2c00ae8a/play_720p.mp4",
  dark: true,
};

export const greenCardsContent = {
  heading: "Warum sich die Aufbereitung Ihrer Büromöbel wirklich lohnt.",
  intro: "Mit Re-Use entscheiden Sie sich für klare strategische und operative Vorteile.",
  cards: [
    {
      title: "Signifikante Kosteneinsparungen.",
      body: "Refurbishment ist bis zu 80 % günstiger als Neuanschaffung. Sie schonen Ihr Budget, erhalten Premiumqualität und setzen vorhandenes Kapital wirtschaftlich sinnvoll ein.",
    },
    {
      title: "CO₂ & ESG.",
      body: "Aufbereitung vermeidet Müll und spart bis zu 90 % der CO₂-Emissionen im Vergleich zur Produktion neuer Möbel – ein klarer Beitrag für Ihre ESG-Ziele und Nachhaltigkeitsberichte.",
    },
    {
      title: "Individuelle Anpassung & Design.",
      body: "Passen Sie Ihre Möbel an neue Anforderungen oder Corporate Identities an – mit neuen Stoffen, Farben oder Oberflächen. Funktion, Look und Qualität bleiben erhalten.",
    },
  ],
};

export const revitalisierenContent = {
  heading: "Neues aus Bestehendem: Bestand revitalisieren.",
  body: "Durch professionelle Aufbereitung sparen signifikant Zeit, Kosten und CO₂, im Vergleich zur Verwertung oder Neukauf.\n\nWir stellen sicher, dass Ihr Bestand Ihren zukünftigen Anforderungen gerecht wird.",
  imageSrc: `${ab}/revitalisieren.webp`,
  imageAlt:
    "Hand in schwarzem Handschuh, die mit einem Spachtel eine weiße Oberfläche abschabt.",
  ctaLabel: "Anforderungen analysieren",
  ctaHref: "#kontakt",
  reverse: true,
  dark: true,
  bgClassName: "bg-abyss-deep",
};

export const bereicheContent = {
  heading:
    "Die Aufbereitung durch Fenyx unterteilt sich in 3 Leistungs-Bereiche.",
  introLead:
    "Die Aufbereitung erfolgt modular, je nach Zustand Ihres Bestands, welchen wir im Rahmen der digitalen Inventarisierung feststellen.",
  tabs: [
    {
      id: "reparatur",
      label: "Reparatur",
      title: "Reparatur.",
      body: "Die Reparatur umfasst die Wiederherstellung aller Funktionalitäten und der ursprünglichen Ästhetik, zum Beispiel durch die Entfernung von Kratzern und die Reparatur von Stoff- und Netzbezügen.",
      imageSrc: `${ab}/step-1.webp`,
      imageAlt:
        "Mann mit Tattoos und schwarzen Handschuhen, der Klebstoff auf eine weiße Oberfläche aufträgt und dabei ein blaues Tuch hält.",
    },
    {
      id: "ersatzteil",
      label: "Ersatzteil-Austausch",
      title: "Ersatzteil-Austausch.",
      body: "Defekte oder abgenutzte Bauteile, wie z.B. die Rollen oder Armlehnen eines Bürodrehstuhls, werden gezielt ausgetauscht. Auf Wunsch kommen dabei hersteller-originale Ersatzteile zum Einsatz.",
      imageSrc: `${ab}/step-2.webp`,
      imageAlt:
        "Nahaufnahme eines weißen Laufrads auf einem gemusterten Teppich mit einem Holzlatten-Hintergrund.",
    },
    {
      id: "tiefenreinigung",
      label: "Tiefenreinigung",
      title: "Tiefenreinigung.",
      body: "Jedes Produkt wird kategorie- und materialgerecht hygienisch nach höchsten Standards gereinigt. Darüber hinaus werden Präventiv-Maßnahmen für den geringeren Verschleiß vorgenommen.",
      imageSrc: `${ab}/step-3.webp`,
      imageAlt:
        "Mann mit schwarzer Mütze und Handschuhen, der einen grauen Bürostuhl in einer blauen Plastikwanne reinigt.",
    },
  ],
};

export const timelineContent = {
  heading: "Bestandsmobiliar in 6 Schritten revitalisiert.",
  backgroundSrc: `${ab}/timeline-bg.webp`,
  backgroundAlt:
    "Mann mit Tattoos in schwarzen Handschuhen und schwarzem Shirt, der hinter einem grauen Bürostuhl vor einem Holzpaneelwand-Hintergrund steht.",
  variant: "dark" as const,
  steps: [
    {
      num: "01",
      title: "Unverbindliche Beratung.",
      body: "Wir klären gemeinsam im kostenlosen Erstgespräch Rahmenbedingungen und Ziele. Nutzen Sie die Möglichkeit, alle Fragen und Sonderwünsche mit unserem Experten-Team zu erörtern.",
      align: "left" as const,
      cta: { label: "Kontakt aufnehmen", href: "#kontakt" },
    },
    {
      num: "02",
      title: "Besichtigungstermin.",
      body: "Wir verschaffen uns bei einem Vor-Ort-Termin einen Überblick über die Qualität Ihres Bestands und die logistischen Anforderungen. Gleichzeitig stellen wir unser ganzheitliches Konzept gerne in Person vor.",
      align: "right" as const,
      cta: {
        label: "Bestandsaufnahme kennenlernen",
        href: "/bestandsmanagement/digitale-inventarisierung",
      },
    },
    {
      num: "03",
      title: "Analyse & Projektplan.",
      body: "Auf Basis des Vor-Ort-Termins und den Daten aus +150 Projekten erhalten Sie von uns eine detaillierte Analyse zum Potenzial einer Aufbereitung.\n\nWir entwickeln einen Projektplan für die logistische Umsetzung. Individuelle Anforderungen werden berücksichtigt.",
      align: "left" as const,
    },
    {
      num: "04",
      title: "Räumung.",
      body: "Wir räumen Teil- oder Gesamtinventare und stellen bei Bedarf refurbished Möbel zur Überbrückung zur Verfügung.",
      align: "right" as const,
    },
    {
      num: "05",
      title: "Aufbereitung.",
      body: "Wir bereiten Ihren Bestand professionell auf und stellen sicher, dass Funktion, Qualität und Optik langfristig erhalten bleiben.",
      align: "left" as const,
    },
    {
      num: "06",
      title: "Lieferung / Einlagerung.",
      body: "Nach Aufbereitung liefern wir Ihren Bestand zurück oder lagern diesen bei Bedarf sicher zwischen.",
      align: "right" as const,
    },
  ],
};

export const crossSellContent = {
  heading: "Noch unklar, welches Potenzial in Ihrem Bestand steckt?",
  body: "Mit unserer digitalen Bestandsaufnahme schaffen Sie die Datenbasis für alle weiteren Schritte. Erfahren Sie, welche Möbel erhalten, modernisiert oder ersetzt werden sollten – abgestimmt auf Ihre Bedürfnisse.",
  href: "/bestandsmanagement/digitale-inventarisierung",
  cta: "Inventarisierung kennenlernen",
  imageSrc: `${ab}/cta-bg.webp`,
};

export const referenzenContent = {
  heading: "Aufbereitung in der Praxis.",
  description: "Einblicke in echte Reuse-Projekte mit Wirkung.",
};
