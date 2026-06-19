import { notFound } from "next/navigation";
import TeamForm from "@/components/admin/TeamForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditTeamMember({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Team-Mitglied bearbeiten</h1>
      <p className="text-mist text-sm mb-6">{data.name}</p>
      <TeamForm initial={data} id={id} />
    </div>
  );
}
