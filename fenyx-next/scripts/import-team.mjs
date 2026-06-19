// Team-Import: Webflow-CSV -> Supabase (Tabelle `team_members` + Storage)
//   cd fenyx-next && node scripts/import-team.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  loadEnv,
  parseCSV,
  isPublished,
  parseIntOrZero,
  uploadImageFromUrl,
} from "./_import-shared.mjs";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/cms download/FENYX LIVE - Team - 6988d9ea184c3a10bc10d811.csv"
);

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Fehlende Keys in .env.local (URL oder SERVICE_ROLE).");
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const table = parseCSV(readFileSync(CSV_PATH, "utf8"));
  const header = table[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const dataRows = table.slice(1).filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Gefundene Team-Mitglieder: ${dataRows.length}`);

  let ok = 0;
  let imgOk = 0;
  let imgFail = 0;

  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");
    const name = get("Name");

    const imageResult = await uploadImageFromUrl(
      supabase,
      get("Bild"),
      `team/${slug}`
    );
    if (imageResult.ok) imgOk++;
    if (imageResult.fail) {
      console.warn(`  ⚠ Bild für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const rowData = {
      slug,
      name,
      position: get("Position") || null,
      bio: get("Personen-Beschreibung") || null,
      image_url: imageResult.url || null,
      image_alt: name || null,
      linkedin_url: get("LinkedIn") || null,
      email: get("E-Mail") || null,
      quote: get("Zitat") || null,
      legend_position: get("Legenden Position") || null,
      sort_order: parseIntOrZero(get("Reihenfolge auf der Über Uns Seite")),
      published: isPublished(get),
    };

    const { error } = await supabase.from("team_members").upsert(rowData, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${slug}${rowData.published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(
    `\nFertig. ${ok}/${dataRows.length} Team-Einträge geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
