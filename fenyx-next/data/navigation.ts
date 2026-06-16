/** Navigationsdaten für Header / Mega-Menü (1:1 aus fenyx-rebuild). */

const CDN = "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d7e6";
const CDN_CASES = "https://cdn.prod.website-files.com/6988d9ea184c3a10bc10d80f";

export type NavServiceLink = {
  label: string;
  href: string;
  sub: string;
  imageSrc: string;
};

export type NavCaseLink = {
  title: string;
  sub: string;
  href: string;
  imageSrc: string;
};

export type NavSimpleLink = {
  label: string;
  href: string;
};

export type MegaMenuConfig = {
  id: string;
  title: string;
  eyebrow: string;
  layout: "full" | "two" | "simple";
  alignEnd?: boolean;
  services: NavServiceLink[];
  cases?: NavCaseLink[];
  simpleLinks?: NavSimpleLink[];
};

export const PROMO = {
  title: "Entdecken Sie den zirkulären Büro-Lebenszyklus",
  href: "/#leistungen",
  imageSrc: "/assets/navigation/mega-promo.webp",
  imageAlt: "Moderner Büroarbeitsplatz mit nachhaltiger Einrichtung",
};

export const MEGA_MENUS: MegaMenuConfig[] = [
  {
    id: "bestandsmanagement",
    title: "Bestandsmanagement",
    eyebrow: "Bestandsmanagement",
    layout: "full",
    services: [
      {
        label: "Digitales Bestandsmanagement",
        href: "/bestandsmanagement",
        sub: "Ziehen Sie den maximalen Wert aus Ihrem Bestand",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d8a1_bestand-hero.webp`,
      },
      {
        label: "Digitale Inventarisierung",
        href: "/bestandsmanagement/digitale-inventarisierung",
        sub: "Schaffen Sie Transparenz über Ihren gesamten Bestand",
        imageSrc: "/assets/timeline/Home-Digitales-Bestandsmanagement.webp",
      },
      {
        label: "Projektmanagement",
        href: "/bestandsmanagement/projektmanagement",
        sub: "Ganzheitliche, nachhaltige Projektbegleitung aus einer Hand",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d8a9_miete-tabs-3.webp`,
      },
    ],
    cases: [
      {
        title: "Internationales Consulting Unternehmen",
        sub: "Vier Standorte digital inventarisiert vor Fusion",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/699452dfaa8fb06578b6e1f9_Sofa%20Lobby%20Quadrat.avif`,
      },
      {
        title: "Internationales Technologieunternehmen",
        sub: "Nachhaltige Aufarbeitung von Arbeitsplätzen",
        href: "/referenzen",
        imageSrc: "/assets/mega-cases/technologieunternehmen.png",
      },
      {
        title: "Internationaler Industriekonzern",
        sub: "Aufbereitung für Unternehmensstandorte",
        href: "/referenzen",
        imageSrc: "/assets/mega-cases/industriekonzern.png",
      },
      {
        title: "Internationaler Finanzdienstleister",
        sub: "Aufbereitung statt Neukauf",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10da60_683a16be5e80545507a92f6f_Finanzdienstleister.avif`,
      },
    ],
  },
  {
    id: "verwertung",
    title: "Verwertung",
    eyebrow: "Verwertung",
    layout: "full",
    services: [
      {
        label: "Büroauflösung",
        href: "/verwertung/bueroaufloesung",
        sub: "Mit nur einem Partner zur besenreinen Flächenübergabe",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d841_bueroaufloesung%20(thumbnail).webp`,
      },
      {
        label: "Mitarbeiterverkauf",
        href: "/verwertung/mitarbeiterverkauf",
        sub: "Verkauf an Mitarbeiter ohne steuerliche und Haftungs-Risiken",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d993_header%20Verwertung%20MA%20Verkauf.webp`,
      },
      {
        label: "Spende",
        href: "/verwertung/spende",
        sub: "Optimale und soziale Verwertung des Gesamtbestands",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d994_Header%20Verwertung%20Spende%20(1).webp`,
      },
      {
        label: "Aufbereitung",
        href: "/verwertung/aufbereitung",
        sub: "Maximaler Erlös durch professionelle Vermarktung",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d96d_Auflso%CC%88ung%20Fenyx%20Versprechen%20(1).webp`,
      },
    ],
    cases: [
      {
        title: "SoundCloud",
        sub: "Circular Office Exit für das Berliner SoundCloud Headquarter",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/69c56038c83ed205443907fd_plakate_gross%20(1).webp`,
      },
      {
        title: "Continentale",
        sub: "Standortzusammenführung mit Mitarbeiterverkauf",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10da94_687513f3537f3fc0f8f0e0a0_Continentale.webp`,
      },
      {
        title: "Ernst Klett Verlag",
        sub: "Räumung mit Spenden an soziale Einrichtungen",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10da8f_687514661a0a1570f8f0e0a0_Klett.webp`,
      },
      {
        title: "OTTO",
        sub: "Nachhaltige Auflösung von vier Standorten",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10dadb_68dd09c82283dea0f8f0e0a0_OTTO.webp`,
      },
    ],
  },
  {
    id: "einrichtung",
    title: "Einrichtung",
    eyebrow: "Einrichtung",
    layout: "full",
    services: [
      {
        label: "Büroeinrichtung",
        href: "/einrichtung/bueroeinrichtung",
        sub: "Ganzheitliche Gestaltung nachhaltiger Arbeitswelten",
        imageSrc: `${CDN}/6989a9bafc4d640fd4e302cb_Einrichtung%20Header%20Dropdown%20B%C3%BCroeinrichtung.webp`,
      },
      {
        label: "Workspace Analytics & Bürokonzept",
        href: "/einrichtung/workspace-analytics",
        sub: "Datenbasierte Analyse und optimale Raumnutzung",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d930_miete-herkunft-3.webp`,
      },
      {
        label: "Mietoptionen",
        href: "/einrichtung/bueromoebel-mieten",
        sub: "Flexible Bürolösungen ohne Kapitalbindung",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d94a_683186c52505f0a9d720ec59_Nachhaltige%20B%C3%BCroplanung.webp`,
      },
    ],
    cases: [
      {
        title: "Pharmaunternehmen",
        sub: "Nachhaltige Büroausstattung im Mietmodell",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/69aeb870d28d57934eb424d4_blick-ins-foyer.webp`,
      },
      {
        title: "Bildungsanbieter",
        sub: "Zirkuläre Einrichtung für 120 Arbeitsplätze",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10dad3_68837e8c28869c60f8f0e0a0_Bildungsanbieter.webp`,
      },
      {
        title: "The Nunatak Group",
        sub: "Workspace-Analyse und nachhaltige Einrichtung",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10da77_683a0c7649d3317f8f0e0a0_Nunatak.webp`,
      },
      {
        title: "bcause",
        sub: "Refurbished Büromöblierung im Mietmodell",
        href: "/referenzen",
        imageSrc: `${CDN_CASES}/6988d9ea184c3a10bc10da90_68caf2fe71b79dec22e92e0e_Bildschirmfoto%25202025-09-17%2520um%252019.42.19.webp`,
      },
    ],
  },
  {
    id: "fenyx-fuer-sie",
    title: "Fenyx für Sie",
    eyebrow: "Fenyx für Sie",
    layout: "two",
    services: [
      {
        label: "Großunternehmen",
        href: "/fenyx-fuer-sie/grossunternehmen",
        sub: "Errichten und betreiben Sie Ihre Standorte kosteneffizient und nachhaltig.",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d841_bueroaufloesung%20(thumbnail).webp`,
      },
      {
        label: "Mittelstand",
        href: "/fenyx-fuer-sie/mittelstand",
        sub: "Gestalten Sie Ihr Büro genauso schnell und flexibel wie Ihr Geschäft.",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d838_mitarbeiterverkauf%20(thumbnail).webp`,
      },
      {
        label: "Scale-Ups",
        href: "/fenyx-fuer-sie/start-up-scale-up",
        sub: "Erhalten Sie EU-weites nachhaltiges Projektmanagement aus einer Hand.",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d8c6_spende%201.webp`,
      },
      {
        label: "Co-Working Space",
        href: "/fenyx-fuer-sie/co-working-space",
        sub: "Machen Sie Ihr Büro zukunftsfähig und schonen Sie dabei Ressourcen.",
        imageSrc: `${CDN}/6988d9ea184c3a10bc10d83a_auktionsplattform.webp`,
      },
    ],
  },
  {
    id: "ueber-uns",
    title: "Über uns",
    eyebrow: "Über uns",
    layout: "simple",
    alignEnd: true,
    services: [],
    simpleLinks: [
      { label: "Team", href: "/ueber-uns" },
      { label: "Ratgeber", href: "/ratgeber" },
      { label: "News & Medien", href: "/presse-medien" },
    ],
  },
];

export const DIRECT_LINKS = [
  { label: "Referenzen", href: "/referenzen" },
  { label: "Events", href: "/events" },
];

export const MOBILE_MENUS = MEGA_MENUS.filter((m) => m.layout !== "simple").concat(
  MEGA_MENUS.filter((m) => m.layout === "simple")
);
