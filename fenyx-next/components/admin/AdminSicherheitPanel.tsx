"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSicherheitPanel() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [factors, setFactors] = useState<
    { id: string; friendly_name?: string; status: string }[]
  >([]);
  const [enrollUri, setEnrollUri] = useState<string | null>(null);
  const [enrollFactorId, setEnrollFactorId] = useState<string | null>(null);
  const [enrollCode, setEnrollCode] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshFactors = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }, []);

  useEffect(() => {
    void refreshFactors();
  }, [refreshFactors]);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword.length < 8) {
      setError("Passwort mindestens 8 Zeichen.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Passwort wurde geändert.");
    } finally {
      setLoading(false);
    }
  }

  async function startEnroll() {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Fenyx Backend",
      });
      if (enrollError) {
        setError(enrollError.message);
        return;
      }
      setEnrollFactorId(data.id);
      setEnrollUri(data.totp?.uri ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollFactorId) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({
        factorId: enrollFactorId,
      });
      if (cErr || !challenge) {
        setError(cErr?.message ?? "Challenge fehlgeschlagen.");
        return;
      }
      const { error: vErr } = await supabase.auth.mfa.verify({
        factorId: enrollFactorId,
        challengeId: challenge.id,
        code: enrollCode,
      });
      if (vErr) {
        setError(vErr.message);
        return;
      }
      setEnrollUri(null);
      setEnrollFactorId(null);
      setEnrollCode("");
      setMessage("Zwei-Faktor-Authentifizierung aktiviert.");
      await refreshFactors();
    } finally {
      setLoading(false);
    }
  }

  async function unenroll(factorId: string) {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: uErr } = await supabase.auth.mfa.unenroll({ factorId });
      if (uErr) {
        setError(uErr.message);
        return;
      }
      setMessage("MFA-Faktor entfernt.");
      await refreshFactors();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-heading mb-2">Sicherheit</h1>
        <p className="text-mist text-sm">
          Passwort ändern und Zwei-Faktor-Authentifizierung verwalten.
        </p>
      </div>

      {message ? <p className="text-sm text-green-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <section className="border border-white/10 p-6 space-y-4">
        <h2 className="text-lg font-heading">Passwort ändern</h2>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <input
            type="password"
            placeholder="Neues Passwort"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
          />
          <input
            type="password"
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider disabled:opacity-60"
          >
            Passwort speichern
          </button>
        </form>
      </section>

      <section className="border border-white/10 p-6 space-y-4">
        <h2 className="text-lg font-heading">Zwei-Faktor-Authentifizierung</h2>

        {factors.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {factors.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between border border-white/5 px-3 py-2"
              >
                <span>
                  {f.friendly_name ?? "TOTP"} —{" "}
                  <span className="text-mist">{f.status}</span>
                </span>
                {f.status === "verified" ? (
                  <button
                    type="button"
                    onClick={() => void unenroll(f.id)}
                    className="text-red-400 text-xs uppercase tracking-wider"
                  >
                    Entfernen
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-mist text-sm">Noch kein MFA-Faktor eingerichtet.</p>
        )}

        {!enrollUri ? (
          <button
            type="button"
            onClick={() => void startEnroll()}
            disabled={loading}
            className="px-4 py-2 border border-signal text-signal text-xs font-bold uppercase tracking-wider disabled:opacity-60"
          >
            MFA einrichten
          </button>
        ) : (
          <form onSubmit={confirmEnroll} className="space-y-3 max-w-sm">
            <div className="flex justify-center bg-white p-4 w-fit">
              <QRCodeSVG value={enrollUri} size={180} level="M" includeMargin />
            </div>
            <input
              inputMode="numeric"
              placeholder="6-stelliger Code"
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value)}
              className="w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider"
            >
              MFA aktivieren
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
