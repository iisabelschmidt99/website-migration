import EventForm from "@/components/admin/EventForm";

export default function NeuesEvent() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Neues Event</h1>
      <p className="text-mist text-sm mb-6">
        Programm und Rich-Text-Felder können HTML enthalten. Gastgeber sind Team-Slugs.
      </p>
      <EventForm />
    </div>
  );
}
