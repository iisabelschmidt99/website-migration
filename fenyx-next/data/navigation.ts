/** Navigationsdaten für Header / Mega-Menü (1:1 aus fenyx-rebuild). */

const NAV_VERWERTUNG = "/assets/navigation/verwertung";
const NAV_EINRICHTUNG = "/assets/navigation/einrichtung";
const NAV_CASES = "/assets/navigation/cases";

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
  sub?: string;
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
        imageSrc: `/assets/cms/bestand-hero.webp`,
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
        imageSrc: `/assets/cms/miete-tabs-3.webp`,
      },
    ],
    cases: [
      {
        title: "Internationales Consulting Unternehmen",
        sub: "Vier Standorte digital inventarisiert vor Fusion",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/consulting-unternehmen.webp`,
      },
      {
        title: "Internationales Technologieunternehmen",
        sub: "Nachhaltige Aufarbeitung von Arbeitsplätzen",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/technologieunternehmen.png`,
      },
      {
        title: "Internationaler Industriekonzern",
        sub: "Aufbereitung für Unternehmensstandorte",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/industriekonzern.png`,
      },
      {
        title: "Internationaler Finanzdienstleister",
        sub: "Aufbereitung statt Neukauf",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/finanzdienstleister.png`,
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
        imageSrc: `${NAV_VERWERTUNG}/bueroaufloesung.webp`,
      },
      {
        label: "Mitarbeiterverkauf",
        href: "/verwertung/mitarbeiterverkauf",
        sub: "Verkauf an Mitarbeiter ohne steuerliche und Haftungs-Risiken",
        imageSrc: `${NAV_VERWERTUNG}/mitarbeiterverkauf.avif`,
      },
      {
        label: "Spende",
        href: "/verwertung/spende",
        sub: "Optimale und soziale Verwertung des Gesamtbestands",
        imageSrc: `${NAV_VERWERTUNG}/spende.webp`,
      },
      {
        label: "Aufbereitung",
        href: "/verwertung/aufbereitung",
        sub: "Maximaler Erlös durch professionelle Vermarktung",
        imageSrc: `${NAV_VERWERTUNG}/aufbereitung.webp`,
      },
    ],
    cases: [
      {
        title: "SoundCloud",
        sub: "Circular Office Exit für das Berliner SoundCloud Headquarter",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/soundcloud.webp`,
      },
      {
        title: "Continentale",
        sub: "Standortzusammenführung mit Mitarbeiterverkauf",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/continentale.png`,
      },
      {
        title: "Ernst Klett Verlag",
        sub: "Räumung mit Spenden an soziale Einrichtungen",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/klett.webp`,
      },
      {
        title: "OTTO",
        sub: "Nachhaltige Auflösung von vier Standorten",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/otto.webp`,
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
        imageSrc: `${NAV_EINRICHTUNG}/bueroeinrichtung.webp`,
      },
      {
        label: "Workspace Analytics & Bürokonzept",
        href: "/einrichtung/workspace-analytics",
        sub: "Datenbasierte Analyse und optimale Raumnutzung",
        imageSrc: `${NAV_EINRICHTUNG}/workspace-analytics.webp`,
      },
      {
        label: "Mietoptionen",
        href: "/einrichtung/bueromoebel-mieten",
        sub: "Flexible Bürolösungen ohne Kapitalbindung",
        imageSrc: `${NAV_EINRICHTUNG}/bueromoebel-mieten.webp`,
      },
    ],
    cases: [
      {
        title: "Pharmaunternehmen",
        sub: "Nachhaltige Büroausstattung im Mietmodell",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/pharma.webp`,
      },
      {
        title: "Bildungsanbieter",
        sub: "Zirkuläre Einrichtung für 120 Arbeitsplätze",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/bildungsanbieter.webp`,
      },
      {
        title: "The Nunatak Group",
        sub: "Workspace-Analyse und nachhaltige Einrichtung",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/nunatak.webp`,
      },
      {
        title: "bcause",
        sub: "Refurbished Büromöblierung im Mietmodell",
        href: "/referenzen",
        imageSrc: `${NAV_CASES}/bcause.webp`,
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
        imageSrc: `/assets/cms/bueroaufloesung-thumbnail.webp`,
      },
      {
        label: "Mittelstand",
        href: "/fenyx-fuer-sie/mittelstand",
        sub: "Gestalten Sie Ihr Büro genauso schnell und flexibel wie Ihr Geschäft.",
        imageSrc: `/assets/cms/mitarbeiterverkauf-thumbnail.webp`,
      },
      {
        label: "Scale-Ups",
        href: "/fenyx-fuer-sie/start-up-scale-up",
        sub: "Erhalten Sie EU-weites nachhaltiges Projektmanagement aus einer Hand.",
        imageSrc: `/assets/cms/spende-1.webp`,
      },
      {
        label: "Co-Working Space",
        href: "/fenyx-fuer-sie/co-working-space",
        sub: "Machen Sie Ihr Büro zukunftsfähig und schonen Sie dabei Ressourcen.",
        imageSrc: `/assets/cms/auktionsplattform.webp`,
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
      {
        label: "Team",
        href: "/ueber-uns",
        sub: "Mehr Über Fenyx und das Team erfahren",
      },
      {
        label: "Ratgeber",
        href: "/ratgeber",
        sub: "Expertenwissen für nachhaltige Bürotransformationen und Kreislaufwirtschaft",
      },
      {
        label: "News & Medien",
        href: "/presse-medien",
        sub: "Aktuelle Unternehmensnews, Ankündigungen und Medienberichte",
      },
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
