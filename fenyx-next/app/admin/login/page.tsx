import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginPage";

export default function AdminLoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-abyss-deep">
          <p className="text-mist text-sm">Laden …</p>
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
