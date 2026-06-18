// ============================================================================
// Blog/Ratgeber-Import: Webflow-CSV -> Supabase (Tabelle `blog_posts` + Storage)
// ----------------------------------------------------------------------------
// Lokal ausführen (NICHT in der Sandbox – braucht Netzwerk + Keys):
//   cd fenyx-next
//   node scripts/import-ratgeber.mjs
//
// Lädt je Artikel das Titelbild in den Storage-Bucket "media/blog" und schreibt
// die Zeile per upsert (auf slug) in `blog_posts`. Mehrfach ausführbar.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/cms download/FENYX LIVE - Ratgeber - 6988d9ea184c3a10bc10d8d9.csv"
);
const BUCKET = "media";

function loadEnv() {
  const txt = readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") {}
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) { console.error("Fehlende Keys in .env.local."); process.exit(1); }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const table = parseCSV(readFileSync(CSV_PATH, "utf8"));
  const header = table[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const dataRows = table.slice(1).filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Gefundene Ratgeber-Artikel: ${dataRows.length}`);
  let ok = 0, imgOk = 0, imgFail = 0;

  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");

    // Titelbild herunterladen + in Storage hochladen
    let coverUrl = get("Main Image") || get("Thumbnail image");
    if (coverUrl) {
      try {
        const res = await fetch(coverUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const ext = (coverUrl.split(".").pop() || "webp").split("?")[0].slice(0, 5);
        const dest = `blog/${slug}.${ext}`;
        const up = await supabase.storage.from(BUCKET)
          .upload(dest, buf, { contentType: res.headers.get("content-type") || "image/webp", upsert: true });
        if (up.error) throw up.error;
        coverUrl = supabase.storage.from(BUCKET).getPublicUrl(dest).data.publicUrl;
        imgOk++;
      } catch (e) {
        console.warn(`  ⚠ Bild für "${slug}" nicht ladbar (${e.message}) – CDN-Link bleibt.`);
        imgFail++;
      }
    }

    // Artikeltext (Rich Text als HTML)
    let body = get("rte-2025") || get("rte_1");

    // FAQ (falls vorhanden) als Abschnitt anhängen
    const faqParts = [];
    for (let n = 1; n <= 5; n++) {
      const q = get(`FAQ F${n}`), a = get(`FAQ A${n}`);
      if (q || a) faqParts.push(`<h3>${q}</h3>\n${a}`);
    }
    if (faqParts.length) {
      const faqTitle = get("FAQ Title") || "Häufige Fragen";
      body += `\n<h2>${faqTitle}</h2>\n${faqParts.join("\n")}`;
    }

    const published =
      get("Draft").toLowerCase() !== "true" && get("Archived").toLowerCase() !== "true";
    const publishedOn = get("Published On");

    const rowData = {
      slug,
      title: get("Name"),
      excerpt: get("Post Summary") || null,
      body_md: body || null,
      cover_image_url: coverUrl || null,
      cover_image_alt: get("Alt Text") || null,
      author: get("Author Name") || null,
      category: get("Category") || null,
      tags: [],
      meta_title: get("Meta Title") || null,
      meta_description: get("Meta Description") || null,
      published,
      published_at: published && publishedOn ? new Date(publishedOn).toISOString() : null,
    };

    const { error } = await supabase.from("blog_posts").upsert(rowData, { onConflict: "slug" });
    if (error) console.error(`  ✗ ${slug}: ${error.message}`);
    else { ok++; console.log(`  ✓ ${slug}${published ? "" : " (Entwurf)"}`); }
  }

  console.log(`\nFertig. ${ok}/${dataRows.length} Artikel geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
