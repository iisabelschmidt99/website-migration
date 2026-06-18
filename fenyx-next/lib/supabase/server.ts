// Supabase-Client für den SERVER (Server-Komponenten, Layouts, Route Handler).
// Liest/schreibt die Session über Cookies, damit der Login serverseitig
// bekannt ist (wichtig für den Schutz von /admin).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // In Next 15/16 ist cookies() asynchron. `await` funktioniert auch auf
  // älteren Versionen problemlos -> versionssicher.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
