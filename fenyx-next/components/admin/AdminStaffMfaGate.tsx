"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";
import {
  isStaffRole,
  shouldEnforceAdminMfa,
} from "@/lib/admin/adminMfaPolicy";

function totpSecretFromUri(uri: string): string | null {
  try {
    return new URL(uri).searchParams.get("secret");
  } catch {
    return null;
  }
}

async function loadStaffRoles(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<string[]> {
  const { data: roleRows, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (!error && roleRows && roleRows.length > 0) {
    return roleRows.map((r) => r.role as string);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role ? [profile.role as string] : [];
}

export default function AdminStaffMfaGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<
    "loading" | "mfa_setup" | "ready" | "denied"
  >("loading");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");

  const runGate = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const roles = await loadStaffRoles(supabase, user.id);
      if (!roles.some(isStaffRole)) {
        setPhase("denied");
        return;
      }

      let requireMfa: boolean | null = null;
      const { data: settings, error: settingsError } = await supabase
        .from("user_admin_access_settings")
        .select("require_mfa")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!settingsError && settings) {
        requireMfa = settings.require_mfa;
      }

      const mfaRequired = shouldEnforceAdminMfa({ roles, requireMfa });
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verified = factors?.totp?.find((f) => f.status === "verified");

      if (mfaRequired) {
        if (!verified) {
          const { data: enroll, error } = await supabase.auth.mfa.enroll({
            factorType: "totp",
            friendlyName: "Fenyx Backend",
          });
          if (error) {
            console.error(error);
            setPhase("denied");
            return;
          }
          setFactorId(enroll.id);
          setQrUri(enroll.totp?.uri ?? null);
          setPhase("mfa_setup");
          return;
        }

        const { data: aal } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.currentLevel !== "aal2") {
          router.replace("/admin/login?redirect=/admin&mfa=1");
          return;
        }
      }

      setPhase("ready");
    } catch (e) {
      console.error(e);
      setPhase("denied");
    }
  }, [router]);

  useEffect(() => {
    void runGate();
  }, [runGate]);

  async function verifyMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    const supabase = createClient();
    const { data: challenge, error } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (error || !challenge) return;
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: verifyCode,
    });
    if (verifyError) return;
    setPhase("ready");
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-abyss-deep">
        <p className="text-mist text-sm">Sitzung wird geprüft …</p>
      </div>
    );
  }

  if (phase === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4 text-center">
        <div className="max-w-sm">
          <h1 className="text-white text-xl font-heading mb-3">Kein Zugriff</h1>
          <p className="text-mist text-sm mb-6">
            Dein Konto hat keine Backend-Rolle oder die Sicherheitsprüfung ist
            fehlgeschlagen.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/admin/login")}
            className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider"
          >
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  if (phase === "mfa_setup") {
    const manualSecret = qrUri ? totpSecretFromUri(qrUri) : null;
    return (
      <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4">
        <div className="w-full max-w-md bg-abyss border border-white/10 p-8 space-y-5">
          <h1 className="text-white text-xl font-heading">
            Zwei-Faktor-Authentifizierung
          </h1>
          <p className="text-mist text-sm">
            QR-Code mit Authenticator-App scannen, dann den 6-stelligen Code
            eingeben.
          </p>
          {qrUri ? (
            <div className="flex justify-center bg-white p-4">
              <QRCodeSVG value={qrUri} size={200} level="M" includeMargin />
            </div>
          ) : null}
          {manualSecret ? (
            <p className="text-mist text-xs break-all">
              Manueller Schlüssel: <code className="text-white">{manualSecret}</code>
            </p>
          ) : null}
          <form onSubmit={verifyMfa} className="space-y-3">
            <input
              className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
              inputMode="numeric"
              placeholder="123456"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em]"
            >
              MFA bestätigen
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
