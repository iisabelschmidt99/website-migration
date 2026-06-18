"use client";

// Formular zum Anlegen UND Bearbeiten einer Referenz.
// - ohne `initial`: neue Referenz (insert)
// - mit `initial` + `id`: bestehende bearbeiten (update)
// Inkl. Wiederhol-Felder für Kennzahlen und Highlights.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

type Stat = { value: string; label: string };
type Highlight = { heading: string; body: string };

export type ReferenceRecord = {
  id?: string;
  slug?: string;
  company?: string;
  title?: string;
  category_label?: string | null;
  city?: string | null;
  year?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  intro?: string[] | null;
  hero_stats?: Stat[] | null;
  highlights?: Highlight[] | null;
  related_slugs?: string[] | null;
  published?: boolean;
};

export default function ReferenceForm({
  initial,
  id,
}: {
  initial?: ReferenceRecord;
  id?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    company: initial?.company ?? "",
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category_label: initial?.category_label ?? "",
    city: initial?.city ?? "",
    year: initial?.year ?? "",
    meta_title: initial?.meta_title ?? "",
    meta_description: initial?.meta_description ?? "",
    hero_image_alt: initial?.hero_image_alt ?? "",
    intro: (initial?.intro ?? []).join("\n"),
    related_slugs: (initial?.related_slugs ?? []).join(", "),
    published: initial?.published ?? false,
  });
  const [heroImageUrl, setHeroImageUrl] = useState(initial?.hero_image_url ?? "");
  const [stats, setStats] = useState<Stat[]>(initial?.hero_stats ?? []);
  const [highlights, setHighlights] = useState<Highlight[]>(initial?.highlights ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onCompanyBlur() {
    if (!form.slug && form.company) {
      update(
        "slug",
        form.company.toLowerCase()
          .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      );
    }
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const path = `referenzen/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(false);
    if (error) { setError(`Bild-Upload fehlgeschlagen: ${error.message}`); return; }
    setHeroImageUrl(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      company: form.company,
      title: form.title,
      slug: form.slug,
      category_label: form.category_label || null,
      city: form.city || null,
      year: form.year || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      hero_image_url: heroImageUrl || null,
      hero_image_alt: form.hero_image_alt || null,
      intro: form.intro.split("\n").map((s) => s.trim()).filter(Boolean),
      hero_stats: stats.filter((s) => s.value || s.label),
      highlights: highlights.filter((h) => h.heading || h.body),
      related_slugs: form.related_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      published: form.published,
    };

    const query = isEdit
      ? supabase.from("references").update(payload).eq("id", id)
      : supabase.from("references").insert(payload);
    const { error } = await query;

    setSaving(false);
    if (error) {
      setError(
        error.message.includes("duplicate")
          ? "Diesen Slug gibt es schon – bitte anderen wählen."
          : `Speichern fehlgeschlagen: ${error.message}`
      );
      return;
    }
    router.push("/admin/referenzen");
    router.refresh();
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none text-sm";
  const labelClass = "block text-mist text-sm mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Unternehmen *</label>
        <input required className={inputClass} value={form.company}
          onChange={(e) => update("company", e.target.value)} onBlur={onCompanyBlur} />
      </div>
      <div>
        <label className={labelClass}>Titel *</label>
        <input required className={inputClass} value={form.title}
          onChange={(e) => update("title", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Slug *</label>
        <input required className={inputClass} value={form.slug}
          onChange={(e) => update("slug", e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Kategorie</label>
          <input className={inputClass} value={form.category_label}
            onChange={(e) => update("category_label", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input className={inputClass} value={form.city}
            onChange={(e) => update("city", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Jahr</label>
          <input className={inputClass} value={form.year}
            onChange={(e) => update("year", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Einleitung (ein Absatz pro Zeile)</label>
        <textarea rows={4} className={inputClass} value={form.intro}
          onChange={(e) => update("intro", e.target.value)} />
      </div>

      {/* Kennzahlen */}
      <div>
        <label className={labelClass}>Kennzahlen (Wert + Beschriftung)</label>
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputClass} w-1/3`} placeholder="z.B. 82" value={s.value}
                onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
              <input className={inputClass} placeholder="z.B. Refurbished Möbelstücke" value={s.label}
                onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
              <button type="button" className="text-mist hover:text-red-400 px-2"
                onClick={() => setStats(stats.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 text-signal text-sm"
          onClick={() => setStats([...stats, { value: "", label: "" }])}>+ Kennzahl</button>
      </div>

      {/* Highlights */}
      <div>
        <label className={labelClass}>Highlights (Überschrift + Text)</label>
        <div className="space-y-3">
          {highlights.map((h, i) => (
            <div key={i} className="border border-white/10 p-3 space-y-2">
              <div className="flex gap-2">
                <input className={inputClass} placeholder="Überschrift" value={h.heading}
                  onChange={(e) => setHighlights(highlights.map((x, j) => j === i ? { ...x, heading: e.target.value } : x))} />
                <button type="button" className="text-mist hover:text-red-400 px-2"
                  onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}>✕</button>
              </div>
              <textarea rows={2} className={inputClass} placeholder="Text" value={h.body}
                onChange={(e) => setHighlights(highlights.map((x, j) => j === i ? { ...x, body: e.target.value } : x))} />
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 text-signal text-sm"
          onClick={() => setHighlights([...highlights, { heading: "", body: "" }])}>+ Highlight</button>
      </div>

      {/* Bild */}
      <div>
        <label className={labelClass}>Hero-Bild</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading ? "Lädt …" : "Bild wählen"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="" className="h-14 w-20 object-cover border border-white/10" />
          )}
        </div>
        {heroImageUrl && (
          <input className={`${inputClass} mt-3`} placeholder="Bildbeschreibung (Alt-Text)"
            value={form.hero_image_alt} onChange={(e) => update("hero_image_alt", e.target.value)} />
        )}
      </div>

      <div>
        <label className={labelClass}>Verwandte Referenzen (Slugs, mit Komma getrennt)</label>
        <input className={inputClass} placeholder="reneo-group, signal-iduna" value={form.related_slugs}
          onChange={(e) => update("related_slugs", e.target.value)} />
      </div>

      <details className="border border-white/10 p-4">
        <summary className="text-mist text-sm cursor-pointer">SEO (optional)</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>Meta-Titel</label>
            <input className={inputClass} value={form.meta_title}
              onChange={(e) => update("meta_title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Meta-Beschreibung</label>
            <textarea rows={2} className={inputClass} value={form.meta_description}
              onChange={(e) => update("meta_description", e.target.value)} />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-3 text-sm text-white">
        <input type="checkbox" checked={form.published}
          onChange={(e) => update("published", e.target.checked)} className="w-4 h-4 accent-[#c8ff00]" />
        Veröffentlicht (auf der Website sichtbar)
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving || uploading}
          className="px-6 py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60">
          {saving ? "Speichern …" : isEdit ? "Änderungen speichern" : "Referenz speichern"}
        </button>
        <button type="button" onClick={() => router.push("/admin/referenzen")}
          className="text-mist text-sm hover:text-white">Abbrechen</button>
      </div>
    </form>
  );
}
