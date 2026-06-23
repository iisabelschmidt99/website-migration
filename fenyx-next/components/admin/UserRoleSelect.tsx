"use client";

// Rollen-Dropdown pro Benutzerzeile; ruft die Server Action auf.
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "editor" | "viewer";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Redakteur" },
  { value: "viewer", label: "Betrachter" },
];

type UpdateUserRole = (
  userId: string,
  role: UserRole,
) => Promise<{ error?: string; success?: boolean }>;

export default function UserRoleSelect({
  userId,
  currentRole,
  currentUserId,
  updateUserRole,
}: {
  userId: string;
  currentRole: UserRole;
  currentUserId: string;
  updateUserRole: UpdateUserRole;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isSelf = userId === currentUserId;
  const disabled = pending || (isSelf && currentRole === "admin");

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as UserRole;
    if (role === currentRole) return;

    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, role);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <select
        value={currentRole}
        onChange={onChange}
        disabled={disabled}
        title={
          isSelf && currentRole === "admin"
            ? "Du kannst dir die Admin-Rolle nicht selbst entziehen."
            : undefined
        }
        className="px-2 py-1.5 bg-abyss border border-white/20 text-white text-sm focus:border-signal focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
