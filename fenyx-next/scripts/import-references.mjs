// ============================================================================
// Referenzen-Import: Webflow-CSV -> Supabase (Tabelle `references` + Storage)
// ----------------------------------------------------------------------------
// Lokal ausführen (NICHT in der Sandbox – braucht Netzwerk + Keys):
//   cd fenyx-next
//   node scripts/import-references.mjs
//
// Liest die CSV, lädt je Referenz das Hauptbild in den Storage-Bucket "media"
// und schreibt die Zeile per upsert (auf slug) in die Tabelle `references`.
// Mehrfach ausführbar (idempotent) – aktualisiert bestehende Einträge.
// ============================================================================
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../_reference/webflow-export/references cms download/FENYX LIVE - Referenzen - 6988d9ea184c3a10bc10d833.csv"
);
const BUCKET = "media";

// ── .env.local einlesen ─────────────────────────────────────────────────────
function loadEnv() {
  const txt = readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

// ── Minimaler, korrekter CSV-Parser (RFC4180: Quotes, "", Zeilen in Feldern) ─
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* ignorieren */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const stripHtml = (s) =>
  (s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Fehlende Keys in .env.local (URL oder SERVICE_ROLE).");
    process.exit(1);
  }
  // service_role: umgeht RLS, nur für dieses Server-Skript
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const raw = readFileSync(CSV_PATH, "utf8");
  const table = parseCSV(raw);
  const header = table[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const dataRows = table.slice(1).filter((r) => r.length > 1 && (r[idx("Slug")] || "").trim());

  console.log(`Gefundene Referenzen: ${dataRows.length}`);

  let ok = 0, imgOk = 0, imgFail = 0;

  for (const r of dataRows) {
    const get = (name) => (idx(name) >= 0 ? (r[idx(name)] || "").trim() : "");
    const slug = get("Slug");
    const company = get("Unternehmensname") || get("Name");
    const title = get("Name");

    // Hero-Bild: versuchen herunterzuladen + in Storage hochladen
    let heroUrl = get("Main image");
    if (heroUrl) {
      try {
        const res = await fetch(heroUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const ext = (heroUrl.split(".").pop() || "webp").split("?")[0].slice(0, 5);
        const dest = `referenzen/${slug}.${ext}`;
        const up = await supabase.storage
          .from(BUCKET)
          .upload(dest, buf, { contentType: res.headers.get("content-type") || "image/webp", upsert: true });
        if (up.error) throw up.error;
        heroUrl = supabase.storage.from(BUCKET).getPublicUrl(dest).data.publicUrl;
        imgOk++;
      } catch (e) {
        console.warn(`  ⚠ Bild für "${slug}" nicht ladbar (${e.message}) – CDN-Link bleibt.`);
        imgFail++;
      }
    }

    // Kennzahlen Zahl 1..5  (Titel = Wert, Text = Label)
    const heroStats = [];
    for (let n = 1; n <= 5; n++) {
      const v = get(`Zahl ${n} Titel`) || get(`Zahl ${n} titel`);
      const l = get(`Zahl ${n} Text`) || get(`Zahl ${n} text`);
      if (v || l) heroStats.push({ value: v, label: l });
    }

    // Intro: Intro-Text + Block 1..3 als Absätze (HTML entfernt)
    const intro = [get("Intro-Text"), get("Block 1 Text"), get("Block 2 Text"), get("Block 3 Text")]
      .map(stripHtml)
      .filter(Boolean);

    const metaRows = [
      ["Unternehmen", company],
      ["Typ", get("Kategorie") || get("Auftragstyp")],
      ["Ort", get("Ort")],
      ["Jahr", get("Jahr")],
    ].filter(([, v]) => v).map(([label, value]) => ({ label, value }));

    const published =
      get("Draft").toLowerCase() !== "true" && get("Archived").toLowerCase() !== "true";

    const rowData = {
      slug,
      company,
      title,
      category_label: get("Kategorie") || get("Auftragstyp") || null,
      city: get("Ort") || null,
      year: get("Jahr") || null,
      meta_title: get("Meta titel") || null,
      meta_description: get("Meta beschreibung") || null,
      hero_image_url: heroUrl || null,
      hero_image_alt: company || null,
      intro,
      hero_stats: heroStats,
      meta_rows: metaRows,
      published,
    };

    const { error } = await supabase.from("references").upsert(rowData, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      ok++;
      console.log(`  ✓ ${slug}${published ? "" : " (Entwurf)"}`);
    }
  }

  console.log(`\nFertig. ${ok}/${dataRows.length} Referenzen geschrieben. Bilder: ${imgOk} ok, ${imgFail} nicht ladbar.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
