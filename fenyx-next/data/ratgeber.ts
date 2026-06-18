import ratgeberRaw from "./ratgeber.generated.json";

export type RatgeberArticle = {
  slug: string;
  title: string;
  meta: { title: string; description: string };
  imageSrc: string;
  paragraphs: string[];
};

export const ratgeberMeta = ratgeberRaw.meta;

export const ratgeberArticles = ratgeberRaw.articles as RatgeberArticle[];

export function getRatgeberArticle(slug: string) {
  return ratgeberArticles.find((article) => article.slug === slug);
}

export function getAllRatgeberSlugs() {
  return ratgeberArticles.map((article) => article.slug);
}

export function getRatgeberExcerpt(article: RatgeberArticle) {
  return article.paragraphs[0]?.slice(0, 180) ?? "";
}
