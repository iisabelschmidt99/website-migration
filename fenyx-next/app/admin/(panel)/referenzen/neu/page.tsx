import ReferenceForm from "@/components/admin/ReferenceForm";

export default function NeueReferenz() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Neue Referenz</h1>
      <p className="text-mist text-sm mb-6">
        Pflichtfelder sind markiert. Das Bild wird in den Storage hochgeladen und
        automatisch verknüpft. „Veröffentlicht" steuert, ob die Referenz auf der
        Website erscheint.
      </p>
      <ReferenceForm />
    </div>
  );
}
