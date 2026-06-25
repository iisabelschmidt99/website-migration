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

type PickerUser = {
  id: string;
  email: string;
  full_name: string | null;
};

export default function UserAccessPanel() {
  const { can, rbacActive } = useAdminPermissions();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [pickerUsers, setPickerUsers] = useState<PickerUser[]>([]);
  const [assignUserId, setAssignUserId] = useState("");
  const [editRole, setEditRole] = useState<AssignableRole>("editor");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editRequireMfa, setEditRequireMfa] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const canManage = can(ADMIN_FEATURE.benutzer);
  const canAssignPrivileged = can(ADMIN_FEATURE.assign_privileged);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: directory, error: dirErr } = await supabase.rpc(
        "get_staff_directory",
      );

      if (dirErr) throw dirErr;

      const staffIds = (directory ?? []).map(
        (d: { user_id: string }) => d.user_id,
      );

      let rolesByUser = new Map<string, AssignableRole[]>();
      let mfaByUser = new Map<string, boolean>();

      if (staffIds.length > 0) {
        const { data: roleRows, error: roleErr } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", staffIds);

        if (roleErr) throw roleErr;

        for (const row of roleRows ?? []) {
          const role = row.role as AssignableRole;
          const list = rolesByUser.get(row.user_id) ?? [];
          if (!list.includes(role)) list.push(role);
          rolesByUser.set(row.user_id, list);
        }

        const { data: settingsRows, error: setErr } = await supabase
          .from("user_admin_access_settings")
          .select("user_id, require_mfa")
          .in("user_id", staffIds);

        if (setErr) throw setErr;

        for (const s of settingsRows ?? []) {
          mfaByUser.set(s.user_id, s.require_mfa);
        }
      }

      const list: StaffRow[] = (directory ?? []).map(
        (d: {
          user_id: string;
          email: string | null;
          full_name: string | null;
        }) => ({
          userId: d.user_id,
          email: d.email,
          fullName: d.full_name,
          roles: rolesByUser.get(d.user_id) ?? [],
          requireMfa: mfaByUser.get(d.user_id) ?? false,
        }),
      );

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

  async function hydrateEditState(row: StaffRow) {
    setEditLoading(true);
    setEditing(row);

    const primary =
      ORDERED_ACCESS_PRESET_ROLES.find((r) => row.roles.includes(r)) ??
      row.roles[0] ??
      "viewer";

    setEditRole(primary);
    setEditRequireMfa(row.requireMfa);

    try {
      const supabase = createClient();

      if (rbacActive && canAssignPrivileged) {
        const { data: effective, error: effErr } = await supabase.rpc(
          "admin_get_effective_permissions_for_user",
          { _target: row.userId },
        );

        if (effErr) throw effErr;

        if (Array.isArray(effective) && effective.length > 0) {
          setEditPermissions(Array.from(new Set(effective)));
          const presetMatch = matchesPreset(effective);
          if (presetMatch !== "custom") {
            setEditRole(presetMatch);
          }
          return;
        }
      }

      setEditPermissions(getPresetPermissionKeys(primary));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zugangsdaten laden fehlgeschlagen.");
      setEditPermissions(getPresetPermissionKeys(primary));
    } finally {
      setEditLoading(false);
    }
  }

  function openAssignExisting() {
    setAssigning(true);
    setAssignUserId("");
    setEditRole("editor");
    setEditPermissions(getPresetPermissionKeys("editor"));
    setEditRequireMfa(false);
    void loadPickerUsers();
  }

  async function loadPickerUsers() {
    try {
      const supabase = createClient();
      const { data, error: pickErr } = await supabase.rpc(
        "get_users_for_admin_picker",
      );
      if (pickErr) throw pickErr;

      const staffIds = new Set(rows.map((r) => r.userId));
      setPickerUsers(
        (data ?? [])
          .filter((u: PickerUser) => !staffIds.has(u.id))
          .map((u: PickerUser) => ({
            id: u.id,
            email: u.email,
            full_name: u.full_name,
          })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nutzerliste laden fehlgeschlagen.");
    }
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

  async function saveRoleForUser(userId: string) {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();

      if (rbacActive) {
        const { data: existing } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        for (const r of existing ?? []) {
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", userId)
            .eq("role", r.role);
        }

        const { error: insErr } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: editRole,
        });
        if (insErr) throw insErr;

        if (canAssignPrivileged) {
          const overrides = computeOverrides(editRole, editPermissions);
          await supabase
            .from("user_admin_permission_overrides")
            .delete()
            .eq("user_id", userId);
          if (overrides.length > 0) {
            const { error: oErr } = await supabase
              .from("user_admin_permission_overrides")
              .insert(
                overrides.map((o) => ({
                  user_id: userId,
                  permission_key: o.permission_key,
                  granted: o.granted,
                })),
              );
            if (oErr) throw oErr;
          }

          await supabase.from("user_admin_access_settings").upsert({
            user_id: userId,
            require_mfa: editRequireMfa,
          });
        }
      } else {
        const { error: upErr } = await supabase
          .from("profiles")
          .update({ role: editRole })
          .eq("id", userId);
        if (upErr) throw upErr;
      }
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await saveRoleForUser(editing.userId);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  }

  async function saveAssign() {
    if (!assignUserId) {
      setError("Bitte einen Nutzer auswählen.");
      return;
    }
    try {
      await saveRoleForUser(assignUserId);
      setAssigning(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zuweisung fehlgeschlagen.");
    }
  }

  function renderRoleEditor() {
    return (
      <>
        <p className="text-xs uppercase tracking-wider text-mist mb-2">Rolle</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ORDERED_ACCESS_PRESET_ROLES.filter(
            (r) =>
              canAssignPrivileged || (r !== "super_admin" && r !== "admin"),
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

        {rbacActive && canAssignPrivileged ? (
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
      </>
    );
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

      <button
        type="button"
        onClick={openAssignExisting}
        className="mb-6 text-signal text-xs uppercase tracking-wider hover:underline"
      >
        Bestehendem Nutzer Zugang geben
      </button>

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
                    onClick={() => void hydrateEditState(row)}
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

      {!loading && rows.length === 0 ? (
        <p className="text-mist text-sm">Noch keine Backend-Nutzer.</p>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg bg-abyss border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-heading mb-1">Zugang bearbeiten</h2>
            <p className="text-mist text-sm mb-4">{editing.email}</p>

            {editLoading ? (
              <p className="text-mist text-sm mb-4">Lade Zugangsdaten …</p>
            ) : (
              renderRoleEditor()
            )}

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
                disabled={saving || editLoading}
                onClick={() => void saveEdit()}
                className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider disabled:opacity-60"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {assigning ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg bg-abyss border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-heading mb-1">Backend-Zugang zuweisen</h2>
            <p className="text-mist text-sm mb-4">
              Wähle einen bestehenden Auth-Nutzer ohne Backend-Rolle.
            </p>

            <label className="block text-mist text-sm mb-1.5" htmlFor="assign-user">
              Nutzer
            </label>
            <select
              id="assign-user"
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              className="w-full px-3 py-2 bg-abyss-deep text-white border border-white/15 mb-4 text-sm"
            >
              <option value="">— Nutzer wählen —</option>
              {pickerUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                  {u.full_name ? ` (${u.full_name})` : ""}
                </option>
              ))}
            </select>

            {pickerUsers.length === 0 ? (
              <p className="text-mist text-xs mb-4">
                Keine weiteren Nutzer ohne Backend-Zugang gefunden.
              </p>
            ) : null}

            {renderRoleEditor()}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setAssigning(false)}
                className="px-4 py-2 text-mist text-xs uppercase tracking-wider"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={saving || !assignUserId}
                onClick={() => void saveAssign()}
                className="px-4 py-2 bg-signal text-black text-xs font-bold uppercase tracking-wider disabled:opacity-60"
              >
                Zuweisen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
