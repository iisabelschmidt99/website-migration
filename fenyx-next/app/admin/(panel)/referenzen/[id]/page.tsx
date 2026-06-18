// Bestehende Referenz bearbeiten. Lädt den Datensatz und füllt das Formular.
import { notFound } from "next/navigation";
import ReferenceForm from "@/components/admin/ReferenceForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditReferenz({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("references")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Referenz bearbeiten</h1>
      <p className="text-mist text-sm mb-6">{data.company}</p>
      <ReferenceForm initial={data} id={id} />
    </div>
  );
}
