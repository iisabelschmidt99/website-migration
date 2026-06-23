import { Suspense } from "react";
import PasswortFestlegenForm from "@/components/PasswortFestlegenForm";

export default function PasswortFestlegenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4">
          <p className="text-mist text-sm">Link wird geprüft …</p>
        </div>
      }
    >
      <PasswortFestlegenForm />
    </Suspense>
  );
}
