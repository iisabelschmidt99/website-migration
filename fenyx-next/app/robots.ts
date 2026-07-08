import type { MetadataRoute } from "next";

// robots.txt: alles crawlbar außer Backend/API/interne Auth-Seiten.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/passwort-festlegen", "/passwort-vergessen"],
    },
    sitemap: "https://www.fenyx-office.com/sitemap.xml",
    host: "https://www.fenyx-office.com",
  };
}
