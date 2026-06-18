"use client";

// Bild-Upload + Übersicht für das Backend.
// Lädt Dateien in den Supabase-Storage-Bucket "media" (öffentlich lesbar,
// Schreiben nur für eingeloggte Redaktion via RLS).
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

type MediaFile = { name: string; url: string };

export default function MediaUploader() {
  const supabase = createClient();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      setError(error.message);
      return;
    }
    const items = (data || [])
      .filter((f) => f.id) // Ordner ausblenden, nur Dateien
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setFiles(items);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    setUploading(false);
    e.target.value = ""; // Input zurücksetzen
    if (error) {
      setError(`Upload fehlgeschlagen: ${error.message}`);
      return;
    }
    load();
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mt-6">
      {/* Upload-Feld */}
      <label className="inline-flex items-center gap-3 px-4 py-3 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer hover:brightness-95 transition">
        {uploading ? "Lädt hoch …" : "Bild hochladen"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      {/* Galerie */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((f) => (
          <div key={f.name} className="border border-white/10 p-2">
            {/* Interne Vorschau – einfaches img genügt im Backend */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.url}
              alt={f.name}
              className="w-full h-28 object-cover bg-abyss"
            />
            <button
              onClick={() => copyUrl(f.url)}
              className="mt-2 w-full text-left text-[11px] text-mist hover:text-signal truncate"
              title={f.name}
            >
              {copied === f.url ? "✓ Link kopiert" : f.name}
            </button>
          </div>
        ))}
      </div>

      {files.length === 0 && !error && (
        <p className="text-mist text-sm mt-6">
          Noch keine Bilder hochgeladen.
        </p>
      )}
    </div>
  );
}
