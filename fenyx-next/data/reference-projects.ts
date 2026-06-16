export type ReferenceStat = {
  value: string;
  label: string;
};

export type ReferenceProject = {
  eyebrow: string;
  heading: string;
  tag: string;
  body: string;
  stats: ReferenceStat[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
};

/** Homepage-Referenzprojekte (Inhalte 1:1 aus Live-Seite / Webflow-Vorlage). */
export const referenceProjects: ReferenceProject[] = [
  {
    eyebrow: "Planung mit Bestand / Einrichtung",
    heading: "Reneo Group GmbH",
    tag: "Schlüsselfertige Einrichtung",
    body: "Fenyx entwickelte für den neuen Firmensitz in Hamburg ein ressourcenschonendes Einrichtungskonzept: Bestehende Möbel wurden gezielt integriert, nicht benötigte Bestände nachhaltig verwertet und 82 ergonomische, refurbished E-Tische ergänzt – funktional, hochwertig und CO₂-effizient.",
    stats: [
      { value: "82", label: "Refurbished Möbelstücke" },
      { value: "5.084 kg", label: "CO₂ Emissionen gespart" },
      { value: "58 %", label: "Kostenersparnis" },
    ],
    href: "/referenzen/reneo-group",
    imageSrc: "/assets/Referenzen/reneo-group.png",
    imageAlt: "Empfangsbereich Reneo Group GmbH, Hamburg",
  },
  {
    eyebrow: "Verwertung / Verkauf",
    heading: "SIGNAL IDUNA Gruppe",
    tag: "Ganzheitliche Verwertung",
    body: "Ganzheitliche Verwertung bei Standortauflösung: Fenyx übernahm die vollständige Räumung von sieben Gebäudeteilen in Hamburg – inklusive strukturierter Aufbereitung, Verkauf und Recycling. Ein Teil des Mobiliars wurde wirtschaftlich weitervermarktet, der Rest fachgerecht und ressourcenschonend recycelt.",
    stats: [
      { value: "4.500", label: "Möbel verarbeitet" },
      { value: "ca. 19.000 kg", label: "CO₂-Emissionen gespart" },
      { value: "15 %", label: "Kosteneinsparung" },
    ],
    href: "/referenzen/signal-iduna",
    imageSrc: "/assets/Referenzen/signal-iduna.png",
    imageAlt: "Empfangsbereich SIGNAL IDUNA Gruppe, Hamburg",
    imageLeft: true,
  },
  {
    eyebrow: "Planung / Workspace Analytics",
    heading: "The Nunatak Group",
    tag: "Schlüsselfertige Einrichtung",
    body: "Fenyx entwickelte ein modernes Einrichtungskonzept für 80 Arbeitsplätze in München – basierend auf einer fundierten Arbeitsplatzanalyse mit Mitarbeitendenbefragung und umgesetzt mit hochwertig aufbereitetem Mobiliar für eine nachhaltige, ergonomische und kollaborative Arbeitsumgebung.",
    stats: [
      { value: "80", label: "Refurbished Möbel" },
      { value: "5.096 kg", label: "CO₂ Emissionen gespart" },
      { value: "49 %", label: "Kostenersparnis im Vergleich zum Neukauf" },
    ],
    href: "/referenzen/the-nunatak-group",
    imageSrc: "/assets/Referenzen/nunatak-group.png",
    imageAlt: "Lounge The Nunatak Group, München",
  },
  {
    eyebrow: "Mitarbeiterverkauf",
    heading: "Universal Music Group",
    tag: "Ganzheitliche Verwertung",
    body: "Fenyx organisierte die vollständige Räumung des Berliner Headquarters und ermöglichte die Weitergabe von 1.800 Möbelstücken an Mitarbeitende. Durch strukturierte Inventarisierung, systematische Sortierung und professionelle Verkaufsabwicklung wurde ein dreistufiges Verwertungsmodell umgesetzt: Mitarbeitendenverkauf, europaweiter Weiterverkauf und gezielte Spenden.",
    stats: [
      { value: "4.500", label: "Möbel verarbeitet" },
      { value: "1.800", label: "Möbel intern weitergegeben" },
      { value: "45.045 kg", label: "CO₂-Emissionen gespart" },
    ],
    href: "/referenzen/universal-studios",
    imageSrc: "/assets/Referenzen/universal-music-group.png",
    imageAlt: "Lounge Universal Music Group, Berlin",
    imageLeft: true,
  },
  {
    eyebrow: "Einrichtung",
    heading: "The Delta Campus",
    tag: "Schlüsselfertige Einrichtung",
    body: "Fenyx begleitete die Ausstattung des Berliner Co-Working-Spaces mit klarem Fokus auf Kreislaufwirtschaft: 324 hochwertig aufbereitete Stühle schaffen eine moderne, wirtschaftliche und ressourcenschonende Arbeitsumgebung.",
    stats: [
      { value: "324", label: "Refurbished Möbel" },
      { value: "21.096 kg", label: "CO₂ Emissionen gespart" },
      { value: "69 %", label: "Kostenersparnis im Vergleich zum Neukauf" },
    ],
    href: "/referenzen/the-delta-campus",
    imageSrc: "/assets/Referenzen/delta-campus.png",
    imageAlt: "Co-Working-Space The Delta Campus, Berlin",
  },
];
