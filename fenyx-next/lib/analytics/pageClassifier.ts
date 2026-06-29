import type { TrackingContext } from "./types";

const CITY_RE = /\/(berlin|bonn|braunschweig|bremen|dortmund|dresden|duesseldorf|essen|frankfurt|hamburg|hannover|karlsruhe|koeln|leipzig|mainz|mannheim|muenchen|nuernberg|stuttgart|wien|zuerich)$/;

export function classifyPage(pathname: string): TrackingContext {
  if (pathname === "/") return { page_type: "home", contact_person: "anina" };
  if (pathname === "/kontakt") return { page_type: "contact", contact_person: "anina" };
  if (["/impressum", "/datenschutz", "/agb", "/events-teilnahmebedingungen-datenschutz"].includes(pathname)) {
    return { page_type: "legal" };
  }
  if (pathname.startsWith("/bestandsmanagement")) {
    return {
      page_type: pathname === "/bestandsmanagement" ? "service_hub" : "service_detail",
      service_area: pathname.includes("digitale-inventarisierung")
        ? "digitale_inventarisierung"
        : pathname.includes("projektmanagement")
          ? "projektmanagement"
          : "bestandsmanagement",
      contact_person: "anina",
    };
  }
  if (pathname.startsWith("/verwertung/")) {
    return {
      page_type: "service_detail",
      service_area: pathname.split("/").at(-1)?.replaceAll("-", "_"),
      contact_person: "thomas",
    };
  }
  if (
    /^\/(bueroaufloesung-at|bueroaufloesung-ch|bueroaufloesung-kosteneffizient|standortaufloesung-luzern|standortauflosung-vtg)$/.test(
      pathname,
    )
  ) {
    const city = pathname.includes("luzern") ? "luzern" : undefined;
    return {
      page_type: "campaign_lp",
      service_area: "bueroaufloesung",
      city,
      contact_person: "thomas",
    };
  }
  if (pathname === "/ankauf" || pathname === "/ankauf-designermoebel") {
    return { page_type: "service_detail", service_area: "ankauf", contact_person: "thomas" };
  }
  if (pathname.startsWith("/einrichtung/bueroeinrichtung/")) {
    return {
      page_type: "city_einrichtung",
      service_area: "bueroeinrichtung",
      city: pathname.match(CITY_RE)?.[1],
      contact_person: "marius",
    };
  }
  if (pathname.startsWith("/einrichtung/bueromoebel-mieten/")) {
    return {
      page_type: "city_mieten",
      service_area: "bueromoebel_mieten",
      city: pathname.match(CITY_RE)?.[1],
      contact_person: "marius",
    };
  }
  if (pathname.startsWith("/einrichtung/")) {
    return {
      page_type: "service_detail",
      service_area: pathname.split("/").at(-1)?.replaceAll("-", "_"),
      contact_person: "marius",
    };
  }
  if (pathname.startsWith("/fenyx-fuer-sie/")) {
    return {
      page_type: "audience",
      audience: pathname.split("/").at(-1)?.replaceAll("-", "_"),
      contact_person: "marius",
    };
  }
  if (pathname === "/referenzen") return { page_type: "reference_list", contact_person: "anina" };
  if (pathname.startsWith("/referenzen/")) return { page_type: "reference_detail", contact_person: "anina" };
  if (pathname === "/events") return { page_type: "event_list", contact_person: "anina" };
  if (pathname === "/in-house-events") {
    return { page_type: "event_list", contact_person: "anina" };
  }
  if (pathname.startsWith("/events/")) {
    return { page_type: "event_detail", contact_person: "anina" };
  }
  if (pathname === "/ratgeber") return { page_type: "article_list" };
  if (pathname.startsWith("/ratgeber/")) return { page_type: "article_detail" };
  if (pathname === "/presse-medien") return { page_type: "press_list" };
  if (pathname.startsWith("/presse-medien/")) return { page_type: "press_detail" };
  if (pathname === "/ueber-uns") return { page_type: "about", contact_person: "anina" };
  if (pathname === "/standorte") return { page_type: "locations", contact_person: "anina" };
  return {};
}
