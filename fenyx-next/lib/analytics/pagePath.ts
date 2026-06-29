import { sanitizePagePath } from "./sanitize";

export function buildTrackedPagePath(pathname: string, search: string): string {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return sanitizePagePath(query ? `${pathname}?${query}` : pathname);
}
