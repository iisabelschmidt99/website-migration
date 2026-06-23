// Einladung neuer Nutzer per Supabase Admin-API (nur für eingeloggte Admins).
// Node-Runtime: Service-Role-Key darf nicht auf Edge laufen.
//
// Produktion (Netlify): SUPABASE_SERVICE_ROLE_KEY als server-seitige Env-Variable
// setzen — NICHT NEXT_PUBLIC, nicht im Client-Bundle. Lokal in .env.local.
import { NextResponse } from "next/server";
import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type UserRole = "admin" | "editor" | "viewer";

const VALID_ROLES: UserRole[] = ["admin", "editor", "viewer"];

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht angemeldet.", status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Kein Zugriff (nur Admins).", status: 403 as const };
  }

  return { user };
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY oder URL fehlt.");
  }

  return createServiceClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function setProfileRole(
  adminClient: SupabaseClient,
  userId: string,
  email: string,
  role: UserRole,
) {
  // Trigger legt Profil mit viewer an; kurz warten, dann Rolle setzen.
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data: existing } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await adminClient
        .from("profiles")
        .update({ role })
        .eq("id", userId);
      if (error) throw error;
      return;
    }

    await new Promise((r) => setTimeout(r, 150));
  }

  // Fallback: Profil direkt anlegen/aktualisieren
  const { error } = await adminClient.from("profiles").upsert({
    id: userId,
    email,
    role,
  });
  if (error) throw error;
}

export async function POST(req: Request) {
  const auth = await assertAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const role = body.role as UserRole;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Gültige E-Mail angeben." }, { status: 400 });
  }

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Ungültige Rolle." }, { status: 400 });
  }

  try {
    const adminClient = getServiceClient();
    const origin = req.headers.get("origin") ?? new URL(req.url).origin;

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/passwort-festlegen`,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return NextResponse.json(
          { error: "Diese E-Mail ist bereits registriert." },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const invitedUser = data.user;
    if (!invitedUser?.id) {
      return NextResponse.json({ error: "Einladung ohne Nutzer-ID." }, { status: 500 });
    }

    await setProfileRole(adminClient, invitedUser.id, email, role);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
