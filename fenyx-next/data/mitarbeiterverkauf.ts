const mv = "/assets/leistungen/mitarbeiterverkauf";

export const mitarbeiterverkaufMeta = {
  title: "Mitarbeiterverkauf Büromöbel | Digital & rechtssicher | Fenyx",
  description:
    "Büromöbel digital & rechtssicher an Mitarbeiter verkaufen. Steuerfrei, inkl. Webshop & Logistik. Komplette Abwicklung durch Fenyx!",
};

export const heroContent = {
  heading: "Professioneller Mitarbeiterverkauf.",
  description:
    "Fenyx macht den Verkauf von obsoletem Bestand an die Mitarbeiterschaft EU-weit möglich. Mit der digitalen Lösung vermeiden Kunden steuerliche Risiken und administrativen Aufwand.",
  bullets: [
    "Frei von steuerlichen und Haftungs-Risiken",
    "Kein administrativer oder buchhalterischer Aufwand",
    "Veräußerung und Logistik aus einer Hand",
  ],
  imageSrc: `${mv}/hero.jpg`,
  imageAlt: "Mitarbeiter wählen Büromöbel bei einem professionellen Mitarbeiterverkauf.",
  ctaHref: "#kontakt",
  ctaLabel: "Kontakt aufnehmen",
};

export const logoGridContent = {
  heading:
    "Diese Unternehmen organisierten Mitarbeiterverkäufe mit und über Fenyx.",
  description:
    "Zahlreiche Unternehmen setzen bei der Organisation ihres Mitarbeitendenverkaufs auf Fenyx – mit klaren Kostenvorteilen, dokumentierter Nachhaltigkeitswirkung und hoher Akzeptanz in der Belegschaft.",
};

export const videoContent = {
  heading: "Mitarbeiterverkauf bei einem Technologie-Unternehmen in Berlin.",
  posterSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/64f845f9-4f37-415a-af8b-1cce1d5d1db3/thumbnail.jpg",
  posterAlt:
    "Mitarbeiterverkauf bei einem Technologie-Unternehmen in Berlin.",
  videoSrc:
    "https://vz-248cf2fb-ed4.b-cdn.net/64f845f9-4f37-415a-af8b-1cce1d5d1db3/play_720p.mp4",
};

export const greenCardsContent = {
  heading: "So verbinden Sie Nachhaltigkeit mit echter Wertschätzung.",
  intro:
    "Ihre Mitarbeiter können von der Verwertung Ihrer Möbel profitieren und erhalten den Restbestand zu attraktiven Preisen zur Einrichtung des Home-Offices.",
  cards: [
    {
      title: "Rechtssicher & Steuerfrei.",
      body: "Fenyx kauft den gesamten Bestand von Ihnen ab und verkauft ihn weiter an Ihre Mitarbeiter. Somit umgehen Sie jegliche Gewährleistungs- und Steuerrisiken.",
    },
    {
      title: "Maximale Mitarbeiterzufriedenheit.",
      body: "Mitarbeitende erhalten in einem smarten Prozess hochwertige Möbel zu attraktiven Konditionen: transparent, fair und auf Wunsch inklusive Lieferung.",
    },
    {
      title: "Abwicklung aus einer Hand.",
      body: "Fenyx koordiniert alle notwendigen Schritte für eine erfolgreiche Abwicklung, von der digitalen Bestandaufnahme bis hin zur Rechnungsstellung und Auslieferung.",
    },
  ],
};

export const eventContent = {
  heading: "Ein verbindendes Event für gelebte Kreislaufwirtschaft.",
  body: "Der digitale Mitarbeiterverkauf macht Nachhaltigkeit im Team greifbar und verwandelt den Abschied von Vertrautem in ein gemeinsames Erlebnis der Wertschätzung. Schenken Sie Ihren Büromöbeln ein zweites Zuhause bei Ihren Kollegen: Dies stärkt den Zusammenhalt und feiert den Wandel Ihres Unternehmens als positives, gemeinschaftliches Projekt.",
  imageSrc: `${mv}/event.webp`,
  imageAlt:
    "Frau, die auf Papieren schreibt, während sie zwischen gestapelten Stühlen mit nach oben zeigenden Holzbeinen in einem hellen Raum sitzt.",
  ctaLabel: "Kontakt aufnehmen",
  ctaHref: "#kontakt",
  reverse: true,
};

export const co2CalculatorContent = {
  heading: "Berechnen Sie Ihre CO₂-Einsparungen mit zwei Klicks!",
  body: `Erfahren Sie, wie viel CO₂-Emissionen Sie durch Fenyx sparen können. Wählen Sie die Optionen aus und passen Sie die Anzahl der Arbeitsplätze an, um Ihre Einsparungen zu berechnen.

Unsere Emissions- und Äquivalentdaten stammen von der United States Environmental Protection Agency (EPA) und aus einer umfassenden Studie der Furniture Industry Research Association (FIRA), die die CO₂-Bilanz verschiedener Möbeltypen analysiert hat.

Indem Sie mit Fenyx für eine nachhaltige Weiterverwendung Ihrer gebrauchten Büroeinrichtung sorgen, tragen Sie aktiv dazu bei, den Bedarf an neuen Produkten zu verringern und somit CO₂-Emissionen zu reduzieren.

Erfahren Sie mehr über unseren Nachhaltigkeitsanspruch oder fordern Sie ein Angebot an.`,
  ctaLabel: "Angebot anfordern",
  ctaHref: "#kontakt",
  backgroundSrc: `${mv}/calculator-bg.webp`,
  categories: [
    {
      id: "workspace",
      label: "Arbeitsplätze",
      hint: "Schreibtisch, Bürostuhl. etc.",
      co2PerWorkstation: 255,
      defaultSelected: true,
    },
    {
      id: "conference",
      label: "Lounge- & Konferenzmöbel",
      co2PerWorkstation: 91,
      defaultSelected: false,
    },
    {
      id: "electronics",
      label: "Elektronik",
      hint: "Screen, Tastatur, etc.",
      co2PerWorkstation: 140,
      defaultSelected: false,
    },
  ],
  icons: {
    car: `${mv}/icon-car.webp`,
    tree: `${mv}/icon-tree.webp`,
  },
};

export const timelineContent = {
  heading: "So funktioniert der Mitarbeiterverkauf mit Fenyx",
  backgroundSrc: `${mv}/timeline-bg.webp`,
  backgroundAlt:
    "Büro im Umbau mit freiliegenden Decken, Holzlamellenwand, gelbem Absperrband und Baumaterialien auf dem Boden.",
  steps: [
    {
      num: "01",
      title: "Digitale Inventarisierung.",
      body: "Fenyx erstellt eine fachgerechte Bestandsliste aller relevanten Modelle inkl. hochauflösender Fotos und Experten-Zustandseinschätzung, für eine professionelle Darstellung im Mitarbeitershop.",
      align: "left" as const,
    },
    {
      num: "02",
      title: "Experten Preisvorschlag.",
      body: "Fenyx erstellt für jeden Artikel einen Preisvorschlag, welcher meist 40% bis 70% des marktüblichen Gebrauchtpreises entspricht. So fühlen sich die Mitarbeitenden bestmöglich abgeholt.",
      align: "right" as const,
    },
    {
      num: "03",
      title: "Set-Up des Online-Shops.",
      body: "Fenyx erstellt einen passwortgeschützten Web-Shop, der für alle oder ausgewählte Mitarbeitende zugänglich ist. Wir empfehlen die Vorgabe eines Reservierungs-Zeitfensters, um einen fairen Prozess zu gewährleisten.",
      align: "left" as const,
    },
    {
      num: "04",
      title: "Operative Koordination & Abwicklung.",
      body: "Auf Basis der Reservierungsanfragen wird eine konkrete Möbelliste erstellt und ein korrespondierender Kaufvertrag geschlossen. Danach übernehmen wir die Vor-Ort-Koordination von Abholungen analog zu der Standorträumung und führen separate Transaktionen mit Ihrer Belegschaft durch. Auf Wunsch organisieren wir Lieferungen mit unserem logistischen Partnernetzwerk.",
      align: "right" as const,
    },
    {
      num: "05",
      title: "Buchhalterische Dokumentation.",
      body: "Kaufverträge werden zwischen Fenyx und Ihren Mitarbeitenden abgeschlossen. Sie umgehen jegliche Gewährleistungsansprüche und Risiken bezüglich geldwerter Vorteile. Zudem erhalten Sie einen abschließenden Kaufbericht und umfassenden Nachhaltigkeitsbericht von Fenyx.",
      align: "left" as const,
    },
  ],
};

export const crossSellContent = {
  heading: "Nach dem Mitarbeiterverkauf existiert noch ein Restbestand?",
  body: "Veräußern Sie alle übrig gebliebenen Posten über die digitale Auktionsplattform. Wir bringen Ihre Möbel fristgerecht und zum Bestpreis zurück in den Kreislauf.",
  href: "#kontakt",
  cta: "Zur Auktionsplattform wechseln",
  imageSrc: `${mv}/cta-bg.webp`,
};

export const referenzenContent = {
  heading: "Mitarbeiterverkauf in der Praxis.",
  description:
    "Werden auch Sie Vorreiter und erleben Sie die Zukunft nachhaltiger Bürotransformationen",
};
