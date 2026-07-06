import { NextResponse } from "next/server";

// Nimmt die Formular-Einsendung (Variante B / Survey-Wizard) entgegen und
// leitet sie serverseitig an den n8n-Webhook „Flow 1" weiter. Die n8n-URL
// bleibt so geheim (Server-Env), der Endpoint ist nicht offen im Client.

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 500 },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: wenn ein verstecktes Feld gefüllt ist, still „ok" antworten.
  if (data && (data as Record<string, unknown>)._hp) {
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
