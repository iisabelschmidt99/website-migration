"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminPermissions } from "@/contexts/AdminPermissionsContext";
import { ADMIN_FEATURE } from "@/lib/admin/adminPermissionKeys";
import {
  type AssignableRole,
  ORDERED_ACCESS_PRESET_ROLES,
  getRoleLabel,
} from "@/lib/admin/accessControlModel";
import {
  buildStaffUserPayload,
  getInitialUserCreationState,
  validateUserCreationForm,
  type UserCreationFormState,
} from "@/lib/admin/userCreationModel";

const inputClass =
  "w-full px-3 py-2 bg-abyss border border-white/20 text-white text-sm focus:border-signal focus:outline-none";
const labelClass = "block text-mist text-sm mb-1.5";

export default function InviteUserForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { can } = useAdminPermissions();
  const canAssignPrivileged = can(ADMIN_FEATURE.assign_privileged);

  const [form, setForm] = useState<UserCreationFormState>(getInitialUserCreationState);
  const [sending, setSending] = useState(false);
  const [resendConfigured, setResendConfigured] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(
    null,
  );

  const availableRoles = ORDERED_ACCESS_PRESET_ROLES.filter(
    (r) => canAssignPrivileged || (r !== "super_admin" && r !== "admin"),
  );

  useEffect(() => {
    void fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d: { resendConfigured?: boolean }) => {
        setResendConfigured(Boolean(d.resendConfigured));
      })
      .catch(() => setResendConfigured(false));
  }, []);

  function patch(partial: Partial<UserCreationFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateUserCreationForm(form);
    if (validationError) {
      setMessage({ type: "err", text: validationError });
      return;
    }

    setSending(true);
    setMessage(null);
    setCredentials(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildStaffUserPayload(form)),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        generatedPassword?: string;
        emailSent?: boolean;
      };

      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Anlegen fehlgeschlagen." });
        return;
      }

      if (form.creationMode === "create" && data.generatedPassword && !form.sendEmail) {
        setCredentials({ email: form.email.trim(), password: data.generatedPassword });
      }

      const okText =
        form.creationMode === "invite"
          ? `Einladung an ${form.email.trim()} wurde versendet.`
          : data.emailSent
            ? `Nutzer ${form.email.trim()} angelegt — Zugangsdaten per E-Mail gesendet.`
            : `Nutzer ${form.email.trim()} angelegt.`;

      setMessage({ type: "ok", text: okText });
      setForm(getInitialUserCreationState());
      router.refresh();
      onSuccess?.();
    } catch {
      setMessage({ type: "err", text: "Netzwerkfehler. Bitte erneut versuchen." });
    } finally {
      setSending(false);
    }
  }

  const isManual = form.creationMode === "create";

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mb-8 p-5 border border-white/10 bg-white/[0.02] space-y-4"
      >
        <h2 className="text-sm font-semibold text-white">Neuen Backend-Nutzer anlegen</h2>

        <label className="flex items-center gap-2 text-sm text-mist cursor-pointer">
          <input
            type="checkbox"
            checked={isManual}
            onChange={(e) =>
              patch({ creationMode: e.target.checked ? "create" : "invite" })
            }
            className="accent-[#c8ff00]"
          />
          Manuell anlegen (ohne Supabase-Einladungs-Mail)
        </label>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className={labelClass} htmlFor="invite-email">
              E-Mail
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => patch({ email: e.target.value })}
              className={inputClass}
              placeholder="name@beispiel.de"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="invite-role">
              Startrolle
            </label>
            <select
              id="invite-role"
              value={form.role}
              onChange={(e) => patch({ role: e.target.value as AssignableRole })}
              className={inputClass}
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {getRoleLabel(r)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isManual ? (
          <div className="space-y-4 border border-white/5 p-4">
            <p className="text-xs text-mist">
              Der Nutzer kann sich sofort unter{" "}
              <code className="text-white/70">/admin/login</code> anmelden.
            </p>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-mist cursor-pointer">
                <input
                  type="radio"
                  name="passwordMode"
                  checked={form.passwordMode === "generated"}
                  onChange={() => patch({ passwordMode: "generated" })}
                  className="accent-[#c8ff00]"
                />
                Passwort generieren
              </label>
              <label className="flex items-center gap-2 text-sm text-mist cursor-pointer">
                <input
                  type="radio"
                  name="passwordMode"
                  checked={form.passwordMode === "manual"}
                  onChange={() => patch({ passwordMode: "manual" })}
                  className="accent-[#c8ff00]"
                />
                Passwort manuell setzen
              </label>
            </div>

            {form.passwordMode === "manual" ? (
              <div>
                <label className={labelClass} htmlFor="manual-password">
                  Passwort
                </label>
                <input
                  id="manual-password"
                  type="text"
                  value={form.password}
                  onChange={(e) => patch({ password: e.target.value })}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-mist cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailConfirmed}
                onChange={(e) => patch({ emailConfirmed: e.target.checked })}
                className="accent-[#c8ff00]"
              />
              E-Mail als bestätigt markieren (ohne Bestätigungs-Mail)
            </label>

            <label
              className={`flex items-start gap-2 text-sm cursor-pointer ${
                resendConfigured ? "text-mist" : "text-mist/60"
              }`}
            >
              <input
                type="checkbox"
                checked={form.sendEmail}
                disabled={!resendConfigured}
                onChange={(e) => patch({ sendEmail: e.target.checked })}
                className="accent-[#c8ff00] mt-0.5"
              />
              <span>
                Zugangsdaten per E-Mail senden
                {!resendConfigured ? (
                  <span className="block text-xs text-mist/70 mt-1">
                    E-Mail-Versand nicht konfiguriert (
                    <code className="text-white/50">RESEND_API_KEY</code>) —
                    Zugangsdaten werden nach dem Anlegen einmalig angezeigt.
                  </span>
                ) : null}
              </span>
            </label>
          </div>
        ) : (
          <p className="text-xs text-mist">
            Supabase sendet eine Einladungs-Mail mit Link zu{" "}
            <code className="text-white/70">/auth/landing</code>.
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="px-5 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60"
        >
          {sending
            ? "Bitte warten …"
            : isManual
              ? "Nutzer anlegen"
              : "Einladen"}
        </button>

        {message ? (
          <p
            className={`text-sm ${message.type === "ok" ? "text-signal" : "text-red-400"}`}
          >
            {message.text}
          </p>
        ) : null}
      </form>

      {credentials ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 mb-8">
          <div className="w-full max-w-md bg-abyss border border-white/10 p-6 space-y-4">
            <h3 className="text-lg font-heading text-white">Zugangsdaten kopieren</h3>
            <p className="text-mist text-sm">
              Dieses Passwort wird nur einmal angezeigt. Bitte sicher an den Nutzer
              weitergeben.
            </p>
            <div className="bg-abyss-deep border border-white/10 p-4 space-y-2 text-sm">
              <p>
                <span className="text-mist">E-Mail: </span>
                <span className="text-white">{credentials.email}</span>
              </p>
              <p>
                <span className="text-mist">Passwort: </span>
                <code className="text-signal">{credentials.password}</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `E-Mail: ${credentials.email}\nPasswort: ${credentials.password}\nLogin: /admin/login`,
                );
              }}
              className="w-full py-2.5 border border-white/20 text-mist text-xs uppercase tracking-wider hover:border-signal"
            >
              In Zwischenablage kopieren
            </button>
            <button
              type="button"
              onClick={() => setCredentials(null)}
              className="w-full py-2.5 bg-signal text-black text-xs font-bold uppercase tracking-wider"
            >
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
