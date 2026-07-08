// Landing-Standort-Import: Webflow-CSV -> Supabase (Tabelle `landing_locations` + Storage)
// ----------------------------------------------------------------------------
// Lokal ausführen (braucht Netz + .env.local, NICHT in der Sandbox):
//   cd fenyx-next && node scripts/import-landing-locations.mjs einrichtung-standorte
//   cd fenyx-next && node scripts/import-landing-locations.mjs ankauf
//
// Eine generische Vorlage für beide „Standort"-Collections. Lädt je Seite das
// Hero-Bild in den Storage-Bucket "media" und schreibt die Zeile per upsert
// (auf collection+slug). Mehrfach ausführbar (idempotent).
// Bilder INNERHALB der RTE-Felder bleiben vorerst Webflow-CDN-Links.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  loadEnv,
  parseCSV,
  isPublished,
  parseDateOrNull,
  uploadImageFromUrl,
} from "./_import-shared.mjs";

const BASE = "../_reference/webflow-export/cms download/SEO Seiten und FAQs";

// Pro Collection: CSV-Datei + Spaltennamen (unterscheiden sich leicht).
const COLLECTIONS = {
  "einrichtung-standorte": {
    file: "FENYX LIVE - Einrichtung LPs - 6988d9ea184c3a10bc10d9bb.csv",
    h1Col: "H1 Titel",
    heroCol: "Hero Bild",
  },
  ankauf: {
    file: "FENYX LIVE - Ankauf LPs - 6988d9ea184c3a10bc10d9a4.csv",
    h1Col: "H1",
    heroCol: "Stadtbild",
  },
};

async function main() {
  const collection = (process.argv[2] || "einrichtung-standorte").trim();
  const cfg = COLLECTIONS[collection];
  if (!cfg) {
    console.error(
      `Unbekannte Collection "${collection}". Erlaubt: ${Object.keys(COLLECTIONS).join(", ")}`
    );
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

  const CSV_PATH = path.resolve(process.cwd(), BASE, cfg.file);
  const table = parseCSV(readFileSync(CSV_PATH, "utf8"));
  const header = table[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const dataRows = table
    .slice(1)
    .filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Collection "${collection}": ${dataRows.length} Zeilen`);

  let ok = 0;
  let imgOk = 0;
  let imgFail = 0;

  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");
    const title = get("Name");
    const h1 = get(cfg.h1Col) || title;

    const imageResult = await uploadImageFromUrl(
      supabase,
      get(cfg.heroCol),
      `${collection}/${slug}`
    );
    if (imageResult.ok) imgOk++;
    if (imageResult.fail) {
      console.warn(`  ⚠ Bild für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const rowData = {
      collection,
      slug,
      title: title || null,
      h1: h1 || null,
      hero_image_url: imageResult.url || null,
      hero_image_alt: h1 || null,
      meta_title: get("Meta Titel") || null,
      meta_description: get("Meta Beschreibung") || null,
      section1_html: get("Sektion 1 RTE") || null,
      section2_html: get("Sektion 2 RTE") || null,
      map_embed: get("Map Google Maps Location Embed Code") || null,
      schema_markup: get("Schema Markup") || null,
      published: isPublished(get),
      published_at: parseDateOrNull(get("Published On")),
    };

    const { error } = await supabase
      .from("landing_locations")
      .upsert(rowData, { onConflict: "collection,slug" });
    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${slug}${rowData.published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(
    `\nFertig. ${ok}/${dataRows.length} Seiten geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
