import legalRaw from "./legal.generated.json";

export type LegalBlock = {
  type: "h2" | "h3" | "h4" | "p" | "li";
  text: string;
};

export type LegalPageData = {
  title: string;
  meta: { title: string; description: string };
  blocks: LegalBlock[];
};

export const legalPages = legalRaw as Record<string, LegalPageData>;

export function getLegalPage(slug: keyof typeof legalPages) {
  return legalPages[slug];
}
