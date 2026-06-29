import type { DeviceType } from "./types";

export type IdentityEnv = {
  SALT_SECRET?: string;
};

export function wantsPrivacyOptOut(request: Request): boolean {
  return request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1";
}

export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "";
  return "";
}

export function truncateIp(ip: string): string {
  if (!ip) return "";
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":");
  const octets = ip.split(".");
  if (octets.length === 4) return `${octets[0]}.${octets[1]}.${octets[2]}.0`;
  return ip;
}

export function reduceUserAgent(userAgent: string): string {
  const ua = userAgent.slice(0, 512);
  const edge = ua.match(/Edg\/(\d+)/);
  if (edge) return `Edge/${edge[1]}`;
  const chrome = ua.match(/Chrome\/(\d+)/);
  if (chrome) return `Chrome/${chrome[1]}`;
  const safari = ua.match(/Version\/(\d+).*Safari/);
  if (safari) return `Safari/${safari[1]}`;
  const firefox = ua.match(/Firefox\/(\d+)/);
  if (firefox) return `Firefox/${firefox[1]}`;
  return ua.split(" ")[0] ?? "unknown";
}

function utcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function deriveSessionHash(
  request: Request,
  env: IdentityEnv,
  host: string,
): Promise<string | null> {
  if (wantsPrivacyOptOut(request)) return null;
  if (!env.SALT_SECRET) return null;

  const ip = truncateIp(getClientIp(request));
  const ua = reduceUserAgent(request.headers.get("user-agent") ?? "");
  const dailySalt = await hmacSha256Hex(env.SALT_SECRET, utcDateKey());
  const hash = await sha256Hex(`${dailySalt}|${ip}|${ua}|${host}`);
  return hash.slice(0, 16);
}

export function detectDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|kindle|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua)) return "mobile";
  if (!ua) return "unknown";
  return "desktop";
}

export function classifyTraffic(input: {
  utm_source?: string | null;
  utm_medium?: string | null;
  referrer_host?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}): string {
  if (input.gclid) return "paid_search";
  if (input.fbclid) return "paid_social";
  const medium = (input.utm_medium ?? "").toLowerCase();
  if (input.utm_source) {
    if (/(cpc|ppc|paid|sem)/.test(medium)) return "paid_search";
    if (/social/.test(medium)) return "organic_social";
    if (/email/.test(medium)) return "email";
    return "campaign";
  }
  const ref = (input.referrer_host ?? "").toLowerCase();
  if (!ref) return "direct";
  if (/(google|bing|duckduckgo|ecosia|yahoo)/.test(ref)) return "organic_search";
  if (/(facebook|instagram|linkedin|tiktok|x\.com|twitter)/.test(ref)) {
    return "organic_social";
  }
  if (/(chatgpt|perplexity|claude|gemini|copilot)/.test(ref)) return "ai_referral";
  return "referral";
}
