"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export type TestimonialRecord = {
  id?: string;
  slug?: string;
  name?: string;
  role_company?: string | null;
  quote?: string | null;
  categories?: string[] | null;
  image_url?: string | null;
  image_alt?: string | null;
  logo_url?: string | null;
  sort_order?: number;
  published?: boolean;
};

export default function TestimonialForm({
  initial,
  id,
}: {
  initial?: TestimonialRecord;
  id?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    role_company: initial?.role_company ?? "",
    quote: initial?.quote ?? "",
    categories: (initial?.categories ?? []).join("; "),
    image_alt: initial?.image_alt ?? "",
    sort_order: String(initial?.sort_order ?? 0),
    published: initial?.published ?? false,
  });
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");
  const [uploading, setUploading] = useState<"image" | "logo" | null>(null);
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

  async function handleImage(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "image" | "logo"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(kind);
    setError(null);
    const folder = kind === "logo" ? "testimonials/logos" : "testimonials";
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(null);
    if (upErr) {
      setError(`Bild-Upload fehlgeschlagen: ${upErr.message}`);
      return;
    }
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    if (kind === "logo") setLogoUrl(url);
    else setImageUrl(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      role_company: form.role_company || null,
      quote: form.quote || null,
      categories: form.categories
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      image_url: imageUrl || null,
      image_alt: form.image_alt || null,
      logo_url: logoUrl || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      published: form.published,
    };

    const query = isEdit
      ? supabase.from("testimonials").update(payload).eq("id", id)
      : supabase.from("testimonials").insert(payload);
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
    router.push("/admin/kundenstimmen");
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
      <div>
        <label className={labelClass}>Position und Firma</label>
        <input
          className={inputClass}
          value={form.role_company}
          onChange={(e) => update("role_company", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Testimonial (HTML erlaubt)</label>
        <textarea
          rows={5}
          className={inputClass}
          value={form.quote}
          onChange={(e) => update("quote", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Kategorien (mit ; getrennt)</label>
        <input
          className={inputClass}
          placeholder="aufbereitung; mitarbeiterverkauf"
          value={form.categories}
          onChange={(e) => update("categories", e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Reihenfolge</label>
        <input
          type="number"
          className={inputClass}
          value={form.sort_order}
          onChange={(e) => update("sort_order", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Kundenbild</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading === "image" ? "Lädt …" : "Bild wählen"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e, "image")}
              className="hidden"
            />
          </label>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-14 w-14 object-cover border border-white/10" />
          )}
        </div>
        {imageUrl && (
          <input
            className={`${inputClass} mt-3`}
            placeholder="Alt-Text"
            value={form.image_alt}
            onChange={(e) => update("image_alt", e.target.value)}
          />
        )}
      </div>

      <div>
        <label className={labelClass}>Firmen-Logo</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading === "logo" ? "Lädt …" : "Logo wählen"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e, "logo")}
              className="hidden"
            />
          </label>
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-10 max-w-[8rem] object-contain border border-white/10 bg-white/5 px-2" />
          )}
        </div>
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
          disabled={saving || uploading !== null}
          className="px-6 py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60"
        >
          {saving ? "Speichern …" : isEdit ? "Änderungen speichern" : "Kundenstimme speichern"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/kundenstimmen")}
          className="text-mist text-sm hover:text-white"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
