import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminMedien() {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Medien / Upload</h1>
      <p className="text-mist text-sm">
        Bilder hochladen (Supabase-Storage-Bucket <code>media</code>). Klick auf
        einen Dateinamen kopiert den Link – den kannst du später in Referenzen
        oder Blogartikeln verwenden.
      </p>
      <MediaUploader />
    </div>
  );
}
