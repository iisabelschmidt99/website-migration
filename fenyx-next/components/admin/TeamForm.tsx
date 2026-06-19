"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export type TeamRecord = {
  id?: string;
  slug?: string;
  name?: string;
  position?: string | null;
  bio?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  quote?: string | null;
  legend_position?: string | null;
  sort_order?: number;
  published?: boolean;
};

export default function TeamForm({
  initial,
  id,
}: {
  initial?: TeamRecord;
  id?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    position: initial?.position ?? "",
    bio: initial?.bio ?? "",
    image_alt: initial?.image_alt ?? "",
    linkedin_url: initial?.linkedin_url ?? "",
    email: initial?.email ?? "",
    quote: initial?.quote ?? "",
    legend_position: initial?.legend_position ?? "",
    sort_order: String(initial?.sort_order ?? 0),
    published: initial?.published ?? false,
  });
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onNameBlur() {
    if (!form.slug && form.name) {
      update(
        "slug",
        form.name
          .toLowerCase()
          .replace(/ä/g, "ae")
          .replace(/ö/g, "oe")
          .replace(/ü/g, "ue")
          .replace(/ß/g, "ss")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const path = `team/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(false);
    if (upErr) {
      setError(`Bild-Upload fehlgeschlagen: ${upErr.message}`);
      return;
    }
    setImageUrl(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      position: form.position || null,
      bio: form.bio || null,
      image_url: imageUrl || null,
      image_alt: form.image_alt || null,
      linkedin_url: form.linkedin_url || null,
      email: form.email || null,
      quote: form.quote || null,
      legend_position: form.legend_position || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      published: form.published,
    };

    const query = isEdit
      ? supabase.from("team_members").update(payload).eq("id", id)
      : supabase.from("team_members").insert(payload);
    const { error: saveErr } = await query;

    setSaving(false);
    if (saveErr) {
      setError(
        saveErr.message.includes("duplicate")
          ? "Diesen Slug gibt es schon – bitte anderen wählen."
          : `Speichern fehlgeschlagen: ${saveErr.message}`
      );
      return;
    }
    router.push("/admin/team");
    router.refresh();
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none text-sm";
  const labelClass = "block text-mist text-sm mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Name *</label>
        <input
          required
          className={inputClass}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={onNameBlur}
        />
      </div>
      <div>
        <label className={labelClass}>Slug *</label>
        <input
          required
          className={inputClass}
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Position</label>
          <input
            className={inputClass}
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Reihenfolge (Über uns)</label>
          <input
            type="number"
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => update("sort_order", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Personen-Beschreibung</label>
        <textarea
          rows={3}
          className={inputClass}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Zitat</label>
        <textarea
          rows={2}
          className={inputClass}
          value={form.quote}
          onChange={(e) => update("quote", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>E-Mail</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            className={inputClass}
            value={form.linkedin_url}
            onChange={(e) => update("linkedin_url", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Legenden-Position</label>
        <input
          className={inputClass}
          value={form.legend_position}
          onChange={(e) => update("legend_position", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Portrait</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading ? "Lädt …" : "Bild wählen"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-14 w-14 object-cover border border-white/10 rounded-full" />
          )}
        </div>
        {imageUrl && (
          <input
            className={`${inputClass} mt-3`}
            placeholder="Bildbeschreibung (Alt-Text)"
            value={form.image_alt}
            onChange={(e) => update("image_alt", e.target.value)}
          />
        )}
      </div>

      <label className="flex items-center gap-3 text-sm text-white">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
          className="w-4 h-4 accent-[#c8ff00]"
        />
        Veröffentlicht (auf der Website sichtbar)
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60"
        >
          {saving ? "Speichern …" : isEdit ? "Änderungen speichern" : "Team-Mitglied speichern"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/team")}
          className="text-mist text-sm hover:text-white"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
