import { NextRequest, NextResponse } from "next/server";
import { assertAnalyticsApiAuth } from "@/lib/admin/assertAnalyticsApiAuth";

export const runtime = "nodejs";

const CF_API = "https://api.cloudflare.com/client/v4";
const AI_CRAWL_BLOCK_PREFIX = "AI Crawl Control: Block ";

async function cfRequest(
  zoneId: string,
  token: string,
  method: string,
  path: string,
  body?: unknown,
) {
  const url = `${CF_API}/zones/${zoneId}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.[0]?.message || json.errors?.[0]?.error || JSON.stringify(json.errors);
    throw new Error(`Cloudflare API: ${msg}`);
  }
  return json.result;
}

async function getRules(zoneId: string, token: string) {
  const result = await cfRequest(
    zoneId,
    token,
    "GET",
    "/rulesets/phases/http_request_firewall_custom/entrypoint",
  );
  return result as { id: string; rules?: Array<{ id: string; description?: string }> };
}

export async function POST(request: NextRequest) {
  try {
    const auth = await assertAnalyticsApiAuth();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    if (!cloudflareToken || !zoneId) {
      return NextResponse.json({ error: "Cloudflare API nicht konfiguriert." }, { status: 503 });
    }

    const body = await request.json();
    const crawler = typeof body?.crawler === "string" ? body.crawler.trim() : null;
    const action = body?.action === "block" ? "block" : body?.action === "allow" ? "allow" : null;

    if (!crawler || !action) {
      return NextResponse.json(
        { error: "crawler und action (allow|block) erforderlich." },
        { status: 400 },
      );
    }

    const ruleset = await getRules(zoneId, cloudflareToken);
    const rulesetId = ruleset.id;
    const rules = ruleset.rules ?? [];
    const blockDesc = `${AI_CRAWL_BLOCK_PREFIX}${crawler}`;
    const existingRule = rules.find((r) => r.description === blockDesc);

    if (action === "block") {
      if (existingRule) {
        return NextResponse.json({ ok: true, message: "Bereits blockiert." });
      }
      await cfRequest(zoneId, cloudflareToken, "POST", `/rulesets/${rulesetId}/rules`, {
        description: blockDesc,
        expression: `http.user_agent contains "${crawler}"`,
        action: "block",
        action_parameters: { response_code: 403 },
      });
      return NextResponse.json({ ok: true, message: "Crawler blockiert." });
    }

    if (action === "allow") {
      if (!existingRule) {
        return NextResponse.json({ ok: true, message: "Bereits erlaubt." });
      }
      await cfRequest(
        zoneId,
        cloudflareToken,
        "DELETE",
        `/rulesets/${rulesetId}/rules/${existingRule.id}`,
      );
      return NextResponse.json({ ok: true, message: "Crawler erlaubt." });
    }

    return NextResponse.json({ error: "Ungültige Aktion." }, { status: 400 });
  } catch (err) {
    console.error("Cloudflare crawler action error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Interner Serverfehler." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const auth = await assertAnalyticsApiAuth();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    if (!cloudflareToken || !zoneId) {
      return NextResponse.json({ error: "Cloudflare nicht konfiguriert." }, { status: 503 });
    }

    const ruleset = await getRules(zoneId, cloudflareToken);
    const rules = ruleset.rules ?? [];
    const blocked = rules
      .filter((r) => r.description?.startsWith(AI_CRAWL_BLOCK_PREFIX))
      .map((r) => r.description!.slice(AI_CRAWL_BLOCK_PREFIX.length));

    return NextResponse.json({ blocked });
  } catch (err) {
    console.error("Cloudflare blocked list error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Interner Serverfehler." },
      { status: 500 },
    );
  }
}
