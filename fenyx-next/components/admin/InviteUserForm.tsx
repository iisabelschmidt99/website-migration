"use client";

// Formular zum Einladen neuer Backend-Nutzer (ruft /api/admin/invite).
import { useState } from "react";
import { useRouter } from "next/navigation";
type UserRole = "admin" | "editor" | "viewer";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "editor", label: "Redakteur" },
  { value: "viewer", label: "Betrachter" },
  { value: "admin", label: "Admin" },
];

const inputClass =
  "w-full px-3 py-2 bg-abyss border border-white/20 text-white text-sm focus:border-signal focus:outline-none";
const labelClass = "block text-mist text-sm mb-1.5";

export default function InviteUserForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("editor");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Einladung fehlgeschlagen." });
        return;
      }

      setMessage({
        type: "ok",
        text: `Einladung an ${email.trim()} wurde versendet.`,
      });
      setEmail("");
      setRole("editor");
      router.refresh();
      onSuccess?.();
    } catch {
      setMessage({ type: "err", text: "Netzwerkfehler. Bitte erneut versuchen." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-5 border border-white/10 bg-white/[0.02] space-y-4"
    >
      <h2 className="text-sm font-semibold text-white">Neuen Nutzer einladen</h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label className={labelClass} htmlFor="invite-email">
            E-Mail
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className={inputClass}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="px-5 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60 whitespace-nowrap"
        >
          {sending ? "Sende …" : "Einladen"}
        </button>
      </div>
      {message && (
        <p
          className={`text-sm ${message.type === "ok" ? "text-signal" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
