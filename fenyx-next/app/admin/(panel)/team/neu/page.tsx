import TeamForm from "@/components/admin/TeamForm";

export default function NeuesTeamMitglied() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Neues Team-Mitglied</h1>
      <p className="text-mist text-sm mb-6">
        Pflichtfelder sind markiert. Das Portrait wird in den Storage hochgeladen.
      </p>
      <TeamForm />
    </div>
  );
}
