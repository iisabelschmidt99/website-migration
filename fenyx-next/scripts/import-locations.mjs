// Standort-Verzeichnisse -> Supabase (Tabelle `locations`).
// ----------------------------------------------------------------------------
// Lokal ausführen (Netz + .env.local):
//   cd fenyx-next && node scripts/import-locations.mjs an-und-verkauf
//   ... bueroeinrichtung | standorte
//
// Löst die Page-Links (SEO-Namensgebung) auf unsere Live-Routen auf, damit
// interne Links direkt (ohne Redirect-Hop) auf echte Seiten zeigen.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnv, parseCSV, isPublished, parseIntOrZero } from "./_import-shared.mjs";

const BASE = "../_reference/webflow-export/cms download/SEO Seiten und FAQs";

const COLLECTIONS = {
  "an-und-verkauf": "FENYX LIVE - Standorte An- und Verkaufs - 6a3bd62dbeb706550843592e.csv",
  bueroeinrichtung: "FENYX LIVE - Standorte Büroeinrichtungs - 6a26c954ab431b5c457d02e5.csv",
  standorte: "FENYX LIVE - Standorte - 69ef183dbdb459519b4ca81b.csv",
};

// Zielbild = SEO-Redirect-Dokument: die Page-Links bleiben die SEO-URLs
// (kanonisch). page_link_resolved = page_link.
function resolveLink(link) {
  return link || null;
}

async function main() {
  const collection = (process.argv[2] || "").trim();
  const file = COLLECTIONS[collection];
  if (!file) {
    console.error(`Collection angeben. Erlaubt: ${Object.keys(COLLECTIONS).join(", ")}`);
    process.exit(1);
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Fehlende Keys in .env.local (URL oder SERVICE_ROLE).");
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const CSV_PATH = path.resolve(process.cwd(), BASE, file);
  const table = parseCSV(readFileSync(CSV_PATH, "utf8"));
  const header = table[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const dataRows = table
    .slice(1)
    .filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Collection "${collection}": ${dataRows.length} Zeilen`);

  let ok = 0;
  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const link = get("Page Link");
    const rowData = {
      collection,
      name: get("Name"),
      slug: get("Slug"),
      address: get("Adresse") || null,
      pin_location: get("Pin Location") || null,
      page_link: link || null,
      page_link_resolved: resolveLink(link),
      published: isPublished(get),
      sort_order: parseIntOrZero(get("Sort") || ""),
    };

    const { error } = await supabase
      .from("locations")
      .upsert(rowData, { onConflict: "collection,slug" });
    if (error) console.error(`  ✗ ${rowData.slug}: ${error.message}`);
    else {
      ok++;
      console.log(`  ✓ ${rowData.slug} -> ${rowData.page_link_resolved}`);
    }
  }

  console.log(`\nFertig. ${ok}/${dataRows.length} Standorte geschrieben.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
