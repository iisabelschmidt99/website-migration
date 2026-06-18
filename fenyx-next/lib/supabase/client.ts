// Supabase-Client für den BROWSER (Client-Komponenten, z.B. Login-Formular).
// Nutzt den öffentlichen anon-Key. Dank Row Level Security sind nur
// erlaubte Daten zugänglich.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
