// Kundenstimmen-Import: Webflow-CSV -> Supabase (Tabelle `testimonials` + Storage)
//   cd fenyx-next && node scripts/import-testimonials.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  loadEnv,
  parseCSV,
  isPublished,
  splitSemiList,
  uploadImageFromUrl,
} from "./_import-shared.mjs";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/cms download/FENYX LIVE - Kundenstimmen - 6988d9ea184c3a10bc10d896.csv"
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

  console.log(`Gefundene Kundenstimmen: ${dataRows.length}`);

  let ok = 0;
  let imgOk = 0;
  let imgFail = 0;

  for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
    const r = dataRows[rowIndex];
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");
    const name = get("Name");

    const imageResult = await uploadImageFromUrl(
      supabase,
      get("Kundenbild"),
      `testimonials/${slug}`
    );
    if (imageResult.ok) imgOk++;
    if (imageResult.fail) {
      console.warn(`  ⚠ Kundenbild für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const logoResult = await uploadImageFromUrl(
      supabase,
      get("Firmen-Logo"),
      `testimonials/${slug}-logo`
    );
    if (logoResult.ok) imgOk++;
    if (logoResult.fail && get("Firmen-Logo")) {
      console.warn(`  ⚠ Logo für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const rowData = {
      slug,
      name,
      role_company: get("Position und Firma") || null,
      quote: get("Testimonial") || null,
      categories: splitSemiList(get("Kategorie")),
      image_url: imageResult.url || null,
      image_alt: name || null,
      logo_url: logoResult.url || null,
      sort_order: rowIndex,
      published: isPublished(get),
    };

    const { error } = await supabase.from("testimonials").upsert(rowData, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${slug}${rowData.published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(
    `\nFertig. ${ok}/${dataRows.length} Kundenstimmen geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
