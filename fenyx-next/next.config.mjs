/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "vz-248cf2fb-ed4.b-cdn.net" },
    ],
  },
  async redirects() {
    const citySlugs = [
      "berlin",
      "bonn",
      "braunschweig",
      "bremen",
      "dortmund",
      "dresden",
      "duesseldorf",
      "essen",
      "frankfurt",
      "hamburg",
      "hannover",
      "karlsruhe",
      "koeln",
      "leipzig",
      "mainz",
      "mannheim",
      "muenchen",
      "nuernberg",
      "stuttgart",
      "wien",
      "zuerich",
    ];

    const cityRedirects = citySlugs.flatMap((stadt) => [
      {
        source: `/bueromoebel-mieten/${stadt}`,
        destination: `/einrichtung/bueromoebel-mieten/${stadt}`,
        permanent: true,
      },
      {
        source: `/bueroeinrichtung-standort/${stadt}`,
        destination: `/einrichtung/bueroeinrichtung/${stadt}`,
        permanent: true,
      },
    ]);

    return [
      { source: "/digitale-inventarisierung", destination: "/bestandsmanagement/digitale-inventarisierung", permanent: true },
      { source: "/projektmanagement", destination: "/bestandsmanagement/projektmanagement", permanent: true },
      { source: "/bueroaufloesung", destination: "/verwertung/bueroaufloesung", permanent: true },
      { source: "/mitarbeiterverkauf", destination: "/verwertung/mitarbeiterverkauf", permanent: true },
      { source: "/spende", destination: "/verwertung/spende", permanent: true },
      { source: "/aufbereitung", destination: "/verwertung/aufbereitung", permanent: true },
      { source: "/bueroeinrichtung", destination: "/einrichtung/bueroeinrichtung", permanent: true },
      { source: "/workspace-analytics", destination: "/einrichtung/workspace-analytics", permanent: true },
      { source: "/bueromoebel-mieten", destination: "/einrichtung/bueromoebel-mieten", permanent: true },
      { source: "/grossunternehmen", destination: "/fenyx-fuer-sie/grossunternehmen", permanent: true },
      { source: "/mittelstand", destination: "/fenyx-fuer-sie/mittelstand", permanent: true },
      { source: "/start-up-scale-up", destination: "/fenyx-fuer-sie/start-up-scale-up", permanent: true },
      { source: "/co-working-space", destination: "/fenyx-fuer-sie/co-working-space", permanent: true },
      {
        source: "/news/:slug",
        destination: "/presse-medien/:slug",
        permanent: true,
      },
      ...cityRedirects,
    ];
  },
};

export default nextConfig;
