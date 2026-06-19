import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NeueKundenstimme() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-2">Neue Kundenstimme</h1>
      <p className="text-mist text-sm mb-6">
        Testimonial-Text kann HTML enthalten. Kategorien mit Semikolon trennen.
      </p>
      <TestimonialForm />
    </div>
  );
}
