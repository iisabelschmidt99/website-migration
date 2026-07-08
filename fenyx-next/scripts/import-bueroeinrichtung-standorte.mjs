// Import der 21 grossen Bueroeinrichtung-Standortseiten -> Supabase.
// ----------------------------------------------------------------------------
// SEPARATE Collection: collection = 'bueroeinrichtung-standort'
// (unterscheidet sich bewusst von 'einrichtung-standorte' = 59 Nischen-LPs).
//
// Datenquelle: scripts/bueroeinrichtung-standorte.data.json
//   (vorab aus dem Webflow-Export extrahiert – siehe
//    scripts/extract_bueroeinrichtung_standorte.py).
//
// Lokal ausfuehren (braucht Netz + .env.local, NICHT in der Sandbox):
//   cd fenyx-next && node scripts/import-bueroeinrichtung-standorte.mjs
//
// Laedt je Seite das Hero-Bild in den Storage-Bucket "media" und schreibt die
// Zeile per upsert (auf collection+slug). Idempotent, mehrfach ausfuehrbar.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./_import-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLLECTION = "bueroeinrichtung-standort";
const DATA = path.join(__dirname, "bueroeinrichtung-standorte.data.json");

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Fehlende Keys in .env.local (URL oder SERVICE_ROLE).");
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const cities = JSON.parse(readFileSync(DATA, "utf8"));
  console.log(`Collection "${COLLECTION}": ${cities.length} Staedte`);

  let ok = 0;

  for (const [i, c] of cities.entries()) {
    // Die Hero-Bilder im Export sind Bunny-Video-Poster (thumbnail.jpg) und lassen
    // sich nicht zuverlässig laden. Daher hero_image_url = null -> die Vorlage nutzt
    // das bewährte lokale Büroeinrichtungs-Hero-Bild als Fallback (einheitlich).
    const rowData = {
      collection: COLLECTION,
      slug: c.slug,
      title: c.name || null,
      h1: c.h1 || null,
      hero_image_url: null,
      hero_image_alt: c.h1 || null,
      meta_title: c.meta_title || null,
      meta_description: c.meta_description || null,
      section1_html: c.section1_html || null,
      section2_html: c.section2_html || null,
      map_embed: null, // Karte kommt aus der geteilten "Unsere Standorte"-Sektion
      schema_markup: c.schema_markup || null,
      published: true,
      published_at: new Date().toISOString(),
      sort_order: i,
    };

    const { error } = await supabase
      .from("landing_locations")
      .upsert(rowData, { onConflict: "collection,slug" });
    if (error) {
      console.error(`  ✗ ${c.slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${c.slug}`);
    }
  }

  console.log(`\nFertig. ${ok}/${cities.length} Seiten geschrieben.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
