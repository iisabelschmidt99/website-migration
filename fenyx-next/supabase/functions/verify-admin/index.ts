import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!adminPassword) {
      return new Response(
        JSON.stringify({ error: "ADMIN_PASSWORD nicht konfiguriert" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc(
      "check_admin_auth_rate_limit",
      { attempt_ip: clientIP },
    );

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      return new Response(
        JSON.stringify({ error: "Rate-Limit-Prüfung fehlgeschlagen" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!rateLimitCheck?.allowed) {
      const lockedUntil = new Date(rateLimitCheck.locked_until);
      const minutesRemaining = Math.ceil(
        (lockedUntil.getTime() - Date.now()) / 60000,
      );
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Zu viele Fehlversuche",
          locked_until: rateLimitCheck.locked_until,
          minutes_remaining: minutesRemaining,
          attempts: rateLimitCheck.attempts,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const isValid = password === adminPassword;

    await supabase.rpc("record_admin_auth_attempt", {
      attempt_ip: clientIP,
      success: isValid,
    });

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        status: isValid ? 200 : 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("verify-admin error:", error);
    return new Response(
      JSON.stringify({ error: "Interner Fehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
