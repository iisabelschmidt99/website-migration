// Themen-Import: Webflow-CSV -> Supabase (Tabelle `landing_topics` + Storage)
// ----------------------------------------------------------------------------
// Lokal ausführen (Netz + .env.local):
//   cd fenyx-next && node scripts/import-landing-topics.mjs bueroaufloesung
//   ... bueroeinrichtung | kauf | bueroplanung
//
// Kombiniert die rte-Felder zu body_html und baut die inline-FAQ (F1/A1..F5/A5).
// Lädt das Hauptbild in den Storage-Bucket "media". Idempotent (upsert collection+slug).
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

const COLLECTIONS = {
  bueroaufloesung: "FENYX LIVE - Büroauflösungen - 69931cebf2e02ee21217efd7.csv",
  bueroeinrichtung: "FENYX LIVE - Büroeinrichtungen - 69933243cb18b1761438620e.csv",
  kauf: "FENYX LIVE - Büromoebel kaufen - 69933241a7e137346ef469cd.csv",
  bueroplanung: "FENYX LIVE - Büroplanung - 699332426978b148a60de707.csv",
};

// rte-Felder in Reihenfolge (nicht alle Collections haben alle).
const RTE_FIELDS = ["rte-2025", "rte_1", "rte_2", "rte_3", "rte_4", "rte_5", "rte_6"];

async function main() {
  const collection = (process.argv[2] || "").trim();
  const file = COLLECTIONS[collection];
  if (!file) {
    console.error(
      `Collection angeben. Erlaubt: ${Object.keys(COLLECTIONS).join(", ")}`
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

  const CSV_PATH = path.resolve(process.cwd(), BASE, file);
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

    // rte-Felder zu einem HTML-Body zusammenführen
    const body = RTE_FIELDS.map((f) => get(f)).filter(Boolean).join("\n");

    // inline-FAQ (F1/A1 .. F5/A5)
    const faq = [];
    for (let i = 1; i <= 5; i++) {
      const q = get(`FAQ F${i}`);
      const a = get(`FAQ A${i}`);
      if (q && a) faq.push({ question: q, answer: a });
    }

    const imageResult = await uploadImageFromUrl(
      supabase,
      get("Main Image"),
      `topics/${collection}/${slug}`
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
      meta_title: get("Meta Title") || null,
      meta_description: get("Meta Description") || null,
      main_image_url: imageResult.url || null,
      main_image_alt: get("Alt Text") || title || null,
      post_summary: get("Post Summary") || null,
      author: get("Author Name") || null,
      body_html: body || null,
      faq_title: get("FAQ Title") || null,
      faq_description: get("FAQ Description") || null,
      faq,
      schema_markup: get("Schema-Markup") || null,
      published: isPublished(get),
      published_at: parseDateOrNull(get("Published On")),
    };

    const { error } = await supabase
      .from("landing_topics")
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
