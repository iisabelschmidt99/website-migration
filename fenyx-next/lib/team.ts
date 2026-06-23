// Öffentliche Team-Daten: liest veröffentlichte Mitglieder aus Supabase
// (Tabelle `team_members`) und fällt ohne Supabase-Konfiguration auf die
// statischen Inhalte aus data/ueber-uns.ts zurück. Muster wie lib/references.ts.
import { createPublicClient } from "@/lib/supabase/public";
import type { TeamMember } from "@/components/TeamGridSection";
import { expertsContent, dachTeamContent } from "@/data/ueber-uns";

type TeamRow = {
  slug: string;
  name: string;
  position: string | null;
  bio: string | null;
  image_url: string | null;
  image_alt: string | null;
  linkedin_url: string | null;
  email: string | null;
  quote: string | null;
  legend_position: string | null;
  sort_order: number;
  published: boolean;
};

export type TeamSections = {
  experts: TeamMember[];
  dach: TeamMember[];
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function mapTeamRow(row: TeamRow): TeamMember {
  return {
    name: row.name,
    role: row.position ?? "",
    email: row.email ?? undefined,
    quote: row.quote ?? undefined,
    imageSrc: row.image_url ?? "",
    imageAlt: row.image_alt ?? row.name,
  };
}

const STATIC_TEAM_SECTIONS: TeamSections = {
  experts: expertsContent.members,
  dach: dachTeamContent.members,
};

/**
 * Liefert die beiden Team-Gruppen für die Über-Uns-Seite.
 * Gruppierung wie im Original: Mitglieder mit gefülltem `legend_position`
 * sind die „Experten" (mit Zitat), alle anderen das allgemeine Team-Grid.
 */
export async function getTeamSections(): Promise<TeamSections> {
  if (!hasSupabaseConfig()) {
    return STATIC_TEAM_SECTIONS;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "slug, name, position, bio, image_url, image_alt, linkedin_url, email, quote, legend_position, sort_order, published",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Team aus Supabase laden fehlgeschlagen: ${error.message}`);
  }

  const rows = (data ?? []) as TeamRow[];
  if (rows.length === 0) {
    return STATIC_TEAM_SECTIONS;
  }

  const experts: TeamMember[] = [];
  const dach: TeamMember[] = [];
  for (const row of rows) {
    const hasLegend = Boolean((row.legend_position ?? "").trim());
    (hasLegend ? experts : dach).push(mapTeamRow(row));
  }

  // Falls die Gruppierung (z.B. fehlende Legenden) eine Spalte leer lässt,
  // statischen Fallback für die betroffene Gruppe nutzen, damit nie leer.
  return {
    experts: experts.length > 0 ? experts : STATIC_TEAM_SECTIONS.experts,
    dach: dach.length > 0 ? dach : STATIC_TEAM_SECTIONS.dach,
  };
}
