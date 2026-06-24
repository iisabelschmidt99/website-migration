"use client";

import { useCallback, useEffect, useState } from "react";
import InviteUserForm from "@/components/admin/InviteUserForm";
import { useAdminPermissions } from "@/contexts/AdminPermissionsContext";
import { ADMIN_FEATURE } from "@/lib/admin/adminPermissionKeys";
import {
  type AssignableRole,
  ORDERED_ACCESS_PRESET_ROLES,
  buildAccessSummary,
  computeOverrides,
  getPresetPermissionKeys,
  getRoleDescription,
  getRoleLabel,
  matchesPreset,
} from "@/lib/admin/accessControlModel";
import { createClient } from "@/lib/supabase/client";

type StaffRow = {
  userId: string;
  email: string | null;
  fullName: string | null;
  roles: AssignableRole[];
  requireMfa: boolean;
};

export default function UserAccessPanel() {
  const { can, rbacActive } = useAdminPermissions();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [editRole, setEditRole] = useState<AssignableRole>("editor");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editRequireMfa, setEditRequireMfa] = useState(false);
  const [saving, setSaving] = useState(false);

  const canManage = can(ADMIN_FEATURE.benutzer);
  const canAssignPrivileged = can(ADMIN_FEATURE.assign_privileged);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: true });

      if (pErr) throw pErr;

      const list: StaffRow[] = [];
      for (const p of profiles ?? []) {
        let roles: AssignableRole[] = [];
        const { data: ur } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", p.id);

        if (ur && ur.length > 0) {
          roles = ur.map((r) => r.role as AssignableRole);
        } else if (p.role) {
          roles = [p.role as AssignableRole];
        }

        let requireMfa = false;
        const { data: settings } = await supabase
          .from("user_admin_access_settings")
          .select("require_mfa")
          .eq("user_id", p.id)
          .maybeSingle();
        if (settings) requireMfa = settings.require_mfa;

        list.push({
          userId: p.id,
          email: p.email,
          fullName: p.full_name,
          roles,
          requireMfa,
        });
      }
      setRows(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Laden fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openEdit(row: StaffRow) {
    setEditing(row);
    const primary = row.roles[0] ?? "viewer";
    setEditRole(primary);
    setEditPermissions(getPresetPermissionKeys(primary));
    setEditRequireMfa(row.requireMfa);
  }

  function selectPreset(role: AssignableRole) {
    setEditRole(role);
    setEditPermissions(getPresetPermissionKeys(role));
  }

  function togglePermission(key: string) {
    setEditPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();

      if (rbacActive) {
        const { data: existing } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", editing.userId);

        for (const r of existing ?? []) {
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", editing.userId)
            .eq("role", r.role);
        }

        const { error: insErr } = await supabase.from("user_roles").insert({
          user_id: editing.userId,
          role: editRole,
        });
        if (insErr) throw insErr;

        const overrides = computeOverrides(editRole, editPermissions);
        await supabase
          .from("user_admin_permission_overrides")
          .delete()
          .eq("user_id", editing.userId);
        if (overrides.length > 0) {
          const { error: oErr } = await supabase
            .from("user_admin_permission_overrides")
            .insert(
              overrides.map((o) => ({
                user_id: editing.userId,
                permission_key: o.permission_key,
                granted: o.granted,
              })),
            );
          if (oErr) throw oErr;
        }

        await supabase.from("user_admin_access_settings").upsert({
          user_id: editing.userId,
          require_mfa: editRequireMfa,
        });
      } else {
        const { error: upErr } = await supabase
          .from("profiles")
          .update({ role: editRole })
          .eq("id", editing.userId);
        if (upErr) throw upErr;
      }

      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  if (!canManage) {
    return (
      <div>
        <h1 className="text-2xl font-heading mb-2">Benutzer</h1>
        <p className="text-mist text-sm">Kein Zugriff auf die Benutzerverwaltung.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Benutzer</h1>

      <InviteUserForm onSuccess={() => void load()} />

      {!rbacActive ? (
        <p className="text-mist text-xs mb-4">
          Hinweis: Volles RBAC aktiv nach Ausführung der SQL-Migration{" "}
          <code className="text-white/70">20260623230000_admin_rbac_security.sql</code>.
          Bis dahin wird nur <code className="text-white/70">profiles.role</code>{" "}
          geändert.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-400 mb-4">{error}</p> : null}
      {loading ? <p className="text-mist text-sm">Lade Benutzer …</p> : null}

      {!loading && rows.length > 0 ? (
        <table className="w-full text-sm border-collapse mt-4">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">E-Mail</th>
              <th className="py-2 pr-4 font-medium">Zugang</th>
              <th className="py-2 pr-4 font-medium">MFA</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.userId} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">{row.fullName || "—"}</td>
                <td className="py-2.5 pr-4 text-mist">{row.email ?? "—"}</td>
                <td className="py-2.5 pr-4 text-mist">
                  {buildAccessSummary(row.roles)}
                </td>
                <td className="py-2.5 pr-4 text-mist">
                  {row.requireMfa ? "Pflicht" : "—"}
                </td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="text-signal text-xs uppercase tracking-wider"
                  >
                    Bearbeiten
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg bg-abyss border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-heading mb-1">Zugang bearbeiten</h2>
            <p className="text-mist text-sm mb-4">{editing.email}</p>

            <p className="text-xs uppercase tracking-wider text-mist mb-2">
              Rolle
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {ORDERED_ACCESS_PRESET_ROLES.filter(
                (r) =>
                  canAssignPrivileged ||
                  (r !== "super_admin" && r !== "admin"),
              ).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectPreset(role)}
                  className={`text-left p-3 border text-sm ${
                    editRole === role
                      ? "border-signal bg-signal/10"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span className="block text-white font-medium">
                    {getRoleLabel(role)}
                  </span>
                  <span className="block text-mist text-xs mt-1">
                    {getRoleDescription(role)}
                  </span>
                </button>
              ))}
            </div>

            {rbacActive ? (
              <>
                <p className="text-xs uppercase tracking-wider text-mist mb-2">
                  Berechtigungen
                  {matchesPreset(editPermissions) === "custom" ? (
                    <span className="text-signal ml-2">Individuell</span>
                  ) : null}
                </p>
                <div className="space-y-1 mb-4 max-h-40 overflow-y-auto border border-white/5 p-2">
                  {getPresetPermissionKeys("super_admin").map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-xs text-mist cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editPermissions.includes(key)}
                        onChange={() => togglePermission(key)}
                        className="accent-[#c8ff00]"
                      />
                      {key}
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-sm text-mist mb-6">
                  <input
                    type="checkbox"
                    checked={editRequireMfa}
                    onChange={(e) => setEditRequireMfa(e.target.checked)}
                    className="accent-[#c8ff00]"
                  />
                  2FA für Admin-Zugang erforderlich
                </label>
              </>
            ) : null}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-mist text-xs uppercase tracking-wider"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveEdit()}
                className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider disabled:opacity-60"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
