"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin";
  const mfaOnly = params.get("mfa") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword(
        { email, password },
      );

      if (signInError) {
        setError("Login fehlgeschlagen – bitte E-Mail und Passwort prüfen.");
        return;
      }

      const totp = data.user?.factors?.find((f) => f.factor_type === "totp");
      if (totp) {
        const { data: challenge, error: challengeError } =
          await supabase.auth.mfa.challenge({ factorId: totp.id });
        if (challengeError || !challenge) {
          setError(challengeError?.message ?? "MFA-Challenge fehlgeschlagen.");
          return;
        }
        setFactorId(totp.id);
        setChallengeId(challenge.id);
        return;
      }

      router.replace(redirect);
      router.refresh();
    } catch {
      setError("Backend nicht konfiguriert – Supabase-Umgebungsvariablen fehlen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMfaVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId || !challengeId) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: mfaCode,
      });
      if (verifyError) {
        setError("Ungültiger Code – bitte erneut versuchen.");
        return;
      }
      router.replace(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function startMfaFromSession() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.find((f) => f.status === "verified");
      if (!totp) {
        setError("Kein MFA-Faktor – bitte mit Passwort anmelden.");
        return;
      }
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: totp.id });
      if (challengeError || !challenge) {
        setError(challengeError?.message ?? "MFA-Challenge fehlgeschlagen.");
        return;
      }
      setFactorId(totp.id);
      setChallengeId(challenge.id);
    } finally {
      setLoading(false);
    }
  }

  const showMfaStep = Boolean(factorId && challengeId);

  return (
    <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/fenyx-logo-white.png"
            alt="FENYX"
            width={110}
            height={24}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>
        <div className="bg-abyss border border-white/10 p-8 space-y-5">
          <h1 className="text-white text-xl font-heading mb-2">Backend-Login</h1>

          {mfaOnly && !showMfaStep ? (
            <div className="space-y-4">
              <p className="text-mist text-sm">
                MFA-Bestätigung erforderlich. Session aktiv? Code eingeben oder
                neu anmelden.
              </p>
              <button
                type="button"
                onClick={() => void startMfaFromSession()}
                disabled={loading}
                className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] disabled:opacity-60"
              >
                MFA-Code eingeben
              </button>
            </div>
          ) : null}

          {!showMfaStep && !mfaOnly ? (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-mist text-sm mb-1.5" htmlFor="email">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-mist text-sm mb-1.5"
                  htmlFor="password"
                >
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60"
              >
                {loading ? "Anmelden …" : "Anmelden"}
              </button>
            </form>
          ) : null}

          {showMfaStep ? (
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <p className="text-mist text-sm">
                6-stelligen Code aus der Authenticator-App eingeben.
              </p>
              <input
                inputMode="numeric"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] disabled:opacity-60"
              >
                {loading ? "Prüfen …" : "Code bestätigen"}
              </button>
            </form>
          ) : null}

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
