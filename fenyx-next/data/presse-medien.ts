import presseRaw from "./presse-medien.generated.json";

export type PresseNewsItem = {
  slug: string;
  title: string;
  meta: { title: string; description: string };
  imageSrc: string;
  paragraphs: string[];
  href?: string;
};

export const presseMedienMeta = presseRaw.meta;

export const presseNewsItems = presseRaw.news as PresseNewsItem[];

export function getPresseNewsItem(slug: string) {
  return presseNewsItems.find((item) => item.slug === slug);
}

export function getAllPresseNewsSlugs() {
  return presseNewsItems.map((item) => item.slug);
}

export function getPresseExcerpt(item: PresseNewsItem) {
  return item.paragraphs[0]?.slice(0, 180) ?? "";
}
