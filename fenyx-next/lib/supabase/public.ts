import { createClient } from "@supabase/supabase-js";

/** Anon-Client für öffentliche, veröffentlichte Inhalte (ohne Cookies). */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL oder NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt");
  }

  return createClient(url, key);
}
