// Supabase-Client für den SERVER (Server-Komponenten, Layouts, Route Handler).
// Liest/schreibt die Session über Cookies, damit der Login serverseitig
// bekannt ist (wichtig für den Schutz von /admin).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase ist nicht konfiguriert. NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY setzen.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // In Server-Komponenten kann setAll fehlschlagen – das übernimmt
            // dann die middleware. Hier bewusst ignorieren.
          }
        },
      },
    }
  );
}
