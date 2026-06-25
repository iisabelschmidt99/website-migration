"use client";

// Passwort setzen nach Klick auf /auth/landing (Hash wird hier per setSession übernommen).
// Supabase Redirect URLs: …/auth/landing und …/passwort-festlegen freigeben.
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { clearUrlHash, readHashTokens } from "@/lib/auth/hashTokens";

type LinkType = "invite" | "recovery";

function isSupportedType(value: string | null): value is LinkType {
  return value === "invite" || value === "recovery";
}

export default function PasswortFestlegenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);

  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const authCode = searchParams.get("code");
  const otpType = useMemo(
    () => (isSupportedType(typeParam) ? typeParam : null),
    [typeParam],
  );

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      setError(null);
      setLinkInvalid(false);
      setReady(false);

      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (errorParam) {
        if (!cancelled) {
          setError(errorDescription ?? errorParam);
          setLinkInvalid(true);
          setReady(true);
        }
        return;
      }

      let supabase;
      try {
        supabase = createClient();
      } catch {
        if (!cancelled) {
          setError("Backend nicht konfiguriert – Supabase-Umgebungsvariablen fehlen.");
          setLinkInvalid(true);
          setReady(true);
        }
        return;
      }

      const hashTokens = readHashTokens();
      if (hashTokens) {
        const { error: sessionError } = await supabase.auth.setSession(hashTokens);
        if (sessionError) {
          if (!cancelled) {
            setError(sessionError.message);
            setLinkInvalid(true);
            setReady(true);
          }
          return;
        }
        clearUrlHash();
        if (!cancelled) {
          setReady(true);
          setLinkInvalid(false);
        }
        return;
      }

      if (authCode) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
        if (exchangeError) {
          if (!cancelled) {
            setLinkInvalid(true);
            setReady(true);
          }
          return;
        }
        if (!cancelled) {
          setReady(true);
          setLinkInvalid(false);
        }
        return;
      }

      if (tokenHash && otpType) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });
        if (verifyError) {
          if (!cancelled) {
            setLinkInvalid(true);
            setReady(true);
          }
          return;
        }
        if (!cancelled) {
          setReady(true);
          setLinkInvalid(false);
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!cancelled) {
        if (session) {
          setReady(true);
          setLinkInvalid(false);
        } else {
          setLinkInvalid(true);
          setReady(true);
        }
      }
    }

    initSession();
    return () => {
      cancelled = true;
    };
  }, [authCode, otpType, searchParams, tokenHash]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Bitte E-Mail-Adresse eingeben.");
      return;
    }

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Backend nicht konfiguriert – Supabase-Umgebungsvariablen fehlen.");
      return;
    }

    setResendLoading(true);
    setError(null);

    const { error: resendError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/landing`,
    });

    setResendLoading(false);

    if (resendError) {
      setError("Link konnte nicht gesendet werden. Bitte später erneut versuchen.");
      return;
    }

    setResendSuccess(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== passwordRepeat) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Backend nicht konfiguriert – Supabase-Umgebungsvariablen fehlen.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Passwort konnte nicht gesetzt werden. Bitte Link erneut anfordern.");
      return;
    }

    await supabase.auth.signOut();

    setSuccess("Passwort gespeichert. Du wirst zum Login weitergeleitet …");
    setTimeout(() => {
      router.replace("/admin/login");
      router.refresh();
    }, 700);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/fenyx-logo-header.png"
            alt="FENYX"
            width={110}
            height={24}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>

        <div className="bg-abyss border border-white/10 p-8 space-y-5">
          <h1 className="text-white text-xl font-heading mb-2">Passwort festlegen</h1>

          {!ready ? (
            <p className="text-mist text-sm">Link wird geprüft …</p>
          ) : linkInvalid ? (
            <div className="space-y-4">
              <p className="text-mist text-sm">
                Dieser Link ist ungültig oder abgelaufen. Fordere einen neuen Link an
                oder bitte einen Administrator um eine neue Einladung.
              </p>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}

              {resendSuccess ? (
                <p className="text-sm text-signal">
                  Neuer Link wurde gesendet. Bitte Posteingang prüfen und über die
                  Zwischenseite fortfahren.
                </p>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <div>
                    <label className="block text-mist text-sm mb-1.5" htmlFor="resend-email">
                      E-Mail
                    </label>
                    <input
                      id="resend-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.12em] hover:border-signal/50 transition disabled:opacity-60"
                  >
                    {resendLoading ? "Senden …" : "Neuen Link anfordern"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-mist text-sm mb-1.5" htmlFor="password">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
                />
              </div>

              <div>
                <label className="block text-mist text-sm mb-1.5" htmlFor="password-repeat">
                  Passwort wiederholen
                </label>
                <input
                  id="password-repeat"
                  type="password"
                  required
                  minLength={8}
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-signal">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60"
              >
                {loading ? "Speichern …" : "Passwort speichern"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
