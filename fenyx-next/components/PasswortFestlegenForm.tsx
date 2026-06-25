"use client";

// Öffentliche Seite zum Setzen eines Passworts nach Einladungs-/Recovery-Link.
// Wichtig: In Supabase unter Authentication -> URL Configuration müssen
// .../passwort-festlegen URLs als Redirect URLs freigegeben sein
// (lokal und Produktion), sonst kommt der Link nicht hier an.
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type LinkType = "invite" | "recovery";

function isSupportedType(value: string | null): value is LinkType {
  return value === "invite" || value === "recovery";
}

export default function PasswortFestlegenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

      if (tokenHash) {
        if (!otpType) {
          if (!cancelled) {
            setLinkInvalid(true);
            setReady(true);
          }
          return;
        }

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

      // Fallback: Supabase legt Session oft per URL-Hash an (Implicit-Flow).
      const { data: initialSession } = await supabase.auth.getSession();
      if (initialSession.session) {
        if (!cancelled) {
          setReady(true);
          setLinkInvalid(false);
        }
        return;
      }

      const sessionFromAuthEvent = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 8000);
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            clearTimeout(timeout);
            subscription.unsubscribe();
            resolve(true);
          }
        });
      });

      if (sessionFromAuthEvent) {
        if (!cancelled) {
          setReady(true);
          setLinkInvalid(false);
        }
        return;
      }

      for (let attempt = 0; attempt < 12; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (!cancelled) {
            setReady(true);
            setLinkInvalid(false);
          }
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      if (!cancelled) {
        setLinkInvalid(true);
        setReady(true);
      }
    }

    initSession();
    return () => {
      cancelled = true;
    };
  }, [authCode, otpType, searchParams, tokenHash]);

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

    setSuccess("Passwort gespeichert. Du wirst zum Backend weitergeleitet …");
    setTimeout(() => {
      router.replace("/admin");
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
            <div className="space-y-2">
              <p className="text-mist text-sm">
                Dieser Link ist ungültig oder abgelaufen. Bitte eine neue Einladung anfordern.
              </p>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
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
