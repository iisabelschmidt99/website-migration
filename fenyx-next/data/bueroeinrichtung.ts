const be = "/assets/leistungen/bueroeinrichtung";

export const bueroeinrichtungMeta = {
  title: "Nachhaltige Büroeinrichtung – Bis zu 60% sparen | Fenyx",
  description:
    "Ganzheitliche Büroeinrichtung mit refurbished Premiummöbeln. Bis zu 60% günstiger, schlüsselfertig umgesetzt, 5 Jahre Garantie. Kostenlose Beratung!",
};

export const heroContent = {
  heading: "Fenyx revolutioniert Büroeinrichtung.",
  description: "⌀ 58% kosteneffizienter. 100% nachhaltiger.",
  videoSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/5cff8bbf-e187-4fa6-b51c-ee787b7adf01/play_720p.mp4",
  posterSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/5cff8bbf-e187-4fa6-b51c-ee787b7adf01/thumbnail.jpg",
  ctaHref: "#kontakt",
  ctaLabel: "Kontakt aufnehmen",
};

export const challengesContent = {
  tabs: [
    {
      id: "kosten",
      label: "Kosteneffizienz",
      title: "Sparen Sie bis zu 60% Beschaffungskosten.",
      body: "Durch eine intelligente Hybridbeschaffung, kommt Neuware nur zum Einsatz, wenn es keine refurbished Alternativen gibt.",
      imageSrc: `${be}/challenge-kosten.webp`,
      imageAlt:
        "Hohes modernes Glasgebäude, das Wolken unter einem klaren blauen Himmel widerspiegelt.",
    },
    {
      id: "nachhaltigkeit",
      label: "Nachhaltigkeit",
      title: "Erhalten Sie das nachhaltigste Büro Europas.",
      body: "Durch das größte Portfolio an hochwertigen Neu- und Refurbished Möbeln, sparen Sie mehr als 125 kg CO₂ pro Arbeitsplatz.",
      imageSrc: `${be}/challenge-nachhaltigkeit.jpg`,
      imageAlt:
        "Großer Baum mit weit ausladenden Ästen und dichtem grünen Laubwerk in einem Park mit Rasen und anderen Bäumen im Hintergrund.",
    },
    {
      id: "umsetzung",
      label: "Umsetzung",
      title: "Schlüsselfertige Umsetzungen, keine teuren New Work Konzepte.",
      body: "Fenyx ist oldschool. Versprechen halten. Projekte durchziehen. Erreichbar sein. Bei uns zählt das Prinzip des Mittelstands: „Verlässlichkeit ist unser größtes Kapital.“",
      imageSrc: `${be}/challenge-umsetzung.webp`,
      imageAlt:
        "Moderne Lobby mit einer weißen geschwungenen Couch, Holztisch, großen Glasfenstern, hängenden weißen Lampen und mehreren grünen Zimmerpflanzen.",
    },
  ],
};

export const methodeContent = {
  heading: "Unsere Circular-Office-Methode in 3 Schritten.",
  description:
    "Allein in Deutschland haben wir bereits über 150 nachhaltige Bürotransformationen erfolgreich realisiert.\nMit Fenyx entscheiden Sie sich für einen strukturierten Ansatz, der Wirtschaftlichkeit und Nachhaltigkeit systematisch verbindet.",
  steps: [
    {
      title: "1. Datenbasierte Workspace Analytics & Bestandsaufnahme.",
      bullets: [
        "Business Case für die Geschäftsführung",
        "Analyse der Verwertungspotenziale im Bestand",
        "Konkrete Bedarfsanalyse mit Handlungsempfehlungen",
      ],
      details:
        "Bevor wir auch nur einen Stuhl bewegen, analysieren wir Ihre Ausgangssituation vollständig und strukturiert. Unsere Workspace-Analysten führen sämtliche relevanten Datenpunkte aus Workshops, Vor-Ort-Begehungen, Flächenanalysen und Budgetplanungen digital zusammen.\n\nParallel bewerten wir Ihren Bestand systematisch – inklusive Wiederverkaufswerten, Aufbereitungsoptionen, logistischer Aufwände und potenzieller Einsparungen.\n\nDas Ergebnis: eine belastbare Entscheidungsgrundlage für Geschäftsführung, Einkauf und Facility Management.",
      imageSrc: `${be}/step-analytics.webp`,
      imageAlt: "Zwei Personen stehen in einem hellen Büro und unterhalten sich.",
      imageAlign: "right" as const,
    },
    {
      title: "2. Intelligentes Konzept & Hybrid-Beschaffung.",
      bullets: [
        "3D-Visualisierung inkl. Akustik- und Lichtplanung",
        "Datenbasierte & maßgeschneiderte Designrouten",
        "Messbares Einsparpotenzial durch Hybrid-Beschaffung",
      ],
      details:
        "Aus den erhobenen Daten entsteht ein konkretes, umsetzbares Konzept. Unsere Planungsexperten entwickeln eine individuelle Arbeitsplatzlösung mit realistischer 3D-Visualisierung und durchdachter Detailplanung.\nDie Beschaffung folgt einem klaren Prinzip: Bestehende Möbel werden gezielt weiterverwendet. Ergänzend setzen wir auf hochwertige refurbished Produkte und – wo erforderlich – nachhaltige Neuware. So entsteht eine wirtschaftlich optimierte Lösung, ohne Abstriche bei Qualität oder Funktion.\n\nDas Ergebnis: ein zukunftsfähiges Bürokonzept mit klar kalkulierbaren Kosten.",
      imageSrc: `${be}/step-konzept.webp`,
      imageAlt:
        "Vier junge Fachleute, die an einem Tisch zusammenarbeiten und einen auf einem Monitor angezeigten Grundriss in einem modernen Büro mit großen Fenstern prüfen.",
      imageAlign: "left" as const,
    },
    {
      title: "3. Umsetzung & schlüsselfertige Übergabe.",
      bullets: [
        "Ein Partner. Ein Prozess. Null Stress.",
        "Besenreine Räumung ihres jetzigen Büros",
        "Schlüsselfertige Übergabe des neuen Büros",
      ],
      details:
        "Ein Konzept ist nur so gut wie seine Umsetzung. Deshalb übernimmt Fenyx die vollständige Projektverantwortung.\nWir steuern die Räumung Ihrer bisherigen Fläche, organisieren Logistik und Montage und sorgen dafür, dass alle Beteiligten effizient zusammenarbeiten.\n\nDas Ergebnis: ein vollständig eingerichtetes, bezugsfertiges Büro mit vollständiger Garantiedokumentation und einem transparenten ESG-Impact-Report.",
      imageSrc: `${be}/step-umsetzung.webp`,
      imageAlt:
        "Moderner verglaster Konferenzraum mit schwarzen Drehstühlen um einen weißen Tisch und großen Monitoren.",
      imageAlign: "right" as const,
    },
  ],
};

export const videoFeatureContent = {
  heading: "Zirkuläre Büroeinrichtung in der Praxis.",
  body: "Werfen Sie einen Blick hinter die Kulissen eines realisierten Projekts und erleben Sie, wie moderne Büroplanung gelingt, die Wirtschaftlichkeit, Ästhetik und konsequente Nachhaltigkeit verbindet.",
  posterSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/fc662b0a-5567-400c-a650-013b7568532a/thumbnail.jpg",
  posterAlt: "Zirkuläre Büroeinrichtung in der Praxis.",
  videoSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/fc662b0a-5567-400c-a650-013b7568532a/play_720p.mp4",
};

export const garantienContent = {
  heading: "Die 3 Fenyx Garantien.",
  description: "",
  tabs: [
    {
      id: "produkt",
      title: "Bis zu 8 Jahre Produkt- und Rückkaufgarantie.",
      body: "Wir glauben an das, was wir verkaufen. Deshalb geben wir längere Garantien, als die meisten Neumöbelhersteller plus die Option jederzeit die Ware wieder an uns zurück zu verkaufen.",
      imageSrc: `${be}/garantie-produkt.webp`,
      imageAlt:
        "Zwei Männer geben sich die Hand in einem hellen Büroraum, einer trägt ein schwarzes Fenyx-Shirt und der andere ein blaues Shirt mit Brille.",
    },
    {
      id: "hersteller",
      title: "Selektion von hochwertigen Herstellern.",
      body: "Bei Fenyx zählt Verlässlichkeit und Langlebigkeit, damit Ihre Mitarbeiter ein angenehmes und produktives Arbeitsumfeld genießen.",
      imageSrc: `${be}/garantie-hersteller.webp`,
      imageAlt:
        "Runder schwarzer Bistrotisch mit zwei passenden Stühlen vor weißem Hintergrund.",
    },
    {
      id: "qualitaet",
      title: "Neuwertige Qualität.",
      body: "Durch State-of-the-Art Refurbishment Prozesse inkl. Reparatur, Hersteller-originalem Ersatz-Teiltausch und materialgerechter Tiefenreinigung.",
      imageSrc: `${be}/garantie-qualitaet.webp`,
      imageAlt:
        "Mann mit grauer Mütze und schwarzen Handschuhen, der den Chromrahmen eines umgekehrten Stuhls vor einer Holzlatten-Wand inspiziert.",
    },
  ],
};

export const referenzenContent = {
  heading: "Büroeinrichtung in der Praxis.",
  description:
    "Werden auch Sie Vorreiter und erleben Sie die Zukunft der Bürotransformation.",
};

export const contactContent = {
  heading: "Lassen Sie uns über Ihre Vision sprechen.",
  email: "kristina@fenyx-office.com",
  phone: "+49 176 23820424",
  portraitSrc: "/assets/kontakt/kristina-niesel.webp",
  portraitAlt: "Bild von Kristina Niesel, Einrichtungsberaterin bei Fenyx Office",
  quote:
    "„Gemeinsam realisieren wir moderne Arbeitswelten - smart, nachhaltig und ästhetisch durchdacht.“",
  name: "Kristina Niesel",
  role: "Einrichtungsberaterin",
};
