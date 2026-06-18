
export type ReferenzEntryType = "project" | "partner";

export type ReferenzCategory =
  | "bestandsmanagement"
  | "verwertung"
  | "einrichtung"
  | "partner";

export type ReferenzMapEntry = {
  id: string;
  type: ReferenzEntryType;
  category: ReferenzCategory;
  company: string;
  title: string;
  city: string;
  imageSrc?: string;
};

/** SVG viewBox 586×793 – Koordinaten aus Altseite. */
export const REFERENZEN_CITY_POSITIONS: Record<string, { x: number; y: number }> =
  {
    Berlin: { x: 398, y: 268 },
    Hamburg: { x: 218, y: 128 },
    München: { x: 378, y: 672 },
    Stuttgart: { x: 248, y: 608 },
    Dortmund: { x: 172, y: 332 },
    Düsseldorf: { x: 142, y: 352 },
    "Bad Homburg": { x: 208, y: 438 },
    Gelsenkirchen: { x: 165, y: 338 },
    Deutschland: { x: 300, y: 400 },
    Lüneburg: { x: 250, y: 210 },
    Bremen: { x: 178, y: 168 },
    Aalen: { x: 320, y: 580 },
  };

export const REFERENZEN_CATEGORY_LABELS: Record<ReferenzCategory, string> = {
  bestandsmanagement: "Digitales Bestandsmanagement",
  verwertung: "Ganzheitliche Verwertung",
  einrichtung: "Schlüsselfertige Einrichtung",
  partner: "Partnernetzwerk",
};

const CATEGORY_IMAGES: Record<Exclude<ReferenzCategory, "partner">, string> = {
  bestandsmanagement: `/assets/cms/Home-Digitales-Bestandsmanagement.webp`,
  verwertung: `/assets/cms/auflosung-besichtigung-angebotserstellung.webp`,
  einrichtung: `/assets/cms/nachhaltige-bueroplanung-80b.webp`,
};

// TODO: Bild fehlt – https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10da8f_687514661a0a1570f8f0e0a0_Klett.webp
const KLETT_IMAGE =
  "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10da8f_687514661a0a1570f8f0e0a0_Klett.webp";
// TODO: Bild fehlt – https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dadb_68dd09c82283dea0f8f0e0a0_OTTO.webp
const OTTO_IMAGE =
  "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dadb_68dd09c82283dea0f8f0e0a0_OTTO.webp";
// TODO: Bild fehlt – https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dba5_Universal%201.avif
const UNIVERSAL_IMAGE =
  "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dba5_Universal%201.avif";
// TODO: Bild fehlt – https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dbdc_Delta%20Campus%201.avif
const DELTA_CAMPUS_IMAGE =
  "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f/6988d9ea184c3a10bc10dbdc_Delta%20Campus%201.avif";

const ENTRY_IMAGES: Record<string, string> = {
  "vw-5": KLETT_IMAGE,
  "ei-3": `/assets/cms/Nunatak-Quadrat.webp`,
  "ei-9": `/assets/cms/Sofa-Lobby-Quadrat.webp`,
  "vw-3": KLETT_IMAGE,
  "vw-4": OTTO_IMAGE,
  "vw-7": UNIVERSAL_IMAGE,
  "ei-11": DELTA_CAMPUS_IMAGE,
};

export const REFERENZEN_MAP_ENTRIES: ReferenzMapEntry[] = [
  {
    id: "bm-1",
    type: "project",
    category: "bestandsmanagement",
    company: "Internationales Consulting Unternehmen",
    title: "Vier Standorte digital inventarisiert vor Fusion",
    city: "Berlin",
  },
  {
    id: "bm-2",
    type: "project",
    category: "bestandsmanagement",
    company: "Internationales Technologieunternehmen",
    title: "Nachhaltige Aufarbeitung von Arbeitsplätzen",
    city: "Deutschland",
  },
  {
    id: "bm-3",
    type: "project",
    category: "bestandsmanagement",
    company: "Internationaler Industriekonzern",
    title: "Aufbereitung für Unternehmensstandorte",
    city: "Deutschland",
  },
  {
    id: "vw-1",
    type: "project",
    category: "verwertung",
    company: "SoundCloud",
    title: "Circular Office Exit für das Berliner SoundCloud Headquarter",
    city: "Berlin",
  },
  {
    id: "vw-2",
    type: "project",
    category: "verwertung",
    company: "Continentale",
    title: "Standortzusammenführung mit Mitarbeiterverkauf",
    city: "Dortmund",
  },
  {
    id: "vw-3",
    type: "project",
    category: "verwertung",
    company: "Ernst Klett Verlag",
    title: "Räumung mit Spenden an soziale Einrichtungen",
    city: "Stuttgart",
  },
  {
    id: "vw-4",
    type: "project",
    category: "verwertung",
    company: "OTTO",
    title: "Nachhaltige Auflösung von vier Standorten",
    city: "Hamburg",
  },
  {
    id: "vw-5",
    type: "project",
    category: "verwertung",
    company: "SIGNAL IDUNA Gruppe",
    title: "Nachhaltige Auflösung von über 2500 Arbeitsplätzen",
    city: "Hamburg",
  },
  {
    id: "vw-6",
    type: "project",
    category: "verwertung",
    company: "TÜV SÜD",
    title: "Mitarbeiterverkauf und Verwertung",
    city: "München",
  },
  {
    id: "vw-7",
    type: "project",
    category: "verwertung",
    company: "Universal Music Group",
    title: "Mitarbeiterverkauf im Zentrum der Verwertung",
    city: "Berlin",
  },
  {
    id: "vw-8",
    type: "project",
    category: "verwertung",
    company: "KPMG",
    title: "Mitarbeiterverkauf bei Standortkonsolidierung",
    city: "Berlin",
  },
  {
    id: "vw-9",
    type: "project",
    category: "verwertung",
    company: "Unibail-Rodamco-Westfield",
    title: "Mitarbeiterverkauf nach Teilflächenauflösung",
    city: "Düsseldorf",
  },
  {
    id: "ei-1",
    type: "project",
    category: "einrichtung",
    company: "Pharmaunternehmen",
    title: "Nachhaltige Büroausstattung im Mietmodell",
    city: "Bad Homburg",
  },
  {
    id: "ei-2",
    type: "project",
    category: "einrichtung",
    company: "Bildungsanbieter",
    title: "Zirkuläre Einrichtung für 120 Arbeitsplätze",
    city: "Gelsenkirchen",
  },
  {
    id: "ei-3",
    type: "project",
    category: "einrichtung",
    company: "The Nunatak Group",
    title: "Workspace-Analyse und nachhaltige Einrichtung",
    city: "München",
  },
  {
    id: "ei-4",
    type: "project",
    category: "einrichtung",
    company: "because",
    title: "Refurbished Büromöblierung im Mietmodell",
    city: "Berlin",
  },
  {
    id: "ei-5",
    type: "project",
    category: "einrichtung",
    company: "w3.hub",
    title: "Zukunftsfähige Einrichtung für Coworking und Events",
    city: "Berlin",
  },
  {
    id: "ei-6",
    type: "project",
    category: "einrichtung",
    company: "Automobilhersteller",
    title: "Refurbished Workspace in Rekordzeit",
    city: "Deutschland",
  },
  {
    id: "ei-7",
    type: "project",
    category: "einrichtung",
    company: "Ivy",
    title: "Refurbished Workspace für das Fintech von morgen",
    city: "Berlin",
  },
  {
    id: "ei-8",
    type: "project",
    category: "einrichtung",
    company: "VARM",
    title: "Möblierung für schnelles Wachstum",
    city: "Berlin",
  },
  {
    id: "ei-9",
    type: "project",
    category: "einrichtung",
    company: "Reneo Group GmbH",
    title: "Büroplanung mit Refurbished Möbeln",
    city: "Hamburg",
  },
  {
    id: "ei-10",
    type: "project",
    category: "einrichtung",
    company: "Spacebase",
    title: "Möblierung für Coworking und Event Space",
    city: "Berlin",
  },
  {
    id: "ei-11",
    type: "project",
    category: "einrichtung",
    company: "The Delta Campus",
    title: "Kreislauffähige Einrichtung für modernes Arbeiten",
    city: "Berlin",
  },
  {
    id: "ei-12",
    type: "project",
    category: "einrichtung",
    company: "Enpal",
    title: "Flexible Möblierung für Wachstum",
    city: "Berlin",
  },
  {
    id: "ei-13",
    type: "project",
    category: "einrichtung",
    company: "O'Donnell Moonshine",
    title: "Flexible Büromöblierung zur Miete",
    city: "Berlin",
  },
  {
    id: "pa-1",
    type: "partner",
    category: "partner",
    company: "Sellenthin",
    title: "Partner für Logistik & Umzug",
    city: "Lüneburg",
  },
  {
    id: "pa-2",
    type: "partner",
    category: "partner",
    company: "Hertling",
    title: "Partner für nationale Transporte",
    city: "Bremen",
  },
  {
    id: "pa-3",
    type: "partner",
    category: "partner",
    company: "Scholz",
    title: "Partner für Recycling & Verwertung",
    city: "Aalen",
  },
];

export function getReferenzEntryImage(entry: ReferenzMapEntry): string {
  if (entry.imageSrc) return entry.imageSrc;
  if (ENTRY_IMAGES[entry.id]) return ENTRY_IMAGES[entry.id];
  if (entry.type === "partner") return CATEGORY_IMAGES.einrichtung;
  return CATEGORY_IMAGES[entry.category as keyof typeof CATEGORY_IMAGES];
}

export function getCityPosition(city: string) {
  return REFERENZEN_CITY_POSITIONS[city] ?? REFERENZEN_CITY_POSITIONS.Deutschland;
}

export type ReferenzFilterType = "all" | "project" | "partner";

export type ReferenzFilterState = {
  type: ReferenzFilterType;
  category: ReferenzCategory | "all";
};

export function matchesReferenzFilter(
  entry: ReferenzMapEntry,
  state: ReferenzFilterState,
) {
  if (state.type === "project" && entry.type !== "project") return false;
  if (state.type === "partner" && entry.type !== "partner") return false;
  if (state.category !== "all" && entry.category !== state.category) return false;
  if (state.category !== "all" && entry.type === "partner") return false;
  return true;
}

export type PositionedReferenzEntry = {
  entry: ReferenzMapEntry;
  x: number;
  y: number;
};

export function spreadReferenzMarkers(
  entries: ReferenzMapEntry[],
): PositionedReferenzEntry[] {
  const byCity: Record<string, ReferenzMapEntry[]> = {};

  entries.forEach((entry) => {
    if (!byCity[entry.city]) byCity[entry.city] = [];
    byCity[entry.city].push(entry);
  });

  const result: PositionedReferenzEntry[] = [];

  Object.values(byCity).forEach((group) => {
    const base = getCityPosition(group[0].city);
    group.forEach((entry, index) => {
      const angle = (index / group.length) * Math.PI * 2 - Math.PI / 2;
      const radius = group.length > 1 ? 10 + group.length * 1.5 : 0;
      result.push({
        entry,
        x: base.x + Math.cos(angle) * radius,
        y: base.y + Math.sin(angle) * radius,
      });
    });
  });

  return result;
}

const CARD_W = 228;
const CARD_H = 178;
const GAP = 26;
const VB_W = 586;
const VB_H = 793;

export type CalloutPlacement = {
  fx: number;
  fy: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function placeReferenzCallout(mx: number, my: number): CalloutPlacement {
  const spaceL = mx;
  const spaceR = VB_W - mx;
  const spaceT = my;
  const spaceB = VB_H - my;
  const pad = 10;

  let placement: "right" | "left" | "bottom" | "top";
  let fx: number;
  let fy: number;
  let x2: number;
  let y2: number;

  if (spaceR >= CARD_W + GAP && mx < 300) {
    placement = "right";
  } else if (spaceL >= CARD_W + GAP && mx > 286) {
    placement = "left";
  } else if (spaceB >= CARD_H + GAP) {
    placement = "bottom";
  } else if (spaceT >= CARD_H + GAP) {
    placement = "top";
  } else if (spaceR >= spaceL) {
    placement = "right";
  } else {
    placement = "left";
  }

  if (placement === "right") {
    fx = mx + GAP;
    fy = my - CARD_H / 2;
    x2 = fx;
    y2 = my;
  } else if (placement === "left") {
    fx = mx - GAP - CARD_W;
    fy = my - CARD_H / 2;
    x2 = fx + CARD_W;
    y2 = my;
  } else if (placement === "bottom") {
    fx = mx - CARD_W / 2;
    fy = my + GAP;
    x2 = mx;
    y2 = fy;
  } else {
    fx = mx - CARD_W / 2;
    fy = my - GAP - CARD_H;
    x2 = mx;
    y2 = fy + CARD_H;
  }

  fx = Math.max(pad, Math.min(fx, VB_W - CARD_W - pad));
  fy = Math.max(pad, Math.min(fy, VB_H - CARD_H - pad));

  return { fx, fy, x1: mx, y1: my, x2, y2 };
}
