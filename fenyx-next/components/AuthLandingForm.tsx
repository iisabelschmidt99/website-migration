"use client";

// Zwischenseite für Einladungs-/Recovery-Links (Lumeus-Muster).
// E-Mail-Scanner (SafeLinks, Proofpoint …) rufen Links per GET auf und
// verbrauchen Single-Use-Tokens. Hier wird erst nach Klick weitergeleitet.
// In Supabase unter Authentication → URL Configuration muss
// …/auth/landing freigegeben sein.
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  readAuthHashType,
  readUrlHashParams,
  type AuthHashType,
} from "@/lib/auth/hashTokens";

const COPY: Record<
  AuthHashType,
  { title: string; description: string; button: string }
> = {
  invite: {
    title: "Einladung bestätigen",
    description:
      "Du wurdest zum FENYX-Backend eingeladen. Klicke auf den Button, um dein Passwort festzulegen.",
    button: "Passwort festlegen",
  },
  recovery: {
    title: "Passwort zurücksetzen",
    description:
      "Klicke auf den Button, um ein neues Passwort für dein Backend-Konto zu vergeben.",
    button: "Weiter zum Passwort",
  },
  signup: {
    title: "Konto aktivieren",
    description: "Klicke auf den Button, um dein Passwort festzulegen.",
    button: "Passwort festlegen",
  },
  magiclink: {
    title: "Anmeldung fortsetzen",
    description: "Klicke auf den Button, um fortzufahren.",
    button: "Weiter",
  },
  unknown: {
    title: "Link bestätigen",
    description: "Klicke auf den Button, um fortzufahren.",
    button: "Weiter",
  },
};

export default function AuthLandingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<AuthHashType>("unknown");

  useEffect(() => {
    const hash = window.location.hash;
    const hashParams = readUrlHashParams();
    const type = readAuthHashType(hashParams, searchParams);
    setLinkType(type);

    const next = searchParams.get("next");
    if (next) {
      setDestination(next + hash);
      return;
    }

    if (!hash) {
      setDestination(null);
      return;
    }

    if (type === "recovery" || type === "magiclink") {
      setDestination(`/passwort-festlegen${hash}`);
    } else {
      setDestination(`/passwort-festlegen${hash}`);
    }
  }, [searchParams]);

  function handleContinue() {
    if (!destination) {
      router.push("/admin/login");
      return;
    }
    window.location.href =
      destination.startsWith("/")
        ? window.location.origin + destination
        : destination;
  }

  const copy = COPY[linkType === "signup" ? "invite" : linkType] ?? COPY.unknown;

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
          <h1 className="text-white text-xl font-heading">{copy.title}</h1>
          <p className="text-mist text-sm">{copy.description}</p>

          {destination ? (
            <>
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition"
              >
                {copy.button}
              </button>

              <div className="border border-white/10 bg-abyss-deep/80 p-4 space-y-1">
                <p className="text-white text-xs font-bold uppercase tracking-[0.08em]">
                  Warum dieser Zwischenschritt?
                </p>
                <p className="text-mist text-xs leading-relaxed">
                  E-Mail-Sicherheitsprogramme öffnen Links automatisch und würden
                  sonst den Einmal-Link verbrauchen, bevor du klickst.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-mist text-sm">
                Dieser Link ist ungültig oder unvollständig. Bitte fordere eine neue
                Einladung an.
              </p>
              <button
                type="button"
                onClick={() => router.push("/admin/login")}
                className="w-full py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.12em] hover:border-signal/50 transition"
              >
                Zum Backend-Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
