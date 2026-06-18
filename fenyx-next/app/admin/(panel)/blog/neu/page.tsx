import BlogForm from "@/components/admin/BlogForm";

export default function NeuerArtikel() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Neuer Artikel</h1>
      <p className="text-mist text-sm mb-6">
        Inhalt als Markdown. „Veröffentlicht" steuert, ob der Artikel auf der
        Website erscheint; das Datum wird beim ersten Veröffentlichen gesetzt.
      </p>
      <BlogForm />
    </div>
  );
}
