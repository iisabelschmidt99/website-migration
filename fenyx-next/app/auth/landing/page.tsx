import { Suspense } from "react";
import AuthLandingForm from "@/components/AuthLandingForm";

export default function AuthLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4">
          <p className="text-mist text-sm">Link wird geladen …</p>
        </div>
      }
    >
      <AuthLandingForm />
    </Suspense>
  );
}
