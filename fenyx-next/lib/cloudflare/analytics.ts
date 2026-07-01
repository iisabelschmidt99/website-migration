export const CLOUDFLARE_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";

/** AI/search crawler user-agent substrings (Cloudflare bot reference). */
export const AI_CRAWLER_UA_PATTERNS = [
  "Googlebot-Image",
  "Google-CloudVertexBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "meta-externalagent",
  "meta-externalfetcher",
  "MistralAI-User",
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "Bytespider",
  "CCBot",
  "Googlebot",
  "BingBot",
  "bingbot",
  "Amazonbot",
  "Applebot",
  "PetalBot",
  "FacebookBot",
  "DuckAssistBot",
  "Cohere-ai",
  "anthropic-ai",
  "Novellum",
  "Anchor",
  "archive.org",
];

const DISPLAY_MERGE: Record<string, string> = { "Googlebot-Image": "Googlebot" };

export const OPERATOR_TO_UA_PATTERNS: Record<string, string[]> = {
  OpenAI: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
  Anthropic: ["ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai"],
  Perplexity: ["PerplexityBot", "Perplexity-User"],
  Google: ["Googlebot", "Googlebot-Image", "Google-CloudVertexBot"],
  Microsoft: ["BingBot", "bingbot"],
  ByteDance: ["Bytespider"],
  "Common Crawl": ["CCBot"],
  Amazon: ["Amazonbot"],
  Apple: ["Applebot"],
  Huawei: ["PetalBot"],
  Meta: ["Meta-ExternalAgent", "meta-externalagent", "meta-externalfetcher", "FacebookBot"],
  DuckDuckGo: ["DuckAssistBot"],
  Mistral: ["MistralAI-User"],
};

export const OPERATOR_MAP: Record<string, string> = {
  GPTBot: "OpenAI",
  "ChatGPT-User": "OpenAI",
  "OAI-SearchBot": "OpenAI",
  ClaudeBot: "Anthropic",
  "Claude-SearchBot": "Anthropic",
  "Claude-User": "Anthropic",
  PerplexityBot: "Perplexity",
  "Perplexity-User": "Perplexity",
  Bytespider: "ByteDance",
  CCBot: "Common Crawl",
  Googlebot: "Google",
  "Googlebot-Image": "Google",
  "Google-CloudVertexBot": "Google",
  BingBot: "Microsoft",
  bingbot: "Microsoft",
  Amazonbot: "Amazon",
  Applebot: "Apple",
  PetalBot: "Huawei",
  "Meta-ExternalAgent": "Meta",
  "meta-externalagent": "Meta",
  FacebookBot: "Meta",
  DuckAssistBot: "DuckDuckGo",
  "MistralAI-User": "Mistral",
};

export const CATEGORY_MAP: Record<string, string> = {
  GPTBot: "AI Crawler",
  ClaudeBot: "AI Crawler",
  PerplexityBot: "AI Search",
  Bytespider: "AI Crawler",
  CCBot: "AI Crawler",
  Googlebot: "Search Engine",
  "Googlebot-Image": "Search Engine",
  BingBot: "Search Engine",
  bingbot: "Search Engine",
  Amazonbot: "AI Crawler",
  Applebot: "AI Search",
  PetalBot: "AI Crawler",
};

export function extractBotName(ua: string): string {
  const uaLower = ua.toLowerCase();
  const sorted = [...AI_CRAWLER_UA_PATTERNS].sort((a, b) => b.length - a.length);
  for (const pattern of sorted) {
    if (uaLower.includes(pattern.toLowerCase())) return pattern;
  }
  return ua.split(/[/\s]/)[0] || "Unknown";
}

export function displayBotName(bot: string): string {
  return DISPLAY_MERGE[bot] ?? bot;
}

export function buildCrawlerFilter(crawler?: string, operator?: string): Record<string, unknown> {
  const base: Record<string, unknown> = { requestSource: "eyeball" };
  if (crawler) {
    base.userAgent_like = `%${crawler}%`;
  } else if (operator && OPERATOR_TO_UA_PATTERNS[operator]) {
    const patterns = OPERATOR_TO_UA_PATTERNS[operator];
    base.OR = patterns.map((ua) => ({ userAgent_like: `%${ua}%` }));
  } else {
    base.OR = AI_CRAWLER_UA_PATTERNS.map((ua) => ({ userAgent_like: `%${ua}%` }));
  }
  return base;
}

export async function queryCloudflare(
  zoneId: string,
  token: string,
  query: string,
  variables?: Record<string, unknown>,
) {
  const res = await fetch(CLOUDFLARE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  }
  return json.data;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
