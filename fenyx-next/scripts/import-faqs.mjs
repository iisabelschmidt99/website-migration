// FAQ-Bibliothek -> Supabase (Tabelle `faqs`).
// ----------------------------------------------------------------------------
// Lokal ausführen (Netz + .env.local):
//   cd fenyx-next && node scripts/import-faqs.mjs
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnv, parseCSV, isPublished } from "./_import-shared.mjs";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/cms download/SEO Seiten und FAQs/FENYX LIVE - FAQs - 6988d9ea184c3a10bc10d8f3.csv"
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
  const dataRows = table
    .slice(1)
    .filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Gefundene FAQs: ${dataRows.length}`);

  let ok = 0;
  let i = 0;
  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const rowData = {
      slug: get("Slug"),
      question: get("Question"),
      answer: get("Answer") || null,
      published: isPublished(get),
      sort_order: i++,
    };

    const { error } = await supabase.from("faqs").upsert(rowData, { onConflict: "slug" });
    if (error) console.error(`  ✗ ${rowData.slug}: ${error.message}`);
    else {
      ok++;
      console.log(`  ✓ ${rowData.slug}${rowData.published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(`\nFertig. ${ok}/${dataRows.length} FAQs geschrieben.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
