// Events-Import: Webflow-CSV -> Supabase (Tabelle `events` + Storage)
//   cd fenyx-next && node scripts/import-events.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  loadEnv,
  parseCSV,
  isPublished,
  splitSemiList,
  parseDateOrNull,
  uploadImageFromUrl,
} from "./_import-shared.mjs";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/cms download/FENYX LIVE - Events - 6a0ed28bae979f3a566d117a.csv"
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

  console.log(`Gefundene Events: ${dataRows.length}`);

  let ok = 0;
  let imgOk = 0;
  let imgFail = 0;

  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");
    const title = get("Name");

    const heroResult = await uploadImageFromUrl(
      supabase,
      get("Hero Image"),
      `events/${slug}-hero`
    );
    if (heroResult.ok) imgOk++;
    if (heroResult.fail) {
      console.warn(`  ⚠ Hero für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const programResult = await uploadImageFromUrl(
      supabase,
      get("Programm Image"),
      `events/${slug}-program`
    );
    if (programResult.ok) imgOk++;
    if (programResult.fail && get("Programm Image")) {
      console.warn(`  ⚠ Programm-Bild für "${slug}" nicht ladbar – CDN-Link bleibt.`);
      imgFail++;
    }

    const takeaways = ["Mitnehmen 1", "Mitnehmen 2", "Mitnehmen 3", "Mitnehmen 4"]
      .map((col) => get(col))
      .filter(Boolean);

    const published = isPublished(get);
    const publishedOn = get("Published On");

    const rowData = {
      slug,
      title,
      hero_image_url: heroResult.url || null,
      hero_image_alt: title || null,
      intro: get("Paragraph") || null,
      intro_info: get("Paragraph Info Text") || null,
      tags: splitSemiList(get("Tags")),
      event_date: parseDateOrNull(get("Datum")),
      time_label: get("Uhrzeit") || null,
      location: get("Ort") || null,
      location_link: get("Ort Link") || null,
      fee: get("€ Teilnahmegebühr") || null,
      seats: get("Plätze") || null,
      language: get("Sprache") || null,
      format: get("Format") || null,
      catering: get("Verpflegung") || null,
      h2_text: get("H2 Text") || null,
      h2_paragraph: get("H2 Paragraph") || null,
      h2_rich_text: get("H2 Rich Text") || null,
      program_html: get("Programm") || null,
      host_slugs: splitSemiList(get("Gastgeber")),
      program_image_url: programResult.url || null,
      program_image_alt: title || null,
      takeaways,
      category: get("Category") || null,
      ics_url: get("ICS") || null,
      hubspot_form: get("Hubspot Form Code") || null,
      published,
      published_at:
        published && publishedOn ? parseDateOrNull(publishedOn) : null,
    };

    const { error } = await supabase.from("events").upsert(rowData, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${slug}${published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(
    `\nFertig. ${ok}/${dataRows.length} Events geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
