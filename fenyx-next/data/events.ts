import eventsRaw from "./events.generated.json";

export type EventItem = {
  slug: string;
  href: string;
  title: string;
  dateLabel: string;
  description: string;
  location: string;
  tag: string;
  imageSrc: string;
  meta: { title: string; description: string };
  paragraphs: string[];
};

export const eventsMeta = eventsRaw.meta;
export const eventsHero = eventsRaw.hero;
export const eventsList = eventsRaw.events as EventItem[];

export function getEvent(slug: string) {
  return eventsList.find((event) => event.slug === slug);
}

export function getAllEventSlugs() {
  return eventsList.map((event) => event.slug);
}
