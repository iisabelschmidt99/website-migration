// Hilfsfunktionen für Supabase-Auth-Links mit URL-Hash (#access_token=…).

export type AuthHashType = "invite" | "recovery" | "signup" | "magiclink" | "unknown";

export function readUrlHashParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.hash.replace(/^#/, ""));
}

export function readHashTokens(): { access_token: string; refresh_token: string } | null {
  const params = readUrlHashParams();
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return null;
  return { access_token, refresh_token };
}

export function readAuthHashType(
  hashParams: URLSearchParams,
  searchParams?: URLSearchParams,
): AuthHashType {
  const type = hashParams.get("type") ?? searchParams?.get("type") ?? null;
  if (type === "invite" || type === "signup") return "invite";
  if (type === "recovery" || type === "magiclink") return "recovery";
  return "unknown";
}

export function clearUrlHash() {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}
