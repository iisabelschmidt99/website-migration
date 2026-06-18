// Bestehenden Blogartikel bearbeiten.
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditArtikel({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Artikel bearbeiten</h1>
      <p className="text-mist text-sm mb-6">{data.title}</p>
      <BlogForm initial={data} id={id} />
    </div>
  );
}
