// Nutzer anlegen / einladen (RBAC-aware, schreibt user_roles).
// Node-Runtime: Service-Role-Key darf nicht auf Edge laufen.
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { assertBenutzerApiAuth } from "@/lib/admin/adminApiAuth";
import { assignStaffRole } from "@/lib/admin/assignStaffRole";
import type { AssignableRole } from "@/lib/admin/accessControlModel";
import { ORDERED_ACCESS_PRESET_ROLES } from "@/lib/admin/accessControlModel";
import { generateFriendlyPassword } from "@/lib/admin/generateFriendlyPassword";
import { isResendConfigured } from "@/lib/admin/resendConfig";
import { sendStaffCredentialsEmail } from "@/lib/admin/staffCredentialsEmail";

export const runtime = "nodejs";

type InviteBody = {
  mode?: "invite";
  email?: string;
  role?: string;
};

type CreateBody = {
  mode: "create";
  email?: string;
  role?: string;
  password?: string;
  generatePassword?: boolean;
  sendEmail?: boolean;
  emailConfirmed?: boolean;
};

type UsersBody = InviteBody | CreateBody;

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

function parseRole(raw: string | undefined): AssignableRole | null {
  if (!raw) return null;
  return ORDERED_ACCESS_PRESET_ROLES.includes(raw as AssignableRole)
    ? (raw as AssignableRole)
    : null;
}

function isEmailExistsError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("already") ||
    m.includes("registered") ||
    m.includes("exists") ||
    m.includes("email_exists")
  );
}

async function waitForProfile(
  adminClient: ReturnType<typeof getServiceClient>,
  userId: string,
) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (data) return;
    await new Promise((r) => setTimeout(r, 150));
  }
}

export async function GET() {
  return NextResponse.json({
    resendConfigured: isResendConfigured(),
  });
}

export async function POST(req: Request) {
  let body: UsersBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const mode = body.mode ?? "invite";
  const email = body.email?.trim().toLowerCase();
  const role = parseRole(body.role);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Gültige E-Mail angeben." }, { status: 400 });
  }

  if (!role) {
    return NextResponse.json({ error: "Ungültige Rolle." }, { status: 400 });
  }

  const auth = await assertBenutzerApiAuth(role);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const adminClient = getServiceClient();
    const origin = req.headers.get("origin") ?? new URL(req.url).origin;

    if (mode === "invite") {
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/auth/landing`,
      });

      if (error) {
        if (isEmailExistsError(error.message)) {
          return NextResponse.json(
            {
              error:
                "Diese E-Mail ist bereits registriert. Nutze „Bestehendem Nutzer Zugang geben“.",
            },
            { status: 409 },
          );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const invitedUser = data.user;
      if (!invitedUser?.id) {
        return NextResponse.json({ error: "Einladung ohne Nutzer-ID." }, { status: 500 });
      }

      await waitForProfile(adminClient, invitedUser.id);
      await assignStaffRole(adminClient, invitedUser.id, role);

      return NextResponse.json({ ok: true, mode: "invite" });
    }

    if (mode === "create") {
      const createBody = body as CreateBody;

      if (createBody.sendEmail && !isResendConfigured()) {
        return NextResponse.json(
          { error: "E-Mail-Versand ist nicht konfiguriert (RESEND_API_KEY fehlt)." },
          { status: 503 },
        );
      }

      const finalPassword = createBody.generatePassword
        ? generateFriendlyPassword()
        : createBody.password?.trim();

      if (!finalPassword) {
        return NextResponse.json({ error: "Passwort fehlt." }, { status: 400 });
      }

      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: createBody.emailConfirmed ?? true,
      });

      if (error) {
        if (isEmailExistsError(error.message)) {
          return NextResponse.json(
            {
              error:
                "Diese E-Mail ist bereits registriert. Nutze „Bestehendem Nutzer Zugang geben“.",
            },
            { status: 409 },
          );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const createdUser = data.user;
      if (!createdUser?.id) {
        return NextResponse.json({ error: "Nutzer ohne ID angelegt." }, { status: 500 });
      }

      await waitForProfile(adminClient, createdUser.id);
      await assignStaffRole(adminClient, createdUser.id, role);

      if (createBody.sendEmail) {
        await sendStaffCredentialsEmail({
          to: email,
          password: finalPassword,
          loginUrl: `${origin}/admin/login`,
        });
      }

      return NextResponse.json({
        ok: true,
        mode: "create",
        generatedPassword: createBody.generatePassword ? finalPassword : undefined,
        emailSent: Boolean(createBody.sendEmail),
      });
    }

    return NextResponse.json({ error: "Unbekannter Modus." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
