import { notFound } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditKundenstimme({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Kundenstimme bearbeiten</h1>
      <p className="text-mist text-sm mb-6">{data.name}</p>
      <TestimonialForm initial={data} id={id} />
    </div>
  );
}
