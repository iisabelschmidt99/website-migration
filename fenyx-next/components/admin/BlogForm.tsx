"use client";

// Formular zum Anlegen UND Bearbeiten eines Blogartikels (Ratgeber).
// ohne `initial`: neu (insert) | mit `initial`+`id`: bearbeiten (update)
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export type BlogRecord = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  body_md?: string | null;
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  published?: boolean;
  published_at?: string | null;
};

export default function BlogForm({ initial, id }: { initial?: BlogRecord; id?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    body_md: initial?.body_md ?? "",
    author: initial?.author ?? "",
    category: initial?.category ?? "",
    tags: (initial?.tags ?? []).join(", "),
    meta_title: initial?.meta_title ?? "",
    meta_description: initial?.meta_description ?? "",
    cover_image_alt: initial?.cover_image_alt ?? "",
    published: initial?.published ?? false,
  });
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleBlur() {
    if (!form.slug && form.title) {
      update(
        "slug",
        form.title.toLowerCase()
          .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      );
    }
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    const path = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(false);
    if (error) { setError(`Bild-Upload fehlgeschlagen: ${error.message}`); return; }
    setCoverUrl(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      body_md: form.body_md || null,
      cover_image_url: coverUrl || null,
      cover_image_alt: form.cover_image_alt || null,
      author: form.author || null,
      category: form.category || null,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      published: form.published,
      // Veröffentlichungsdatum setzen, sobald erstmals veröffentlicht
      published_at:
        form.published && !initial?.published_at
          ? new Date().toISOString()
          : initial?.published_at ?? null,
    };

    const query = isEdit
      ? supabase.from("blog_posts").update(payload).eq("id", id)
      : supabase.from("blog_posts").insert(payload);
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
    router.push("/admin/blog");
    router.refresh();
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none text-sm";
  const labelClass = "block text-mist text-sm mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Titel *</label>
        <input required className={inputClass} value={form.title}
          onChange={(e) => update("title", e.target.value)} onBlur={onTitleBlur} />
      </div>
      <div>
        <label className={labelClass}>Slug *</label>
        <input required className={inputClass} value={form.slug}
          onChange={(e) => update("slug", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Autor</label>
          <input className={inputClass} value={form.author}
            onChange={(e) => update("author", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Kategorie</label>
          <input className={inputClass} value={form.category}
            onChange={(e) => update("category", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Kurzbeschreibung (Anriss)</label>
        <textarea rows={2} className={inputClass} value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Inhalt (Markdown)</label>
        <textarea rows={12} className={`${inputClass} font-mono`} value={form.body_md}
          onChange={(e) => update("body_md", e.target.value)} />
      </div>

      {/* Titelbild */}
      <div>
        <label className={labelClass}>Titelbild</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading ? "Lädt …" : "Bild wählen"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="h-14 w-20 object-cover border border-white/10" />
          )}
        </div>
        {coverUrl && (
          <input className={`${inputClass} mt-3`} placeholder="Bildbeschreibung (Alt-Text)"
            value={form.cover_image_alt} onChange={(e) => update("cover_image_alt", e.target.value)} />
        )}
      </div>

      <div>
        <label className={labelClass}>Tags (mit Komma getrennt)</label>
        <input className={inputClass} placeholder="Nachhaltigkeit, Büro, Tipps" value={form.tags}
          onChange={(e) => update("tags", e.target.value)} />
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
          {saving ? "Speichern …" : isEdit ? "Änderungen speichern" : "Artikel speichern"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")}
          className="text-mist text-sm hover:text-white">Abbrechen</button>
      </div>
    </form>
  );
}
