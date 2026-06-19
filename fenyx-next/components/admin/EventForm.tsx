"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export type EventRecord = {
  id?: string;
  slug?: string;
  title?: string;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  intro?: string | null;
  intro_info?: string | null;
  tags?: string[] | null;
  event_date?: string | null;
  time_label?: string | null;
  location?: string | null;
  location_link?: string | null;
  fee?: string | null;
  seats?: string | null;
  language?: string | null;
  format?: string | null;
  catering?: string | null;
  h2_text?: string | null;
  h2_paragraph?: string | null;
  h2_rich_text?: string | null;
  program_html?: string | null;
  host_slugs?: string[] | null;
  program_image_url?: string | null;
  program_image_alt?: string | null;
  takeaways?: string[] | null;
  category?: string | null;
  ics_url?: string | null;
  hubspot_form?: string | null;
  published?: boolean;
  published_at?: string | null;
};

export default function EventForm({
  initial,
  id,
}: {
  initial?: EventRecord;
  id?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    intro: initial?.intro ?? "",
    intro_info: initial?.intro_info ?? "",
    tags: (initial?.tags ?? []).join("; "),
    event_date: initial?.event_date
      ? initial.event_date.slice(0, 10)
      : "",
    time_label: initial?.time_label ?? "",
    location: initial?.location ?? "",
    location_link: initial?.location_link ?? "",
    fee: initial?.fee ?? "",
    seats: initial?.seats ?? "",
    language: initial?.language ?? "",
    format: initial?.format ?? "",
    catering: initial?.catering ?? "",
    h2_text: initial?.h2_text ?? "",
    h2_paragraph: initial?.h2_paragraph ?? "",
    h2_rich_text: initial?.h2_rich_text ?? "",
    program_html: initial?.program_html ?? "",
    program_image_alt: initial?.program_image_alt ?? "",
    category: initial?.category ?? "",
    ics_url: initial?.ics_url ?? "",
    hubspot_form: initial?.hubspot_form ?? "",
    hero_image_alt: initial?.hero_image_alt ?? "",
    published: initial?.published ?? false,
  });
  const [heroUrl, setHeroUrl] = useState(initial?.hero_image_url ?? "");
  const [programImageUrl, setProgramImageUrl] = useState(initial?.program_image_url ?? "");
  const [hostSlugs, setHostSlugs] = useState<string[]>(initial?.host_slugs ?? []);
  const [takeaways, setTakeaways] = useState<string[]>(initial?.takeaways ?? []);
  const [uploading, setUploading] = useState<"hero" | "program" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleBlur() {
    if (!form.slug && form.title) {
      update(
        "slug",
        form.title
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
    kind: "hero" | "program"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(kind);
    setError(null);
    const path = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(null);
    if (upErr) {
      setError(`Bild-Upload fehlgeschlagen: ${upErr.message}`);
      return;
    }
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    if (kind === "hero") setHeroUrl(url);
    else setProgramImageUrl(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      intro: form.intro || null,
      intro_info: form.intro_info || null,
      tags: form.tags.split(";").map((s) => s.trim()).filter(Boolean),
      event_date: form.event_date
        ? new Date(`${form.event_date}T12:00:00`).toISOString()
        : null,
      time_label: form.time_label || null,
      location: form.location || null,
      location_link: form.location_link || null,
      fee: form.fee || null,
      seats: form.seats || null,
      language: form.language || null,
      format: form.format || null,
      catering: form.catering || null,
      h2_text: form.h2_text || null,
      h2_paragraph: form.h2_paragraph || null,
      h2_rich_text: form.h2_rich_text || null,
      program_html: form.program_html || null,
      host_slugs: hostSlugs.filter(Boolean),
      takeaways: takeaways.filter(Boolean),
      hero_image_url: heroUrl || null,
      hero_image_alt: form.hero_image_alt || null,
      program_image_url: programImageUrl || null,
      program_image_alt: form.program_image_alt || null,
      category: form.category || null,
      ics_url: form.ics_url || null,
      hubspot_form: form.hubspot_form || null,
      published: form.published,
      published_at:
        form.published && !initial?.published_at
          ? new Date().toISOString()
          : initial?.published_at ?? null,
    };

    const query = isEdit
      ? supabase.from("events").update(payload).eq("id", id)
      : supabase.from("events").insert(payload);
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
    router.push("/admin/events");
    router.refresh();
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-abyss-deep text-white border border-white/15 focus:border-signal outline-none text-sm";
  const labelClass = "block text-mist text-sm mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Titel *</label>
        <input
          required
          className={inputClass}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={onTitleBlur}
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
        <label className={labelClass}>Intro</label>
        <textarea rows={3} className={inputClass} value={form.intro}
          onChange={(e) => update("intro", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Intro Info</label>
        <textarea rows={2} className={inputClass} value={form.intro_info}
          onChange={(e) => update("intro_info", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Datum</label>
          <input type="date" className={inputClass} value={form.event_date}
            onChange={(e) => update("event_date", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Uhrzeit</label>
          <input className={inputClass} placeholder="09:00–17:00 Uhr" value={form.time_label}
            onChange={(e) => update("time_label", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ort</label>
          <input className={inputClass} value={form.location}
            onChange={(e) => update("location", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Ort-Link</label>
          <input className={inputClass} value={form.location_link}
            onChange={(e) => update("location_link", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Teilnahmegebühr</label>
          <input className={inputClass} value={form.fee}
            onChange={(e) => update("fee", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Plätze</label>
          <input className={inputClass} value={form.seats}
            onChange={(e) => update("seats", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Kategorie</label>
          <input className={inputClass} value={form.category}
            onChange={(e) => update("category", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Sprache</label>
          <input className={inputClass} value={form.language}
            onChange={(e) => update("language", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Format</label>
          <input className={inputClass} value={form.format}
            onChange={(e) => update("format", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Verpflegung</label>
          <input className={inputClass} value={form.catering}
            onChange={(e) => update("catering", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (mit ; getrennt)</label>
        <input className={inputClass} value={form.tags}
          onChange={(e) => update("tags", e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>H2 Text</label>
        <input className={inputClass} value={form.h2_text}
          onChange={(e) => update("h2_text", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>H2 Paragraph</label>
        <textarea rows={3} className={inputClass} value={form.h2_paragraph}
          onChange={(e) => update("h2_paragraph", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>H2 Rich Text (HTML)</label>
        <textarea rows={4} className={inputClass} value={form.h2_rich_text}
          onChange={(e) => update("h2_rich_text", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Programm (HTML)</label>
        <textarea rows={6} className={inputClass} value={form.program_html}
          onChange={(e) => update("program_html", e.target.value)} />
      </div>

      {/* Gastgeber (Team-Slugs) */}
      <div>
        <label className={labelClass}>Gastgeber (Team-Slugs)</label>
        <div className="space-y-2">
          {hostSlugs.map((slug, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputClass} placeholder="team-member-slug" value={slug}
                onChange={(e) => setHostSlugs(hostSlugs.map((x, j) => j === i ? e.target.value : x))} />
              <button type="button" className="text-mist hover:text-red-400 px-2"
                onClick={() => setHostSlugs(hostSlugs.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 text-signal text-sm"
          onClick={() => setHostSlugs([...hostSlugs, ""])}>+ Gastgeber</button>
      </div>

      {/* Mitnehmen */}
      <div>
        <label className={labelClass}>Mitnehmen</label>
        <div className="space-y-2">
          {takeaways.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputClass} value={item}
                onChange={(e) => setTakeaways(takeaways.map((x, j) => j === i ? e.target.value : x))} />
              <button type="button" className="text-mist hover:text-red-400 px-2"
                onClick={() => setTakeaways(takeaways.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 text-signal text-sm"
          onClick={() => setTakeaways([...takeaways, ""])}>+ Mitnehmen</button>
      </div>

      <div>
        <label className={labelClass}>Hero-Bild</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading === "hero" ? "Lädt …" : "Bild wählen"}
            <input type="file" accept="image/*" onChange={(e) => handleImage(e, "hero")} className="hidden" />
          </label>
          {heroUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroUrl} alt="" className="h-14 w-24 object-cover border border-white/10" />
          )}
        </div>
        {heroUrl && (
          <input className={`${inputClass} mt-3`} placeholder="Alt-Text" value={form.hero_image_alt}
            onChange={(e) => update("hero_image_alt", e.target.value)} />
        )}
      </div>

      <div>
        <label className={labelClass}>Programm-Bild</label>
        <div className="flex items-center gap-4">
          <label className="px-3 py-2 border border-white/20 text-mist text-sm cursor-pointer hover:border-signal">
            {uploading === "program" ? "Lädt …" : "Bild wählen"}
            <input type="file" accept="image/*" onChange={(e) => handleImage(e, "program")} className="hidden" />
          </label>
          {programImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={programImageUrl} alt="" className="h-14 w-24 object-cover border border-white/10" />
          )}
        </div>
        {programImageUrl && (
          <input className={`${inputClass} mt-3`} placeholder="Alt-Text" value={form.program_image_alt}
            onChange={(e) => update("program_image_alt", e.target.value)} />
        )}
      </div>

      <div>
        <label className={labelClass}>ICS-URL</label>
        <input className={inputClass} value={form.ics_url}
          onChange={(e) => update("ics_url", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>HubSpot Form Code</label>
        <textarea rows={4} className={inputClass} value={form.hubspot_form}
          onChange={(e) => update("hubspot_form", e.target.value)} />
      </div>

      <label className="flex items-center gap-3 text-sm text-white">
        <input type="checkbox" checked={form.published}
          onChange={(e) => update("published", e.target.checked)} className="w-4 h-4 accent-[#c8ff00]" />
        Veröffentlicht (auf der Website sichtbar)
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving || uploading !== null}
          className="px-6 py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition disabled:opacity-60">
          {saving ? "Speichern …" : isEdit ? "Änderungen speichern" : "Event speichern"}
        </button>
        <button type="button" onClick={() => router.push("/admin/events")}
          className="text-mist text-sm hover:text-white">Abbrechen</button>
      </div>
    </form>
  );
}
